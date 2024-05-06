const router = require("express").Router();
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/models.js");

//수상 정보 조회
router.get("/", async (req, res, next) => {
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
router.post("/", async (req, res, next) => {
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

    const { awardName, issuingOrganization, issueDate } = req.body;
    if (!awardName || !issuingOrganization || !issueDate) {
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

        const putUser = await Award.create({
            user: user._id,
            awardName,
            issuingOrganization,
            issueDate,
        });

        user.award.push(putUser._id);
        await user.save();
        res.json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 수상 수정
router.patch("/:_id", async (req, res, next) => {
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

    const { awardName, issuingOrganization, issueDate } = req.body;
    if (!awardName || !issuingOrganization || !issueDate) {
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

        const patchUser = await Award.findOneAndUpdate(
            {
                user: user._id,
                _id,
            },
            {
                $set: {
                    awardName,
                    issuingOrganization,
                    issueDate,
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
