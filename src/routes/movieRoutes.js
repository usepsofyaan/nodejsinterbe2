const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// GET semua movie
router.get("/", movieController.getMovies);

// GET berdasarkan ID
router.get("/:id", movieController.getMovieById);

// POST tambah movie
router.post("/", movieController.createMovie);

// PUT update movie
router.put("/:id", movieController.updateMovie);

// DELETE movie
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
