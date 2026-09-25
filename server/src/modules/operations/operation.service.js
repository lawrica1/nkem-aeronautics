import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { escapeHtml } from "../../shared/utils/html.js";
import { notify } from "../notifications/notification.service.js";
import { ROLES } from "../platform/platform.constants.js";
import { REQUEST_STATUS, REQUEST_STATUS_VALUES, REQUEST_STATUS_LABELS } from "../requests/request.constants.js";
import { serializeOperation } from "./operation.serializer.js";

const OPERATION_INCLUDE = {
  pilot: true,
  drone: true,
  review: true,
  files: { orderBy: { createdAt: "asc" } },
  telemetry: { orderBy: { recordedAt: "asc" } },
};

export async function assign(body) {
  if (!body.serviceRequestId) throw new HttpError(400, "serviceRequestId is required.");

  const request = await prisma.serviceRequest.findUnique({
    where: { id: body.serviceRequestId },
    include: { operation: true },
  });
  if (!request) throw new HttpError(404, "Service request not found.");
  if (request.operation) throw new HttpError(409, "This request already has an operation assigned.");

  const [operation] = await prisma.$transaction([
    prisma.operation.create({
      data: {
        serviceRequestId: request.id,
        userId: request.userId,
        pilotId: body.pilotId || null,
        droneId: body.droneId || null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        chemical: body.chemical || "",
        region: body.region || request.region || "",
        comments: body.comments || "",
      },
      include: OPERATION_INCLUDE,
    }),
    prisma.serviceRequest.update({
      where: { id: request.id },
      data: { status: REQUEST_STATUS.ASSIGNED },
    }),
  ]);

  return serializeOperation(operation);
}

export async function update(id, body) {
  const data = {};
  for (const key of ["pilotId", "droneId", "chemical", "region", "comments", "results"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.scheduledAt !== undefined) {
    data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
  }

  const operation = await prisma.operation
    .update({ where: { id }, data, include: OPERATION_INCLUDE })
    .catch(() => null);
  if (!operation) throw new HttpError(404, "Operation not found.");

  if (body.status !== undefined) {
    if (!REQUEST_STATUS_VALUES.includes(body.status)) {
      throw new HttpError(400, "A valid request status is required.");
    }
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: operation.serviceRequestId },
      data: { status: body.status },
    });

    if (body.status === REQUEST_STATUS.COMPLETED) {
      await notify(
        updatedRequest.userId,
        {
          type: "operation_completed",
          title: `Your ${updatedRequest.service} operation is complete`,
          body: operation.results || "",
          link: "/logbook",
        },
        `Your ${updatedRequest.service} operation is complete`,
        `<p>Your <strong>${escapeHtml(updatedRequest.service)}</strong> operation${operation.pilot ? ` with pilot ${escapeHtml(operation.pilot.name)}` : ""} is complete.</p>${operation.results ? `<p><strong>Results:</strong> ${escapeHtml(operation.results)}</p>` : ""}<p>You can now leave a review for the pilot from your Logbook.</p><p><a href="${env.clientOrigin}/logbook">View in your Logbook</a></p><p>— Nkem Aeronautics Ltd</p>`,
      );
    } else {
      const statusLabel = REQUEST_STATUS_LABELS[updatedRequest.status] || updatedRequest.status;
      await notify(
        updatedRequest.userId,
        {
          type: "request_status",
          title: `Your ${updatedRequest.service} request is now ${statusLabel}`,
          link: "/logbook",
        },
        `Update on your ${updatedRequest.service} request`,
        `<p>Your request for <strong>${escapeHtml(updatedRequest.service)}</strong> is now <strong>${statusLabel}</strong>.</p><p><a href="${env.clientOrigin}/logbook">View in your Logbook</a></p><p>— Nkem Aeronautics Ltd</p>`,
      );
    }
  }

  return serializeOperation(operation);
}

async function requirePilotOwnership(operationId, user) {
  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) throw new HttpError(404, "No pilot profile linked to this account.");

  const operation = await prisma.operation.findUnique({ where: { id: operationId } });
  if (!operation || operation.pilotId !== pilot.id) throw new HttpError(404, "Operation not found.");
  return operation;
}

export async function attachMedia(id, user, body) {
  if (!Array.isArray(body.fileAssetIds) || body.fileAssetIds.length === 0) {
    throw new HttpError(400, "fileAssetIds is required.");
  }

  let operation;
  if (user.role === ROLES.PILOT) {
    operation = await requirePilotOwnership(id, user);
  } else if (user.role === ROLES.ADMIN) {
    operation = await prisma.operation.findUnique({ where: { id } });
    if (!operation) throw new HttpError(404, "Operation not found.");
  } else {
    throw new HttpError(403, "You do not have permission to attach media to this operation.");
  }

  const { count } = await prisma.fileAsset.updateMany({
    where: { id: { in: body.fileAssetIds }, ownerId: user.id },
    data: { operationId: operation.id },
  });
  if (count === 0) throw new HttpError(400, "None of those files were uploaded by you.");

  const updated = await prisma.operation.findUnique({ where: { id: operation.id }, include: OPERATION_INCLUDE });
  return serializeOperation(updated);
}

export async function listForPilot(user) {
  const pilot = await prisma.pilot.findUnique({ where: { userId: user.id } });
  if (!pilot) throw new HttpError(404, "No pilot profile linked to this account.");

  const operations = await prisma.operation.findMany({
    where: { pilotId: pilot.id },
    include: {
      drone: true,
      files: { orderBy: { createdAt: "asc" } },
      review: true,
      serviceRequest: {
        select: {
          service: true,
          status: true,
          region: true,
          user: { select: { name: true, surname: true, telephone: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return operations.map((op) => ({
    id: op.id,
    service: op.serviceRequest.service,
    status: op.serviceRequest.status,
    statusLabel: REQUEST_STATUS_LABELS[op.serviceRequest.status] || op.serviceRequest.status,
    customer: op.serviceRequest.user,
    drone: op.drone ? { id: op.drone.id, name: op.drone.name, model: op.drone.model } : null,
    scheduledAt: op.scheduledAt?.toISOString() ?? null,
    chemical: op.chemical,
    region: op.region,
    comments: op.comments,
    results: op.results,
    files: op.files.map((f) => ({ id: f.id, url: f.url, mimeType: f.mimeType, originalName: f.originalName })),
    review: op.review ? { rating: op.review.rating, comment: op.review.comment } : null,
    createdAt: op.createdAt.toISOString(),
  }));
}

export async function updateAsPilot(id, user, body) {
  await requirePilotOwnership(id, user);

  const data = {};
  for (const key of ["comments", "results"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const updated = await prisma.operation.update({ where: { id }, data, include: OPERATION_INCLUDE });
  return serializeOperation(updated);
}

export async function addReview(operationId, user, body) {
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new HttpError(400, "rating must be an integer between 1 and 5.");
  }

  const operation = await prisma.operation.findUnique({
    where: { id: operationId },
    include: { serviceRequest: true, review: true },
  });
  if (!operation || operation.userId !== user.id) {
    throw new HttpError(404, "Operation not found.");
  }
  if (operation.serviceRequest.status !== REQUEST_STATUS.COMPLETED) {
    throw new HttpError(400, "You can only review a completed operation.");
  }
  if (operation.review) throw new HttpError(409, "This operation has already been reviewed.");
  if (!operation.pilotId) throw new HttpError(400, "This operation has no pilot to review.");

  await prisma.review.create({
    data: {
      operationId: operation.id,
      userId: user.id,
      pilotId: operation.pilotId,
      rating,
      comment: body.comment || "",
    },
  });

  const updated = await prisma.operation.findUnique({ where: { id: operationId }, include: OPERATION_INCLUDE });
  return serializeOperation(updated);
}
