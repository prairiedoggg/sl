const router = require("express").Router();
const {
    User,
    Portfolio,
} = require("../models/models.js");
const { portfolioFieldsCheck, checkDateRange } = require("../utils/validation");

//개인 포트폴리오 조회
router.get("/", async (req, res, next) => {

    try {
        const putUser = await User.findOne({
            email : req.user.email,
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
router.post("/", portfolioFieldsCheck, checkDateRange, async (req, res, next) => {

    try {
        const user = await User.findOne({
            email : req.user.email,
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
            link: req.body.link,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
        });

        user.portfolioUrl.push(putUser._id);
        await user.save();
        res.json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 페이지 수정 (포트폴리오)
router.patch("/:_id", portfolioFieldsCheck, checkDateRange, async (req, res, next) => {

    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const user = await User.findOne({
            email: req.user.email,
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
                    link : req.body.link,
                    startDate : req.body.startDate,
                    endDate : req.body.endDate,
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
router.delete("/:_id", async (req, res, next) => {

    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const updateUser = await User.findOneAndUpdate(
            {
                email: req.user.email,
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