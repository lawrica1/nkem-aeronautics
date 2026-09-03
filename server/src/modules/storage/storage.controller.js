import { uploadFileToStorage } from "./storage.service.js";

export async function upload(req, res) {
  const asset = await uploadFileToStorage(req.file, {
    ownerId: req.user.id,
    serviceRequestId: req.body.serviceRequestId || undefined,
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
