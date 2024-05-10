const router = require("express").Router();
const { User } = require("../models/models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { commonError, createError } = require("../utils/error");
const secretKey = process.env.SECRET_KEY;
const refKey = process.env.REFRESH_TOKEN_SECRET_KEY;

// 사용자 로그인 및 토큰 갱신
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // 사용자 확인
        const user = await User.findOne({ email: email }).lean();
        if (!user) {
            throw createError(
                commonError.UNAUTHORIZED.name,
                commonError.UNAUTHORIZED.message,
                401
            );
        }

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw createError(
                commonError.UNAUTHORIZED.name,
                commonError.UNAUTHORIZED.message,
                401
            );
        }

        // JWT 토큰 발급
        const payload = { email: email };
        const token = jwt.sign(payload, secretKey);
        const reftoken = jwt.sign(payload, refKey);

        // 쿠키 설정
        res.cookie("refreshToken", reftoken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 });

        // 응답 데이터 구성
        const userResponse = { ...user };
        delete userResponse.password;
        delete userResponse.__v;
        res.json(userResponse);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
