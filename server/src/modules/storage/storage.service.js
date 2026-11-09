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

function extensionFor(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  if (ext) return ext;

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
