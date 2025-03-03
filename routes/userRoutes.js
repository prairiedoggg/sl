const router = require("express").Router();
const {
    User,
    Reply,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/models.js");
const { authBytoken } = require("../middlewares/authBytoken");
const { commonError, createError } = require("../utils/error");

//로그아웃
router.post("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");
    res.status(200).send("로그아웃");
});

//페이지네이션
router.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    try {
        const totalUsers = await User.countDocuments();
        const users = await User.find()
            .skip(skip)
            .limit(limit)
            .select("-password -__v")
            .lean();
        const totalPages = Math.ceil(totalUsers / limit);

        res.json({
            currentPage: page,
            totalPages: totalPages,
            totalUsers: totalUsers,
            limit: limit,
            users: users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("서버 오류");
    }
});

//전체 유저
router.get("/userlist", async (req, res) => {
    const users = await User.find({}).select("-password -__v");
    res.json(users);
});

// 유저 상세페이지
router.get("/:username", async (req, res) => {
    let username = req.params.username;
    let user = await User.findOne({ username: username })
        .select("-password")
        .lean();
    if (!user) {
        return res.status(404).send("User not found");
    }
    const [education, certificate, award, portfolioUrl, reply] =
        await Promise.all([
            Education.find({ user: user._id }).lean(),
            Certificate.find({ user: user._id }).lean(),
            Award.find({ user: user._id }).lean(),
            Portfolio.find({ user: user._id }).lean(),
            Reply.find({ user: user._id }).lean(),
        ]);
    const userData = {
        ...user,
        education,
        certificate,
        award,
        portfolioUrl,
        reply,
    };
    res.json(userData);
});

// 유저 댓글
router.post("/:username", authBytoken, async (req, res, next) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username: username })
            .select("-password")
            .lean();
        if (!user) {
            return next(
                createError(
                    "USER_NOT_FOUND",
                    commonError.USER_NOT_FOUND.message,
                    404
                )
            );
        }
        const authorUser = await User.findOne({ email: req.user.email }).lean();
        if (!authorUser) {
            return next(
                createError(
                    "AUTHOR_NOT_FOUND",
                    "댓글 작성자를 찾을 수 없습니다.",
                    404
                )
            );
        }
        const reply = await Reply.create({
            user: user._id,
            author: authorUser._id,
            reply: req.body.reply,
        });
        await reply.save({ validateBeforeSave: false });
        res.json(reply);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
