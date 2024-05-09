//여기에 받아와야 할 것들은 뭐가 있을까
// 이미지, 이름, 이메일, 자기소개
// 학력정보, 자격증, 수상이력, 포트폴리오에 관한 정보
// -> json으로 받아와서 -> 넣어주기
//
//
//예시 데이터 (스키마 안보고 대충 만든거입니다)
const userData = {
  image: "user.jpg",
  name: "앨리스",
  email: "elice@naver.com",
  intro:
    "안녕하세요 프론트엔드 / 백엔드를 담당하고 있는 만능인재 엘리스라고 합니다",
  education: [
    {
      degree: "학위",
      major: "전공",
      university: "학교",
      duration: "기간",
    },
    // 추가 학력 정보를 필요한 만큼 추가
  ],
  awards: [
    {
      name: "수상명",
      organization: "기관/기업명",
      date: "수상일자",
    },
    // 추가 수상 이력 정보를 필요한 만큼 추가
  ],
  certifications: [
    {
      name: "자격증명",
      issuer: "발행 기관",
      date: "취득일자",
    },
    // 추가 자격증 정보를 필요한 만큼 추가
  ],
  // 추가 포트폴리오 정보를 필요한 만큼 추가
};
//한번만 받아올거라 비동기 처리 필요없어보임? 논의 필요
// AWS에서 이미지 가져오기
fetch("/aws_image_url_endpoint") // AWS 이미지 사용자 url (회원 id별로 다르게 가져와야함).
    .then((response) => response.json())
    .then((imageData) => {
      // 이미지 설정
      document.querySelector(
        ".profile-image"
      ).style.backgroundImage = `url(${imageData.imageUrl})`;
    })
    .catch((error) => console.error("AWS Error:", error));
// MongoDB에서 사용자 데이터 가져오기
fetch("/mongodb_user_data") // MongoDB 사용자 url (회원 id별로 다르게 가져와야함).
    .then((response) => response.json())
    .then((userData) => {
      // 데이터 출력
      console.log(userData);

      // 이름 설정
      document.querySelector("h1").textContent = userData.name;

      // 이메일 설정
      document.querySelector("p:nth-of-type(1)").textContent = userData.email;

      // 자기 소개 설정
      document.querySelector("p:nth-of-type(2)").textContent =
        userData.introduction;
    })
    .catch((error) => console.error("MongoDB Error:", error));