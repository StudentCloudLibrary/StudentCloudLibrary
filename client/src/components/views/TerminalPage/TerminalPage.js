import React, {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TermianlPage() {
    const navigate = useNavigate();
    function onListHandler () {
        navigate("/serverRoom");
    };

    return (
        <div>
            <button onClick={onListHandler}>목록으로 돌아가기</button>
        </div>
    )
}

export default TermianlPage