import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';

export default function authHOC(SpecificComponent, option, adminRoute = null) {

  // option
  // - null : 아무나 출입 가능한 페이지
  // - ture : 로그인한 유저만 출입이 가능한 페이지
  // - false : 로그인 한 유저는 출입이 불가능
  function AuthenticationCheck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // 로그인 하지 않은 상태
        // isAuth가 fail 일 경우
        if (!response.payload.isAuth) {
          if (option) {
            // 로그인을 하지 않았는데 option이 true인 경우
            // 로그인을 해야 한다.
            navigate("/login");
          } 
          // 로그인 x & option = false | null
          // 그냥 그대로 실행
        }
        else {  // 로그인 한 상태
            if (adminRoute && !response.payload.isAdmin) {
              navigate("/");
            } else {

                // 로그인을 했고, false인 경우
              if (option === false) navigate("/");
            }
        }
      });
    });

    return <SpecificComponent />;
  }

  return <AuthenticationCheck />;
}