exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Upload berhasil!",
      fileUrl: `/uploads/${req.file.filename}`,
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat upload.",
      error: error.message,
    });
  }
};
