- 개발기간
    - 2024년 04월 29일 ~ 2024년 05월 10일

- 프로젝트 소개
    - Portfolio를 Share하는 서비스, Sharelio입니다.

- 개발 환경
    -JavaScript
    -Database : Mongo DB
    -ORM : Mongoose

- 주요 기능
    - 회원가입
        - 이메일, 유저네임 중복
        - 확인이메일 양식확인
        - 비밀번호 확인 로직 구현
        - 비밀번호 최소 길이 확인 로직 구현
    -   로그인
        - DB에 접근 로그인 후 유저 식별을 위해 JWT 토큰 채택
        - 로그인 시, 액세스 토큰, 리프레쉬 토큰을 동시에 생성해 토큰 탈취 시의 위험성 개선

- 마이페이지
    - 토큰을 통해 본인의 마이페이지만 접근 가능하도록 구현
    - 회원 자신의 프로필 사진과 코멘트 및, 학력, 자격증, 수상, 포트폴리오의 정보 열람, 수정 가능
    - 학력 CRUD
    - 자격증 CRUD
    - 수상 CRUD
    - 포트폴리오 CRUD

- 유저 리스트
    - mongo db의 skip, limit 쿼리를 이용, 페이지네이션 구현

- 유저 상세페이지
    - 유저 리스트에서 클릭하는 것으로 접근 가능
    - 해당 회원의 프로필 사진, 코멘트, 학력, 자격증, 수상, 포트폴리오의 정보 열람 가능

- 2024년 4월 29일 월요일 
        - erd 작성 - api 문서화 작성

- API 문서
    - [api 문서화](https://docs.google.com/spreadsheets/d/1LIZwSXOgF8M56g2NHNhycC_yPoY6cQymbahfsNI2N6c/edit#gid=0)

- ERD
    - [ERD](https://dbdiagram.io/d/662f85cb5b24a634d010eb34)

- 2024년 4월 30일 화요일
    (passport 사용하지 않고 구현)
    - 회원가입 구현
    - 로그인 구현
    - 로그인 시 jwt 토큰 구현
    - 더미 api 추가(오피스아워 코치님의 피드백으로 추가)

- 2024년 5월 1일 수요일
    - 가입 시 이메일, 이름 보이도록 구현
    - 비밀번호 8자 제한 구현
    - 프로필 사진 업로드, 수정 기능 구현
    - 학력 정보 추가, 수정 기능 구현
    - 오피스 아워 이후 많은 부분 수정할 것이 생김(api 간략화 및 파일 구조, 하지만 오히려 방향이 간단해진 부분도 있음)

- 2024년 5월 2일 목요일
    - education, certificate, portfolio, award mvp 구현
    - postman 사용하여 작동 확인
    - 기존 user/education/userId => /api/mypage/education/:education_id과 같이 path경로 수정 (path를 users/username 이런식으로 짜게 되면 누구나 수정, 추가, 삭제가 가능한것 처럼 보이는 것이 문제라는 코치님의 피드백)

- 2024년 5월 3일 금요일
    - crud 에러핸들링 및 리팩토링
        에러핸들링 구현하며 postman으로 테스트 해보는 과정에서 계속해서 에러 발생 => 매개변수 next를 추가하지 않아 생긴 것이었음
    - 회원가입 조건, 사용자 이름 특수문자 검증, 비밀번호 검증(특수 문자 포함), 이메일 형식 검증 추가

- 2024년 5월 4일 토요일

    - dev-back 브랜치로 합침

- 2024년 5월 6일 월요일
    - 이메일 중복확인 기능 구현
    - 불필요한 코드 삭제

- 2024년 5월 7일 화요일
    - 로그인, 회원가입 리팩토링 및 에러 수정
    - 토요일날 하지 못한 mr 받음

- 2024년 5월 8일 수요일
    - 학력정보에서 서로 주고 받는 데이터가 다른 것을 확인, 한 쪽에 맞추어서 변경을 해야하는데 잘 해결되지 않아 코치님에게 조언을 구해 학력 정보 관련해서 입력값 체크하던 함수 삭제
    - 로그인과 회원가입 기능 분리, 중복 로직 삭제(코치님 피드백 통해)
    - username 중복 방지 구현
    - dev-back-test 브랜치로 통합

- 2024년 5월 9일 목요일
    - error message 추가 (코드 스타일 통일 하라는 코치님의 피드백)

- 2024년 5월 10일 금요일 
    - 경로 때문에 프론트와 백 사이에서 에러 발생(폴더명은 대문자, 경로는 소문자였던게 원인이었던 것으로 추정됨) 
    - vm으로 api 작동 확인

- 추가기능
    - 페이지네이션
    - 이메일 중복 방지
    - 프로필 이미지 업로드

```
- 파일 구조 트리
📂 webProject
├─ 📂 middlewares
│  ├─ authBytoken.js
│  ├─ multerComfig.js
│  └─ errorHandler.js
├─ 📂 models
│  ├─ 📂 schemas
│  │  ├─ awardSchema.js
│  │  ├─ certificatesSchema.js
│  │  ├─ educationSchema.js
│  │  ├─ portfolioSchema.js
│  │  ├─ replySchema.js
│  │  └─ userSchema.js
│  └─ models.js
├─ 📂 public
│  ├─ 📂 components
│  │  ├─ header.css
│  │  └─ header.js
│  ├─ 📂 editpage
│  │  ├─ editpage.css
│  │  ├─ editpage.html
│  │  └─ editpage.js
│  ├─ 📂 img
│  │  ├─ Logo.png
│  │  └─ sharelioLogo.png
│  ├─ 📂 listpage
│  │  ├─ listpage.css
│  │  ├─ listpage.html
│  │  └─ listpage.js
│  ├─ 📂 login
│  │  ├─ login.css
│  │  ├─ login.html
│  │  └─ login.js
│  ├─ 📂 register
│  │  ├─ register.css
│  │  ├─ register.html
│  │  └─ register.js
│  ├─ 📂 userpage
│  │  ├─ userpage.css
│  │  ├─ userpage.html
│  │  └─ userpage.js
│  └─ 📂 util
│     └─ transferManager.js
├─ 📂 routes
│  ├─ awardRoutes.js
│  ├─ certRoutes.js
│  ├─ eduRoutes.js
│  ├─ loginRoutes.js
│  ├─ mypageRoutes.js
│  ├─ portfolioRoutes.js
│  ├─ registerRoutes.js
│  └─ userRoutes.js
├─ 📂 utils
│  ├─ error.js
│  └─ validation.js
└─ server.js
```
