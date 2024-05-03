const commonError = {
    NO_ACCESS_TOKEN: {
        // code: "SHARE_LIO_01",
        name: "No access token",
        message: "토큰이 없습니다",
    },
    UNAUTHORIZED: {
        name: "Unauthroized",
        message: "접근 권한이 없습니다."
    },
    INVALID_TOKEN: {
        name: "Invalid token",
        message: "잘못된 토큰입니다."
    }
}

function createError(errorName, errorMessage, statusCode) {
    const error = new Error(errorMessage);
    error.name = errorName;
    error.statusCode = statusCode;
    return error;
}

module.exports = {
    commonError,
    createError,
}
