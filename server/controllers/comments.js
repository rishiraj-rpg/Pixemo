const Comments = require("../models/comments");
const Post = require("../models/posts");
const User = require("../models/users");

const createComment = async (req, res) => {
  try {
    const comment = req.body;
    const userId = req.user.user.id;

    const fetchedUser = await User.findById(userId);

    let url = "";

    if (fetchedUser.profileImageURL) {
      url = fetchedUser.profileImageURL;
    }

    const userComment = {
      body: comment.comment,
      author: {
        name: fetchedUser.name,
        username: fetchedUser.username,
        authorImageURL: url,
      },
    };

    const newComment = new Comments(userComment);
    const post = await Post.findById(req.params.postId);
    await newComment.save();
    post.comments.push(newComment);
    await post
      .save()
      .then(() => {
        return res.status(200).json({
          msg: "Successfully added comment",
        });
      })
      .catch((err) => {
        return res.status(404).json({
          msg: "Comments not added",
        });
      });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $pull: { comments: req.params.commentId },
    });
    await Comments.findByIdAndDelete(req.params.commentId)

      .then(() => {
        return res.status(200).json({
          msg: "Successfully deleted comment",
        });
      })
      .catch((err) => {
        return res.status(404).json({
          msg: "Comment is not deleted",
        });
      });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

module.exports = { createComment, deleteComment };
