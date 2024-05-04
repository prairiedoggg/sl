document.addEventListener("DOMContentLoaded", function() {
  // 회원가입 버튼
  const submitButton = document.querySelector(".submit-button");

  // 회원가입 버튼 클릭 시 실행될 함수
  submitButton.addEventListener("click", handleRegistration);
});
document.addEventListener("DOMContentLoaded", function() {
  // 로고 요소 가져오기
  const logo = document.querySelector(".logo");

  // 로고를 클릭할 때 실행될 함수
  logo.addEventListener("click", handleLogoClick);
});


// 회원가입 처리 함수
function handleRegistration() {
  // 각 입력 필드의 값 가져오기
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const name = document.getElementById("name").value;

  // 간단한 유효성 검사
  if (!validateInputs(email, password, confirmPassword, name)) {
    return;
  }

  // 회원가입 데이터를 JSON 형식으로 만들기
  const userData = {
    email: email,
    password: password,
    name: name
  };

  // 서버에 회원가입 데이터를 보내는 fetch 요청
  registerUser(userData);
}

// 입력값의 유효성을 검사하는 함수
function validateInputs(email, password, confirmPassword, name) {
  if (email === "" || password === "" || confirmPassword === "" || name === "") {
    alert("모든 필드를 채워주세요.");
    return false;
  }

  if (password.length <= 8) {
    alert("비밀번호는 8자리 이상으로 설정하세요.");
    return false;
  }

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return false;
  }

  return true;
}

// 서버에 회원가입 데이터를 보내는 함수
function registerUser(userData) {
  // 서버 엔드포인트 설정해야 함
  fetch('server_endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    return response.json();
  })
  .then(data => {
    // 서버 응답에 따른 처리
    console.log('Success:', data);
    alert("회원가입 되었습니다.");
    window.location.href = "login.html";
  })
  .catch(error => {
    console.error('Error:', error);
    alert("회원가입 중 오류가 발생했습니다.");
  });
}

// 로고 클릭 시 메인 페이지로 이동하는 함수
function handleLogoClick(event) {
  // 기본 동작 방지
  event.preventDefault();

  // 메인 페이지로 이동
  window.location.href = "login.html"; // 
}