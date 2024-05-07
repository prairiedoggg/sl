// DOMContentLoaded 이벤트가 발생했을 때 실행되는 함수
document.addEventListener('DOMContentLoaded', function () {
    // 모든 '추가' 버튼에 대해 이벤트 리스너 등록
    document.querySelectorAll('.add-btn').forEach(function (button) {
        button.addEventListener('click', handleAddButtonClick);
    });
});

// '추가' 버튼 클릭 시 실행되는 함수
function handleAddButtonClick() {
    // 해당 버튼이 속한 섹션과 입력 필드를 가져옴
    // section 부분 고민중
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
