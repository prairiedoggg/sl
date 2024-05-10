// 버튼 클릭 이벤트 설정
document.getElementById('login').addEventListener('click', onSubmitButton);
document.getElementById('register').addEventListener('click', movePage);

document.getElementsByName('username')[0].addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        onSubmitButton();
    }
});
document.getElementsByName('password')[0].addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        onSubmitButton();
    }
});

// 로그인
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
        location.href = '../listpage/listpage.html';
    }
}

// 회원가입 페이지로 이동
function movePage() {
    location.href = "../register/register.html";
}