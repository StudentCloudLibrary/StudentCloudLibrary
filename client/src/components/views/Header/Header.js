import React from 'react'
import './App.css';
import React, {Header, useState} from 'react'

function Header() {
    return (
    <div>
        <ul class="header-ul">
            <li id="logo">
                <a href="https://ssu.ac.kr/">
                    <img src="image/test.png" />
                </a>
            </li>
            <li><a>숭실대학교</a></li>
            <li><a>서버</a></li>
            <li><a>대여 시스템</a></li>
            <li id="vertical-line">|</li>
            <li><a>NDI</a></li>
        </ul>

        <ul class="header-ul">
            <li id="name">이름</li>
            <li>
                <img src="https://i.pinimg.com/564x/7a/c4/ed/7ac4edd64a67fccd0e2d547a9ffde845.jpg" id="profile-img"
                    alt="profile"></img>
            </li>
        </ul>
    </div>
)
}

export default Header