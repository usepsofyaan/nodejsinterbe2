const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { verifyToken } = require("../middleware/authMiddleware");

// GET semua movie
router.get("/", verifyToken, movieController.getMovies);

// GET berdasarkan ID
router.get("/:id", verifyToken, movieController.getMovieById);

// POST tambah movie
router.post("/", verifyToken, movieController.createMovie);

// PUT update movie
router.put("/:id", verifyToken, movieController.updateMovie);

// DELETE movie
router.delete("/:id", verifyToken, movieController.deleteMovie);

module.exports = router;
