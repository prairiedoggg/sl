const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { isValidObjectId } = require("mongoose");
const app = express();
const { User } = require("./models/newUser.js");
const { authBytoken } = require("./middlewares/authBytoken");
// const authRoutes = require("./routes/authRoutes");
// const crudRoutes = require("./routes/crudRoutes");
const newAuthRoutes = require("./routes/newAuthRoutes");
// const {upload} = require("./middlewares/upload");

const mockapi = require("./api/mockapi");
const cookieParser = require("cookie-parser");
app.use(express.static(__dirname + "/public")); // CSS,JS,JPG(static 파일임)
app.set("view engine", "ejs");
app.use(express.json());
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const { createError } = require("./utils/error.js");
app.use(cookieParser());

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@`
);

function checkUser(req, res, next) {
    if (!req.user) {
        next(createError(
            commonError.NO_ACCESS_TOKEN.name,
            commonError.NO_ACCESS_TOKEN.message,
            401
        ));
    }
    next();
}

// api에 접근하기 위해서 토큰을 체크, req.user 체크
app.use("/api/mypage", authBytoken, checkUser, require("./routes/mypageRoutes"));

app.use("/api", newAuthRoutes);

//전체 유저
app.post("/users", authBytoken, checkUser, async (req, res) => {
    const { Page } = req.body;
    //const users = await User.find({}).select("-password");
    console.log(Page);
    const users = await User.find({}).skip(12 * (Page === 0 ? 0 : Page)).limit(12);
    console.log("🚀 ~ router.get ~ users:", users);
    res.json(users);
});


app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

// //이미지 세팅
// const multer = require("multer");
// const upload = multer({
//     limits: {
//         fileSize: 1000000 // 1MB 크기 제한
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('이미지 파일만 업로드 가능합니다.'));
//         }
//         cb(undefined, true);
//     }
// });

//app.use("/", mockapi);

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

// app.get("/", (req, res) => {
//     res.render("main.ejs");
// });

// app.get("/write", authBytoken, (req, res) => {
//     res.render("write.ejs");
// });
// app.post("/add", async (req, res) => {
//     console.log(req.body);

//     try {
//         if (req.body.title == "") {
//             res.send("제목없음");
//         } else {
//             await db.collection("post").insertOne({
//                 title: req.body.title,
//                 content: req.body.content,
//             });
//             res.redirect("/list");
//         }
//     } catch (e) {
//         console.log(e); // 콘솔창에 에러가 났다는 것을 알리기 위함
//         res.status(500).send("server error");
//     } //500은 서버의 잘못으로 인한 에러라는 뜻임
// });

// app.get("/list", async (req, res) => {
//     let page = parseInt(req.query.page) || 1;
//     let limit = 12;
//     let skip = (page - 1) * limit;

//     try {
//         let totalUser = await User.countDocuments();
//         let users = await User.find().skip(skip).limit(limit).lean();
//         let totalPages = Math.ceil(totalUser / limit);

//         res.render("userlist", { users: users, totalPages: totalPages });
//     } catch (e) {
//         console.error(err);
//         res.status(500).send("서버 오류");
//     }
// });

// //상세페이지
// app.get("/user/:username", async (req, res) => {
//     let username = req.params.username;
//     let user = await User.findOne({ username: username }).select("-password");
//     if (!user) {
//         return res.status(404).send("User not found");
//     }
//     res.render("person.ejs", { user: user });
// });

// app.get("/edits", (req, res) => {
//     const data = [{ name: "hi", age: "hi" }];
//     res.render("edit.ejs", { data: data });
// });

// app.get("/edits/:username", authBytoken, (req, res) => {
//     const username = req.params.username;
//     res.render("edit.ejs", { username: username });
// });
// app.post("/edits/:username", upload.single("img1"), async (req, res) => {
//     const username = req.params.username;

//     try {
//         const user = await User.findOne({ username: username });

//         if (!user) {
//             return res.status(404).send("User not found");
//         }

//         const profPicURL = req.file.location;

//         await User.findOneAndUpdate(
//             { username: username },
//             { profilePictureUrl: profPicURL },
//             { new: true }
//         );

//         res.redirect("/list");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//     }
// });

app.get('/', authBytoken, (req, res) => {
    // 토큰이 존재하지 않는다면
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + '/public/html/listpage.html');
});

app.get('/login', authBytoken, (req, res) => {
    // 토큰이 존재한다면
    if (req.user) {
        res.redirect('/');
        return;
    }
    res.sendFile(__dirname + '/public/html/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/html/register.html');
});

app.get('/mypage', authBytoken, (req, res) => {
    // 토큰이 존재하지 않는다면
    if (!req.user) {
        res.redirect('/login');
    }
    res.sendFile(__dirname + '/public/html/editpage.html');
});