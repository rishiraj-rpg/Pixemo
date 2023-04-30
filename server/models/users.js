const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Posts = require("./posts");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageName: {
      type: String,
    },
    profileImageURL: {
      type: String,
    },
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
