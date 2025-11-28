const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");
const { v4: uuidv4 } = require("uuid");

// REGISTER USER
exports.register = async (req, res) => {
  const { fullname, username, password, email } = req.body;

  try {
    if (!fullname || !username || !password || !email) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek apakah username/email sudah dipakai
    const [existingUser] = await db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username atau Email sudah digunakan" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token verifikasi
    const verifyToken = uuidv4();

    // Insert user
    await db.query(
      `INSERT INTO users (fullname, username, password, email, verify_token, is_verified)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [fullname, username, hashedPassword, email, verifyToken]
    );

    // Buat URL verifikasi
    const verifyUrl = `http://localhost:3000/api/auth/verify/${verifyToken}`;

    // Kirim email verifikasi
    await transporter.sendMail({
      from: `"Movie App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifikasi Akun Anda",
      html: `
        <h3>Halo ${fullname}</h3>
        <p>Klik link berikut untuk verifikasi akun Anda:</p>
        <a href="${verifyUrl}" 
           style="background:#4CAF50; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
           Verifikasi Akun
        </a>
        <p>Atau salin link ini: ${verifyUrl}</p>
      `,
    });

    res.status(201).json({
      message: "Registrasi berhasil. Silakan cek email untuk verifikasi akun.",
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mendaftarkan user", error });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password harus diisi" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = rows[0];

    // Cek verifikasi
    if (user.is_verified === 0) {
      return res.status(403).json({
        message: "Akun belum diverifikasi. Silakan cek email Anda.",
      });
    }

    // Bandingkan password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate JWT
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

exports.verifyUser = async (req, res) => {
  const { token } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE verify_token = ?", [token]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    await db.query("UPDATE users SET is_verified = 1, verify_token = NULL WHERE verify_token = ?", [token]);

    res.json({ message: "Akun berhasil diverifikasi" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memverifikasi akun", error });
  }
};
