document.addEventListener("DOMContentLoaded", function () {
    // 회원가입 버튼
    var submitButton = document.querySelector(".submit-button");

    // 회원가입 버튼을 클릭할 때 실행할 함수를 정의.
    async function handleRegistration() {
        // 각 입력 필드의 값 가져오기
        var email = document.getElementById("email").value.trim();
        var password = document.getElementById("password").value.trim();
        var confirmPassword = document
            .getElementById("confirm_password")
            .value.trim();
        var username = document.getElementById("name").value.trim();

        // 유효성 체크
        if (!checkText({ email, password, confirmPassword, username })) return;

        // 회원가입 요청
        const { response } = await sendRequest("/api/register", {
            Method: "POST",
            ContentType: "application/json",
            BodyData: JSON.stringify({
                email,
                password,
                confirmPassword,
                username,
            }),
        });
        // 회원가입을 성공하였다면
        if (response.ok) {
            alert("회원가입에 성공하셨습니다!");
            location.href = "/login";
        }
    }

    // 회원가입 버튼에 클릭 이벤트 리스너를 추가
    submitButton.addEventListener("click", handleRegistration);
});
