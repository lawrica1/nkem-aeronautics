import { serializeFileAsset, uploadFileToStorage } from "./storage.service.js";

export async function upload(req, res) {
  // Uploads are always unattached; linking to a request happens in request.service, scoped to the owner.
  const asset = await uploadFileToStorage(req.file, {
    ownerId: req.user.id,
    purpose: req.body.purpose || "general",
  });

  res.status(201).json(await serializeFileAsset(asset));
}
