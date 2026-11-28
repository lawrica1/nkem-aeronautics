import crypto from "node:crypto";
import path from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env, requireEnv } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

let client;

function getStorageClient() {
  if (!client) {
    client = new S3Client({
      region: env.storageRegion,
      endpoint: requireEnv("AWS_ENDPOINT_URL_S3", env.storageEndpoint),
      credentials: {
        accessKeyId: requireEnv("AWS_ACCESS_KEY_ID", env.storageAccessKeyId),
        secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY", env.storageSecretAccessKey),
      },
      forcePathStyle: true,
    });
  }

  return client;
}

// Photos shown on the public site. Only admins may upload them, only as images, and they are served
// from a permanent API address (/api/storage/public/<key>) that redirects to a fresh signed link,
// so a saved URL never expires. Everything else stays private behind short-lived signed links.
export const PUBLIC_PURPOSES = ["product-photos", "drone-photos", "news"];
const PUBLIC_KEY = /^(product-photos|drone-photos|news)\/\d{4}-\d{2}-\d{2}\/[0-9a-f-]{36}(\.[a-z0-9]+)?$/;

export const isPublicKey = (key) => PUBLIC_KEY.test(key);
export const publicUrlForKey = (apiOrigin, key) => `${apiOrigin}/api/storage/public/${key}`;

// The object key inside one of our storage URLs (a signed https link or an s3:// reference), else null.
export function storageKeyFromUrl(url) {
  try {
    const bucket = requireEnv("STORAGE_BUCKET", env.storageBucket);
    const u = new URL(url);
    if (u.protocol === "s3:") return u.hostname === bucket ? decodeURIComponent(u.pathname.slice(1)) : null;
    const endpointHost = new URL(requireEnv("AWS_ENDPOINT_URL_S3", env.storageEndpoint)).host;
    const prefix = `/${bucket}/`;
    return u.host === endpointHost && u.pathname.startsWith(prefix) ? decodeURIComponent(u.pathname.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

// Re-signs a saved storage link (signed links expire); anything else is returned unchanged.
export async function freshStorageUrl(url) {
  const key = url && storageKeyFromUrl(url);
  return key ? signedUrlForKey(key) : url;
}

function extensionFor(file) {
  const ext = path.extname(file.originalname || "").toLowerCase().replace(/[^.a-z0-9]/g, "");
  if (ext.length > 1) return ext;

  const [, subtype] = file.mimetype.split("/");
  return subtype ? `.${subtype.replace(/[^a-z0-9]/gi, "")}` : "";
}

export function storageReferenceForKey(key) {
  return `s3://${requireEnv("STORAGE_BUCKET", env.storageBucket)}/${key}`;
}

export async function signedUrlForKey(key) {
  if (!key) return null;
  return getSignedUrl(
    getStorageClient(),
    new GetObjectCommand({
      Bucket: requireEnv("STORAGE_BUCKET", env.storageBucket),
      Key: key,
    }),
    { expiresIn: env.storageSignedUrlTtl },
  );
}

export async function serializeFileAsset(asset) {
  return {
    id: asset.id,
    key: asset.key,
    url: await signedUrlForKey(asset.key),
    mimeType: asset.mimeType,
    originalName: asset.originalName,
    size: asset.size,
    purpose: asset.purpose,
  };
}

export async function serializeFileAssets(assets = []) {
  return Promise.all(assets.map(serializeFileAsset));
}

export async function uploadFileToStorage(file, { ownerId, purpose = "general" } = {}) {
  if (!file) throw new HttpError(400, "A file is required.");

  const safePurpose = String(purpose || "general").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const key = `${safePurpose}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}${extensionFor(file)}`;

  await getStorageClient().send(
    new PutObjectCommand({
      Bucket: requireEnv("STORAGE_BUCKET", env.storageBucket),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  const asset = await prisma.fileAsset.create({
    data: {
      ownerId,
      purpose: safePurpose,
      originalName: file.originalname || key,
      key,
      url: storageReferenceForKey(key),
      mimeType: file.mimetype,
      size: file.size,
    },
  });

  return asset;
}
