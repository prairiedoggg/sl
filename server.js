const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { authBytoken } = require("./middlewares/authBytoken");
const mypageRoutes = require("./routes/mypageRoutes");
const userRoutes = require("./routes/userRoutes");
const eduRoutes = require("./routes/eduRoutes");
const certRoutes = require("./routes/certRoutes");
const awardRoutes = require("./routes/awardRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const registerRoutes = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const { checkToken } = require("./utils/validation");
const { createError, commonError } = require("./utils/error");
const jwt = require("jsonwebtoken");

app.use(express.static(__dirname + "/public")); // CSS,JS,JPG(static 파일임)
app.use(express.json());
require("dotenv").config();
app.use(cookieParser());

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@shareliobackend.7wgu2k1.mongodb.net/testUser?retryWrites=true&w=majority&appName=SharelioBackEnd`
);

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/mypage", authBytoken, checkToken, mypageRoutes);
app.use("/api/mypage/education", eduRoutes);
app.use("/api/mypage/certificate", certRoutes);
app.use("/api/mypage/award", awardRoutes);
app.use("/api/mypage/portfolio", portfolioRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

async function userCheck(req, res, next) {
    const token = req.cookies.jwt;
    // Guard clause
    if (token === null || token === undefined) {
        next();
        return;
    }
    try {
        req.user = await jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (err) {
        next(err);
    }
}

app.get("/", userCheck, (req, res) => {
    if (!req.user) {
        res.redirect('/login');
    }
    res.sendFile(__dirname + "/public/listPage/listpage.html");
});

app.get("/login", userCheck, (req, res) => {
    if (req.user) {
        res.redirect('/');
    }
    res.sendFile(__dirname + "/public/login/login.html");
});

app.get("/register", userCheck, (req, res) => {
    if (req.user) {
        res.redirect('/');
    }
    res.sendFile(__dirname + "/public/register/register.html");
});

app.get("/mypage", userCheck, (req, res) => {
    if (!req.user) {
        res.redirect('/login');
    }
    res.sendFile(__dirname + "/public/editpage/editpage.html");
});

app.get("/userpage", userCheck, (req, res) => {
    if (!req.user) {
        res.redirect('/login');
    }
    res.sendFile(__dirname + "/public/userpage/userpage.html");
});

app.use((req, res, next) => {
    next(
        createError(
            commonError.INVALID_API_PATH.name,
            commonError.INVALID_API_PATH.message,
            404
        )
    );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:3000/`);
});

//에러핸들러
app.use(errorHandler);
