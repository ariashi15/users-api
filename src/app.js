const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const userController = require("./controllers/userController")

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.get("/api/users", userController.getAllUsers);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;