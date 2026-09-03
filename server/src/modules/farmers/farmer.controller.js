import * as farmerService from "./farmer.service.js";

export function me(req, res) {
  res.json(farmerService.getProfile(req.user));
}

export async function logbook(req, res) {
  res.json(await farmerService.getLogbook(req.user));
}
