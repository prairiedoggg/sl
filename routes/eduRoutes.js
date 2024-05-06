const router = require("express").Router();
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/models.js");
const { eduFieldsCheck, checkDateRange } = require("../utils/validation");



//개인 학력 조회
router.get("/", async (req, res, next) => {

    let putUser;
    try {
        putUser = await User.findOne({
            email:req.user.email,
        }).populate("education");

        if (!putUser) {
            return next(
                createError(
                    "NO_RESOURCES",
                    commonError.NO_RESOURCES.message,
                    404
                )
            );
        }
    } catch (err) {
        next(err);
    }

    res.json(putUser); // 이제 putUser는 정의되었습니다.
});

//개인 페이지 추가 (학력)
router.post("/", eduFieldsCheck, checkDateRange, async(req, res, next) => {

    try {
        const user = await User.findOne({
            email:req.user.email,
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

        const putUser = await Education.create({
            user: user._id,
            schoolName : req.body.schoolName,
            degree : req.body.degree,
            fieldOfStudy : req.body.fieldOfStudy,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
        });

        user.education.push(putUser._id);
        await user.save();
        res.json(putUser);
    } catch (err) {
        next(err);
    }
});

//학력 페이지 수정
router.patch("/:_id", eduFieldsCheck, checkDateRange, async (req, res, next) => {
    const _id = req.params._id;

    try {
        const user = await User.findOne({
            email : req.user.email,
        }).select("-password");

        // 사용자가 존재하지 않는 경우 에러 처리
        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        const updatedEducation = await Education.findOneAndUpdate(
            {
                user: user._id,
                _id,
            },
            {
                $set: {
                    schoolName : req.body.schoolName,
                    degree : req.body.degree,
                    fieldOfStudy : req.body.fieldOfStudy,
                    startDate : req.body.startDate,
                    endDate : req.body.endDate,
                },
            },
            { new: true }
        );

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

    const _id = req.params._id;
    if (!_id) {
        next(
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
                    education: _id,
                },
            },
            { new: true }
        );
        res.json(updateUser);
    } catch (err) {
        next(err);
    }
});

module.exports = router;