// require("dotenv").config();

// const {
//     User,
//     Education,
//     Certificate,
//     Award,
//     Portfolio,
// } = require("../models/models.js");
// const express = require("express");
// const {
//     User,
//     Education,
//     Certificate,
//     Award,
//     Portfolio,
// } = require("../models/newUser.js");
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRET_KEY;
// const refKey = process.env.REFRESH_TOKEN_SECRET_KEY;
// const { authBytoken } = require("../middlewares/authBytoken");
// const { commonError, createError } = require("../utils/error");

// router.use((req, res, next) => {
//     if (req.path === "/login" || req.path === "/register") {
//         return next();
//     }
//     authBytoken(req, res, next);
// });

// // 사용자 등록
// router.post("/register", async (req, res, next) => {
//     const { username, password, confirmPassword, email } = req.body;
//     console.log(username, password, confirmPassword, email);
//     // 사용자 이름은 특수문자 검증
//     const usernameRegex = /^[a-zA-Z가-힣0-9]+$/;
//     if (!usernameRegex.test(username)) {
//         return res.status(400).json({
//             message: "사용자 이름에 특수문자를 포함할 수 없습니다.",
//         });
//     }
//     // 비밀번호 검증(특수 문자 포함)
//     const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
//     if (password.length < 8 || !passwordRegex.test(password)) {
//         return res.status(400).json({
//             message: "비밀번호는 특수문자를 포함한 8자 이상어야 합니다.",
//         });
//     }
//     // 비밀번호 일치 검증
//     if (password !== confirmPassword) {
//         return res
//             .status(400)
//             .json({ message: "비밀번호가 일치하지 않습니다." });
//     }
//     // 이메일 형식 검증
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         return res
//             .status(400)
//             .json({ message: "올바른 이메일 형식이 아닙니다." });
//     }

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "이미 가입된 메일입니다." });
//         }
//         // 비밀번호 암호화
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 사용자 생성
//         const newUser = await User.create({
//             username,
//             username,
//             password: hashedPassword,
//             email,
//             profilePictureUrl:
//                 "https://sharelio.s3.ap-northeast-2.amazonaws.com/tmp_gallery.png",
//             comments: `안녕하세요, ${username} 입니다.`,
//             email,
//             profilePictureUrl:
//                 "https://sharelio.s3.ap-northeast-2.amazonaws.com/tmp_gallery.png",
//             comments: `안녕하세요, ${username} 입니다.`,
//         });
//         res.json(newUser);
//     } catch (error) {
//         // 오류 처리
//         console.error(error);
//         res.status(500).send("서버에서 오류가 발생했습니다.");
//         next(error);
//     }
// });

// // router.get("/register", (req, res) => {
// //     res.render("register", { message: null });
// // });

// // 사용자 로그인
// router.post("/login", async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email: email });
//         if (!user) {
//             throw createError(
//                 commonError.UNAUTHORIZED.name,
//                 commonError.UNAUTHORIZED.message,
//                 401
//             );
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             throw createError(
//                 commonError.UNAUTHORIZED.name,
//                 commonError.UNAUTHORIZED.message,
//                 401
//             );
//         }
//         const payload = { email : email };
//         const token = jwt.sign(payload, secretKey);
//         const reftoken = jwt.sign(payload, refKey);
//         console.log("🚀 ~ router.post ~ token:", token);
//         res.cookie("refreshToken", reftoken, {
//             httpOnly: true,
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
//         });
//         res.cookie("jwt", token, { httpOnly: true, maxAge: 15 * 60 * 1000 }); // 15분
//         res.json(user);
//     } catch (error) {
//         next(error);
//     }
// });

// router.post("/token", (req, res) => {
//     console.log("만료됨");
//     const refreshToken = req.cookies.refreshToken;
//     if (refreshToken == null) return res.sendStatus(401);
//     jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET_KEY,
//         (err, user) => {
//             if (err) return res.sendStatus(403);
//             const accessToken = jwt.sign(
//                 { username: user.username },
//                 process.env.SECRET_KEY,
//                 { expiresIn: "15m" }
//             );
//             res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 10000 });
//             res.json({ accessToken });
//         }
//     );
// });

// module.exports = router;
