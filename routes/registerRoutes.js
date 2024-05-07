const router = require("express").Router();
const { User } = require("../models/models.js");
const bcrypt = require("bcrypt");
const { commonError, createError } = require("../utils/error");

// 사용자 등록
router.post("/", async (req, res, next) => {
    const { username, password, confirmPassword, email } = req.body;
    console.log(username, password, confirmPassword, email);
    // 사용자 이름은 특수문자 검증
    const usernameRegex = /^[a-zA-Z가-힣0-9]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            message: "사용자 이름에 특수문자를 포함할 수 없습니다.",
        });
    }
    // 비밀번호 검증(특수 문자 포함)
    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (password.length < 8 || !passwordRegex.test(password)) {
        return res.status(400).json({
            message: "비밀번호는 특수문자를 포함한 8자 이상어야 합니다.",
        });
    }
    // 비밀번호 일치 검증
    if (password !== confirmPassword) {
        return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." });
    }
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: "올바른 이메일 형식이 아닙니다." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "이미 가입된 메일입니다." });
        }
        // 비밀번호 암호화
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 사용자 생성
        const newUser = await User.create({
            username,
            username,
            password: hashedPassword,
            email,
            profilePictureUrl:
                "https://sharelio.s3.ap-northeast-2.amazonaws.com/tmp_gallery.png",
            comments: `안녕하세요, ${username} 입니다.`,
            email,
            profilePictureUrl:
                "https://sharelio.s3.ap-northeast-2.amazonaws.com/tmp_gallery.png",
            comments: `안녕하세요, ${username} 입니다.`,
        });
        res.json(newUser);
    } catch (error) {
        // 오류 처리
        console.error(error);
        res.status(500).send("서버에서 오류가 발생했습니다.");
        next(error);
    }
});

module.exports = router;
