import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { ServiceRequest } from "@/lib/server/models/ServiceRequest";
import { FIRM_OPTIONS } from "@/lib/firms";

const FIRM_LABELS = Object.fromEntries(FIRM_OPTIONS.map((f) => [f.value, f.label]));

async function countsByField(Model, match, field) {
  const rows = await Model.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map((r) => ({ value: r._id ?? "(none)", count: r.count }));
}

// No per-region breakdown here — Farmer.address is free text, not a
// structured region field, and guessing a region out of it would report
// numbers nobody actually verified. See AGENTS.md for the follow-up needed
// (a real region/district field on signup) before this can exist.
export async function getFarmerStats() {
  await connectDb();

  const verifiedMatch = { isVerified: true };

  const [totalFarmers, bySector, byFirmRaw, byCrop, totalRequests, byStatus, byService] =
    await Promise.all([
      Farmer.countDocuments(verifiedMatch),
      countsByField(Farmer, verifiedMatch, "sector"),
      countsByField(Farmer, { ...verifiedMatch, sector: "agricultural" }, "firm"),
      countsByField(Farmer, { ...verifiedMatch, sector: "agricultural" }, "crop"),
      ServiceRequest.countDocuments({}),
      countsByField(ServiceRequest, {}, "status"),
      countsByField(ServiceRequest, {}, "service"),
    ]);

  const byFirm = byFirmRaw.map((row) => ({
    ...row,
    label: FIRM_LABELS[row.value] ?? row.value,
  }));

  return { totalFarmers, bySector, byFirm, byCrop, totalRequests, byStatus, byService };
}
