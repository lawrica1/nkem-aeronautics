import { NextResponse } from "next/server";
import { requireFarmer } from "@/lib/server/auth";
import { ServiceRequest } from "@/lib/server/models/ServiceRequest";
import { handleRoute } from "@/lib/server/handleRoute";
import { HttpError } from "@/lib/server/httpError";

const UNROUTABLE_FIRMS = new Set(["none", "other", undefined, ""]);

export const POST = handleRoute(async (request) => {
  const farmer = await requireFarmer(request);
  const { service } = await request.json();
  if (!service) {
    throw new HttpError(400, "service is required.");
  }

  const status = UNROUTABLE_FIRMS.has(farmer.firm) ? "unassigned" : "routed";

  const serviceRequest = await ServiceRequest.create({
    farmer: farmer._id,
    service,
    firm: farmer.firm,
    status,
  });

  return NextResponse.json(serviceRequest, { status: 201 });
});
