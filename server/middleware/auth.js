const { User } = require('../models/User');

let auth = (req,res,next) => {

    // 인증 처리를 하는 곳

    // 1. 클라이언트 쿠키에서 토큰을 가져옴.
    let token = req.cookies.x_auth;
    
    // 2. 복호화를 하면 id가 나오고, 해당 id로 DB에서 user를 찾은 후
    // 해당 유저도 쿠키에서 받아온 token이 있는지 확인한다.

    // 2-1. 토큰을 복호화 한 후 유저를 찾는다.
    // 앞에서 generateToken 함수를 만든 것과 비슷하다.
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        req.token = token;
        req.user = user;
        // 이렇게 저장해주면 index.js에서 
        // req.user, req.token 을 이용해 불러올 수 있다.

        next();

    })
    // 유저가 있으면 인중 Okay



    // 유저가 없으면 인정 No



}

module.exports = { auth };
