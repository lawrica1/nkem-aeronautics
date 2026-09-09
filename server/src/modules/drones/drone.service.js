import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

export async function list() {
  return prisma.drone.findMany({ orderBy: { name: "asc" } });
}

export async function create(body) {
  if (!body.name) throw new HttpError(400, "name is required.");

  return prisma.drone.create({
    data: {
      name: body.name,
      model: body.model || null,
      type: body.type || null,
      specs: body.specs || "",
    },
  });
}

export async function update(id, body) {
  const data = {};
  for (const key of ["name", "model", "type", "specs", "active"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const drone = await prisma.drone.update({ where: { id }, data }).catch(() => null);
  if (!drone) throw new HttpError(404, "Drone not found.");
  return drone;
}
