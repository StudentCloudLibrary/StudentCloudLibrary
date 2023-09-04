const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10 // bcrypt에서 salt의 길이
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50 // maxlength : 최대길이
    },
    email: {
        type: String,
        trim: true, // 앞의 공백을 제거
        unique: 1 // unique : 중복 불가
    },
    password: {
        type: String,
        minLength: 5 // minlength : 최소길이
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0 // default : 입력이 없을 시 기본값.
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    // User가 저장되기 전에 작업되도록 함. 

    var user = this;

    if (user.isModified('password')) {
        // 이대로 사용하면 user가 수정되어도 save는 일어나기 때문에,
        // 다른 정보가 수정되어도 password 암호화가 일어남.
        // password가 수정되었을 때만 실행되도록.

        // 비밀번호를 암호화시킴
        // Salt 값을 이용해서 비밀번호를 암호화시킴. 
        // saltRounds : salt가 몇글자인지
        bcrypt.genSalt(saltRounds, function(err, salt) {
            // next() : user 저장되는 과정으로 넘김

            if (err) return next(err)
            // salt를 만드는데 문제가 생기면 그냥 넘김

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                // hash값을 넘기는데 문제가 생기면 그냥 넘김

                user.password = hash
                next()
            })
        })
    } else {
        next()
        // 다른 것들을 바꿀 때는 바로 넘어가도록
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // 여기서 cb는 callback이다. 이전 호출된 곳으로 넘어가는 작용을 한다.

    // plainPassword 12341234 
    // 암호화된 비밀번호 : $2b$10$z929l0XFRLkjbYEw3zjhjeB.acUmi3M.g80665Rp1x16wK8HKOBh.
    // 이 둘이 같은지 확인해야 한다. plainPassword를 암호화해서 확인한다.
    // bcrypt 라이브러리 내부에서 password와 salt값을 함께 저장한다고 한다.

    bcrypt.compare(plainPassword,this.password,function(err,isMatch) {
        if(err) return cb(err);

        cb(null,isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기.
    var token = jwt.sign(user._id.toHexString(),'secretToken') // database에서의 아이디
    // user._id+'secretToken' = token 
    // 'secretToken' -> user._id

    user.token = token

    // 토큰을 db에 저장해준다.
    user.save(function(err,user) {
        if(err) return cb(err);
        cb(null, user)
    })
}


userSchema.statics.findByToken = function(token,cb) {
    var user = this;

    // 토큰을 decode 한다. 
    // 지난번에 id와 'secretToken'을 합쳐서 token을 만들고, 
    // 'secretToken'을 제공하면 id이 제공되었다.
    jwt.verify(token,'secretToken',function(err,decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인함.

        user.findOne({"_id": decoded, "token": token}, function(err,user) {

            if(err) return cb(err);
            cb(null,user);
        })
    })
}

const User = mongoose.model('User', userSchema);
// 위에 함수들이 schema를 정의하는 작업이다.
// 이 문장에서 model과 schema를 bind시켜주므로,
// model()은 schema 정의가 모두 끝나고 가장 아래에 넣어주어야 한다.


module.exports = { User };
// 다른 곳에서도 쓸 수 있도록 model을 export