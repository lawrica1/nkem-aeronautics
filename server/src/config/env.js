import "dotenv/config";

export const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  r2Endpoint: process.env.R2_ENDPOINT,
  r2Bucket: process.env.R2_BUCKET,
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  r2PublicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
  termiiApiKey: process.env.TERMII_API_KEY,
  termiiSenderId: process.env.TERMII_SENDER_ID || "N-Alert",
  termiiChannel: process.env.TERMII_CHANNEL || "generic",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number(process.env.SMTP_PORT) || 465,
  smtpUser: process.env.SMTP_USER || "nkemaeronautics@gmail.com",
  smtpPass: process.env.SMTP_PASS,
  brevoApiKey: process.env.BREVO_API_KEY,
  flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  flutterwaveWebhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH,
};

export function requireEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is not set. Add it to server/.env`);
  }
  return value;
}
