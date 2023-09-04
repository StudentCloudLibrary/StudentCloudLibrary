if(process.env.NODE_ENV==='production') {
    // 배포가 되었을 경우
    module.exports = require('./dev');
} else {
    // local 환경인 경우
    module.exports = require('./dev');
}
// local에서 작업하는 것과 배포되는 것을 따로 생각해줘야 함. 
// 배포될 때 날것으로 배포되어서는 안되는 것들이 있음. 