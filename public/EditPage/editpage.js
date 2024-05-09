createHeader({ text: "둘러보기", link: "/" });

// edit 버튼 클릭 시 editMode 함수 호출
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.profile-edit-btn').addEventListener('click', editMode);
});

// 프로필 소개란 editMode 함수 정의
function editMode() {
    const profileDetails = document.querySelector('.profile-details');
    const introductionInput = profileDetails.querySelector('.introduction');
    const introduction = profileDetails.querySelector('div')

    if (introductionInput.style.display === 'none') {
        // input과 edit 버튼이 감춰진 상태이므로 보이도록 변경
        introductionInput.style.display = 'block';
        this.textContent = 'edit'; // 버튼 텍스트를 'edit'로 변경
        introduction.textContent = '';
    } else {
        // input과 edit 버튼이 보이는 상태이므로 감추고 텍스트를 업데이트한 후 input에 적힌 텍스트를 h1 요소에 반영
        if (handleDataButtonClick('comments', { comments: introductionInput.value }, "PATCH")) {
            introductionInput.style.display = 'none';
            this.textContent = 'save'; // 버튼 텍스트를 'save'로 변경
            introduction.textContent = introductionInput.value;
        }
    }
}

// 이미지를 업로드하고 input 요소가 변경될 때 호출되는 함수
function loadProfileImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        // 파일을 읽은 후 실행되는 콜백 함수
        reader.onload = async function (e) {
            const response = fetch('/api/mypage/profile-picture', {
                method: "PATCH",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: {
                    "profilePictureUrl": e.target.result
                }
            })
        };

        // 파일을 읽음
        reader.readAsDataURL(input.files[0]);
    }
}

// '추가' 또는 '수정' 버튼 클릭 시 실행되는 함수
async function handleDataButtonClick(sectionClassName, requestData, method) {
    // POST 또는 PUT 요청 보내기
    const { response } = await sendRequest(`/api/mypage/${sectionClassName}`, {
        Method: method,
        ContentType: 'application/json',
        BodyData: JSON.stringify(requestData),
        ResponseError: "데이터 처리 중 오류가 발생했습니다."
    });

    if (!response.ok) {
        return false;
    }
    alert("요청을 성공적으로 처리하였습니다!");
    return true;
}

// '추가' 버튼 클릭 시 실행되는 함수
function handleAddButtonClick() {
    // 해당 버튼이 속한 섹션과 입력 필드 가져오기
    const section = this.closest('.section');
    const inputs = section.querySelectorAll('input');

    // 입력 필드가 모두 채워져 있는지 확인
    if (!areAllFieldsFilled(inputs)) {
        alert('모든 입력 필드를 채워주세요.');
        return;
    }

    // 필요한 데이터 추출
    const requestData = {};
    inputs.forEach(input => {
        requestData[input.name] = input.value;
    });



    // POST 요청 보내기
    if (handleDataButtonClick(section.classList[1], requestData, 'POST')) {
        location.reload();
    }
}

// 모든 입력 필드가 채워져 있는지 확인하는 함수
function areAllFieldsFilled(fields) {
    let allFilled = true;
    fields.forEach(function (field) {
        if (field.value.trim() === '') {
            allFilled = false;
        }
    });
    return allFilled;
}

function elementRemove(li) {
    if (handleDataButtonClick(`${li.classList[0]}/${li.id}`, undefined, "DELETE")) {
        li.remove();
    }
}

// 수정 버튼을 눌렀을 때
function retouch(li) {
    const spans = li.querySelectorAll('span');
    const inputs = li.closest(`div`).querySelector('.inputs').querySelectorAll('input');
    const request = document.createElement('button');
    const cancell = document.createElement('button');

    request.innerText = "수정";
    cancell.innerText = "취소";

    const datas = {};
    const placeholders = {};

    spans.forEach(spanE => { datas[spanE.id] = spanE.textContent });
    inputs.forEach(inputE => { placeholders[inputE.name] = inputE.placeholder });
    li.innerHTML = "";

    for (const key in datas) {
        const createInput = document.createElement("input");
        createInput.name = key;
        createInput.value = datas[key];
        createInput.placeholder = placeholders[key];
        li.appendChild(createInput);
    }

    request.onclick = () => {
        let retouchData = {};
        const inputData = li.querySelectorAll('input');
        inputData.forEach(inputE => { retouchData[inputE.name] = inputE.value });
        if (handleDataButtonClick(`${li.classList[0]}/${li.id}`, retouchData, "PATCH")) {
            li.innerHTML = '';
            let html = '';
            let retouchKeys = Object.keys(retouchData);
            let endKey = retouchKeys[retouchKeys.length - 1];
            for (const data in retouchData) {
                if (data === endKey) {
                    html += `<span id="${data}">${retouchData[data]}</span>`;
                } else {
                    html += `<span id="${data}">${retouchData[data]}</span>, `;
                }
            }
            li.innerHTML = html;

            const retouchButton = document.createElement('button');
            const removeButton = document.createElement('button');

            retouchButton.innerText = "수정";
            removeButton.innerHTML = "삭제";

            retouchButton.onclick = () => retouch(li);
            removeButton.onclick = () => elementRemove(li);

            li.appendChild(retouchButton);
            li.appendChild(removeButton);
        }
    }
    cancell.onclick = () => {
        let retouchData = {};
        const inputData = li.querySelectorAll('input');
        const keys = Object.keys(inputData);
        const end = inputData[keys.length - 1];
        li.innerHTML = '';
        for (const input of inputData) {
            if (input === end) {
                li.innerHTML += `<span id="${input.name}">${input.value}</span>`;
            } else {
                li.innerHTML += `<span id="${input.name}">${input.value}</span>, `;
            }
        }
        const retouchButton = document.createElement('button');
        const removeButton = document.createElement('button');

        retouchButton.innerText = "수정";
        removeButton.innerHTML = "삭제";

        retouchButton.onclick = () => retouch(li);
        removeButton.onclick = () => elementRemove(li);

        li.appendChild(retouchButton);
        li.appendChild(removeButton);
    }

    li.appendChild(request);
    li.appendChild(cancell);
    // handleDataButtonClick(`${li.classList[0]}/${li.id}`, sendData, "PATCH");
}

// 정보를 불러옴
document.addEventListener('DOMContentLoaded', async () => {
    const { data } = await sendRequest('/api/mypage', {
        Method: "GET"
    });
    const { education, award, certificate, portfolioUrl, username, email, comments, profilePictureUrl } = data;
    const fieldData = { education, award, certificate, portfolio: portfolioUrl };
    document.querySelector('.portfolio-section span').innerText = username;
    document.querySelector('.profile-details h1').innerText = username;
    document.querySelector('.profile-details p').innerText = email;
    document.querySelector('.introduction').value = comments;
    document.querySelector('.profile-image').style.backgroundImage = `url(${profilePictureUrl})`;
    for (const key in fieldData) {
        const ul = document.querySelector(`.${key} ul`);
        // 불러온 데이터를 가지고 li 생성
        fieldData[key].forEach(data => {
            const li = document.createElement('li');
            li.id = data._id;
            li.className = key;
            const retouchButton = document.createElement('button');
            const removeButton = document.createElement('button');
            removeButton.innerText = "삭제";
            retouchButton.innerText = "수정";
            retouchButton.onclick = () => retouch(li);
            removeButton.onclick = () => elementRemove(li);
            if (key === 'education') {
                li.innerHTML = `<span id="schoolName">${data.schoolName}</span>, <span id="fieldOfStudy">${data.fieldOfStudy}</span>, <span id="degree">${data.degree}</span>`;
                li.appendChild(retouchButton);
                li.appendChild(removeButton);
            } else {
                delete data.user;
                delete data.__v;
                li.innerHTML = `<span id="${Object.keys(data)[1]}">${Object.values(data)[1]}</span>`;
                li.appendChild(retouchButton);
                li.appendChild(removeButton);
            }
            ul.appendChild(li);
        });
    }
});

// 모든 '추가' 또는 '수정' 버튼에 대해 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-btn').forEach(function (button) {
        button.addEventListener('click', handleAddButtonClick);
    });
    document.querySelectorAll('.edit-btn').forEach(function (button) {
        button.addEventListener('click', handleEditButtonClick);
    });
});