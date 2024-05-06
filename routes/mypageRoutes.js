const router = require("express").Router();
const { authBytoken } = require("../middlewares/authBytoken");
const multer = require("multer");
const path = require("path");
const { createError, commonError } = require("../utils/error");
const fs = require("fs");
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/newUser.js");
const mongoose = require("mongoose");
const multerConfig = require("../middlewares/multerConfig");


//개인 페이지
router.get("/", async (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
        return next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }
    const email = req.user.email;
    try {
        const user = await User.find({
            email,
        })
            .select("-password")
            .populate("education")
            .populate("certificate")
            .populate("award")
            .populate("portfolioUrl");
        res.json(user);

        if (!user) {
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
});

//자기소개 수정
router.patch("/comments", async (req, res, next) => {
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

    const comments = req.body.comments;
    if (!comments) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { comments },
            { new: true }
        );
        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
});

//프로필사진수정
router.patch(
    "/profile-picture",
    multerConfig.single("profilePictureUrl"),
    async (req, res, next) => {
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

        let profilePictureUrl;
        if (req.file) {
            profilePictureUrl = req.file.path;
        } else {
            return next(
                createError(
                    "NO_RESOURCES",
                    commonError.NO_RESOURCES.message,
                    404
                )
            );
        }

        try {
            const user = await User.findOneAndUpdate(
                { email },
                { profilePictureUrl : profilePictureUrl },
                { new: true }
            );
            await user.save();
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
);


//개인 학력 조회
router.get("/education", async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }
    let putUser;
    try {
        putUser = await User.findOne({
            email,
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
router.post("/education", async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }
    const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;

    if (!schoolName || !degree || !fieldOfStudy || !startDate || !endDate) {
        next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // startDate가 endDate보다 빠른 날짜인지 검증
    if (start >= end) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "시작 날짜가 종료 날짜보다 같거나 나중일 수 없습니다.",
                400
            )
        );
    }

    // endDate가 현재보다 나중으로 선택되지 않도록 검증
    if (end > now) {
        return next(
            createError(
                "INVALID_END_DATE",
                "종료 날짜는 현재 날짜보다 나중일 수 없습니다.",
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

        const putUser = await Education.create({
            user: user._id,
            schoolName,
            degree,
            fieldOfStudy,
            startDate,
            endDate,
        });

        user.education.push(putUser._id);
        await user.save();
        res.json(putUser);
    } catch (err) {
        next(err);
    }
});

//학력 페이지 수정
router.patch("/education/:_id", async (req, res, next) => {
    const email = req.user.email;
    const _id = req.params._id;
    const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;
    if (!email) {
        next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }
    if (
        !_id ||
        !schoolName ||
        !degree ||
        !fieldOfStudy ||
        !startDate ||
        !endDate
    ) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start >= end) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "시작 날짜가 종료 날짜보다 같거나 나중일 수 없습니다.",
                400
            )
        );
    }

    if (end > now) {
        return next(
            createError(
                "INVALID_END_DATE",
                "종료 날짜는 현재 날짜보다 나중일 수 없습니다.",
                400
            )
        );
    }
    try {
        const user = await User.findOne({
            email,
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
                    schoolName,
                    degree,
                    fieldOfStudy,
                    startDate,
                    endDate,
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
router.delete("/education/:_id", async (req, res, next) => {
    const email = req.user.email;
    if (!email) {
        next(
            createError(
                "NO_ACCESS_TOKEN",
                commonError.NO_ACCESS_TOKEN.message,
                401
            )
        );
    }
    const _id = req.params._id;
    if (!_id) {
        next(
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

router.get("/award", async (req, res, next) => {
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
router.post("/award", async (req, res, next) => {
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
router.patch("/award/:_id", async (req, res, next) => {
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
router.delete("/award/:_id", async (req, res, next) => {
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

//개인 포트폴리오 조회
router.get("/portfolio", async (req, res, next) => {
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
        const putUser = await User.findOne({
            email,
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
router.post("/portfolio", async (req, res, next) => {
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

    const { link, startDate, endDate } = req.body;
    if (!link || !startDate || !endDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // startDate가 endDate보다 빠른 날짜인지 검증
    if (start >= end) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "시작 날짜가 종료 날짜보다 같거나 나중일 수 없습니다.",
                400
            )
        );
    }

    // endDate가 현재보다 나중으로 선택되지 않도록 검증
    if (end > now) {
        return next(
            createError(
                "INVALID_END_DATE",
                "종료 날짜는 현재 날짜보다 나중일 수 없습니다.",
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

        const putUser = await Portfolio.create({
            user: user._id,
            link,
            startDate,
            endDate,
        });

        user.portfolioUrl.push(putUser._id);
        await user.save();
        res.json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 페이지 수정 (포트폴리오)
router.patch("/portfolio/:_id", async (req, res, next) => {
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

    const { link, startDate, endDate } = req.body;
    if (!link || !startDate || !endDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // startDate가 endDate보다 빠른 날짜인지 검증
    if (start >= end) {
        return next(
            createError(
                "INVALID_DATE_RANGE",
                "시작 날짜가 종료 날짜보다 같거나 나중일 수 없습니다.",
                400
            )
        );
    }

    // endDate가 현재보다 나중으로 선택되지 않도록 검증
    if (end > now) {
        return next(
            createError(
                "INVALID_END_DATE",
                "종료 날짜는 현재 날짜보다 나중일 수 없습니다.",
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

        const patchUser = await Portfolio.findOneAndUpdate(
            {
                user: user._id,
                _id,
            },
            {
                $set: {
                    link,
                    startDate,
                    endDate,
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
router.delete("/portfolio/:_id", async (req, res, next) => {
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
