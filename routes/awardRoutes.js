const router = require("express").Router();
const {
    User,
    Award,
} = require("../models/models.js");
const { checkToken, checkDate } = require("../utils/validation");

//수상 정보 조회
router.get("/", async (req, res, next) => {
    const email = req.user.email;

    try {
        const user = await User.findOne({ email }).populate("award");
        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        res.json(user.award);
    } catch (error) {
        next(error);
    }
});
// 수상 정보 추가
router.post("/", (req, res, next) => awardCertFieldsCheck(req, res, next, "awardName"), checkDate, async (req, res, next) => {

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

        const putUser = await Award.create({
            user: user._id,
            awardName : req.body.awardName,
            issuingOrganization : req.body.issuingOrganization,
            issueDate : req.body.issueDate,
        });

        user.award.push(putUser._id);
        await user.save();
        res.json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 수상 수정
router.patch("/:_id", (req, res, next) => awardCertFieldsCheck(req, res, next, "awardName"), checkDate, async (req, res, next) => {

    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

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

        const patchUser = await Award.findOneAndUpdate(
            {
                user: user._id,
                _id,
            },
            {
                $set: {
                    awardName : req.body.awardName,
                    issuingOrganization : req.body.issuingOrganization,
                    issueDate : req.body.issueDate,
                },
            },
            { new: true }
        );

        user.award.push(patchUser._id);
        await user.save();
        res.json(patchUser);
    } catch (error) {
        next(error);
    }
});

//개인 수상 페이지 삭제
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
                    award: _id,
                },
            }
        );
        res.json(updateUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
