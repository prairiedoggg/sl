
const { createError, commonError } = require("../utils/error");


const checkToken = (req, res, next) => {
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
    next();
};

const awardCertFieldsCheck = (req, res, next, categoryName) => {
    const { issuingOrganization, issueDate } = req.body;
    const category = req.body[categoryName]; 
    if(!category||!issuingOrganization||!issueDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        )
    }
    next();

}

const eduFieldsCheck = (req, res, next) => {
    const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;

    if (!schoolName || !degree || !fieldOfStudy || !startDate || !endDate) {
        next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    next();

}

const portfolioFieldsCheck = (req, res, next) => {
    const { link, startDate, endDate } = req.body;
    if (!link || !startDate || !endDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    next();

}

const checkAwardCertFieldsWith = (categoryName) => (req, res, next) => {
    const { issuingOrganization, issueDate } = req.body;
    const category = req.body[categoryName]; 
    if(!category||!issuingOrganization||!issueDate) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        )
    }
    next();
}


const replyFieldsCheck = (req, res, next) => {
    const { reply } = req.body;
    if(!reply) {
        return next(
            createError("NO_RESOURCES", commonError.NO_RESOURCES.message, 404)
        );
    }
    next();
}

//수상, 자격증
const checkDate = (req, res, next) => {
    const  issueDate  = req.body.issueDate;
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
    next();
};

const checkDateRange = (req, res, next) => {
    const {startDate, endDate} = req.body
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
    next();
}

module.exports = {
    checkToken,
    checkAwardCertFieldsWith,
    awardCertFieldsCheck,
    checkDate,
    checkDateRange,
    eduFieldsCheck,
    portfolioFieldsCheck,
    replyFieldsCheck,
};