const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController"); // Match exact filename
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

// Protected routes
// router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);
router.get("/major/:major", UserController.getUsersByMajor);
router.post("/courses/:courseId/enroll", UserController.enrollInCourse);
router.post("/posts", UserController.createPost);

module.exports = router;