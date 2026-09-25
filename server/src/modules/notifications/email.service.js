import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

// Brevo HTTP API — used when BREVO_API_KEY is set (avoids SMTP port blocks on Railway).
async function sendViaBrevoApi(to, subject, html) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.brevoApiKey,
    },
    body: JSON.stringify({
      sender: { name: "Nkem Aeronautics", email: env.smtpUser },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || `Brevo API error ${res.status}`);
  }
}

// Nodemailer SMTP fallback — used when only SMTP_PASS is set (local dev / non-Railway).
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: false,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
}

export async function sendEmail(to, subject, html) {
  if (!env.brevoApiKey && !env.smtpPass) {
    console.log(`[email] ${subject} -> ${to}`);
    return;
  }

  try {
    if (env.brevoApiKey) {
      await sendViaBrevoApi(to, subject, html);
    } else {
      await getTransporter().sendMail({
        from: `"Nkem Aeronautics" <${env.smtpUser}>`,
        to,
        subject,
        html,
      });
    }
  } catch (error) {
    console.error(`[email] send failed for ${to}: ${error.message}`);
  }
}
