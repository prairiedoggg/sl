const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { isValidObjectId } = require("mongoose");
const app = express();
const { User } = require("./models/newUser.js");
const { authBytoken } = require("./middlewares/authBytoken");
const newAuthRoutes = require("./routes/newAuthRoutes");
const mypageRoutes = require("./routes/mypageRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
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

app.use('/api/users', userRoutes);
app.use('/api', newAuthRoutes);
app.use('/api/mypage', authBytoken, mypageRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:3000/`);
});


//에러핸들러
app.use(errorHandler);