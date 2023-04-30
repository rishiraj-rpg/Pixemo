const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  updateProfileImage,
  getProfileImage,
  getSavedPosts,
} = require("../controllers/profile");

router.post("/", authenticateUser, upload.single("image"), updateProfileImage);
router.get("/", authenticateUser, getProfileImage);
router.get("/posts", authenticateUser, getSavedPosts);
module.exports = router;
