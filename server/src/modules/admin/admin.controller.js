import * as adminService from "./admin.service.js";

export async function login(req, res) {
  res.json(await adminService.login(req.body));
}

export async function stats(_req, res) {
  res.json(await adminService.getStats());
}

export async function listUsers(req, res) {
  res.json(await adminService.listUsers(req.query));
}

export async function updateUser(req, res) {
  res.json(await adminService.updateUser(req.params.id, req.body));
}

export async function exportLogbooks(req, res) {
  const file = await adminService.exportLogbooks(req.query);
  res.setHeader("Content-Type", file.contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
  res.send(file.body);
}
