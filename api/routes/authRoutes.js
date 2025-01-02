const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/protected", authMiddleware, authController.getProtectedData);

module.exports = router;