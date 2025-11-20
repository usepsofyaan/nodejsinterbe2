const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API MySQL berjalan 🚀");
});

module.exports = app;
