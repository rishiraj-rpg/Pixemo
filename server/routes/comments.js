const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/auth");

const { createComment, deleteComment } = require("../controllers/comments");

router.post("/:postId/comments/",isLoggedIn,createComment);
router.delete("/:postId/comments/:commentId", isLoggedIn, deleteComment);

module.exports = router;
