const router = require("express").Router();
const { authBytoken } = require("../middlewares/authBytoken");
const multer = require("multer");
const upload = multer({ dest : '../utils/upload'})

// const { upload } = require("../middlewares/upload");
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/newUser.js");
const mongoose = require("mongoose");

//전체 유저조회

//개인 페이지
router.get("/", async (req, res) => {
    const username = req.user.username;
    console.log(username);
    const user = await User.find({
        username,
    })
        .select("-password")
        .populate("education")
        .populate("certificate")
        .populate("award")
        .populate("portfolioUrl");
    res.json(user);
});



//자기소개, 프로필 사진 수정
router.patch("/", upload.single("profilePictureUrl"), async (req, res) => {
    const username = req.user.username;
    const comments = req.body.comments;
    let profilePictureUrl;
        
    if (req.file) {
        profilePictureUrl = req.file.path;
    }

    try {
        const user = await User.findOneAndUpdate(
            {
                username,
            },
            {
                comments,
                profilePictureUrl,
            },
            { new: true }
        );
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
});


//개인 학력 조회
router.get("/education", async (req, res) => {
    const username = req.user.username;
    let putUser;
    try {
        putUser = await User.findOne({
            username,
        }).populate("education");

        if (!putUser) {
            return res.status(404).send({
                Message: "User not found",
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            Message: "Internal Server Error",
        });
    }

    res.json(putUser); // 이제 putUser는 정의되었습니다.
});

//개인 페이지 추가 (학력)
router.post("/education", async (req, res) => {
    const username = req.user.username;
    const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;
    const user = await User.findOne({
        username,
    }).select("-password");
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
});

//개인 페이지 수정
router.patch("/education/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;
    const user = await User.findOne({
        username,
    }).select("-password");

    const patchUser = await Education.findOneAndUpdate(
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

    if (patchUser) {
        user.education.push(patchUser._id);
        await user.save();
        res.json(patchUser);
    } else {
        res.status(404).json({ message: "Education not found" });
    }
});

//개인 페이지 삭제
router.delete("/education/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const updateUser = await User.findOneAndUpdate(
        {
            username: username,
        },
        {
            $pull: {
                education: _id,
            },
        },
        { new: true }
    );
    res.json(updateUser);
});

// 자격증 정보 추가
router.post("/certificate", async (req, res) => {
    try {
        const username = req.user.username;
        const { name, issuingOrganization, issueDate } = req.body;

        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res
                .status(404)
                .json({ message: "사용자를 찾을 수 없습니다." });
        }

        const putUser = await Certificate.create({
            user: user._id,
            name,
            issuingOrganization,
            issueDate,
        });

        user.certificate.push(putUser._id);
        await user.save();

        res.status(401).json(putUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
});

// 자격증 정보 조회
router.get("/certificate", async (req, res) => {
    const username = req.user.username;
    const user = await User.findOne({ username }).populate("certificate");
    res.json(user.certificate);
});

// 자격증 정보 수정
router.patch("/certificate/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const { name, issuingOrganization, issueDate } = req.body;
    const user = await User.findOne({ username }).select("-password");

    await Certificate.findOneAndUpdate(
        { _id },
        { $set: { name, issuingOrganization, issueDate } }
    );
    res.json({ message: "자격증 정보 수정 완료" });
});

// 자격증 정보 삭제
router.delete("/certificate/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const updateUser = await User.findOneAndUpdate(
        {
            username: username,
        },
        {
            $pull: {
                certificate: _id,
            },
        }
    );
    res.json(updateUser);
});
// 수상 정보 추가
router.post("/award", async (req, res) => {
    const username = req.user.username;
    const { awardName, issuingOrganization, issueDate } = req.body;
    const user = await User.findOne({
        username,
    }).select("-password");
    const putUser = await Award.create({
        user: user._id,

        awardName,
        issuingOrganization,
        issueDate,
    });
    console.log(user.award);
    user.award.push(putUser._id);
    await user.save();
    res.json(user);
});

//개인 수상 수정
router.patch("/award/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const { awardName, issuingOrganization, issueDate } = req.body;
    const user = await User.findOne({
        username,
    }).select("-password");

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
});

//개인 페이지 삭제
router.delete("/award/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const updateUser = await User.findOneAndUpdate(
        {
            username: username,
        },
        {
            $pull: {
                award: _id,
            },
        }
    );
    res.json(updateUser);
});

router.get("/portfolio", async (req, res) => {
    const username = req.user.username;
    let putUser;

    try {
        putUser = await User.findOne({
            username,
        }).populate("portfolioUrl");

        if (!putUser) {
            return res.status(404).send({
                Message: "User not found",
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            Message: "Internal Server Error",
        });
    }

    res.json(putUser); // 이제 putUser는 정의되었습니다.
});

//개인 페이지 추가 (학력)
router.post("/portfolio", async (req, res) => {
    const username = req.user.username;
    const { link } = req.body;
    const user = await User.findOne({
        username,
    }).select("-password");
    const putUser = await Portfolio.create({
        user: user._id,
        link,
    });
    console.log(putUser);
    user.portfolioUrl.push(putUser._id);
    await user.save();
    res.json(putUser);
});

//개인 페이지 수정
router.patch("/portfolio/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const { link } = req.body;
    const user = await User.findOne({
        username,
    }).select("-password");

    const patchUser = await Portfolio.findOneAndUpdate(
        {
            user: user._id,
            _id,
        },
        {
            $set: {
                link,
            },
        },
        { new: true }
    );
    user.portfolioUrl.push(patchUser._id);
    await user.save();
    res.json(patchUser);
});

//포트폴리오 삭제
router.delete("/portfolio/:_id", async (req, res) => {
    const username = req.user.username;
    const _id = req.params._id;
    const updateUser = await User.findOneAndUpdate(
        {
            username: username,
        },
        {
            $pull: {
                portfolioUrl: _id,
            },
        }
    );
    res.json(updateUser);
});

module.exports = router;
