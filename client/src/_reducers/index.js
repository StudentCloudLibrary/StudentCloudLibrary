import { createSlice } from '@reduxjs/toolkit';
import user from './user_reducer';
// import comment from './comment_reducer';
// 각 기능에서 사용할 reducer들을 root reducer로 통합함.

const initialState = { value: 0 };

const rootReducer = createSlice({
    name: 'root',
    initialState,
    reducers: {
        user,
    // comment,
    
    // 기능이 추가될수록 계속 추가
    }
})


export default rootReducer;