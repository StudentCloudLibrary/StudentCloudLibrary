// 여기에 user reducer를 다 치면 된다. 

import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

// 인자로 previous state와 action을 넣어주고
// 변경된 state를 리턴해줌
export default function Reducer(state = {}, action) {
    switch (action.type) {
      case LOGIN_USER:
        return { ...state, loginSuccess: action.payload };

      case REGISTER_USER:
        return { ...state, register: action.payload };

      case AUTH_USER:
        return { ...state, userData: action.payload };
        // 여기에 모든 user data가 들어있게 된다.
        // 백앤드 auth에서 그렇게 기능이 수행된다.
      default:
        return state;
    }
}
