const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password harus diisi" });
    }

    // Query database
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = rows[0];

    // Bandingkan password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    delete user.password;

    return res.status(200).json({
      message: "Login berhasil",
      user,
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};
