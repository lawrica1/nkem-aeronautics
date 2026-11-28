import { HttpError } from "../../shared/errors/HttpError.js";
import { ROLES } from "../platform/platform.constants.js";
import {
  PUBLIC_PURPOSES,
  isPublicKey,
  publicUrlForKey,
  serializeFileAsset,
  signedUrlForKey,
  uploadFileToStorage,
} from "./storage.service.js";
import { IMAGE_TYPES } from "./upload.middleware.js";

export async function upload(req, res) {
  const purpose = req.body.purpose || "general";
  const isPublic = PUBLIC_PURPOSES.includes(purpose);
  if (isPublic && req.user.role !== ROLES.ADMIN) throw new HttpError(403, "Only admins can upload website photos.");
  if (isPublic && !IMAGE_TYPES.includes(req.file?.mimetype)) throw new HttpError(400, "Website photos must be image files.");

  // Uploads are always unattached; linking to a request happens in request.service, scoped to the owner.
  const asset = await uploadFileToStorage(req.file, { ownerId: req.user.id, purpose });
  const body = await serializeFileAsset(asset);
  // Public photos get their permanent address; the signed link in `url` would expire after STORAGE_SIGNED_URL_TTL.
  if (isPublic) body.url = publicUrlForKey(`${req.protocol}://${req.get("host")}`, asset.key);
  res.status(201).json(body);
}

// Permanent address for a public photo: redirect to a fresh signed link. Cached for less than the link's lifetime.
export async function publicFile(req, res) {
  const key = req.params[0];
  if (!isPublicKey(key)) throw new HttpError(404, "File not found.");
  res.set({ "Cache-Control": "public, max-age=300", "Cross-Origin-Resource-Policy": "cross-origin" });
  res.redirect(302, await signedUrlForKey(key));
}
