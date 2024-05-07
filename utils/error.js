const commonError = {
    NO_ACCESS_TOKEN: {
        // code: "SHARE_LIO_01",
        name: "No access token",
        message: "토큰이 없습니다",
    },
    UNAUTHORIZED: {
        name: "Unauthroized",
        message: "접근 권한이 없습니다.",
    },
    INVALID_TOKEN: {
        name: "Invalid token",
        message: "잘못된 토큰입니다.",
    },
    EXPIRED_TOKEN: {
        name: "Expired token",
        message: "만료된 토큰입니다.",
    },
    NO_RESOURCES:{
        name: "No resources",
        message: "리소스가 존재하지 않습니다.",
    },
    USER_NOT_FOUND:{
        name: "User not found",
        message: "사용자를 찾을 수 없습니다",
    },
    INVALID_TOKEN: {
        name: 'INVALID_TOKEN',
        message: '잘못된 토큰입니다.',
    },
};

function createError(errorName, errorMessage, statusCode) {
    const error = new Error(errorMessage);
    error.name = errorName;
    error.statusCode = statusCode;
    return error;
}

module.exports = {
    commonError,
    createError,
};
