import * as farmerService from "./farmer.service.js";

export function me(req, res) {
  res.json(farmerService.getProfile(req.user));
}

export async function logbook(req, res) {
  res.json(await farmerService.getLogbook(req.user));
}

export async function updatePhoto(req, res) {
  const updated = await farmerService.updateProfilePhoto(req.user, req.file);
  res.json(updated);
}

export async function updateProfile(req, res) {
  const updated = await farmerService.updateProfile(req.user, req.body);
  res.json(updated);
}
