import "dotenv/config";
import crypto from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const required = [
  "AWS_ENDPOINT_URL_S3",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "STORAGE_BUCKET",
];

for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is not configured.`);
}

const client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const key = `healthcheck/${crypto.randomUUID()}.txt`;
const expected = `nkem-storage-check:${crypto.randomUUID()}`;

try {
  await client.send(new PutObjectCommand({
    Bucket: process.env.STORAGE_BUCKET,
    Key: key,
    Body: expected,
    ContentType: "text/plain",
  }));

  const result = await client.send(new GetObjectCommand({
    Bucket: process.env.STORAGE_BUCKET,
    Key: key,
  }));
  const actual = await result.Body.transformToString();
  if (actual !== expected) throw new Error("Downloaded object did not match the uploaded content.");

  const signedUrl = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: process.env.STORAGE_BUCKET, Key: key }),
    { expiresIn: 60 },
  );
  const signedResponse = await fetch(signedUrl);
  if (!signedResponse.ok || (await signedResponse.text()) !== expected) {
    throw new Error("The private signed download URL could not retrieve the uploaded content.");
  }

  console.log("Neon Object Storage check passed: upload, private download, and signed download succeeded.");
} finally {
  await client.send(new DeleteObjectCommand({
    Bucket: process.env.STORAGE_BUCKET,
    Key: key,
  })).catch(() => {});
}
