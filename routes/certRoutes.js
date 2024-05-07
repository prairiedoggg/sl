const router = require("express").Router();
const {
    User,
    Certificate,
} = require("../models/models.js");
const { createError, commonError } = require("../utils/error");
const { awardCertFieldsCheck, checkDate } = require("../utils/validation");

// 자격증 정보 조회
router.get("/", async (req, res, next) => {
    // 쿠키에 들어있는 이메일로 유저 아이디를 찾음
    const userId = await User.findOne({ email : req.user.email}).lean();

    try {
        const user = await Certificate.find({ user : userId._id}).lean();
        res.json(user);
    } catch (error) {
        next(error);
    }
});


// 자격증 정보 추가
router.post("/", (req, res, next) => awardCertFieldsCheck(req, res, next, "name"), checkDate, async (req, res, next) => {
    const userId = await User.findOne({ email : req.user.email}).lean();

    try {
        const user = await Certificate.findOne({ user : userId._id }).select("-password").lean();
        const putUser = await Certificate.create({
            user: user._id,
            name : req.body.name,
            issuingOrganization : req.body.issuingOrganization,
            issueDate : req.body.issueDate,
        });

        await putUser.save();
        res.status(200).json(putUser);
    } catch (error) {
        next(error);
    }
});

// 자격증 정보 수정
router.patch("/:_id", (req, res, next) => awardCertFieldsCheck(req, res, next, "name"), checkDate, async (req, res, next) => {
    
    const userId = await User.findOne({ email : req.user.email}).lean();
    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    try {
        const newUser = await Certificate.findOneAndUpdate(
            { user : userId._id },
            { $set: { name : req.body.name,
                    issuingOrganization : req.body.issuingOrganization, 
                    issueDate : req.body.issueDate } }
        );
        res.json(newUser);
    } catch (error) {
        next(error);
    }
});

// 자격증 정보 삭제
router.delete("/:_id", async (req, res, next) => {

    const userId = await User.findOne({ email : req.user.email}).lean();
    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const updateUser = await Certificate.findOneAndDelete(
            { _id, user: userId._id },
        );
        res.json(updateUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;