import './ServerRoomPage.css';
import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { startContainer } from '../../../_actions/docker_action';

function ServerRoomPage(props) {
  const navigate = useNavigate();
  function onLoginClickHandler() {
    navigate('/login');
    console.log('로그인 페이지로 이동');
  }
  function onLogoutClickHandler() {
    axios.get('/api/users/logout')
      .then(response => {
        if (response.data.success) {
          navigate("/login");
        } else {
          alert("Fail to logout.");
        }
        console.log(response.data);
      });
  }
  function onLandingHandler() {
          navigate("/");
      };
  function onUbuntuServerHandler () {
    axios.get('/api/users/auth')
    .then(response => {

    let body = {
      "os" : "ubuntu",
      "name" : response.data.name
    }
    console.log(JSON.stringify(body));
    startContainer(body);
  });
    navigate("/terminal");
  };
  function onCentosServerHandler () {
    axios.get('/api/users/auth')
    .then((response) => {
      let body = {
        "os" : "centos",
        "name" : response.name
      }
  
      startContainer(body);
    });

    navigate("/terminal");
  };
  return (
    <div>
        <header

        style={{
          display: "flex",
          justifyContent: "space-between",
          background:"#28CC9E",
          color: "white",
          position: "sticky",
          top: 0,
        }}
        >
        <ul className="header-ul">
          <li id="logo">
            <a href="https://github.com/StudentCloudLibrary/StudentCloudLibrary//">
              <img style={{height: "70px", objectFit: "fill", }} src="image/test.png" alt="Soongsil University" />
            </a>
          </li>
          <li><a style={{display: "block", color: "white"}}>Ubuntu</a></li>
        </ul> 
        <ul className="header-CentOS">
          <li><a style={{display: "block", color: "white"}}>CentOS</a></li>
        </ul>

        <ul class="header-ul">
          {
            1 === 1 // 로그인시 로그인, 아니면 로그아웃
            ? <button onClick={onLoginClickHandler}>로그인</button>
            : <button onClick={onLogoutClickHandler}>로그아웃</button>
          }
          <button onClick={onLandingHandler}>사용량 보기</button>
            <li id="name">로그인 이름 넣어주세요</li>
            <li>
                <img src="https://i.pinimg.com/564x/7a/c4/ed/7ac4edd64a67fccd0e2d547a9ffde845.jpg" id="profile-img"
                    alt="profile"></img>
            </li>
        </ul>
    </header>
      <ul id ="first_line"
      style={{
        position: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
      }}>
        <div id = "server1"  className='didiv'>
          Ubuntu
          <div id = "server1_1" onClick={onUbuntuServerHandler} 
            style={{
              osition: "relative", 
              backgroundColor: "white", 
              width: "100%",
              height: "80%",
              opacity:"0.9",
            }}>
          </div>
        </div>
        <div id = "server2" onClick={onCentosServerHandler} className='didiv'>
          CentOS
          <div id = "server2_1" onClick={onCentosServerHandler} 
            style={{
              osition: "relative", 
              backgroundColor: "white", 
              width: "100%",
              height: "80%",
              opacity:"0.9",
            }}>
          </div>
        </div>
      </ul>
    </div>
  );
}

export default ServerRoomPage;