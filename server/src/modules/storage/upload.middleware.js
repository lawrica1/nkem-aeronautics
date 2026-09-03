import multer from "multer";
import { HttpError } from "../../shared/errors/HttpError.js";

const ALLOWED_MIME_PREFIXES = ["image/", "video/"];
const ALLOWED_MIME_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

function fileFilter(_req, file, cb) {
  const allowed =
    ALLOWED_MIME_PREFIXES.some((prefix) => file.mimetype.startsWith(prefix)) ||
    ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (!allowed) {
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
    if (!file.mimetype.startsWith("image/")) {
      cb(new HttpError(400, "Profile photo must be an image file."));
      return;
    }

    cb(null, true);
  },
}).single("photo");
