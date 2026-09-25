import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: false, // Brevo uses STARTTLS on 587, not implicit TLS
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
}

export async function sendEmail(to, subject, html) {
  if (!env.smtpPass) {
    console.log(`[email] ${subject} -> ${to}`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: `"Nkem Aeronautics" <${env.smtpUser}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    // A misconfigured/unreachable mail server shouldn't fail the request that triggered
    // the email (e.g. recording a payment) — log it and move on, same pattern as OTP SMS.
    console.error(`[email] send failed for ${to}: ${error.message}`);
  }
}
