import multer from "multer";
import { HttpError } from "../../shared/errors/HttpError.js";

// Exact types, not "image/*": the client-supplied type becomes the stored Content-Type, and
// types a browser renders as a document (image/svg+xml, text/html, …) could run script.
// Includes what phones produce: iPhone HEIC/MOV, Android 3GP.
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/3gpp"];
export const ALLOWED_UPLOAD_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES, "application/pdf"];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

function fileFilter(_req, file, cb) {
  if (!ALLOWED_UPLOAD_TYPES.includes(file.mimetype)) {
    cb(new HttpError(400, "Only image, video, and PDF files are supported."));
    return;
  }

  cb(null, true);
}

export const uploadSingleFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter,
}).single("file");

export const uploadProfilePhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, cb) {
    if (!IMAGE_TYPES.includes(file.mimetype)) {
      cb(new HttpError(400, "Profile photo must be an image file."));
      return;
    }

    cb(null, true);
  },
}).single("photo");
