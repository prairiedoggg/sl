const router = require("express").Router();
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/models.js");

//개인 포트폴리오 조회
router.get("/portfolio", async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        return next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }

    try {
        const putUser = await User.findOne({
            email,
        }).populate("portfolioUrl");

        if (!putUser) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        res.json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 페이지 추가 (포트폴리오)
router.post("/portfolio", async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        return next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }

    const { link, startDate, endDate } = req.body;
    if (!link || !startDate || !endDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // startDate가 endDate보다 빠른 날짜인지 검증
    if (start >= end) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "시작 날짜가 종료 날짜보다 같거나 나중일 수 없습니다.",
                400
            )
        );
    }

    // endDate가 현재보다 나중으로 선택되지 않도록 검증
    if (end > now) {
        return next(
            createError(
                "INVALID_END_DATE",
                "종료 날짜는 현재 날짜보다 나중일 수 없습니다.",
                400
            )
        );
    }
    try {
        const user = await User.findOne({
            email,
        }).select("-password");

        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        const putUser = await Portfolio.create({
            user: user._id,
            link,
            startDate,
            endDate,
        });

        user.portfolioUrl.push(putUser._id);
        await user.save();
        res.json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 페이지 수정 (포트폴리오)
router.patch("/portfolio/:_id", async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        return next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }

    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    const { link, startDate, endDate } = req.body;
    if (!link || !startDate || !endDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // startDate가 endDate보다 빠른 날짜인지 검증
    if (start >= end) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "시작 날짜가 종료 날짜보다 같거나 나중일 수 없습니다.",
                400
            )
        );
    }

    // endDate가 현재보다 나중으로 선택되지 않도록 검증
    if (end > now) {
        return next(
            createError(
                "INVALID_END_DATE",
                "종료 날짜는 현재 날짜보다 나중일 수 없습니다.",
                400
            )
        );
    }

    try {
        const user = await User.findOne({
            email,
        }).select("-password");

        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        const patchUser = await Portfolio.findOneAndUpdate(
            {
                user: user._id,
                _id,
            },
            {
                $set: {
                    link,
                    startDate,
                    endDate,
                },
            },
            { new: true }
        );

        user.portfolioUrl.push(patchUser._id);
        await user.save();
        res.json(patchUser);
    } catch (error) {
        next(error);
    }
});

//포트폴리오 삭제
router.delete("/portfolio/:_id", async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        return next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }

    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const updateUser = await User.findOneAndUpdate(
            {
                email: email,
            },
            {
                $pull: {
                    portfolioUrl: _id,
                },
            }
        );
        res.json(updateUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;