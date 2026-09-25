import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { ROLES } from "../platform/platform.constants.js";

export async function list() {
  return prisma.user.findMany({
    where: { role: ROLES.PARTNER },
    select: { id: true, name: true, email: true, telephone: true, isVerified: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function create(body) {
  if (!body.name) throw new HttpError(400, "name is required.");
  if (!body.email) throw new HttpError(400, "email is required.");
  if (!body.password) throw new HttpError(400, "password is required.");

  const passwordHash = await bcrypt.hash(body.password, 10);
  const partner = await prisma.user
    .create({
      data: {
        role: ROLES.PARTNER,
        email: body.email.toLowerCase(),
        name: body.name,
        telephone: body.telephone || null,
        passwordHash,
        isVerified: true,
        isProfileComplete: true,
      },
      select: { id: true, name: true, email: true, telephone: true, isVerified: true, createdAt: true },
    })
    .catch(() => null);
  if (!partner) throw new HttpError(409, "An account with this email already exists.");
  return partner;
}
