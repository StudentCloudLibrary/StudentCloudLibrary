import React, { useState } from "react";
import {useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import {useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import './RegisterPage.css';

function RegisterPage(props) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 화면에서 글자가 쳐지고,, 하는 것들이 모두 이 안에서
  // 변화가 일어나는 것들이므로 state를 사용해서 값을 바꿔준다.
  // useState의 인자는 초기값이다.
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  // event로 state가 전달된다.
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };
  
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    // page가 refresh되지 않도록
    // refresh가 되면 입력받은 뒤에 해야하는 일들을 하지 못한다.
    event.preventDefault();

    console.log("Email", Email);
    console.log("Password", Password);
    console.log("Name",Name);
    console.log("ConfirmPasswrd",ConfirmPassword);

    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.');
    }

    let body = {
      email: Email,
      name: Name,
      password: Password,
    };

    // dispatch를 이용해서 Action을 취함.
    dispatch(registerUser(body))
      .then((response) => {
        if (response.payload.success) {
          navigate("/login");
        } else {
          alert("Failed to sign up");
        }
    });
  };
  const onLoginHandler = () => {
    navigate("/login");
};

  return (
    <div
      style={{
      }}
    >
      <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        background:"#28CC9E",
        color: "white",
        position: "sticky",
        top: 0,
      }}>
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
            <li id="name">사용자 이름</li>
            <li>
                <img src="https://i.pinimg.com/564x/7a/c4/ed/7ac4edd64a67fccd0e2d547a9ffde845.jpg" id="profile-img"
                    alt="profile"></img>
            </li>
        </ul>
    </header>
      <form
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
         }}
        // submit이 되면 handler가 실행된다.
        onSubmit={onSubmitHandler}
      >
        {/* 각 state를 value로 넣어줌*/}
        {/* 타이핑을 칠 때 onChange를  발생시켜서
         * 해당 state가 변화되도록 한다. */}
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type="name" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />

        <br />
        <div
          style={{
            display:"flex",
            gap:"30px"
          }}>
          <button type="submit">회원가입</button>
          <button onClick={onLoginHandler}>로그인</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
