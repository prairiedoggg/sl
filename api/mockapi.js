const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const {dumApi} = require('../middlewares/dumApi');

const filePath = path.join(__dirname, '../public/mock.json');
try {
    const data = fs.readFileSync(filePath, 'utf8'); // 동기적 호출
    jsonData = JSON.parse(data);
} catch (err) {
    console.error(err);
}

router.get('/mock', (req, res)=>{
    res.send("Mock Api")
})
router.get('/api/mock', dumApi);

router.post('/api/mock', dumApi);

router.get('/user/education', dumApi);

router.get('/user/education/:userId', dumApi);

router.post('/user/education', dumApi);

router.get('/user/award', dumApi);

router.get('/user/award/:userId', dumApi);

router.post('/user/award', dumApi);

router.get('/user/project', dumApi);

router.get('/user/project/:userId', dumApi);

router.post('/user/project', dumApi);

router.get('/user/certificate', dumApi);

router.get('/user/certificate/:userId', dumApi);

router.post('/user/certificate', dumApi);


module.exports = router;

