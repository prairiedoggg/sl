const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/mock.json');

try {
    const data = fs.readFileSync(filePath, 'utf8'); // 동기적 호출
    jsonData = JSON.parse(data);
} catch (err) {
    console.error(err);
}

const dumApi = (req, res) => {
    res.json(jsonData);
}


module.exports = { dumApi }
