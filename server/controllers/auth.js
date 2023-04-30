const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const user = req.body;
    console.log("inside auth login");
    const fetchedUser = await User.findOne({ email: user.email });

    if (!fetchedUser) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    bcrypt.compare(user.password, fetchedUser.password, (err, result) => {
      if (err) throw err;

      if (result) {
        const payload = {
          user: {
            id: fetchedUser._id,
            name: fetchedUser.name,
          },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "30 days",
        });

        console.log("token created");
        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: false,
        });
        res
          .status(200)
          .json({
            message: "Logged in successfully",
            user: fetchedUser,
            token,
          });
      } else {
        return res.status(401).json({ msg: "Invalid credentials" });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.json({ message: "Server Error" });
  }
};

const register = async (req, res) => {
  const user = req.body;
  console.log(user);
  const takenUserName = await User.findOne({ username: user.username });
  const takenEmailId = await User.findOne({ email: user.email });

  if (takenUserName || takenEmailId) {
    res.json({ message: "Username or Email has already been taken" });
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);

    const dbUser = new User({
      name: user.name,
      username: user.username.toLowerCase(),
      email: user.email.toLowerCase(),
      password: user.password,
    });

    dbUser.save();
    res.json({ message: "Success" });
  }
};

const logout = (req, res) => {
  console.log(req.user);
  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, "", { expires: new Date(0) });
  }
  res.send("Successfully logged out");
};

module.exports = { login, register, logout };
