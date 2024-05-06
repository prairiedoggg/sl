const router = require("express").Router();
const {
    User,
    Education,
    Certificate,
    Award,
    Portfolio,
} = require("../models/models.js");

//개인 학력 조회
router.get("/", async (req, res, next) => {
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
router.post("/", async (req, res, next) => {
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
router.patch("/:_id", async (req, res, next) => {
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
router.delete("/:_id", async (req, res, next) => {
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

module.exports = router;