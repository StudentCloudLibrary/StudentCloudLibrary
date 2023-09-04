# Node.js 강의 실습 자료

## 1. boiler-plate
자주 쓸 수 있는 템플릿같은 개념.

## 2. NODE JS, EXPRESS JS 다운로드
js는 원래 웹 안에서만 사용했는데, NODE JS 가 나옴으로서 서버 환경으로도 NODE JS를 사용할 수 있게 되었음. 



### URI 암호화
github에서도 환경변수 설정을 해줄 수 있다.
![image](https://user-images.githubusercontent.com/81542290/231735848-47119e60-01f0-4d1b-9204-f06f8caf5d5d.png)



## 14. 로그아웃 기능
1. 로그아웃 Rount 만들기
2. 로그아웃하려는 유저를 데이터베이스에 찾아서 
3. 해당 유저의 토큰(in DB)을 지워줘야 함. 

auth 기능 만들 때, 인증하는데 있어서 client의 쿠키에서 토큰을 가져와서 서버에서 동일한지 확인했다. 
만약 서버 안에 Token이 없으면 인증이 안되기 때문에 login 기능이 풀려버린다.
- 클라이언트의 토큰은 남기고, 서버의 토큰만 지워준다.
