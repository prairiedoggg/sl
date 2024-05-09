const router = require("express").Router();
const { User } = require("../models/models.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { commonError, createError } = require("../utils/error");
const secretKey = process.env.SECRET_KEY;
const refKey = process.env.REFRESH_TOKEN_SECRET_KEY;

// 사용자 로그인
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email }).lean();
        if (!user) {
            throw createError(
                commonError.UNAUTHORIZED.name,
                commonError.UNAUTHORIZED.message,
                401
            );
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw createError(
                commonError.UNAUTHORIZED.name,
                commonError.UNAUTHORIZED.message,
                401
            );
        }
        const payload = { email: email };
        const token = jwt.sign(payload, secretKey);
        const reftoken = jwt.sign(payload, refKey);
        res.cookie("refreshToken", reftoken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.post("/token", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, user) => {
            if (err) {
                return res
                    .sendStatus(403)
                    .json({ message: "토큰 갱신 실패. 다시 로그인 해주세요." });
            }
            try {
                const accessToken = jwt.sign(
                    { email: user.email },
                    process.env.SECRET_KEY,
                    { expiresIn: "15m" }
                );
                res.cookie("jwt", accessToken, {
                    httpOnly: true,
                    maxAge: 10000,
                });
                res.json({ accessToken });
            } catch (error) {
                console.log(error);
                res.sendStatus(500).json({
                    message: "서버 오류. 다시 시도해주세요.",
                });
            }
        }
    );
});

module.exports = router;
