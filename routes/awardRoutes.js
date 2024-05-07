const router = require("express").Router();
const {
    User,
    Award,
} = require("../models/models.js");
const { checkAwardCertFieldsWith, checkDate } = require("../utils/validation");
const { commonError, createError } = require("../utils/error");

//수상 정보 조회
router.get("/", async (req, res, next) => {
    const userId = await User.findOne({ email : req.user.email}).lean();
    try {
        const award = await Award.find({ user : userId._id }).lean();
        if (!award) {
            return next(
                createError(
                    "NO_RESOURCES",
                    commonError.NO_RESOURCES.message,
                    404
                )
            );
        }
    res.json(award);
    } catch (error) {
        next(error);
    }
});
// 수상 정보 추가
router.post("/", checkAwardCertFieldsWith("awardName"), checkDate, async (req, res, next) => {
    const userId = await User.findOne({ email : req.user.email}).lean();

    try {
        const putUser = await Award.create({
            user: userId._id,
            awardName : req.body.awardName,
            issuingOrganization : req.body.issuingOrganization,
            issueDate : req.body.issueDate,
        });

        await putUser.save();
        res.status(200).json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 수상 수정
router.patch("/:_id", checkAwardCertFieldsWith("awardName"), checkDate, async (req, res, next) => {
    
    const userId = await User.findOne({ email : req.user.email}).lean();
    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const patchUser = await Award.findOneAndUpdate(
            {
                user: userId._id,
            },
            {
                $set: {
                    awardName : req.body.awardName,
                    issuingOrganization : req.body.issuingOrganization,
                    issueDate : req.body.issueDate,
                },
            },
            { new: true }
        ).lean();
        res.json(patchUser);
    } catch (error) {
        next(error);
    }
});

//개인 수상 페이지 삭제
router.delete("/:_id", async (req, res, next) => {

    const userId = await User.findOne({ email : req.user.email}).lean();
    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const updateUser = await Award.findOneAndDelete(
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
