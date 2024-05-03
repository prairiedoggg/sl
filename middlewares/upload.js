const multer = require("multer");

const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB 크기 제한
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('이미지 파일만 업로드 가능합니다.'));
        }
        cb(undefined, true);
    }
});    



module.exports = {upload}