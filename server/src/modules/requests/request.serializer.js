import { REQUEST_STATUS_LABELS } from "./request.constants.js";

export function serializeRequest(request) {
  return {
    id: String(request._id),
    _id: String(request._id),
    service: request.service,
    description: request.description,
    location: request.location,
    region: request.region,
    firm: request.firm,
    status: request.status,
    statusLabel: REQUEST_STATUS_LABELS[request.status] || request.status,
    adminNotes: request.adminNotes,
    createdAt: request.createdAt?.toISOString(),
    updatedAt: request.updatedAt?.toISOString(),
  };
}
