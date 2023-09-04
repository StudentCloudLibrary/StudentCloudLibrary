const express = require("express"); // express 모듈을 가져오기
const app = express(); // 새로운 express 앱을 만듬
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const Docker = require("dockerode");

const config = require("./config/key");
// config/key.js에서 production에 따른 URI 참조 방식을
// 결정해줌.

// application/x-www-form-urlencoded 형식을 분석하도록
// x, www, form 등의 형식으로 넘어오는 데이터를 분석해준다는 말이다.
// extended: true - express 안의 qs를 사용.
// extended: false - NodeJs의 queryString을 사용.
// 자세한 것은 모르겠음. 
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 형식을 분석하도록
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
// require() : 파일 경로를 인수로받아서 해당 파일에서 내보낸
// 객체를 반환하는 함수.

//    "mongoose": "^7.0.3",
// config 안의 mongoURI를 가져와주는 방식.
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected...")) // 연결이 되면 log 출력
  .catch((err) => console.log(err)); // err catch
// connect()


// Docker 서버에 연결된 Docker 클라이언트 생성
// const dockerClient = new Docker({ host: '172.17.0.1', port: 2375 });
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const exec = require('child_process').exec;
const fs = require('fs');
const { isUtf8 } = require("buffer");

// 루트 디렉토리에 오면 Hello World를 출력하도록
app.get("/", (req, res) => res.send("Hello World! 안녕하세요!"));

// 아래에서 server를 정의내려줘야 stopServer 함수에서 server.close()를 호출할 수 있다
const server = app.listen(8080, () => {
  console.log('도커 컨트롤러 시작! 포트 8080에서 요청 기다리고 있습니다.');
});

const stopServer = () => {
  server.close(); // 위에서 시작한 새로운 서버를 닫아준다
  // 테스트할 때 필요한 툴 (프로덕션 상에서는 상관없음)
};

// API: /docker/api/v1/listContainers (GET)
// 설명: 로컬에서 실행 중인 도커 컨테이너의 아이디값들을 리스트(어레이)의 형식으로 리턴해준다.
app.get('/docker/api/v1/listContainers', async (req, res) => {
  const response = await docker.listContainers();
  const containerIDs = [];
  for (const containerObj of response) {
    containerIDs.push(containerObj.Id);
  }
  res.status(200);
  res.send(containerIDs);
});

// API: /docker/api/v1/createContainer (POST)
// 설명: POST 데이터로 실행시킬 컨테이너의 정보를 보내면, 로컬에서 그 spec에 맞게 컨테이너를 실행시킨다.
app.post('/', async (req, res) => {
  // pass
});

// API: /docker/api/v1/img-pull (POST)
// 설명: POST 데이터에 도커 이미지 정보를 json 형식으로 넣고 send하면 그 내역에 맞는 도커 이미지를 로컬에 풀한다.
// 형식: myrepo/myname:tag 형식으로 post에 image:< message >, message 안에 넣어 post 한다.
app.post('/docker/api/v1/img-pull/', async (req, res) => {
  const ImgName = req.body.image;
  // console.log(ImgName);
  // console.log(req);
  const docker = new Docker();
  docker.pull(ImgName, (err, stream) => {
    if (!err) {
      console.log('Successfully pulled');
      res.status(200);
      res.json({ status: 'success' });
    } else {
      console.log(err);
      res.status(400);
      res.json(err);
    }
  });
});

// API: /docker/api/v1/img-build (POST)
// 설명: POST 매서드를 이용하여 dockerfile의 경로와 tag명을 파싱해 도커 이미지를 빌드한다.
// 형식: post 안의 메시지 형식은 다음 { path : <pathname>, tag : <tagname> } 와 같다.
app.post('/docker/api/v1/img-build/', async (req, res) => {
  const pathName = req.body.path;
  const tagName = req.body.tag;
  const docker = new Docker({ host: '127.0.0.1' });
  docker.buildImage(pathName, { t: tagName }, (err, stream) => {
    if (err) {
      res.json(err);
      res.status(400);
    } else {
      res.status(200);
    }
    // stream.pipe(process.stdout, {
    //   end: true
    // });
    // stream.on('end', () => {
    //   res.status(200);8
    // });
  });
});


// API: /docker/api/v1/img-delete (POST)
// 설명: POST 매서드를 이용하여 image 이름을 파싱하여 로컬에서 삭제한다.
// 형식: post 안의 메시지 형식은 다음 { image: <imageName> } 와 같다.
app.post('/docker/api/v1/img-delete/', async (req, res) => {
  const imageName = req.body.image;
  const docker = new Docker(/* { host: '127.0.0.1' } */);
  docker.getImage(imageName).remove((err, data) => {
    if (err) {
      console.log(err);
      res.status(400);
    } else {
      console.log(data);
      res.status(200);
    }
  });
});
('/stop', async (req, res) => {


});
// API: /docker/api/v1/img-delete-all (GET)
// 설명: GET 매서드를 이용하여 모든 이미지들을 삭제한다.
app.get('/docker/api/v1/img-delete-all/', async (req, res) => {
  exec('sudo docker rmi -f $(sudo docker images -q)', (err, stdout, stderr) => {
    if (err) {
      // 명령 시도 자체에 오류가 있을 경우.
      console.log(err);
      res.json(err);
    } else {
      // 콘솔에서 오류가 발생했을 경우.
      if (stderr) {
        console.log(stderr);
        res.json(stderr);
      } else {
        // 오류가 발생하지 않고 단순 처리 구문만 나왔을 경우.
        console.log(stdout);
        res.json(stdout);
      }
    }
  });
});

async function getRunningContainerCount() {
  try {
    const response = await docker.listContainers();
  const containerIDs = [];
  for (const containerObj of response) {
    containerIDs.push(containerObj.Id);
  }
  res.json(containerIDs.length)
  } catch (error) {
    console.error('Failed to get running container count:', error);
    throw error;
  }
}

app.get('/docker/api/v1/num-container', (req, res) => {
  docker.listContainers((err, containers) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Error occurred');
    } else {
      const containerCount = containers.length;
      res.json({ count: containerCount });
    }
  });
});

// CPU 상태를 반환하는 API 엔드포인트를 정의합니다.
app.get('/docker/api/v1/cpu-stats', (req, res) => {
  docker.info((err, info) => {
    if (err) {
      console.error('오류:', err);
      res.status(500).send('오류가 발생했습니다.');
    } else {
      const cpuStats = info.CPUsStats;
      res.json(cpuStats);
    }
  });
});

// 메모리 상태를 반환하는 API 엔드포인트를 정의합니다.
app.get('/docker/api/v1/memory-stats', (req, res) => {
  docker.info((err, info) => {
    if (err) {
      console.error('오류:', err);
      res.status(500).send('오류가 발생했습니다.');
    } else {
      const memoryStats = info.MemStats;
      res.json(memoryStats);
    }
  });
});

// API: /docker/api/v1/run (POST)
// 설명: POST 매서드를 이용하여 image와 path를 파싱하여 해당 path의 image를 run 하도록 수행.
// 형식: post 안의 메시지 형식은 다음 { image: <image name>, path : [ "bash", "-c", "uname -s"] .. (예시)) 와 같다.
app.post('/docker/api/v1/img-run/', async (req, res) => {
  const imageName = req.body.image;
  const pathArray = req.body.path;
  const containerName = req.body.name;

  const containerOptions = {
    name : containerName
  };

  docker.run(imageName, pathArray, process.stdout, containerOptions,(err, data, container) => {
    if (err) {
      res.json(err);
      console.log(err);
      res.status(400);
    } else {
      console.log(data);
      res.json(data);
      res.status(200);
    }
  });
});


// API: /docker/api/v1/stop (POST)
// 설명: POST 매서드를 이용하여 container name을 파싱하여 해당 컨테이너를 종료한다.
// 형식: post 안의 메시지 형식은 다음 { 'containerName' : <containerName> } 와 같다.
app.post('/docker/api/v1/stop/', async (req, res) => {
  try {
    // 클라이언트에서 전달된 데이터 추출
    const { containerName } = req.body;

    // 컨테이너 조회
    const container = await docker.getContainer(containerName);

    if (!container) {
      console.log(`컨테이너 ${containerName} 찾을 수 없음`);
      return res.status(404).send(`컨테이너 ${containerName} 찾을 수 없음`);
    }

    // 컨테이너 중지
    await container.stop();

    console.log(`컨테이너 ${containerName} 중지됨`);

    res.send(`컨테이너 ${containerName} 중지됨`);
  } catch (error) {
    console.error('오류 발생:', error);
    res.status(500).send('오류 발생');
  }
});

// API: /docker/api/v1/stop-all (POST)
// 설명: POST 매서드를 이용하여 로컬에서 실행중인 모든 도커 컨테이너를 종료한다.
// 관리자 권한을 필요로 함.
app.post('/docker/api/v1/stop-all/', async (req, res) => {
  exec('sudo docker stop $(sudo docker ps -a -q )');
});

// app.get('/docker/api/v1/server-status/', async (req,res) => {
//   const Response = { cpu : '', mem : '' };
//   exec('top -b -n 1 | grep "Cpu(s)" | awk {print $2} > ./cpu',(err,stdout, stderr) => {
//     fs.readFile('./cpu','utf8',(err,data) => {
//       if (err) {
//         console.log(err);
//         Response.cpu = err;
//       } else {
//         console.log(data);
//         Response.cpu = data;
//       }
//     })
//   });
//   exec('docker ps -a | grep ${ContainerName} > ./cpu',(err,stdout, stderr) => {
//     fs.readFile('./cpu','utf8',(err,data) => {
//       if (err) {
//         console.log(err);
//         Response.cpu = err;
//       } else {
//         console.log(data);
//         Response.cpu = data;
//       }
//     })
//   });
// });

app.get('/docker/api/v1/server-status/', async (req, res) => {
  try {
    const response = {};

    exec('top -b -n 1 | grep "Cpu(s)" | awk \'{print $2}\'', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        response.cpu = err;
      } else {
        const cpuUsage = parseFloat(stdout.trim());
        response.cpu = cpuUsage;
      }
    });

    exec('free | grep Mem', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        response.mem = err;
      } else {
        const memInfo = stdout.split(/\s+/);
        const totalMemory = parseFloat(memInfo[1]);
        const usedMemory = parseFloat(memInfo[2]);
        const memoryUsage = (usedMemory / totalMemory) * 100;
        response.mem = memoryUsage.toFixed(2);
      }
    });

    exec('docker ps -aq | wc -l', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        response.containerCount = err;
      } else {
        const containerCount = parseInt(stdout.trim());
        response.containerCount = containerCount;
      }
    });

    setTimeout(() => {
      res.json(response);
    }, 1000);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// API: /docker/api/v1/state/ (POST)
// 설명: POST 매서드를 이용, container-name을 파싱하여 해당 컨테이너의 상태를 json으로 send.
// 형식: 'container':<Container Name>
app.post('/docker/api/v1/state/', async (req, res) => {
  ContainerName = req.body.container;
  const Response = { PS: '', STATS: '' };
  exec(`sudo docker ps -a | grep ${ContainerName} > ./tmpPs`, (err, stdout, stderr) => {
    //exec('sudo chmod +wx ./tmpPs');
    fs.readFile('./tmpPs', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        Response.PS = err;
      } else {
        console.log(data);
        Response.PS = data;
      }
    });
  });
  exec(`sudo docker stats ${ContainerName} --no-stream > ./tmpStats`, (err, stdout, stderr) => {
    //exec('sudo chmod +wx ./tmpStats');
    fs.readFile('./tmpStats', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        Response.STATS = err;
      } else {
        console.log(data);
        Response.STATS = data;
      }
      console.log(Response);
      res.json(Response);
    });
  });
});


// API: /docker/api/v1/log/ (POST)
// 설명: POST 매서드를 이용, container-name을 파싱하여 해당 컨테이너의 로그를 json으로 send.
// 형식: 'container':<Container Name>, 반드시 슈퍼유저 권한을 획득하고 진행해야 함.
// 출력: 10줄만 출력
app.post('/docker/api/v1/log/', async (req, res) => {
  ContainerName = req.body.container;
  exec(`sudo tail -10 /var/lib/docker/containers/${ContainerName}*/${ContainerName}*-json.log`, (err, stdout, stderr) => {
    if (err) {
      res.json(err);
    } else {
      res.json(stdout);
    }
  });
});


// API: /docker/api/v1/up/ (POST)
// 설명: POST 매서드를 이용, path를 파싱하여 해당 경로에서 compose-up 수행.
// 형식: path:<Path-Name>, 반드시 슈퍼유저 권한을 획득하고 진행해야 함.
app.post('/docker/api/v1/up/', async (req, res) => {
  pathName = req.body.path;
  exec(`docker-compose p -d --build ${pathName}`, (err, stdout, stderr) => {
    if (err) {
      res.json(err);
    } else {
      res.json(stdout);
    }
  });
});


module.exports = {
  server,
  stopServer,
};

app.post("/api/users/register", async (req, res) => {
  // async : 비동기 처리를 위해 사용하는 키워드. function 앞에 붙이면
  //         해당 함수는 Promise 객체를 반환한다.
  // - Promise 객체는 .then(), .catch() 함수를 통해 작업하는 것 같은데 잘 모르겠다.
  // await : Promise 객체의 처리를 기다린다. 
  // - async 함수 안에서만 사용한다. 

  //회원가입시 필요 정보를 client에서 가져오면
  //데이터베이스에 삽입한다

  //body parser를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body);

  //mongoDB 메서드, user모델에 저장
  const result = await user.save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

app.post("/api/users/login", async (req, res) => {  

  // 1. 요청된 이메일이 데이터베이스에 있는지 찾음.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      // 데이터베이스에 없을 경우
      return res.json({
        loginSuccess: false,
        messeage: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // 2.요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      // 3. 비밀번호까지 맞다면 토큰을 부여
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 쿠키나 로컬 스토리지나,, 어디든 저장할 수 있다.
        // 어디더 저장해야 안전한지는 아직 말이 많다. 여기서는 쿠기에 하자.
        // 쿠키를 사용하기 위해서는 cookie-parser를 깔아야 한다.
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//#13. authentication 기능 구현 
// 인자로 auth가 들어간 것이 middle ware이다. 콜백 함수 전에
// 사전 작업을 취해준다.
// 여기서는 auth에서 인증처리를 해준다.
app.get('/api/users/auth', auth, async(req,res) => {

  // 여기까지 미들웨어를 통과해왔다는 것은 
  // Authentication이 True라는 말.
  // 이제 user 정보를 제공해주면 된다. 원하는 것을 선택해서,,

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, 
    // 이는 얼마든지 바꿀 수 있다. role 숫자에 따라 직분을 결정한다던지,,
    // role 1 어드민    role 2 특정 부서 어드민
    // role 0 일반유저   그 외에는 관리자 등등,,

    isAuth: true,
    email : req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

// #14 로그아웃 기능 구현
// 이미 로그인된 상태이기 때문에 auth를 넣어준다.
app.get('/api/users/logout',auth,async (req,res) => {
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""},
    (err,user)=> {
      if(err) return res.json({success:false,err});
      return res.status(200).send({
        success: true
      })
    })
})

app.get('/api/hello', (req,res)=> {
  res.send("/api/hello 로 전달 완료!")
})

const port = 5000;

// 해당 port로 요청이 들어오면 해당 log를 출력
app.listen(port, () => console.log(`Example app listening on port ${port}`));
