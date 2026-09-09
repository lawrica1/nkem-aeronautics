import { REQUEST_STATUS_LABELS } from "./request.constants.js";
import { serializeOperation } from "../operations/operation.serializer.js";

export function serializeRequest(request) {
  return {
    id: request.id,
    service: request.service,
    description: request.description,
    location: request.location,
    region: request.region,
    firm: request.firm,
    status: request.status,
    statusLabel: REQUEST_STATUS_LABELS[request.status] || request.status,
    adminNotes: request.adminNotes,
    files: request.files?.map((f) => ({ id: f.id, url: f.url, mimeType: f.mimeType, originalName: f.originalName })) ?? [],
    operation: request.operation ? serializeOperation(request.operation) : null,
    createdAt: request.createdAt?.toISOString(),
    updatedAt: request.updatedAt?.toISOString(),
  };
}
