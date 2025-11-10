const db = require("../config/db");

// Ambil semua user
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil user", error });
  }
};

// Tambah user baru
exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah user", error });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);
    res.json({ message: "User berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user", error });
  }
};

// Hapus user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user", error });
  }
};
