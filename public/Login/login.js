// const form = document.getElementById("mainForm");

function check(email, password) {
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (email === "") {
        alert("이메일을 적어주세요!");
        return false;
    }
    if (!pattern.test(email)) {
        alert("이메일 혹은 비밀번호가 올바르지 않습니다!");
        return false;
    }
    if (password === "") {
        alert("비밀번호를 적어주세요!");
        return false;
    }
    if ((password.length < 8) || password.length > 16) {
        alert("이메일 혹은 비밀번호가 올바르지 않습니다!");
        return false;
    }
    return true;
}
// 통상적으로 이메일 비밀번호 틀리는 것은 뭘틀렸는지 안알려줌

async function onSubmitButton() {
    try {
        const email = document.getElementsByName("username")[0].value.trim();
        const password = document.getElementsByName("password")[0].value.trim();

        if (check(email, password)) return;

        const response = await fetch('/api/login', {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const { status } = response;
        const { message } = await response.json();

        console.log(response);
        if (status === 201) {
            location.href = '/';
        } else {
            alert(message);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


function moveRegisterPage() {
    location.href = "/register";
}
