const form = document.getElementById("mainForm");

function check(email, password) {
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (email === "") {
        alert("이메일을 적어주세요!");
        return true;
    }
    if (!pattern.test(email)) {
        alert("이메일 형식이 올바르지 않습니다!");
        return true;
    }
    if (password === "") {
        alert("비밀번호를 적어주세요!");
        return true;
    }
    if ((password.length < 8) || password.length > 16) {
        alert("비밀번호는 최소 8자리 최대 16자리 입니다!");
        return true;
    }
    return false;
}

async function onSubmitButton() {
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
    const { message } = await response.json().then(res => res);

    console.log(response);
    if (status === 201) {
        location.href = '/';
    } else {
        alert(message);
    }
}

function movePage() {
    location.href = "/register";
}