// require('dotenv').config()

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const secretKey = process.env.SECRET_KEY;
// const refKey = process.env.REFRESH_TOKEN_SECRET_KEY;


// // 사용자 등록
// router.post('/register', async (req, res) => {
//     const { username, password, email } = req.body;

//     try {
//         // 비밀번호 암호화
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 사용자 생성
//         const newUser = await User.create({
//             username,
//             password: hashedPassword,
//             email,
//             profilePictureUrl: "https://sharelio.s3.ap-northeast-2.amazonaws.com/tmp_gallery.png"
//         });
//         res.json(newUser);
//     } catch (e) {
//         // 오류 처리
//         console.error(e);
//         res.status(500).send('서버에서 오류가 발생했습니다.');
//     } 
// });






// router.get('/register', (req, res) => {
//     res.render('register', {message: null});
// });

// // 사용자 로그인


// router.post('/login', async (req, res) => {
//         const {username, password} = req.body; 
//         const user = await User.findOne({username: username})
//         if (!user) {
//             return res.status(400).json({
//                 message: '사용자를 찾을 수 없습니다.'
//             });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({
//                 message: '비밀번호가 일치하지 않습니다.'
//             });
//         }
//             const payload = { username: username };
//             const token = jwt.sign(payload, secretKey);
//             const reftoken = jwt.sign(payload, refKey);
//             console.log("🚀 ~ router.post ~ token:", token)
//             res.cookie('refreshToken', reftoken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000});
//             res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
            
//             res.json(user);

    
// });



// router.post('/token', (req, res) => {
//     console.log('만료됨');
//     const refreshToken = req.cookies.refreshToken;
//     if (refreshToken == null) return res.sendStatus(401);
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
//         if (err) return res.sendStatus(403);
//         const accessToken = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: '15m' });
//         res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 10000 });
//         res.json({ accessToken });
//     });
// });




// module.exports = router;
