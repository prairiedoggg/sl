const router = require("express").Router();
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/models.js");
const { checkRequiredFields, checkDate } = require("../utils/validation");

// 자격증 정보 조회
router.get("/certificate", async (req, res, next) => {


    try {
        const user = await User.findOne({ email : req.user.email }).populate("certificate");
        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        res.json(user.certificate);
    } catch (error) {
        next(error);
    }
});


// 자격증 정보 추가
router.post("/certificate", checkDate, async (req, res, next) => {


    const { name, issuingOrganization, issueDate } = req.body;
    if (!name || !issuingOrganization || !issueDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const user = await User.findOne({ email : req.user.email }).select("-password");

        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        const putUser = await Certificate.create({
            user: user._id,
            name,
            issuingOrganization,
            issueDate,
        });

        user.certificate.push(putUser._id);
        await user.save();

        res.status(200).json(putUser);
    } catch (error) {
        next(error);
    }
});

// 자격증 정보 수정
router.patch("/certificate/:_id", checkDate, async (req, res, next) => {

    const _id = req.params._id;
    if (!_id) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    const { name, issuingOrganization, issueDate } = req.body;
    if (!name || !issuingOrganization || !issueDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const user = await User.findOne({ email : req.user.mail }).select("-password");
        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }

        await Certificate.findOneAndUpdate(
            { _id },
            { $set: { name, issuingOrganization, issueDate } }
        );
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// 자격증 정보 삭제
router.delete("/certificate/:_id", async (req, res, next) => {

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
                    certificate: _id,
                },
            }
        );
        res.json(updateUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;