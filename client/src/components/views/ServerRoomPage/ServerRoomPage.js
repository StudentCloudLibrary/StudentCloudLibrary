import './ServerRoomPage.css';
import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  function onServerHandler () {
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
            <a href="https://www.leagueoflegends.com/ko-kr//">
              <img style={{ height: '70px'}} src="image/test.png" alt="Soongsil University" />
            </a>
          </li>
          <li><a>숭실대 제발 망해라</a></li>
          <li id="vertical-line">|</li>
          <li><a>김민욱</a></li>
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
        <div id = "server1" onClick={onServerHandler} className='didiv'> Ubntu </div>
        <div id = "server2" onClick={onServerHandler} className='didiv'></div>
      </ul>
    </div>
  );
}

export default ServerRoomPage;