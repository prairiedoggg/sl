require("dotenv").config();
const jwt = require("jsonwebtoken");
const { commonError, createError } = require("../utils/error");

const authBytoken = async (req, res, next) => {
    const token = req.cookies.jwt;
    // Guard clause
    if (token === null || token === undefined) {
        next(
            createError(
                commonError.NO_ACCESS_TOKEN.name,
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }
    try {
        const user = await jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            next(
                createError(
                    commonError.INVALID_TOKEN.name,
                    commonError.INVALID_TOKEN.message,
                    401
                )
            );
        }
        if (error.name === "TokenExpiredError") {
            // 토큰 만료 시 처리
            res.clearCookie("jwt");
            next(
                createError(
                    commonError.EXPIRED_TOKEN.name,
                    commonError.EXPIRED_TOKEN.message,
                    401
                )
            );
        }
    }
};

module.exports = { authBytoken };