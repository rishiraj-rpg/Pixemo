require("dotenv").config();
const Post = require("../models/posts");
const User = require("../models/users");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const sharp = require("sharp");

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

//updating profile image of user
const updateProfileImage = async (req, res) => {
  console.log("req.file", req.file);

  const userId = req.user.user.id;
  const fetchedUser = await User.findById(userId);
  let imageName = "";

  if (fetchedUser.profileImageName) {
    imageName = fetchedUser.profileImageName;
  } else {
    imageName = req.file.originalname + randomImageName();
  }

  //if image/file has same name,then s3 completely overwrites the old image with the new image having the same name
  //so to avoid this we have to make sure that the Key of the img is unique
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  //uplaoding image/file on s3 bucket
  const command = new PutObjectCommand(params);
  await s3.send(command);

  //updating image name of users profile
  if (!fetchedUser.profileImageName) {
    try {
      const dataToUpdate = {
        profileImageName: imageName,
      };
      const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        dataToUpdate,
        { new: true }
      );
      console.log("updatedUser:", updatedUser.profileImageName);
      res.status(200).json({ user: updatedUser });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  } else {
    res.status(200).json({ user: fetchedUser });
  }
};

const getProfileImage = async (req, res) => {
  const userId = req.user.user.id;
  const fetchedUser = await User.findById(userId);

  if (!fetchedUser) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  console.log("fetched user", fetchedUser);

  const getObjectParams = {
    Bucket: bucketName,
    Key: fetchedUser.profileImageName,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 6 * 24 * 60 * 60 });

  try {
    const dataToUpdate = {
      profileImageURL: url,
    };
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      dataToUpdate,
      { new: true }
    );
    console.log("updatedUser:", updatedUser.profileImageName);
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const fetchedUser = await User.findById(userId).populate({
      path: "savedPosts",
    });
    if (!fetchedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    console.log("user:", fetchedUser);
    return res.status(200).json({
      user: fetchedUser,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = { updateProfileImage, getProfileImage, getSavedPosts };
