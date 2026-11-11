import "dotenv/config";
import { sendEmail } from "../src/modules/notifications/email.service.js";

const recipient = process.argv[2];
if (!recipient || !recipient.includes("@")) {
  throw new Error("Usage: npm run email:check -- recipient@example.com");
}
if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is not configured in server/.env.");
}
if (!process.env.EMAIL_FROM_ADDRESS) {
  throw new Error("EMAIL_FROM_ADDRESS is not configured in server/.env.");
}

await sendEmail(
  recipient,
  "Nkem Aeronautics email configuration test",
  `<p>Your Nkem Aeronautics Brevo integration is working.</p><p>Sent at ${new Date().toISOString()}</p>`,
  { throwOnError: true },
);

console.log(`Brevo email accepted for delivery to ${recipient}.`);
