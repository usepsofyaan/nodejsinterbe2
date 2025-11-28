const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const uploadController = require("../controllers/uploadController");

// Endpoint: POST /upload
router.post("/upload", upload.single("image"), uploadController.uploadImage);

module.exports = router;
