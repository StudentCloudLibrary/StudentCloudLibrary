import React from "react";
import {
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import ServerRoomPage from "./components/views/ServerRoomPage/ServerRoomPage";
import TerminalPage from "./components/views/TerminalPage/TerminalPage";
import Auth from "./hoc/auth";

function App() {
  return (
      <div>
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Routes>
          <Route exact path="/" element={Auth(LandingPage,null)}/>
          <Route exact path="/login" element={Auth(LoginPage,false)}/>
          <Route exact path="/register" element={Auth(RegisterPage,false)}/>
          <Route exact path="/serverRoom" element={Auth(ServerRoomPage,true)}/>
          <Route exact path="/terminal" element={Auth(TerminalPage,true)}/>
          {/* 해당 path에서 다음 메소드가 실행되도록*/ }
        </Routes>
      </div>
  );
}

export default App;