"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, createSession, getSession, verifyCredentials } from "@/lib/cms/auth";
import {
  clearLoginFailures,
  getDraftContent,
  getLoginRateLimit,
  getRevision,
  recordLoginFailure,
  saveDraftContent,
  savePublishedContent,
  saveRevision,
} from "@/lib/cms/content";
import { validateCmsDocument } from "@/lib/cms/schema";

async function requireCmsSession() {
  const session = await getSession();
  if (!session) throw new Error("Your editor session has expired. Please sign in again.");
  return session;
}

async function loginIdentifier(username) {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || headerStore.get("x-real-ip") || "local";
  return createHash("sha256").update(`${address}:${String(username).toLowerCase()}`).digest("hex");
}

export async function loginAction(_previousState, formData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const identifier = await loginIdentifier(username);
  const limit = await getLoginRateLimit(identifier);

  if (limit.blocked) return { error: "Too many sign-in attempts. Please wait 15 minutes and try again." };
  if (!verifyCredentials(username, password)) {
    await recordLoginFailure(identifier);
    return { error: "The username or password is incorrect." };
  }

  await clearLoginFailures(identifier);
  await createSession(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

function parseDocument(serialized) {
  let input;
  try {
    input = JSON.parse(serialized);
  } catch {
    throw new Error("The editor content could not be read.");
  }
  return validateCmsDocument(input);
}

export async function saveDraftAction(serialized, expectedUpdatedAt) {
  await requireCmsSession();
  const document = parseDocument(serialized);
  const existing = await getDraftContent();
  if (existing?.data?.updatedAt && expectedUpdatedAt && existing.data.updatedAt !== expectedUpdatedAt) {
    return { ok: false, conflict: true, error: "A newer draft exists. Refresh before saving again." };
  }

  const saved = { ...document, updatedAt: new Date().toISOString() };
  await saveDraftContent(saved);
  revalidatePath("/admin");
  return { ok: true, document: saved };
}

export async function publishAction(serialized, expectedUpdatedAt) {
  await requireCmsSession();
  const document = parseDocument(serialized);
  const existingDraft = await getDraftContent();
  if (existingDraft?.data?.updatedAt && expectedUpdatedAt && existingDraft.data.updatedAt !== expectedUpdatedAt) {
    return { ok: false, conflict: true, error: "A newer draft exists. Refresh before publishing." };
  }

  const now = new Date().toISOString();
  const draft = { ...document, updatedAt: now };
  const published = { ...draft, publishedAt: now };
  await saveDraftContent(draft);
  await savePublishedContent(published);
  await saveRevision(published);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, document: published };
}

export async function restoreRevisionAction(pathname) {
  await requireCmsSession();
  const revision = await getRevision(pathname);
  if (!revision?.data) return { ok: false, error: "That revision could not be found." };
  const restored = { ...validateCmsDocument(revision.data), updatedAt: new Date().toISOString() };
  await saveDraftContent(restored);
  revalidatePath("/admin");
  return { ok: true, document: restored };
}

