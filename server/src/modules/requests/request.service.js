import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { escapeHtml } from "../../shared/utils/html.js";
import { notify } from "../notifications/notification.service.js";
import { ROLES } from "../platform/platform.constants.js";
import { REQUEST_STATUS, REQUEST_STATUS_VALUES, REQUEST_STATUS_LABELS } from "./request.constants.js";
import { serializeRequest } from "./request.serializer.js";

const OPERATION_INCLUDE = {
  include: {
    pilot: true,
    drone: true,
    review: true,
    files: { orderBy: { createdAt: "asc" } },
    telemetry: { orderBy: { recordedAt: "asc" } },
  },
};

export async function listForUser(user) {
  const requests = await prisma.serviceRequest.findMany({
    where: { userId: user.id },
    include: { files: { orderBy: { createdAt: "asc" } }, operation: OPERATION_INCLUDE },
    orderBy: { createdAt: "desc" },
  });
  return requests.map(serializeRequest);
}

export async function createForUser(user, body) {
  if (!body.service) throw new HttpError(400, "service is required.");

  const request = await prisma.serviceRequest.create({
    data: {
      userId: user.id,
      service: body.service,
      description: body.description || "",
      location: body.location || user.address || "",
      region: body.region || user.region || "",
      firm: user.firm,
      status: REQUEST_STATUS.SUBMITTED,
    },
  });

  if (Array.isArray(body.fileAssetIds) && body.fileAssetIds.length > 0) {
    await prisma.fileAsset.updateMany({
      where: { id: { in: body.fileAssetIds }, ownerId: user.id },
      data: { serviceRequestId: request.id },
    });
  }

  return serializeRequest(request);
}

export async function listForAdmin({ status, firm, country } = {}) {
  const userFilter = {
    ...(country && { country }),
  };

  const requests = await prisma.serviceRequest.findMany({
    where: {
      ...(status && { status }),
      ...(firm && { firm }),
      ...(Object.keys(userFilter).length > 0 && { user: userFilter }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          telephone: true,
          identificationNumber: true,
          sector: true,
          crop: true,
          firm: true,
          country: true,
        },
      },
      operation: OPERATION_INCLUDE,
      partner: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return requests.map((request) => ({
    ...serializeRequest(request),
    user: request.user,
    partner: request.partner,
  }));
}

export async function assignPartner(id, body) {
  const partnerId = body.partnerId || null;

  if (partnerId) {
    const partner = await prisma.user.findFirst({ where: { id: partnerId, role: ROLES.PARTNER } });
    if (!partner) throw new HttpError(404, "Partner not found.");
  }

  const request = await prisma.serviceRequest
    .update({
      where: { id },
      data: { partnerId },
      include: { partner: { select: { id: true, name: true, email: true } } },
    })
    .catch(() => null);
  if (!request) throw new HttpError(404, "Service request not found.");

  return { ...serializeRequest(request), partner: request.partner };
}

// Partners get read-only visibility of what Nkem has explicitly shared with them —
// spec §18 keeps Nkem responsible for managing requests until partnerships mature.
export async function listForPartner(user) {
  const requests = await prisma.serviceRequest.findMany({
    where: { partnerId: user.id },
    include: {
      user: { select: { name: true, surname: true, telephone: true, region: true } },
      operation: { select: { scheduledAt: true, region: true, results: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return requests.map((request) => ({
    id: request.id,
    service: request.service,
    description: request.description,
    location: request.location,
    region: request.region,
    status: request.status,
    statusLabel: REQUEST_STATUS_LABELS[request.status] || request.status,
    customer: request.user,
    operation: request.operation
      ? {
          scheduledAt: request.operation.scheduledAt?.toISOString() ?? null,
          region: request.operation.region,
          results: request.operation.results,
        }
      : null,
    createdAt: request.createdAt.toISOString(),
  }));
}

export async function updateStatus(id, body) {
  if (!REQUEST_STATUS_VALUES.includes(body.status)) {
    throw new HttpError(400, "A valid request status is required.");
  }

  const request = await prisma.serviceRequest
    .update({
      where: { id },
      data: { status: body.status, adminNotes: body.adminNotes || "" },
    })
    .catch(() => null);

  if (!request) throw new HttpError(404, "Service request not found.");

  const statusLabel = REQUEST_STATUS_LABELS[request.status] || request.status;
  await notify(
    request.userId,
    {
      type: "request_status",
      title: `Your ${request.service} request is now ${statusLabel}`,
      body: request.adminNotes || "",
      link: "/logbook",
    },
    `Update on your ${request.service} request`,
    `<p>Your request for <strong>${escapeHtml(request.service)}</strong> is now <strong>${statusLabel}</strong>.</p>${request.adminNotes ? `<p>${escapeHtml(request.adminNotes)}</p>` : ""}<p><a href="${env.clientOrigin}/logbook">View in your Logbook</a></p><p>— Nkem Aeronautics Ltd</p>`,
  );

  return serializeRequest(request);
}
