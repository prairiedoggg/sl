const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { isValidObjectId } = require("mongoose");
const app = express();
const { User } = require("./models/newUser.js");
const { authBytoken } = require("./middlewares/authBytoken");
const newAuthRoutes = require("./routes/newAuthRoutes");
const mypageRoutes = require("./routes/mypageRoutes");
const cookieParser = require("cookie-parser");
app.use(express.static(__dirname + "/public")); // CSS,JS,JPG(static 파일임)
app.set("view engine", "ejs");
app.use(express.json());
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
app.use(cookieParser());

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@shareliobackend.7wgu2k1.mongodb.net/testUser?retryWrites=true&w=majority&appName=SharelioBackEnd
`);




app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

app.use('/api', newAuthRoutes)
app.use('/api/mypage', mypageRoutes)

//전체 유저
app.get("/api/users", async (req, res) => {
    const users = await User.find({}).select("-password");
    console.log("🚀 ~ router.get ~ users:", users);
    res.json(users);
});

//에러핸들러
app.use((error, req, res, next) => {
    const { name, message, statusCode } = error;

    if (statusCode >= 500 || statusCode === undefined) {
        console.error(name, message);
        res.statusCode = 500;
        res.json({
            error: "서버에서 에러가 발생하였습니다. 자세한 내용은 개발자에게 문의해주세요.",
            data: null,
        });
        return;
    }

    res.statusCode = statusCode;
    res.json({
        error: message,
        data: null,
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:3000/`);
});

//페이지네이션
app.get("/api/list", async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 12;
    let skip = (page - 1) * limit;

    try {
        let totalUser = await User.countDocuments();
        let users = await User.find().skip(skip).limit(limit).lean();
        let totalPages = Math.ceil(totalUser / limit);

        res.json({ users: users, totalPages: totalPages });
    } catch (e) {
        console.error(err);
        res.status(500).send("서버 오류");
    }
});

// 유저 상세페이지
app.get("/api/users/:username", async (req, res) => {
    let username = req.params.username;
    let user = await User.findOne({ username: username }).select("-password");
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.json(user);
});

