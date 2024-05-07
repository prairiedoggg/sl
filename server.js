const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { authBytoken } = require("./middlewares/authBytoken");
const newAuthRoutes = require("./routes/newAuthRoutes");
const mypageRoutes = require("./routes/mypageRoutes");
const userRoutes = require("./routes/userRoutes");
const eduRoutes = require("./routes/eduRoutes");
const certRoutes = require("./routes/certRoutes");
const awardRoutes = require("./routes/awardRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const { checkToken } = require("./utils/validation");
const { createError, commonError } = require("./utils/error.js");

app.use(express.static(__dirname + "/public")); // CSS,JS,JPG(static 파일임)
app.set("view engine", "ejs");
app.use(express.json());
require("dotenv").config();
app.use(cookieParser());

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@shareliobackend.7wgu2k1.mongodb.net/testUser?retryWrites=true&w=majority&appName=SharelioBackEnd
`
);

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api", newAuthRoutes);
app.use("/api/mypage", authBytoken, checkToken, mypageRoutes);
app.use("/api/mypage/education", eduRoutes);
app.use("/api/mypage/certificate", certRoutes);
app.use("/api/mypage/award", awardRoutes);
app.use("/api/mypage/portfolio", portfolioRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:3000/`);
});

//에러핸들러
app.use(errorHandler);
