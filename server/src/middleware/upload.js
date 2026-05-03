import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.resolve(process.cwd(), "uploads"));
  },
  filename(req, file, callback) {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    callback(null, `${Date.now()}-${safeName}`);
  }
});

function imageFilter(req, file, callback) {
  if (file.mimetype.startsWith("image/")) {
    return callback(null, true);
  }

  callback(new Error("Only image uploads are allowed."));
}

export const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
