const db = require("../config/db");

/**
 * GET /api/contents
 * Query Params:
 *  - genre : filter berdasarkan nama genre
 *  - type  : filter berdasarkan tipe (movie, series)
 *  - sort  : kolom untuk sorting (rating, created_at, title, dll.)
 *  - order : asc / desc
 *  - search: mencari konten berdasarkan judul
 */
exports.getContents = async (req, res) => {
  try {
    const { genre, type, sort, order, search } = req.query;

    // ==============================
    // 1. VALIDASI INPUT QUERY
    // ==============================

    // Validasi sort column agar tidak SQL injection
    const allowedSortFields = ["title", "rating", "created_at"];
    const allowedOrder = ["asc", "desc"];

    const sortField = allowedSortFields.includes(sort) ? sort : null;
    const sortOrder = allowedOrder.includes(order?.toLowerCase()) ? order : "asc";

    let query = `
      SELECT c.*, g.namaGenre 
      FROM contents c
      LEFT JOIN genres g ON c.genre_id = g.id
      WHERE 1=1
    `;

    const params = [];

    // ==============================
    // 2. FILTER
    // ==============================

    // Filter berdasarkan genre
    if (genre) {
      query += " AND g.namaGenre = ?";
      params.push(genre);
    }

    // Filter berdasarkan tipe konten (movie/series)
    if (type) {
      query += " AND c.type = ?";
      params.push(type);
    }

    // ==============================
    // 3. SEARCH
    // ==============================

    if (search) {
      query += " AND c.title LIKE ?";
      params.push(`%${search}%`);
    }

    // ==============================
    // 4. SORTING
    // ==============================

    if (sortField) {
      query += ` ORDER BY ${sortField} ${sortOrder}`;
    }

    // Eksekusi query
    const [rows] = await db.execute(query, params);

    return res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      filter: { genre, type, search },
      sort: sortField ? { field: sortField, order: sortOrder } : null,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error getContents:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
