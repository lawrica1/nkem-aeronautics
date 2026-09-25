import { uploadFileToStorage } from "./storage.service.js";

export async function upload(req, res) {
  // Uploads are always unattached; linking to a request happens in request.service, scoped to the owner.
  const asset = await uploadFileToStorage(req.file, {
    ownerId: req.user.id,
    purpose: req.body.purpose || "general",
  });

  res.status(201).json({
    id: asset.id,
    key: asset.key,
    url: asset.url,
    mimeType: asset.mimeType,
    size: asset.size,
    purpose: asset.purpose,
  });
}
