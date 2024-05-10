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
const { User } = require("./models/models");
const jwt = require("jsonwebtoken");

app.use(express.static(__dirname + "/public")); // CSS,JS,JPG(static 파일임)
//app.set("view engine", "ejs");
app.use(express.json());
require("dotenv").config();
app.use(cookieParser());

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@`);

async function tokenCheck(req, res, next) {
    const token = req.cookies.jwt;
    if (token === null || token === undefined) {
        next();
        return;
    }
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
}

app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/mypage", authBytoken, checkToken, mypageRoutes);
app.use("/api/mypage/education", eduRoutes);
app.use("/api/mypage/certificate", certRoutes);
app.use("/api/mypage/award", awardRoutes);
app.use("/api/mypage/portfolio", portfolioRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

app.get("/", tokenCheck, (req, res) => {
    if (!req.user) {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/public/ListPage/listpage.html");
});

app.get("/login", tokenCheck, (req, res) => {
    if (req.user) {
        res.redirect("/");
    }
    res.sendFile(__dirname + "/public/Login/login.html");
});

app.get("/register", (req, res) => {
    if (req.user) {
        res.redirect("/");
    }
    res.sendFile(__dirname + "/public/Register/register.html");
});

app.get("/mypage", tokenCheck, (req, res) => {
    if (!req.user) {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/public/EditPage/editpage.html");
});

app.get("/userpage", tokenCheck, (req, res) => {
    if (!req.user) {
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + "/public/UserPage/userpage.html");
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
