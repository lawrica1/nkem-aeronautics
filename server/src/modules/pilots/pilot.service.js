import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { ROLES } from "../platform/platform.constants.js";

export async function list() {
  return prisma.pilot.findMany({ orderBy: { name: "asc" }, include: { user: { select: { id: true, email: true } } } });
}

export async function create(body) {
  if (!body.name) throw new HttpError(400, "name is required.");

  let userId = null;
  if (body.email && body.password) {
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user
      .create({
        data: {
          role: ROLES.PILOT,
          email: body.email.toLowerCase(),
          name: body.name,
          telephone: body.telephone || null,
          passwordHash,
          isVerified: true,
          isProfileComplete: true,
        },
      })
      .catch(() => null);
    if (!user) throw new HttpError(409, "An account with this email already exists.");
    userId = user.id;
  }

  return prisma.pilot.create({
    data: {
      name: body.name,
      telephone: body.telephone || null,
      email: body.email || null,
      droneTypes: body.droneTypes || "",
      userId,
    },
  });
}

export async function update(id, body) {
  const data = {};
  for (const key of ["name", "telephone", "email", "droneTypes", "active"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const pilot = await prisma.pilot.update({ where: { id }, data }).catch(() => null);
  if (!pilot) throw new HttpError(404, "Pilot not found.");
  return pilot;
}
