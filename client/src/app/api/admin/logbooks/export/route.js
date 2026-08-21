import ExcelJS from "exceljs";
import { connectDb } from "@/lib/server/db";
import { Farmer } from "@/lib/server/models/Farmer";
import { requireAdmin } from "@/lib/server/auth";
import { toCsv } from "@/lib/server/csv";
import { handleRoute } from "@/lib/server/handleRoute";
import { HttpError } from "@/lib/server/httpError";
import { FIRM_OPTIONS } from "@/lib/firms";

const FIRM_LABELS = Object.fromEntries(FIRM_OPTIONS.map((f) => [f.value, f.label]));
const FIRM_VALUES = new Set(FIRM_OPTIONS.map((f) => f.value));

// Explicit allowlist — never passwordHash or otp, and safe against a future
// schema field leaking into an export by accident.
const SELECT_FIELDS =
  "identificationNumber surname name sex telephone email address sector crop firm otherFirm wildlifeOrg wildlifeRole createdAt";

const COLUMNS = [
  { key: "identificationNumber", header: "Logbook ID" },
  { key: "surname", header: "Surname" },
  { key: "name", header: "Name" },
  { key: "sex", header: "Sex" },
  { key: "telephone", header: "Telephone" },
  { key: "email", header: "Email" },
  { key: "address", header: "Address" },
  { key: "sector", header: "Sector" },
  { key: "crop", header: "Crop" },
  { key: "firmDisplay", header: "Firm Affiliation" },
  { key: "wildlifeOrg", header: "Wildlife Org" },
  { key: "wildlifeRole", header: "Wildlife Role" },
  { key: "createdAt", header: "Registered" },
];

function firmDisplay(farmer) {
  if (farmer.firm === "other") return farmer.otherFirm || "Other";
  return FIRM_LABELS[farmer.firm] ?? farmer.firm ?? "";
}

export const GET = handleRoute(async (request) => {
  await requireAdmin(request);

  const { searchParams } = new URL(request.url);
  const firm = searchParams.get("firm") ?? "all";
  const format = searchParams.get("format") ?? "csv";

  if (firm !== "all" && !FIRM_VALUES.has(firm)) {
    throw new HttpError(400, "Unknown firm value.");
  }
  if (!["csv", "xlsx"].includes(format)) {
    throw new HttpError(400, "format must be csv or xlsx.");
  }

  await connectDb();

  const query = { isVerified: true, ...(firm !== "all" && { firm }) };
  const farmers = await Farmer.find(query).select(SELECT_FIELDS).lean();

  const rows = farmers.map((f) => ({
    ...f,
    firmDisplay: firmDisplay(f),
    createdAt: f.createdAt?.toISOString().slice(0, 10) ?? "",
  }));

  const filenameBase = `nkem-logbooks-${firm}-${new Date().toISOString().slice(0, 10)}`;

  if (format === "csv") {
    const csv = toCsv(rows, COLUMNS);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filenameBase}.csv"`,
      },
    });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Logbooks");
  sheet.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 20 }));
  sheet.addRows(rows);
  sheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filenameBase}.xlsx"`,
    },
  });
});
