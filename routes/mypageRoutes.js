const router = require("express").Router();
const { authBytoken } = require("../middlewares/authBytoken");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { createError, commonError } = require("../utils/error");

const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/newUser.js");
const mongoose = require("mongoose");

//개인 페이지
router.get("/", async (req, res, next) => {
    if(!req.user){
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }
    const username = req.user.username;
    try{
        const user = await User.find({
            username,
        })
            .select("-password")
            .populate("education")
            .populate("certificate")
            .populate("award")
            .populate("portfolioUrl");
        
        if(!user) {
            return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
        }
    }
    catch(err) {
        next(err);
    }

    res.json(user);
});

//자기소개, 프로필 사진 수정
router.patch("/", upload.single("profilePictureUrl"), async (req, res, next) => {

    const username = req.user.username;
    if(!username){
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }
    const comments = req.body.comments;
    if(!comments){
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));

    }
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
        next(err);
    }
});

//개인 학력 조회
router.get("/education", async (req, res, next) => {
    const username = req.user.username;
    if(!username){
        next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401))
    }
    let putUser;
    try {
        putUser = await User.findOne({
            username,
        }).populate("education");

        if (!putUser) {
            return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404))
            ;
        }
    } catch (err) {
        next(err);
    }

    res.json(putUser); // 이제 putUser는 정의되었습니다.
});

//개인 페이지 추가 (학력)
router.post("/education", async (req, res, next) => {
    const username = req.user.username;
    if(!username){
        next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401))
    }
    const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;

    if(!schoolName || !degree || !fieldOfStudy || !startDate || !endDate){
        next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404))
    }
    
    try {
        const user = await User.findOne({
            username,
        }).select("-password");

        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
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
    const username = req.user.username;
    const _id = req.params._id;
    const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;
    if(!username) {
        next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401))
    }
    if(!_id || !schoolName || !degree || !fieldOfStudy || !startDate || !endDate) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
        const user = await User.findOne({
            username,
        }).select("-password");
        
        // 사용자가 존재하지 않는 경우 에러 처리
        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
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
            return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
        }

        res.json(updatedEducation);
    } catch (err) {
        next(err);
    }
});


//학력 페이지 삭제
router.delete("/education/:_id", async (req, res, next) => {
    const username = req.user.username;
    if(!username) {
        next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401))
    }
    const _id = req.params._id;
    if(!_id){
        next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404))
    }
    try{
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
    }
    catch(err){
        next(err);
    }
});

// 자격증 정보 추가
// 자격증 정보 추가
router.post("/certificate", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const { name, issuingOrganization, issueDate } = req.body;
    if (!name || !issuingOrganization || !issueDate) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
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

// 자격증 정보 조회
router.get("/certificate", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    try {
        const user = await User.findOne({ username }).populate("certificate");
        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
        }

        res.json(user.certificate);
    } catch (error) {
        next(error);
    }
});

// 자격증 정보 수정
router.patch("/certificate/:_id", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const _id = req.params._id;
    if (!_id) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    const { name, issuingOrganization, issueDate } = req.body;
    if (!name || !issuingOrganization || !issueDate) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
        }

        await Certificate.findOneAndUpdate(
            { _id },
            { $set: { name, issuingOrganization, issueDate } }
        );
        res.json({ message: "자격증 정보 수정 완료" });
    } catch (error) {
        next(error);
    }
});

// 자격증 정보 삭제
router.delete("/certificate/:_id", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const _id = req.params._id;
    if (!_id) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
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
    } catch (error) {
        next(error);
    }
});

// 수상 정보 추가
router.post("/award", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const { awardName, issuingOrganization, issueDate } = req.body;
    if (!awardName || !issuingOrganization || !issueDate) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
        const user = await User.findOne({
            username,
        }).select("-password");

        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
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
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const _id = req.params._id;
    if (!_id) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    const { awardName, issuingOrganization, issueDate } = req.body;
    if (!awardName || !issuingOrganization || !issueDate) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
        const user = await User.findOne({
            username,
        }).select("-password");

        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
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

//개인 페이지 삭제
router.delete("/award/:_id", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const _id = req.params._id;
    if (!_id) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
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
    } catch (error) {
        next(error);
    }
});

router.get("/portfolio", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    try {
        const putUser = await User.findOne({
            username,
        }).populate("portfolioUrl");

        if (!putUser) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
        }

        res.json(putUser);
    } catch (error) {
        next(error);
    }
});

//개인 페이지 추가 (포트폴리오)
router.post("/portfolio", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const { link } = req.body;
    if (!link) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
        const user = await User.findOne({
            username,
        }).select("-password");

        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
        }

        const putUser = await Portfolio.create({
            user: user._id,
            link,
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
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const _id = req.params._id;
    if (!_id) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    const { link } = req.body;
    if (!link) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
        const user = await User.findOne({
            username,
        }).select("-password");

        if (!user) {
            return next(createError('USER_NOT_FOUND', commonError.USER_NOT_FOUND.message, 404));
        }

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
    } catch (error) {
        next(error);
    }
});

//포트폴리오 삭제
router.delete("/portfolio/:_id", async (req, res, next) => {
    const username = req.user.username;
    if (!username) {
        return next(createError('NO_ACCESS_TOKEN', commonError.NO_ACCESS_TOKEN.message, 401));
    }

    const _id = req.params._id;
    if (!_id) {
        return next(createError('NO_RESOURCES', commonError.NO_RESOURCES.message, 404));
    }

    try {
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
    } catch (error) {
        next(error);
    }
});

module.exports = router;
