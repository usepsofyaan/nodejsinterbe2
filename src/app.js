const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
const contentRoutes = require("./routes/contentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contents", contentRoutes);
app.use("/uploads", express.static("uploads")); // agar file bisa diakses public
app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API MySQL berjalan 🚀");
});

module.exports = app;
