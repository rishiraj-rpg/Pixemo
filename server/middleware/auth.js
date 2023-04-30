const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  //Get token from cookies
  const token = req.cookies.auth_token;
  console.log("token", token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    //attach the user to the job routes
    req.user = { user: payload.user };
    next();
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
