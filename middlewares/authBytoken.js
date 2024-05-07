require("dotenv").config();
const jwt = require("jsonwebtoken");
const { commonError, createError } = require("../utils/error");

// 이곳에서는 토큰이 존재하는지만 체크 후 존재한다면 복호화하여 req.user에 저장하여 다음 미들웨어로 전달

const authBytoken = async (req, res, next) => {
    const token = req.cookies.jwt;
    // Guard clause
    if (token === null || token === undefined) {
        // 주석처리 한 이유는 토큰이 존재하지 않을 경우 req.user에 무엇도 넣지않고 넘기기 위함
        // next(
        //     createError(
        //         commonError.NO_ACCESS_TOKEN.name,
        //         commonError.NO_ACCESS_TOKEN.message,
        //         401
        //     )
        // );
        next();
        return;
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