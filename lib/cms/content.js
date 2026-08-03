import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, get, list, put } from "@vercel/blob";

const PRIVATE_TOKEN = () => process.env.CMS_READ_WRITE_TOKEN;
const MEDIA_TOKEN = () => process.env.CMS_MEDIA_READ_WRITE_TOKEN;
const LOCAL_DATA_ROOT = path.join(process.cwd(), ".cms-data");
const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const IS_VERCEL = Boolean(process.env.VERCEL);

function localPath(pathname) {
  return path.join(LOCAL_DATA_ROOT, ...pathname.split("/"));
}

async function readLocalJson(pathname) {
  try {
    const raw = await readFile(localPath(pathname), "utf8");
    return { data: JSON.parse(raw), etag: null };
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function writeLocalJson(pathname, data) {
  const target = localPath(pathname);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(data, null, 2), "utf8");
  return { pathname, etag: null };
}

async function deleteLocal(pathname) {
  await rm(localPath(pathname), { force: true });
}

async function readPrivateJson(pathname) {
  const token = PRIVATE_TOKEN();
  if (!token) return IS_VERCEL ? null : readLocalJson(pathname);
  const result = await get(pathname, { access: "private", token });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const raw = await new Response(result.stream).text();
  return { data: JSON.parse(raw), etag: result.blob.etag };
}

async function writePrivateJson(pathname, data) {
  const token = PRIVATE_TOKEN();
  if (!token) {
    if (IS_VERCEL) throw new Error("CMS storage is not configured in Vercel.");
    return writeLocalJson(pathname, data);
  }
  return put(pathname, JSON.stringify(data), {
    access: "private",
    token,
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

async function deletePrivate(pathname) {
  const token = PRIVATE_TOKEN();
  if (!token) {
    if (!IS_VERCEL) await deleteLocal(pathname);
    return;
  }
  await del(pathname, { token });
}

export function getCmsStorageStatus() {
  if (!IS_VERCEL) return { mode: "local", ready: true };
  return {
    mode: "vercel-blob",
    ready: Boolean(PRIVATE_TOKEN() && MEDIA_TOKEN()),
  };
}

export function getDraftContent() {
  return readPrivateJson("cms/draft.json");
}

export function getPublishedContent() {
  return readPrivateJson("cms/published.json");
}

export function saveDraftContent(document) {
  return writePrivateJson("cms/draft.json", document);
}

export function savePublishedContent(document) {
  return writePrivateJson("cms/published.json", document);
}

export function saveRevision(document) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return writePrivateJson(`cms/revisions/${timestamp}.json`, document);
}

export function getRevision(pathname) {
  if (!/^cms\/revisions\/[0-9TZ-]+\.json$/.test(pathname)) throw new Error("Invalid revision.");
  return readPrivateJson(pathname);
}

export async function listRevisions() {
  const token = PRIVATE_TOKEN();
  if (!token) {
    if (IS_VERCEL) return [];
    try {
      const directory = path.join(LOCAL_DATA_ROOT, "cms", "revisions");
      const { readdir } = await import("node:fs/promises");
      const files = await readdir(directory);
      return files.sort().reverse().slice(0, 20).map((name) => ({
        pathname: `cms/revisions/${name}`,
        uploadedAt: name.replace(".json", ""),
      }));
    } catch (error) {
      if (error?.code === "ENOENT") return [];
      throw error;
    }
  }
  const result = await list({ prefix: "cms/revisions/", limit: 20, token });
  return result.blobs
    .sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())
    .map((blob) => ({ pathname: blob.pathname, uploadedAt: blob.uploadedAt.toISOString() }));
}

function safeFilename(filename) {
  const extension = path.extname(filename).toLowerCase();
  const base = path.basename(filename, extension).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
  return `${base}-${randomUUID()}${extension}`;
}

export async function uploadCmsImage(file) {
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!(file instanceof File) || !allowedTypes.has(file.type)) throw new Error("Choose a JPEG, PNG, or WebP image.");
  if (file.size > 4 * 1024 * 1024) throw new Error("Images must be 4 MB or smaller.");
  const filename = safeFilename(file.name);
  const token = MEDIA_TOKEN();

  if (!token) {
    if (IS_VERCEL) throw new Error("CMS image storage is not configured in Vercel.");
    await mkdir(LOCAL_UPLOAD_ROOT, { recursive: true });
    await writeFile(path.join(LOCAL_UPLOAD_ROOT, filename), Buffer.from(await file.arrayBuffer()));
    return { src: `/uploads/${filename}`, alt: path.basename(file.name, path.extname(file.name)) };
  }

  const blob = await put(`cms-media/${filename}`, file, {
    access: "public",
    token,
    addRandomSuffix: false,
    cacheControlMaxAge: 31_536_000,
  });
  return { src: blob.url, alt: path.basename(file.name, path.extname(file.name)) };
}

function rateLimitPath(identifier) {
  const key = createHash("sha256").update(identifier).digest("hex");
  return `cms/auth/${key}.json`;
}

export async function getLoginRateLimit(identifier) {
  const record = await readPrivateJson(rateLimitPath(identifier));
  if (!record) return { blocked: false, attempts: 0 };
  const age = Date.now() - Number(record.data.startedAt || 0);
  if (age > 15 * 60 * 1000) {
    await deletePrivate(rateLimitPath(identifier));
    return { blocked: false, attempts: 0 };
  }
  return { blocked: Number(record.data.attempts || 0) >= 5, attempts: Number(record.data.attempts || 0) };
}

export async function recordLoginFailure(identifier) {
  const pathname = rateLimitPath(identifier);
  const existing = await readPrivateJson(pathname);
  const now = Date.now();
  const record = existing?.data && now - Number(existing.data.startedAt || 0) < 15 * 60 * 1000
    ? { startedAt: existing.data.startedAt, attempts: Number(existing.data.attempts || 0) + 1 }
    : { startedAt: now, attempts: 1 };
  await writePrivateJson(pathname, record);
}

export function clearLoginFailures(identifier) {
  return deletePrivate(rateLimitPath(identifier));
}
