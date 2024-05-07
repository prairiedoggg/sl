const router = require("express").Router();
const { User } = require("../models/newUser.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { commonError, createError } = require("../utils/error");

// 사용자 로그인
router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });
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
        const payload = { username: username };
        const token = jwt.sign(payload, secretKey);
        const reftoken = jwt.sign(payload, refKey);
        console.log("🚀 ~ router.post ~ token:", token);
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
    console.log("만료됨");
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { username: user.username },
                process.env.SECRET_KEY,
                { expiresIn: "15m" }
            );
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 10000 });
            res.json({ accessToken });
        }
    );
});

module.exports = router;
