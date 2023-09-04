const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

// module.exports = {
// server,
// stopServer,
// };
// index.js의 맨 아래부분에 있는 export형식을 보면, 앱과 서버를 멈추는 함수를 가져왓음을 알 수 있다
const { server, stopServer } = require('../index.js');

describe('도커 컨트롤러 테스트', async () => {
  beforeEach(() => {
    this.request = chai.request(server);

    // 테스트 내부에서 this.request를 사용할 수 있게해줌
  });

  afterEach(() => {
    stopServer();
  }); // 서버를 꺼주지 않으면 에러 발생

  // 테스트 #1: 모카 작동하는지 확인하기
  it('기본적인 모카 테스트가 작동한다', (done) => {
    const num = 1;
    expect(num).to.equal(1);
    done();
  });
  // 테스트 #2: API 요청으로 컨테이너 리스트를 가져올 수 있는지 확인하기
  it('/docker/api/v1/listContainers/', (done) => {
    chai.request(server) // 우선 서버로 요청을 보낸다
      .get('/docker/api/v1/listContainers') // 테스트하고 싶은 API URL을 GET한다
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.status(200);
        expect(res.body).to.be.an('array'); // 리턴된 값이 어레이인지 확인
        setTimeout(done, 4000);
      });
  }).timeout(15000);

  // 테스트 #3: API 요청을 통해 도커 이미지를 pull 한다.
  it('/docker/api/v1/img-pull/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/img-pull/')
      .send({ image: 'ubuntu' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 80000);
      });
  }).timeout(180000);

  // 테스트 #4 : API를 통해 image를 build 한다.
  it('/docker/api/v1/img-build/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/img-build/')
      .send({ path: './ubuntu.tar', tag: 'test' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 16000);
      });
  }).timeout(32000);

  // 테스트 #5 : API를 통해 특정 이미지를 제거한다.
  it('/docker/api/v1/img-delete/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/img-delete/')
      .send({ image: 'ubuntu:12.04' })         // <-- 여기에 운영체제:태그 를 입력하면 됨. 
      .end((err, res) => {                     // <-- 그냥 ubuntu 라고 적으면 에러 발생(latest 참조때문)
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 16000);
      });
  }).timeout(64000);

  // 테스트 #6 : API를 통해 모든 이미지를 제거한다.
  it('/docker/api/v1/img-delete-all/', (done) => {
    chai.request(server)
      .get('/docker/api/v1/img-delete-all/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 8000);
      });
  }).timeout(16000);

  // 테ㅔ스트 #7 : API를 통해 특정 이미지를 run 한다.
  it('/docker/api/v1/img-run/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/img-run/')
      .send({ image: 'test', path: './ubuntu.tar' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 8000);
      });
  }).timeout(16000);


  // stop 할 컨테이너의 ID를 아래 숫자란에 넣으면 됨.
  it('/docker/api/v1/stop/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/stop/')
      .send({ container: '02767fc07765'}) // <-- 숫자란
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 8000);
      });
  }).timeout(16000);

  // API를 통해 모든 도커 이미지를 stop 한다.
  it('/docker/api/v1/stop-all/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/stop-all/') // <-- 숫자란
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 8000);
      });
  }).timeout(16000);

  it('/docker/api/v1/state/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/state/') // <-- 숫자란
      .send({container:"fbce427523ee"})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 8000);
      });
  }).timeout(16000);

  it('/docker/api/v1/log/', (done) => {
    chai.request(server)
      .post('/docker/api/v1/log/') // <-- 숫자란
      .send({container:"fbce427523ee"})
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        setTimeout(done, 8000);
      });
  }).timeout(16000);

});
