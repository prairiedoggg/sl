const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { isValidObjectId } = require("mongoose");
const app = express();
const { User } = require("./models/models.js");
const { authBytoken } = require("./middlewares/authBytoken");
const newAuthRoutes = require("./routes/newAuthRoutes");
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

app.use(express.static(__dirname + "/public")); // CSS,JS,JPG(static 파일임)
app.set("view engine", "ejs");
app.use(express.json());
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { createError } = require("./utils/error.js");
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
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:3000/`);
});

//에러핸들러
app.use(errorHandler);
