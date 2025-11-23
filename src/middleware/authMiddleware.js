const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Pastikan token ada di header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Akses ditolak. Token tidak ditemukan",
    });
  }

  // 2. Ambil token-nya
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Tempelkan data user ke req
    req.user = decoded;

    next(); // lanjut ke endpoint berikutnya
  } catch (error) {
    return res.status(403).json({
      message: "Token tidak valid",
      error,
    });
  }
};
