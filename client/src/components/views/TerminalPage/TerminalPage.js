import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { connectContainer, stopContainer } from '../../../_actions/docker_action';

function TermianlPage() {
    const navigate = useNavigate();

    function onConnectHandler() {
        axios.get('/api/users/auth')
        .then(response => {
            let body = {
                "os": "ubuntu",
                "name": response.data.name
            }
            return connectContainer(body);
        });
    }

    function onListHandler () {

        axios.get('/api/users/auth')
        .then(response=>{
            let body = {
                "os" : "ubuntu",
                "name" : response.data.name
            }

            return stopContainer(body);
        })
        navigate("/serverRoom");
    };
    function onHelloHandler() {
        console.log("Hello!");

        return "good";
    }

    return (
        <div>
            <div>
                <button onClick={onListHandler}>목록으로 돌아가기</button>
            </div>
            <div>
                <button onClick={onConnectHandler}>서버 연결하기</button>
            </div>
        </div>
    )
}

export default TermianlPage