const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./users");

const commentSchema = new Schema({
  body: String,
  author: {
    name: String,
    username: String,
    authorImageURL: String,
  },
  createdAt: { type: Date, required: true,default: new Date() },
});

module.exports = mongoose.model("Comments", commentSchema);
