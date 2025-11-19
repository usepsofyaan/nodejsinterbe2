const db = require("../config/db");
const bcrypt = require("bcrypt");

// REGISTER USER
exports.register = async (req, res) => {
  const { fullname, username, password, email } = req.body;

  try {
    // 1. Validasi input sederhana
    if (!fullname || !username || !password || !email) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    // 2. Cek apakah username sudah ada
    const [existingUser] = await db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Username atau Email sudah digunakan",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user baru
    await db.query("INSERT INTO users (fullname, username, password, email) VALUES (?, ?, ?, ?)", [fullname, username, hashedPassword, email]);

    // 5. Response sukses
    res.status(201).json({
      message: "Registrasi berhasil",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mendaftarkan user",
      error,
    });
  }
};
