import "dotenv/config";

export const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  // Extra site addresses allowed to call the API (comma-separated), e.g. the www and
  // onrender.com hosts; * stands for one host label (see originPattern in app.js).
  // CLIENT_ORIGIN stays the single address used in email links.
  corsOrigins: (process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean),
  nodeEnv: process.env.NODE_ENV || "development",
  r2Endpoint: process.env.R2_ENDPOINT,
  r2Bucket: process.env.R2_BUCKET,
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  r2PublicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
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
  adminSignupCode: process.env.ADMIN_SIGNUP_CODE || "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  // Fallback provider for the website assistant when ANTHROPIC_API_KEY is not set.
  geminiApiKey: process.env.GEMINI_API_KEY,
  // Flash-Lite starts answering fastest, which suits short catalog questions.
  geminiModel: process.env.GEMINI_MODEL || "gemini-flash-lite-latest",
  // Model tried when the main one is overloaded; set GEMINI_FALLBACK_MODEL= (empty) to disable.
  geminiFallbackModel: process.env.GEMINI_FALLBACK_MODEL ?? "gemini-flash-latest",
};

export function requireEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is not set. Add it to server/.env`);
  }
  return value;
}
