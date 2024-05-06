document.addEventListener("DOMContentLoaded", function () {
  // 회원가입 버튼
  var submitButton = document.querySelector(".submit-button");

  // 회원가입 버튼을 클릭할 때 실행할 함수를 정의.
  async function handleRegistration() {
    // 각 입력 필드의 값 가져오기
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var confirmPassword = document.getElementById("confirm_password").value.trim();
    var username = document.getElementById("name").value.trim();

    if (email === "" || password === "" || confirmPassword !== password || username === "") {
      alert("데이터가 모두 입력되지 않았거나 비밀번호가 일치하지 않습니다!");
      return;
    }

    // 회원가입 요청
    const response = await fetch('/api/register', {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        username
      })
    });

    const { status } = response;
    const { message } = await response.json().then(res => res);

    // 회원가입을 성공하였다면
    if (status === 201) {
      alert(message);
      location.href = '/login';
    } else {
      alert(message);
    }
  }

  // 회원가입 버튼에 클릭 이벤트 리스너를 추가
  submitButton.addEventListener("click", handleRegistration);
});
