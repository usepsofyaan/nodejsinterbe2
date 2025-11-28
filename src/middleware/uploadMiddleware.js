const multer = require("multer");
const path = require("path");

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder penyimpanan
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Filter file agar hanya menerima gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Jenis file tidak didukung. Hanya JPG / JPEG / PNG."), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
  fileFilter,
});

module.exports = upload;
