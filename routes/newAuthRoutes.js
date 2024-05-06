require("dotenv").config();

const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/newUser.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const refKey = process.env.REFRESH_TOKEN_SECRET_KEY;
const { authBytoken } = require("../middlewares/authBytoken");
const { commonError, createError } = require("../utils/error");

// 사용자 등록
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    console.log(username, password, email);
    // 사용자 이름은 특수문자 검증
    const usernameRegex = /^[a-zA-Z가-힣0-9]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            message: "사용자 이름에 특수문자를 포함할 수 없습니다.",
        });
    }
    // 비밀번호 검증(특수 문자 포함)
    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (password.length < 8 || !passwordRegex.test(password)) {
        return res.status(400).json({
            message: "비밀번호는 특수문자를 포함한 8자 이상어야 합니다.",
        });
    }
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: "올바른 이메일 형식이 아닙니다." });
    }

    try {
        // 비밀번호 암호화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 사용자 생성
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            profilePictureUrl:
                "https://sharelio.s3.ap-northeast-2.amazonaws.com/tmp_gallery.png",
            comments: `안녕하세요, ${username} 입니다.`,
        });
        res
            .status(201)
            .json({ message: "회원가입을 성공하였습니다!" });
    } catch (e) {
        // 오류 처리
        console.error(e);
        res.status(500).send("서버에서 오류가 발생했습니다.");
    }
});

// 사용자 로그인
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    // 여기에 중복이메일 확인 코드 작성 해야합니다.
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(401).json({ message: "사용자가 존재하지 않습니다" });
            throw createError(
                commonError.UNAUTHORIZED.name,
                commonError.UNAUTHORIZED.message,
                401
            );
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "이메일 또는 비밀번호가 틀렸습니다!" });
            throw createError(
                commonError.UNAUTHORIZED.name,
                commonError.UNAUTHORIZED.message,
                401
            );
        }
        const payload = { email: email };
        const token = jwt.sign(payload, secretKey);
        const reftoken = jwt.sign(payload, refKey);
        console.log("🚀 ~ router.post ~ token:", token);
        res.cookie("refreshToken", reftoken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res
            .status(201)
            .cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 }).json({ message: "" });
    } catch (error) {
        next(error);
    }
});

//로그아웃
router.post("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");
    res.sendStatus(200);
    console.log("로그아웃됨");
});

router.post("/token", (req, res) => {
    console.log("만료됨");
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { email: user.email },
                process.env.SECRET_KEY,
                { expiresIn: "15m" }
            );
            res
                .cookie("jwt", accessToken, { httpOnly: true, maxAge: 10000 })
                .json();
        }
    );
});

module.exports = router;
