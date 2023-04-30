require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

//Database Connection
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

//middleware

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"],
    credentials: true,
  })
);

// app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/post", postsRouter);
app.use("/api/v1/posts", commentsRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Connected to DB & Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
