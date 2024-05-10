// 유효성 체크
function checkText(text) {
    const { email, password, username, confirmPassword } = text;
    if (email !== undefined) {
        const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
        if (email === "") {
            alert("이메일을 적어주세요!");
            return false;
        }
        if (!pattern.test(email)) {
            alert("이메일이 형식에 맞지 않습니다!");
            return false;
        }
    }
    if (password !== undefined) {
        const pattern = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (password === "") {
            alert("패스워드를 적어주세요!");
            return false;
        }
        if (!pattern.test(password)) {
            alert("패스워드는 특수 문자를 포함한 8자리 이상이어야 합니다!");
            return false;
        }
    }
    if (password !== undefined && confirmPassword !== undefined) {
        if (confirmPassword === "") {
            alert("패스워드 재입력칸이 비어있습니다!");
            return false;
        }
        if (password !== confirmPassword) {
            alert("입력된 패스워드가 서로 같지 않습니다!");
            return false;
        }
    }
    if (username !== undefined) {
        const pattern = /^[a-zA-Z가-힣0-9]+$/;
        if (username === "") {
            alert("사용자 이름을 적어주세요!");
            return false;
        }
        if (!pattern.test(username)) {
            alert("사용자 이름에는 특수문자를 포함 할 수 없습니다!");
            return false;
        }
    }
    return true;
}

// 데이터 전송 및 에러처리
async function sendRequest(URL, header) {
    try {
        const { Method, ContentType, BodyData, ResponseError } = header;
        const response = await fetch(URL, {
            method: Method,
            headers: {
                "Content-Type": (ContentType ? ContentType : "Multipart / related")
            },
            body: (BodyData ? BodyData : undefined)
        });

        // json 데이터가 존재하는지 확인하고 에러가 발생했다면 undefined
        const data = await response.json().catch(err => undefined);

        // 정상적인 응답이 아니며 data.message가 존재하는 경우
        if (!response.ok && data !== undefined && data.message !== undefined) {
            const { message } = data;
            alert(message);
        }
        // 정상적이 응답이 아니고 Error Code 400 미만인경우
        else if (!response.ok && response.status < 400) {
            throw new Error(ResponseError ? ResponseError : response.status);
        }
        // Error Code 400 이상인경우
        else if (!response.ok && response.status >= 400) {
            throw new Error(`${response.status} : 서버와 연결을 실패 하였습니다!`);
        }
        return { response, data };
    } catch (ErrorMessage) {
        console.log(ErrorMessage);
    }
}

