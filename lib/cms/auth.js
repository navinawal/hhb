import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "hhb-cms-session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function encode(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  const secret = process.env.CMS_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createPasswordHash(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

export function verifyCredentials(username, password) {
  const expectedUsername = process.env.CMS_USERNAME;
  const passwordSalt = process.env.CMS_PASSWORD_SALT;
  const expectedHash = process.env.CMS_PASSWORD_HASH;

  if (!expectedUsername || !passwordSalt || !expectedHash) return false;
  const usernameMatches = safeEqual(String(username), expectedUsername);
  const passwordHash = createPasswordHash(String(password), passwordSalt);
  return usernameMatches && safeEqual(passwordHash, expectedHash);
}

export async function createSession(username) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = encode(JSON.stringify({ username, expiresAt, nonce: randomBytes(12).toString("hex") }));
  const signature = sign(payload);
  if (!signature) throw new Error("CMS session security is not configured.");

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [payload, signature] = token.split(".");
  const expectedSignature = payload ? sign(payload) : null;
  if (!payload || !signature || !expectedSignature || !safeEqual(signature, expectedSignature)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session.expiresAt <= Date.now() || session.username !== process.env.CMS_USERNAME) return null;
    return session;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

