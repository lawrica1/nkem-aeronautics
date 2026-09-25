import crypto from "node:crypto";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env, requireEnv } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

let client;

function getStorageClient() {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: requireEnv("R2_ENDPOINT", env.r2Endpoint),
      credentials: {
        accessKeyId: requireEnv("R2_ACCESS_KEY_ID", env.r2AccessKeyId),
        secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY", env.r2SecretAccessKey),
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

export function publicUrlForKey(key) {
  return `${requireEnv("R2_PUBLIC_BASE_URL", env.r2PublicBaseUrl).replace(/\/$/, "")}/${key}`;
}

export async function uploadFileToStorage(file, { ownerId, purpose = "general" } = {}) {
  if (!file) throw new HttpError(400, "A file is required.");

  const safePurpose = String(purpose || "general").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const key = `${safePurpose}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}${extensionFor(file)}`;

  await getStorageClient().send(
    new PutObjectCommand({
      Bucket: requireEnv("R2_BUCKET", env.r2Bucket),
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
      url: publicUrlForKey(key),
      mimeType: file.mimetype,
      size: file.size,
    },
  });

  return asset;
}
