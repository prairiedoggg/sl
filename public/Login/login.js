import { checkText, sendRequest } from '../utils/transferManager.js';

// 버튼 클릭 이벤트 설정
document.getElementById('login').addEventListener('click', onSubmitButton);
document.getElementById('register').addEventListener('click', movePage);

async function onSubmitButton() {
    const email = document.getElementsByName("username")[0].value.trim();
    const password = document.getElementsByName("password")[0].value.trim();
    // 유효성 체크
    if (!checkText({ email, password })) return;
    // 데이터 불러오기 및 에러처리
    const { response } = await sendRequest('/api/login', {
        Method: "POST",
        ContentType: "application/json",
        BodyData: JSON.stringify({ email, password })
    });
    // 성공적으로 불러왔다면 '/'경로로 이동
    if (response.ok) {
        location.href = '/';
    }
}

function movePage() {
    location.href = "/register";
}