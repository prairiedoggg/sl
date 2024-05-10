const errorHandler = (error, req, res, next) => {
    const { name, message, statusCode } = error;
    if (statusCode >= 500 || statusCode === undefined) {
        console.error(name, message);
        res.status(500).json({
            error: "서버에서 에러가 발생하였습니다. 자세한 내용은 개발자에게 문의해주세요.",
            data: null,
        });
        return;
    }
    res.status(statusCode).json({ error: message, data: null });
};

module.exports = errorHandler;
