const router = require("express").Router();
const {
    User,
    Portfolio,
} = require("../models/models.js");
const { portfolioFieldsCheck, checkDateRange } = require("../utils/validation");
const { commonError, createError } = require("../utils/error");


//개인 포트폴리오 조회
router.get("/", async (req, res, next) => {
    const userId = await User.findOne({ email : req.user.email}).lean();
    try {
        const port = await Portfolio.find({
            user : userId._id,
        }).lean();

        if (!port) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        res.json(port);
    } catch (error) {
        next(error);
    }
});

//개인 페이지 추가 (포트폴리오)
router.post("/",  async (req, res, next) => {
    const userId = await User.findOne({ email : req.user.email}).lean();

    try {
        const port = await Portfolio.findOne({
            user : userId._id,
        }).lean();

        if (!port) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        const newPort = await Portfolio.create({
            user: userId._id,
            link: req.body.link,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
        });

        await newPort.save();
        res.json(newPort);
    } catch (error) {
        next(error);
    }
});

//개인 페이지 수정 (포트폴리오)
router.patch("/:_id", async (req, res, next) => {
    const userId = await User.findOne({ email : req.user.email}).lean();
    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const patchUser = await Portfolio.findOneAndUpdate(
            {
                user: userId._id,
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

        await patchUser.save();
        res.json(patchUser);
    } catch (error) {
        next(error);
    }
});

//포트폴리오 삭제
router.delete("/:_id", async (req, res, next) => {
    const userId = await User.findOne({ email : req.user.email}).lean();
    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    try {
        const updateUser = await Portfolio.findOneAndDelete(
            {
                _id, 
                user : userId._id
            },
        );
        res.json(updateUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;