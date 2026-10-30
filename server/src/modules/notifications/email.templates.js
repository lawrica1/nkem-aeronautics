import { env } from "../../config/env.js";

const BRAND_NAVY = "#0f172a";
const BRAND_BLUE = "#2563eb";
const BRAND_LIGHT = "#f8fafc";
const BRAND_BORDER = "#e2e8f0";
const TEXT_MAIN = "#1e293b";
const TEXT_MUTED = "#64748b";

function base(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nkem Aeronautics</title>
</head>
<body style="margin:0;padding:0;background:${BRAND_LIGHT};font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_LIGHT};padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND_BORDER};">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND_NAVY};padding:28px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">NKEM AERONAUTICS</span>
                </td>
                <td align="right">
                  <span style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:1px;text-transform:uppercase;">Aerial Intelligence</span>
                </td>
              </tr>
            </table>
            <div style="height:3px;background:${BRAND_BLUE};border-radius:2px;margin-top:16px;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${BRAND_LIGHT};border-top:1px solid ${BRAND_BORDER};padding:20px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:12px;color:${TEXT_MUTED};">
                  <strong style="color:${TEXT_MAIN};">Nkem Aeronautics Ltd</strong><br/>
                  Junction of Cairo Road and Independence Avenue, Lusaka 10101, Zambia<br/>
                  <a href="mailto:nkem@nkemaeronautics.com" style="color:${BRAND_BLUE};text-decoration:none;">nkem@nkemaeronautics.com</a>
                  &nbsp;·&nbsp;
                  <a href="${env.clientOrigin}" style="color:${BRAND_BLUE};text-decoration:none;">nkemaeronautics.com</a>
                </td>
              </tr>
              <tr>
                <td style="padding-top:12px;font-size:11px;color:${TEXT_MUTED};">
                  This email was sent by Nkem Aeronautics. Please do not reply directly to this message.
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function badge(text, color = BRAND_BLUE) {
  return `<span style="display:inline-block;background:${color};color:#fff;font-size:11px;font-weight:600;letter-spacing:0.5px;padding:3px 10px;border-radius:20px;text-transform:uppercase;">${text}</span>`;
}

function btn(label, href) {
  return `<a href="${href}" style="display:inline-block;background:${BRAND_BLUE};color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;margin-top:20px;">${label}</a>`;
}

function row(label, value) {
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:${TEXT_MUTED};width:40%;">${label}</td>
    <td style="padding:8px 0;font-size:13px;color:${TEXT_MAIN};font-weight:600;">${value || "—"}</td>
  </tr>`;
}

function table(rows) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND_BORDER};margin-top:20px;">${rows}</table>`;
}

function divider() {
  return `<div style="height:1px;background:${BRAND_BORDER};margin:24px 0;"></div>`;
}

function heading(text) {
  return `<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${TEXT_MAIN};">${text}</h1>`;
}

function subheading(text) {
  return `<p style="margin:0 0 20px 0;font-size:15px;color:${TEXT_MUTED};">${text}</p>`;
}

function para(text) {
  return `<p style="font-size:14px;line-height:1.6;color:${TEXT_MAIN};margin:12px 0;">${text}</p>`;
}

function alertBox(text, color = "#eff6ff", borderColor = BRAND_BLUE) {
  return `<div style="background:${color};border-left:4px solid ${borderColor};border-radius:6px;padding:14px 18px;margin:20px 0;font-size:14px;color:${TEXT_MAIN};">${text}</div>`;
}

// ─── Customer-facing templates ──────────────────────────────────────────────

export function serviceRequestConfirmation({ name, service, location, logbookId }) {
  return base(`
    ${badge("Service Request", "#16a34a")}
    <div style="margin-top:16px;">
      ${heading("We've received your request")}
      ${subheading(`Hello ${name || "there"}, your service request has been submitted successfully.`)}
    </div>
    ${table(`
      ${row("Service Type", service)}
      ${row("Location", location)}
      ${row("Logbook ID", logbookId)}
      ${row("Status", "Submitted")}
    `)}
    ${alertBox("Our team will review your request and reach out to you shortly. You can track the status in your Logbook portal.")}
    ${btn("View My Logbook", `${env.clientOrigin}/logbook`)}
  `);
}

export function serviceRequestStatusUpdate({ name, service, statusLabel, adminNotes }) {
  return base(`
    ${badge("Request Update")}
    <div style="margin-top:16px;">
      ${heading(`Your ${service} request has been updated`)}
      ${subheading(`Hello ${name || "there"}, here is the latest on your service request.`)}
    </div>
    ${table(`
      ${row("Service Type", service)}
      ${row("New Status", statusLabel)}
    `)}
    ${adminNotes ? alertBox(`<strong>Note from our team:</strong><br/>${adminNotes}`) : ""}
    ${btn("View in Logbook", `${env.clientOrigin}/logbook`)}
  `);
}

export function partRequestConfirmation({ name, description }) {
  return base(`
    ${badge("Parts Request", "#7c3aed")}
    <div style="margin-top:16px;">
      ${heading("Part identification request received")}
      ${subheading(`Hello ${name || "there"}, we've received your part request and our team will identify it for you.`)}
    </div>
    ${table(`
      ${row("Description", description?.slice(0, 120) + (description?.length > 120 ? "…" : ""))}
      ${row("Status", "Under Review")}
    `)}
    ${alertBox("Our parts team will review your request and get back to you with identification details and pricing.")}
    ${btn("View My Requests", `${env.clientOrigin}/logbook`)}
  `);
}

export function partRequestStatusUpdate({ name, description, statusLabel, adminNotes }) {
  return base(`
    ${badge("Parts Request Update", "#7c3aed")}
    <div style="margin-top:16px;">
      ${heading("Update on your part request")}
      ${subheading(`Hello ${name || "there"}, your part identification request has been updated.`)}
    </div>
    ${table(`
      ${row("Part Description", description?.slice(0, 80) + (description?.length > 80 ? "…" : ""))}
      ${row("New Status", statusLabel)}
    `)}
    ${adminNotes ? alertBox(`<strong>Note from our team:</strong><br/>${adminNotes}`) : ""}
    ${btn("View in Logbook", `${env.clientOrigin}/logbook`)}
  `);
}

export function logbookVerifiedEmail({ name, logbookId }) {
  return base(`
    ${badge("Logbook Verified", "#16a34a")}
    <div style="margin-top:16px;">
      ${heading("Your logbook has been verified!")}
      ${subheading(`Congratulations ${name || "there"}, Nkem Aeronautics has officially verified your logbook.`)}
    </div>
    ${table(`
      ${row("Logbook ID", logbookId)}
      ${row("Verified By", "Nkem Aeronautics")}
    `)}
    ${alertBox("Your logbook is now fully active. You have full access to submit service requests and track your agricultural operations.")}
    ${btn("Open My Logbook", `${env.clientOrigin}/logbook`)}
  `);
}

export function orderConfirmation({ name, orderId, items, total }) {
  const itemRows = items.map((i) => row(i.name, `${i.quantity} × ${Number(i.unitPrice).toLocaleString()} XAF`)).join("");
  return base(`
    ${badge("Order Confirmed", "#16a34a")}
    <div style="margin-top:16px;">
      ${heading("Your order has been received")}
      ${subheading(`Hello ${name || "there"}, thank you for your order. Here is a summary.`)}
    </div>
    ${table(`
      ${row("Order ID", orderId)}
      ${itemRows}
      ${row("Total", `${Number(total).toLocaleString()} XAF`)}
      ${row("Status", "Pending Payment")}
    `)}
    ${alertBox("Our team will contact you to confirm delivery details and payment arrangements.")}
    ${btn("View My Orders", `${env.clientOrigin}/logbook`)}
  `);
}

export function orderStatusUpdate({ name, orderId, statusLabel }) {
  return base(`
    ${badge("Order Update")}
    <div style="margin-top:16px;">
      ${heading("Your order status has changed")}
      ${subheading(`Hello ${name || "there"}, here is the latest update on your order.`)}
    </div>
    ${table(`
      ${row("Order ID", orderId)}
      ${row("New Status", statusLabel)}
    `)}
    ${btn("View My Orders", `${env.clientOrigin}/logbook`)}
  `);
}

export function passwordChangedEmail({ name }) {
  return base(`
    ${badge("Security Notice", "#dc2626")}
    <div style="margin-top:16px;">
      ${heading("Your password was changed")}
      ${subheading(`Hello ${name || "there"}, this is a confirmation that your password was just updated.`)}
    </div>
    ${alertBox(`If you made this change, you can ignore this email.<br/><br/><strong>If you did not change your password</strong>, please contact us immediately at <a href="mailto:nkem@nkemaeronautics.com" style="color:${BRAND_BLUE};">nkem@nkemaeronautics.com</a> or via WhatsApp.`, "#fef2f2", "#dc2626")}
    ${btn("Contact Support", `${env.clientOrigin}/contact`)}
  `);
}

// ─── Admin-facing templates ──────────────────────────────────────────────────

export function adminNewServiceRequest({ userName, userEmail, service, location, region, requestId }) {
  return base(`
    ${badge("New Service Request", "#ea580c")}
    <div style="margin-top:16px;">
      ${heading("New service request submitted")}
      ${subheading("A customer has submitted a new service request on the platform.")}
    </div>
    ${table(`
      ${row("Customer", userName)}
      ${row("Email", userEmail)}
      ${row("Service", service)}
      ${row("Location", location)}
      ${row("Region", region)}
      ${row("Request ID", requestId)}
    `)}
    ${btn("Review in Admin Portal", `${env.clientOrigin}/admin/requests`)}
  `);
}

export function adminNewPartRequest({ userName, userEmail, description, requestId }) {
  return base(`
    ${badge("New Parts Request", "#7c3aed")}
    <div style="margin-top:16px;">
      ${heading("New part identification request")}
      ${subheading("A customer needs help identifying a part.")}
    </div>
    ${table(`
      ${row("Customer", userName)}
      ${row("Email", userEmail)}
      ${row("Description", description?.slice(0, 160))}
      ${row("Request ID", requestId)}
    `)}
    ${btn("Review in Admin Portal", `${env.clientOrigin}/admin/part-requests`)}
  `);
}

export function adminNewOrder({ userName, userEmail, orderId, items, total }) {
  const itemRows = items.map((i) => row(i.name, `${i.quantity} × ${Number(i.unitPrice).toLocaleString()} XAF`)).join("");
  return base(`
    ${badge("New Order", "#16a34a")}
    <div style="margin-top:16px;">
      ${heading("New order placed")}
      ${subheading("A customer has placed a new order on the platform.")}
    </div>
    ${table(`
      ${row("Customer", userName)}
      ${row("Email", userEmail)}
      ${row("Order ID", orderId)}
      ${itemRows}
      ${row("Total", `${Number(total).toLocaleString()} XAF`)}
    `)}
    ${btn("View in Admin Portal", `${env.clientOrigin}/admin/orders`)}
  `);
}

export function adminNewVerifiedUser({ userName, email, logbookId }) {
  return base(`
    ${badge("New User Verified", "#16a34a")}
    <div style="margin-top:16px;">
      ${heading("A new user has verified their account")}
      ${subheading("A new farmer account is now active on the platform.")}
    </div>
    ${table(`
      ${row("Name", userName)}
      ${row("Email", email)}
      ${row("Logbook ID", logbookId)}
    `)}
    ${btn("View in Admin Portal", `${env.clientOrigin}/admin/users`)}
  `);
}
