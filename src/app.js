const express = require("express");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("API MySQL berjalan 🚀");
});

module.exports = app;
