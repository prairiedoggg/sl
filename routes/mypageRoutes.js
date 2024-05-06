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
} = require("../models/models.js");
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

module.exports = router;
