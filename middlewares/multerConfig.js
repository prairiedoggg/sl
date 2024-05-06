const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, "../public/uploads");

// uploads 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const multerConfig = multer({
    storage: storage,
    limits: {
        fileSize: 1000000, // 1MB 크기 제한
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("이미지 파일만 업로드 가능합니다."));
        }
        cb(undefined, true);
    },
});

module.exports = multerConfig;