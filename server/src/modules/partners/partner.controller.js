import * as partnerService from "./partner.service.js";

export async function list(_req, res) {
  res.json(await partnerService.list());
}

export async function create(req, res) {
  res.status(201).json(await partnerService.create(req.body));
}
