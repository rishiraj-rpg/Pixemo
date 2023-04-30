const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  getAllPosts,
  getSinglePost,
  generatePostImageCaption,
  createPost,
  deletePost,
  savePost,
  unsavePost,
  likePost,
  unlikePost,
} = require("../controllers/posts");

router.get("/", getAllPosts);
router.get("/:id", isLoggedIn, getSinglePost);
router.post("/:id/save", savePost);
router.post("/:id/unsave", unsavePost);
router.post("/:id/like", likePost);
router.post("/:id/unlike", unlikePost);
router.post(
  "/image",
  isLoggedIn,
  upload.single("image"),
  generatePostImageCaption
);
router.post("/", createPost);
router.delete("/:id", isLoggedIn, deletePost);
// router.put("/:id", isLoggedIn, updatePost);

module.exports = router;
