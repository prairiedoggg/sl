document.addEventListener("DOMContentLoaded", function() {
    // 회원가입 버튼 클릭 시 회원가입 페이지로 이동
    const registerButton = document.getElementById("register-button");
    registerButton.addEventListener("click", redirectToRegisterPage);
  
    // 로그인 폼 제출 시
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", handleLoginFormSubmit);
  });

  // 회원가입 페이지로 이동하는 함수
  function redirectToRegisterPage() {
    window.location.href = "register.html"; // 회원가입 페이지로 이동하는 주소로 변경
  }
  
  // 로그인 폼 제출 처리 함수
  function handleLoginFormSubmit(event) {
    event.preventDefault(); // 기본 제출 동작 방지
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // 서버로 보낼 데이터
    const data = {
      email: email,
      password: password
    };
  
    // 서버로 데이터를 전송하여 로그인 시도
    loginUser(data)
      .then(data => {
        // 로그인 성공 시 동작
        console.log("Login successful:", data);
        // 성공한 경우, 필요한 동작을 여기에 추가
      })
      .catch(error => {
        // 오류 발생 시 동작
        console.error("Error:", error);
        // 오류 처리를 여기에 추가
      });
  }
  
  // 서버에 로그인 요청을 보내는 함수
  function loginUser(data) {
    return fetch("server-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      });
  }
  