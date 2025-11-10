const db = require("../config/db");

// Ambil semua movie
exports.getMovies = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM movie");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
};

// Ambil movie berdasarkan ID
exports.getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM movie WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Movie tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil movie", error });
  }
};

// Tambah movie baru
exports.createMovie = async (req, res) => {
  const { title, genre, release_year } = req.body;
  try {
    await db.query("INSERT INTO movie (title, genre, release_year) VALUES (?, ?, ?)", [title, genre, release_year]);
    res.status(201).json({ message: "Movie berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah movie", error });
  }
};

// Update movie
exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, genre, release_year } = req.body;
  try {
    await db.query("UPDATE movie SET title=?, genre=?, release_year=? WHERE id=?", [title, genre, release_year, id]);
    res.json({ message: "Movie berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate movie", error });
  }
};

// Hapus movie
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM movie WHERE id=?", [id]);
    res.json({ message: "Movie berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus movie", error });
  }
};
