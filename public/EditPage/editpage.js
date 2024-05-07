document.addEventListener('DOMContentLoaded', async function () {
    // 사용자 정보를 가져옴
    const userInfo = await getUserInfo();
    // 사용자 정보를 해당 섹션에 채움
    if (userInfo) {
        fillUserInfo(userInfo);
    }
    // 모든 '추가' 버튼에 대해 이벤트 리스너 등록
    document.querySelectorAll('.add-btn').forEach(function (button) {
        button.addEventListener('click', handleAddButtonClick);
    });
});

// '추가' 버튼 클릭 시 실행되는 함수
function handleAddButtonClick() {
    // 해당 버튼이 속한 섹션과 입력 필드를 가져옴
    const section = this.closest('.section');
    const inputsContainer = section.querySelector('.inputs');
    const inputFields = inputsContainer.querySelectorAll('input');

    // 입력 필드가 모두 채워져 있는지 확인
    if (!areAllFieldsFilled(inputFields)) {
        alert('모든 입력 필드를 채워주세요.');
        return;
    }

    // 입력 필드에 입력된 내용을 가져와서 리스트 아이템으로 추가
    const newItemContent = getInputFieldsContent(inputFields);
    const newItem = createListItem(newItemContent);
    attachEditButtonListener(newItem);
    attachListItem(section, newItem);
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

// 입력 필드에 입력된 내용을 가져오는 함수
function getInputFieldsContent(fields) {
    let content = '';
    fields.forEach(function (field) {
        content += `<span>${field.value}</span>`;
        field.value = '';
    });
    return content;
}

// 새로운 리스트 아이템을 생성하는 함수
function createListItem(content) {
    const newItem = document.createElement('li');
    newItem.innerHTML = content + '<button class="edit-button">edit</button>';
    return newItem;
}

// 수정 버튼에 대한 이벤트 리스너를 추가하는 함수
function attachEditButtonListener(item) {
    const editButton = item.querySelector('.edit-button');
    editButton.addEventListener('click', handleEditButtonClick);
}

// 'edit' 버튼 클릭 시 실행되는 함수
function handleEditButtonClick() {
    const item = this.parentNode;
    const inputs = item.querySelectorAll('span');

    // 각 입력 필드를 텍스트 입력 상자로 변경하고 수정 가능하도록 설정
    inputs.forEach(function (span) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        span.parentNode.replaceChild(input, span);
        input.focus();
        input.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                span.textContent = input.value;
            }
        });
    });

    // 완료 버튼 생성 및 이벤트 리스너 등록
    const completeButton = createCompleteButton();
    completeButton.addEventListener('click', handleCompleteButtonClick);

    // 완료 버튼 추가 및 'edit' 버튼 제거
    item.appendChild(completeButton);
    item.removeChild(item.querySelector('.edit-button'));
}

// '완료' 버튼을 생성하는 함수
function createCompleteButton() {
    const completeButton = document.createElement('button');
    completeButton.textContent = '완료';
    return completeButton;
}

// '완료' 버튼 클릭 시 실행되는 함수
function handleCompleteButtonClick() {
    const item = this.parentNode;
    const inputs = item.querySelectorAll('input');

    // 텍스트 입력 상자를 span 요소로 변경하여 수정된 내용을 반영
    inputs.forEach(function (input) {
        const newSpan = document.createElement('span');
        newSpan.textContent = input.value;
        input.parentNode.replaceChild(newSpan, input);
    });

    // 'edit' 버튼 다시 추가 및 '완료' 버튼 제거
    const editButton = createEditButton();
    editButton.addEventListener('click', handleEditButtonClick);
    item.appendChild(editButton);
    item.removeChild(item.querySelector('button'));
}

// 'edit' 버튼을 생성하는 함수
function createEditButton() {
    const editButton = document.createElement('button');
    editButton.textContent = 'edit';
    editButton.className = 'edit-button';
    return editButton;
}

// 리스트 아이템을 섹션에 추가하는 함수
function attachListItem(section, item) {
    section.querySelector('ul').appendChild(item);
}
//mongoDB에서 사용자의 info 가져오기
async function getUserInfo() {
    try {
        const response = await fetch('/api/user'); //주소 수정필요
        if (!response.ok) {
            throw new Error('Failed to fetch user information');
        }
        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('An error occurred while fetching user information:', error);
        // 오류 처리
        return null;
    }
}

// 사용자 정보를 채우는 함수
function fillUserInfo(userInfo) {
    const userNamePlaceholder = document.getElementById('user-name-placeholder');
    const userEmailPlaceholder = document.getElementById('user-email-placeholder');
    userNamePlaceholder.textContent = userInfo.name;
    userEmailPlaceholder.textContent = userInfo.email;
    // 프로필 이미지
    if (userInfo.profileImage) {
        const profileImageContainer = document.querySelector('.profile-image');
        const img = document.createElement('img');
        img.src = userInfo.profileImage; // 이미지 URL을 설정.
        img.alt = '프로필 이미지';
        profileImageContainer.innerHTML = ''; // 이미지 컨테이너 내용 초기화
        profileImageContainer.appendChild(img); // 이미지를 컨테이너에 추가합니다.
    }
    document.getElementById('education-info').textContent = userInfo.education;
    document.getElementById('awards-info').textContent = userInfo.awards;
    document.getElementById('certifications-info').textContent = userInfo.certifications;
    document.getElementById('portfolio-info').textContent = userInfo.portfolio;
    // 필요한 사용자 정보가 더 있으면 추가하세요.
}
// '완료' 버튼 클릭 시 실행되는 함수
async function handleCompleteButtonClick() {
    const item = this.parentNode;
    const inputs = item.querySelectorAll('input');

    const updatedUserInfo = {};
    // 수정된 내용을 객체에 저장
    inputs.forEach(function (input) {
        const fieldName = input.getAttribute('data-field');
        updatedUserInfo[fieldName] = input.value;
    });

    try {
        // MongoDB로 수정된 사용자 정보 전송
        await updateUserInfo(updatedUserInfo);
        // 사용자 페이지로 이동
        redirectToUserPage();
    } catch (error) {
        console.error('An error occurred while updating user information:', error);
        // 오류 처리
    }
}

// MongoDB에 사용자 정보를 업데이트하는 함수
async function updateUserInfo(updatedUserInfo) {
    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUserInfo)
        });
        if (!response.ok) {
            throw new Error('Failed to update user information');
        }
        // 성공적으로 업데이트된 경우 아무런 처리 없이 반환
    } catch (error) {
        throw new Error(error.message);
    }
}

// 사용자 페이지로 이동하는 함수
function redirectToUserPage() {
    window.location.href = '/userpage'; // 사용자 페이지 URL로 변경
}
