const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");

const { login, register, logout } = require("../controllers/auth");

router.post("/login", login);
router.post("/register", register);
router.get("/logout",authenticateUser,logout);

module.exports = router;
