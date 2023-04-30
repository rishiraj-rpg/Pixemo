require("dotenv").config();
const Post = require("../models/posts");
const User = require("../models/users");
const Comments = require("../models/comments");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const { log } = require("console");

//crypto generates random hexadeicmal string which we are using as a unique name for our image
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

//s3 bucket credentials
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const getAllPosts = async (req, res) => {
  try {
    const fetchedPosts = await Post.find({}).sort({ _id: -1 });

    if (!fetchedPosts) {
      return res.status(404).json({
        error: "Posts not found",
      });
    }

    for (const post of fetchedPosts) {
      if (post.postImageURL) {
        console.log("url exists");
      } else {
        const getObjectParams = {
          Bucket: bucketName,
          Key: post.postImageName,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, {
          expiresIn: 6 * 24 * 60 * 60,
        });
        post.postImageURL = url;
      }

      const userId = post.author;
      const fetchedUser = await User.findById(userId);

      post.username = fetchedUser.username;
    }

    return res.status(200).json({
      posts: fetchedPosts,
      count: fetchedPosts.length,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const fetchedPost = await Post.findById(postId)
      .populate("author")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      });

    if (!fetchedPost) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    console.log("post", fetchedPost);
    return res.status(200).json({
      post: fetchedPost,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const generatePostImageCaption = async (req, res) => {
  console.log("req.file", req.file);

  const userId = req.user.user.id;
  const imageName = req.file.originalname + randomImageName();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  //uplaoding image/file on s3 bucket
  const command = new PutObjectCommand(params);
  await s3.send(command);

  const getObjectParams = {
    Bucket: bucketName,
    Key: imageName,
  };

  const command2 = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command2, {
    expiresIn: 6 * 24 * 60 * 60,
  });

  try {
    const newPostData = {
      postImageName: imageName,
      postImageURL: url,
      author: userId,
    };
    const newPost = new Post(newPostData);
    const newPostCreated = await newPost.save();
    console.log(newPostCreated);
    return res.status(200).json({
      postId: newPostCreated._id,
      postImageURL: newPostCreated.postImageURL,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  const { caption, tags, id } = req.body;
  try {
    const dataToUpdate = {
      caption: caption,
      tags: tags,
    };
    const updatedUserPost = await Post.findOneAndUpdate(
      { _id: id },
      dataToUpdate,
      { new: true }
    );
    return res.status(200).json({ post: updatedUserPost });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const dataToUpdate = {
      title: req.body.title,
      caption: req.body.caption,
    };

    await Post.findByIdAndUpdate({ _id: req.params.id }, dataToUpdate).then(
      function (docs, err) {
        if (err) {
          return res.status(400).json({
            msg: "Post Not Updated",
          });
        } else {
          return res.status(200).json({
            msg: "Succssfully Updated Post!!",
          });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const currPost = await Post.findById(req.params.id);

    if (!currPost) {
      res.status(404).json({ msg: `No post with id ${req.params.id}` });
    }

    //deleting comments corresponding to the post

    for (let comment_id in currPost.comments) {
      await Comments.findByIdAndDelete(currPost.comments[comment_id])
        .then((resp) => console.log("comment deleted"))
        .catch((err) => {
          res
            .status(400)
            .json({ msg: "Comments are not deleted of this post" });
        });
    }

    //deleting post image from S3

    const params = {
      Bucket: bucketName,
      Key: currPost.postImageName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    //deleting post
    await Post.findByIdAndDelete(req.params.id).then(function (docs, err) {
      if (err) {
        return res.status(400).json({
          msg: "Post Not Deleted",
        });
      } else {
        return res.status(200).json({
          msg: "Succssfully Deleted Post!!",
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const savePost = async (req, res) => {
  const postId = req.params.id;
  const fetchedPost = await Post.findById(postId);
  console.log("fetchedPost", fetchedPost);
  const userId = req.body;
  console.log("userID", userId.id);
  const user = await User.findById(userId.id);
  console.log("user", user);

  user.savedPosts.push(fetchedPost);

  await user
    .save()
    .then(() => {
      return res.status(200).json({
        msg: "Successfully saved post",
        user: user,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        msg: "Post not saved",
      });
    });
};

const unsavePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body;
  const user = await User.findById(userId.id);

  const index = user.savedPosts.indexOf(postId);
  const x = user.savedPosts.splice(index, 1);

  await user
    .save()
    .then(() => {
      return res.status(200).json({
        msg: "Successfully un-saved post",
        user: user,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        msg: "Post not un-saved",
      });
    });
};

const likePost = async (req, res) => {
  const postId = req.params.id;
  const fetchedPost = await Post.findById(postId);
  const userId = req.body;
  const user = await User.findById(userId.id);

  const count = fetchedPost.likeCount;
  await Post.findByIdAndUpdate({ _id: postId }, { likeCount: count + 1 });
  user.likedPosts.push(fetchedPost);

  await user
    .save()
    .then(() => {
      return res.status(200).json({
        msg: "Successfully liked post",
        user: user,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        msg: "Post not liked",
      });
    });
};

const unlikePost = async (req, res) => {
  const postId = req.params.id;
  const fetchedPost = await Post.findById(postId);
  const userId = req.body;
  const user = await User.findById(userId.id);

  const count = fetchedPost.likeCount;
  await Post.findByIdAndUpdate({ _id: postId }, { likeCount: count - 1 });

  // const myArray = user.likedPosts;

  const index = user.likedPosts.indexOf(postId);
  const x = user.likedPosts.splice(index, 1);

  await user
    .save()
    .then(() => {
      return res.status(200).json({
        msg: "Successfully un-liked post",
        user: user,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        msg: "Post not un-liked",
      });
    });
};

module.exports = {
  getAllPosts,
  getSinglePost,
  generatePostImageCaption,
  createPost,
  updatePost,
  deletePost,
  savePost,
  unsavePost,
  likePost,
  unlikePost,
};
