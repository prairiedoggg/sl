const router = require("express").Router();
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/models.js");

// 자격증 정보 조회
router.get("/certificate", async (req, res, next) => {
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
        const user = await User.findOne({ email }).populate("certificate");
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
router.post("/certificate", async (req, res, next) => {
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

    const { name, issuingOrganization, issueDate } = req.body;
    if (!name || !issuingOrganization || !issueDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    const now = new Date();
    const date = new Date(issueDate);
    if (date > now) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "발급날짜가 나중일 수 없습니다.",
                400
            )
        );
    }
    try {
        const user = await User.findOne({ email }).select("-password");

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
router.patch("/certificate/:_id", async (req, res, next) => {
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

    const { name, issuingOrganization, issueDate } = req.body;
    if (!name || !issuingOrganization || !issueDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    const now = new Date();
    const date = new Date(issueDate);
    if (date > now) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "발급날짜가 나중일 수 없습니다.",
                400
            )
        );
    }
    try {
        const user = await User.findOne({ email }).select("-password");
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