const router = require("express").Router();
const { User } = require("../models/newUser.js");

//페이지네이션
router.get("/list", async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 12;
    let skip = (page - 1) * limit;

    try {
        let totalUser = await User.countDocuments();
        let users = await User.find().skip(skip).limit(limit).lean();
        let totalPages = Math.ceil(totalUser / limit);

        res.json({ users: users, totalPages: totalPages });
    } catch (e) {
        console.error(err);
        res.status(500).send("서버 오류");
    }
});

//전체 유저
router.get("/", async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json(users);
});

// 유저 상세페이지
router.get("/:username", async (req, res) => {
    let username = req.params.username;
    let user = await User.findOne({ username: username }).select("-password");
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.json(user);
});

router.post("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");
    res.status(200).send("로그아웃");
    console.log("로그아웃됨");
});


module.exports = router;


