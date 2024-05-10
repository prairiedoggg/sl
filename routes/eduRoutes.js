const router = require("express").Router();
const { User, Education } = require("../models/models.js");
const { eduFieldsCheck, checkDateRange } = require("../utils/validation");

//개인 학력 조회
router.get("/", async (req, res, next) => {
    const userId = await User.findOne({ email: req.user.email }).lean();

    try {
        const edu = await Education.find({
            user: userId._id,
        }).lean();

        if (!edu) {
            return next(
                createError(
                    "NO_RESOURCES",
                    commonError.NO_RESOURCES.message,
                    404
                )
            );
        }
        res.json(edu);
    } catch (err) {
        next(err);
    }
});

//개인 페이지 추가 (학력)
router.post("/", async (req, res, next) => {
    const userId = await User.findOne({ email: req.user.email }).lean();

    try {
        const putUser = await Education.create({
            user: userId._id,
            schoolName: req.body.schoolName,
            degree: req.body.degree,
            fieldOfStudy: req.body.fieldOfStudy,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });

        await putUser.save();
        res.json(putUser);
    } catch (err) {
        next(err);
    }
});

//학력 페이지 수정
router.patch("/:_id", async (req, res, next) => {
    const userId = await User.findOne({ email: req.user.email }).lean();
    const _id = req.params._id;
    try {
        const updatedEducation = await Education.findOneAndUpdate(
            {
                user: userId._id,
                _id,
            },
            {
                $set: {
                    schoolName: req.body.schoolName,
                    degree: req.body.degree,
                    fieldOfStudy: req.body.fieldOfStudy,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                },
            },
            { new: true }
        ).lean();

        // 업데이트된 교육 정보가 없는 경우(잘못된 ID 등의 이유로)
        if (!updatedEducation) {
            return next(
                createError(
                    "NO_RESOURCES",
                    commonError.NO_RESOURCES.message,
                    404
                )
            );
        }

        res.json(updatedEducation);
    } catch (err) {
        next(err);
    }
});

//학력 페이지 삭제
router.delete("/:_id", async (req, res, next) => {
    const userId = await User.findOne({ email: req.user.email }).lean();
    const _id = req.params._id;
    if (!_id) {
        next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    try {
        const updateUser = await Education.findOneAndDelete(
            {
                _id,
                user: userId._id,
            },

            { new: true }
        ).lean();
        res.json(updateUser);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
