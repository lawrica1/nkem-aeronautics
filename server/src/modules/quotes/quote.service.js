import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { env } from "../../config/env.js";
import { sendEmail } from "../notifications/email.service.js";

const TERMII_SEND_URL = "https://v4.api.termii.com/api/sms/send";

async function notifyAdmin(quote) {
  const name = quote.name || "Anonymous";
  const sector = quote.sector.replace("-", " & ");

  if (env.adminEmail) {
    const subject = `New enquiry: ${sector} — ${name}`;
    const html = `
      <h2 style="color:#1a2e4a">New Enquiry Received</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${name}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${quote.email}</td></tr>
        ${quote.whatsapp ? `<tr><td style="padding:4px 12px 4px 0;color:#666">WhatsApp</td><td>${quote.whatsapp}</td></tr>` : ""}
        ${quote.targetCountry ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Region</td><td>${quote.targetCountry}</td></tr>` : ""}
        <tr><td style="padding:4px 12px 4px 0;color:#666">Service</td><td>${sector}</td></tr>
        ${quote.interestedIn ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Interested in</td><td>${quote.interestedIn}</td></tr>` : ""}
      </table>
      <p style="margin-top:16px;font-family:sans-serif;font-size:14px"><strong>Message:</strong><br>${quote.message}</p>
      <p style="margin-top:16px;font-family:sans-serif;font-size:12px;color:#999">View in admin: /admin/quotes</p>
    `;
    sendEmail(env.adminEmail, subject, html).catch((err) =>
      console.error("[quote:notify:email]", err.message)
    );
  }

  if (env.adminPhone && env.termiiApiKey) {
    const sms = `New Nkem enquiry — ${name} (${sector}): "${quote.message.slice(0, 100)}"`;
    fetch(TERMII_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: env.adminPhone.replace(/[^\d+]/g, "").replace(/^\+/, ""),
        from: env.termiiSenderId,
        sms,
        type: "plain",
        channel: env.termiiChannel,
        api_key: env.termiiApiKey,
      }),
    }).catch((err) => console.error("[quote:notify:sms]", err.message));
  }
}

// Mirrors the client's catalogue tabs (client/src/lib/catalog.js CATALOG_SECTORS), plus
// "general" for customer-service messages submitted from the Contact page (no catalogue tab).
// Must cover every service page that renders QuoteRequestForm (client/src/lib/services.js slugs).
const QUOTE_SECTORS = ["agricultural", "wildlife", "mining", "pipeline", "survey-mapping", "evtol", "general"];

export async function create(body) {
  if (!body.sector || !QUOTE_SECTORS.includes(body.sector)) {
    throw new HttpError(400, "A valid sector is required.");
  }
  if (!body.email) throw new HttpError(400, "email is required.");
  if (!body.message) throw new HttpError(400, "message is required.");

  const quote = await prisma.quoteRequest.create({
    data: {
      sector: body.sector,
      name: body.name || null,
      email: body.email,
      whatsapp: body.whatsapp || null,
      company: body.company || null,
      targetCountry: body.targetCountry,
      interestedProduct: body.interestedProduct || null,
      interestedIn: body.interestedIn || null,
      message: body.message,
    },
  });

  notifyAdmin(quote);
  return quote;
}

export async function listAdmin() {
  return prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function update(id, body) {
  const data = {};
  for (const key of ["status", "adminNotes"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const quote = await prisma.quoteRequest.update({ where: { id }, data }).catch(() => null);
  if (!quote) throw new HttpError(404, "Quote request not found.");
  return quote;
}
