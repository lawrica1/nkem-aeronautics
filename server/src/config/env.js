import "dotenv/config";

export const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  storageEndpoint: process.env.AWS_ENDPOINT_URL_S3 || process.env.R2_ENDPOINT,
  storageBucket: process.env.STORAGE_BUCKET || process.env.R2_BUCKET,
  storageAccessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID,
  storageSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY,
  storageRegion: process.env.AWS_REGION || "auto",
  storageSignedUrlTtl: Number(process.env.STORAGE_SIGNED_URL_TTL) || 900,
  termiiApiKey: process.env.TERMII_API_KEY,
  termiiSenderId: process.env.TERMII_SENDER_ID ?? "",
  termiiChannel: process.env.TERMII_CHANNEL || "generic",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number(process.env.SMTP_PORT) || 465,
  smtpUser: process.env.SMTP_USER || "nkem@nkemaeronautics.com",
  smtpPass: process.env.SMTP_PASS,
  brevoApiKey: process.env.BREVO_API_KEY,
  flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  flutterwaveWebhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH,
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPhone: process.env.ADMIN_PHONE || "",
};

export function requireEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is not set. Add it to server/.env`);
  }
  return value;
}
