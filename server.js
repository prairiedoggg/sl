const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const { isValidObjectId } = require("mongoose");
const crudRoutes = require("./routes/crudRoutes");
const app = express();
const { authBytoken } = require("./middlewares/authBytoken");
const newAuthRoutes = require("./routes/newAuthRoutes");
const mockapi = require("./api/mockapi");
const cookieParser = require("cookie-parser");

app.use(express.static(__dirname + "/public")); // CSS,JS,JPG(static 파일임)
app.set("view engine", "ejs");
app.use(express.json());
app.set("view engine", "ejs");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
app.use(cookieParser());

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@shareliobackend.7wgu2k1.mongodb.net/?retryWrites=true&w=majority&appName=SharelioBackEnd`
);

app.use("/", newAuthRoutes);
app.use("/auth", authRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

//이미지 세팅
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_KEY_SECRET_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sharelio",
    key: function (요청, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

app.use("/", authRoutes);
app.use("/", mockapi);
app.use("/", crudRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:3000/`);
});

app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.get("/write", authBytoken, (req, res) => {
  res.render("write.ejs");
});
app.post("/add", async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.title == "") {
      res.send("제목없음");
    } else {
      await db
        .collection("post")
        .insertOne({ title: req.body.title, content: req.body.content });
      res.redirect("/list");
    }
  } catch (e) {
    console.log(e); // 콘솔창에 에러가 났다는 것을 알리기 위함
    res.status(500).send("server error");
  } //500은 서버의 잘못으로 인한 에러라는 뜻임
});

app.get("/user2", async (req, res) => {
  try {
    let result = await User.find({}).select("password");
    // -_id로 제외 가능
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/list", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = 12;
  let skip = (page - 1) * limit;

  try {
    let totalUser = await User.countDocuments();
    let users = await User.find().skip(skip).limit(limit).lean();
    let totalPages = Math.ceil(totalUser / limit);

    res.render("userlist", { users: users, totalPages: totalPages });
  } catch (e) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.clearCookie("refreshToken");

  console.log("로그아웃됨");
  res.redirect("/login");
});

//상세페이지
app.get("/user/:username", async (req, res) => {
  let username = req.params.username;
  let user = await User.findOne({ username: username }).select("-password");
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.render("person.ejs", { user: user });
});

app.get("/edits", (req, res) => {
  const data = [{ name: "hi", age: "hi" }];
  res.render("edit.ejs", { data: data });
});

app.get("/edits/:username", authBytoken, (req, res) => {
  const username = req.params.username;
  res.render("edit.ejs", { username: username });
});
app.post("/edits/:username", upload.single("img1"), async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const profPicURL = req.file.location;

    await User.findOneAndUpdate(
      { username: username },
      { profilePictureUrl: profPicURL },
      { new: true }
    );

    res.redirect("/list");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
