const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./users");
const Comments = require("./comments");

const postSchema = new Schema(
  {
    caption: String,
    tags: String,
    username: String,
    postImageName: {
      type: String,
    },
    postImageURL: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postSchema);
