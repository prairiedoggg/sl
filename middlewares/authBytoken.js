require('dotenv').config()
const jwt = require('jsonwebtoken');

// const authBytoken = (req, res, next) => {
//     const token = req.cookies.jwt;
//     if (token) {
//         jwt.verify(token, process.env.SECRET_KEY, (err, decodetoken) =>{
//             if (err) { 
//                 res.redirect('/login');
//             }
//             else {
//                 console.log(decodetoken);
//                 req.user = decodetoken;
                
//                 if (req.params.username !== decodetoken.username) {
//                     return res.status(403).send('접근 권한이 없습니다.')
//                 }
                
//                 next();

//             }
//         })
//     }
//     // else{
//     //     res.redirect('/login');
//     // }
// }

const authBytoken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) =>{
            if (err) { 
                res.status(500).send('server error');
            }
            else {
                console.log(user);
                req.user = user;
                
                if (req.user.username !== user.username) {
                    return res.status(403).send('접근 권한이 없습니다.')
                }
                
                next();

            }
        })
    }
    // else{
    //     res.redirect('/login');
    // }
}


module.exports = { authBytoken };
