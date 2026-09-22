import { serializeUser } from "../users/user.serializer.js";
import { listForUser } from "../requests/request.service.js";
import { uploadFileToStorage } from "../storage/storage.service.js";
import { prisma } from "../../config/prisma.js";

export function getProfile(user) {
  return serializeUser(user);
}

export async function getLogbook(user) {
  const requests = await listForUser(user);
  return {
    farmer: serializeUser(user),
    requests,
    operations: requests.map((r) => r.operation).filter(Boolean),
  };
}

export async function updateProfilePhoto(user, file) {
  const asset = await uploadFileToStorage(file, { ownerId: user.id, purpose: "profile-photo" });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { profilePhotoKey: asset.key, profilePhotoUrl: asset.url },
  });

  return serializeUser(updated);
}

export async function updateProfile(user, body) {
  const ALLOWED = [
    "sector", "accountType", "name", "surname", "sex",
    "telephone", "address", "country", "region", "district",
    "crop", "otherCrop", "firm", "otherFirm",
    "wildlifeOrg", "wildlifeRole",
    "miningOrg", "miningRole",
  ];

  const data = {};
  for (const key of ALLOWED) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  // Mark profile complete when name + surname are provided (sector is set at signup)
  const merged = { ...user, ...data };
  if (merged.name && merged.surname) {
    data.isProfileComplete = true;
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return serializeUser(updated);
}
