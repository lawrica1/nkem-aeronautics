import * as productService from "./product.service.js";

export async function list(req, res) {
  res.json(await productService.list(req.query));
}

export async function listAdmin(req, res) {
  res.json(await productService.list(req.query, { includeInactive: true }));
}

export async function getBySlug(req, res) {
  res.json(await productService.getBySlug(req.params.slug));
}

export async function create(req, res) {
  res.status(201).json(await productService.create(req.body));
}

export async function update(req, res) {
  res.json(await productService.update(req.params.id, req.body));
}
