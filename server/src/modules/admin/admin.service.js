import ExcelJS from "exceljs";
import { prisma } from "../../config/prisma.js";
import { ROLES, ROLE_VALUES, SECTORS } from "../platform/platform.constants.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { signAdminToken } from "../../shared/middleware/auth.js";
import { serializeUser } from "../users/user.serializer.js";
import { toCsv } from "../../shared/utils/csv.js";
import { checkPassword } from "../../shared/utils/loginGuard.js";

const EXPORT_COLUMNS = [
  { key: "identificationNumber", header: "Logbook ID" },
  { key: "surname", header: "Surname" },
  { key: "name", header: "Name" },
  { key: "sex", header: "Sex" },
  { key: "telephone", header: "Telephone" },
  { key: "email", header: "Email" },
  { key: "address", header: "Address" },
  { key: "country", header: "Country" },
  { key: "region", header: "Region" },
  { key: "district", header: "District" },
  { key: "sector", header: "Sector" },
  { key: "crop", header: "Crop" },
  { key: "firmLabel", header: "Firm Affiliation" },
  { key: "createdAt", header: "Registered" },
];

export async function login({ email, password }) {
  if (!email || !password) throw new HttpError(400, "email and password are required.");

  const admin = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), role: ROLES.ADMIN, isVerified: true },
  });

  await checkPassword("admin", email, admin?.passwordHash, password);
  // 12h instead of the 30-day user token: a leaked admin token is the most damaging one.
  return { token: signAdminToken(admin) };
}

export async function getStats() {
  const verified = { isVerified: true };
  const [totalUsers, bySector, byCountry, byRegion, byCrop, byFirm, totalRequests, byStatus] =
    await Promise.all([
      prisma.user.count({ where: verified }),
      prisma.user.groupBy({ by: ["sector"], where: verified, _count: { _all: true } }),
      prisma.user.groupBy({ by: ["country"], where: verified, _count: { _all: true } }),
      prisma.user.groupBy({ by: ["region"], where: verified, _count: { _all: true } }),
      prisma.user.groupBy({
        by: ["crop"],
        where: { ...verified, sector: SECTORS.AGRICULTURE },
        _count: { _all: true },
      }),
      prisma.user.groupBy({
        by: ["firm"],
        where: { ...verified, sector: SECTORS.AGRICULTURE },
        _count: { _all: true },
      }),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

  return {
    totalUsers,
    totalRequests,
    bySector: bySector.map((row) => ({ value: row.sector, count: row._count._all })),
    byCountry: byCountry.map((row) => ({ value: row.country, count: row._count._all })),
    byRegion: byRegion.map((row) => ({ value: row.region || "(none)", count: row._count._all })),
    byCrop: byCrop.map((row) => ({ value: row.crop || "(none)", count: row._count._all })),
    byFirm: byFirm.map((row) => ({ value: row.firm || "(none)", count: row._count._all })),
    byStatus: byStatus.map((row) => ({ value: row.status, count: row._count._all })),
  };
}

export async function listUsers({ search, role, sector, country } = {}) {
  const users = await prisma.user.findMany({
    where: {
      ...(role && { role }),
      ...(sector && { sector }),
      ...(country && { country }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { surname: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { identificationNumber: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { organization: { select: { name: true } } },
  });

  return users.map(serializeUser);
}

export async function updateUser(id, body, actor) {
  const data = {};
  if (body.role !== undefined) {
    if (!ROLE_VALUES.includes(body.role)) throw new HttpError(400, "A valid role is required.");
    data.role = body.role;
  }
  if (body.isVerified !== undefined) data.isVerified = !!body.isVerified;
  if (body.organizationId !== undefined) data.organizationId = body.organizationId || null;
  if (body.revokeSessions === true) data.tokenVersion = { increment: 1 };

  // ponytail: count-then-update isn't serializable; two admins demoting each other at the same instant could both pass. Use a SERIALIZABLE transaction if that ever matters.
  const user = await prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({ where: { id } });
    if (!target) throw new HttpError(404, "User not found.");

    const isAdminNow = target.role === ROLES.ADMIN && target.isVerified;
    const staysAdmin = (data.role ?? target.role) === ROLES.ADMIN && (data.isVerified ?? target.isVerified);

    if (isAdminNow && !staysAdmin) {
      if (target.id === actor.id) {
        throw new HttpError(400, "You can't remove your own admin access. Ask another admin to do it.");
      }
      const otherAdmins = await tx.user.count({
        where: { role: ROLES.ADMIN, isVerified: true, id: { not: target.id } },
      });
      if (otherAdmins === 0) throw new HttpError(400, "At least one admin account must remain.");
    }

    return tx.user.update({ where: { id }, data, include: { organization: { select: { name: true } } } });
  });

  if (data.role !== undefined || data.isVerified !== undefined || data.tokenVersion) {
    const change = { role: data.role, isVerified: data.isVerified, revokedSessions: !!data.tokenVersion };
    console.info(`[audit] admin ${actor.id} updated user ${id}: ${JSON.stringify(change)}`);
  }
  return serializeUser(user);
}

export async function exportLogbooks({ firm = "all", format = "csv" }) {
  if (!["csv", "xlsx"].includes(format)) {
    throw new HttpError(400, "format must be csv or xlsx.");
  }

  const users = await prisma.user.findMany({
    where: {
      isVerified: true,
      role: ROLES.FARMER,
      ...(firm !== "all" && { firm }),
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = users.map((user) => {
    const row = serializeUser(user);
    return { ...row, createdAt: row.createdAt?.slice(0, 10) || "" };
  });

  const filename = `nkem-logbooks-${firm}-${new Date().toISOString().slice(0, 10)}`;
  if (format === "csv") {
    return {
      contentType: "text/csv; charset=utf-8",
      filename: `${filename}.csv`,
      body: toCsv(rows, EXPORT_COLUMNS),
    };
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Logbooks");
  sheet.columns = EXPORT_COLUMNS.map((column) => ({ ...column, width: 20 }));
  sheet.addRows(rows);
  sheet.getRow(1).font = { bold: true };

  return {
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    filename: `${filename}.xlsx`,
    body: await workbook.xlsx.writeBuffer(),
  };
}
