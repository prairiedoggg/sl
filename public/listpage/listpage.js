createHeader({ text: "둘러보기", link: "../listpage/listpage.html" });

const pageSize = 12; // 페이지당 프로필 수
let currentPage = 1; // 현재 페이지
let totalPages = 1; // 전체 페이지 수 초기값 설정

// 프로필 카드를 생성하는 함수
function createProfileCard(profile) {
    const profileCard = document.createElement('div');
    profileCard.classList.add('profile_card');
    
    const profileImage = document.createElement('div');
    profileImage.classList.add('profile_image');
    profileImage.style.backgroundImage = `url('${profile.profilePictureUrl}')`; // 프로필 이미지 설정

    const profileText = document.createElement('div');
    profileText.classList.add('profile_text');

    const name = document.createElement('div');
    name.classList.add('name');
    name.textContent = profile.username;

    const mail = document.createElement('div');
    mail.classList.add('mail');
    mail.textContent = profile.email;

    const comment = document.createElement('div');
    comment.classList.add('comment');
    comment.textContent = profile.comments;

    // 프로필 카드를 클릭하면 해당 사용자의 프로필을 보여주는 페이지로 이동하는 링크 추가
    profileCard.addEventListener('click', () => {
        window.location.href = `/showuser?username=${profile.username}`; // 프로필을 보여주는 페이지로 이동
    });

    profileText.appendChild(name);
    profileText.appendChild(mail);
    profileText.appendChild(comment);

    profileCard.appendChild(profileImage);
    profileCard.appendChild(profileText);

    return profileCard;
}


// 페이지 로드 시 프로필 데이터를 가져와서 프로필 카드를 추가
document.addEventListener('DOMContentLoaded', () => {
    fetchProfiles(currentPage);
});

// 서버로부터 프로필 데이터를 가져오는 함수
async function fetchProfiles(page) {
    try {
        const response = await fetch(`/api/profiles?page=${page}`); // 서버에서 데이터를 가져오는 API 엔드포인트
        if (!response.ok) {
            throw new Error('서버로부터 데이터를 가져오는 데 실패했습니다.');
        }
        const { currentPage, totalPages, profiles } = await response.json();
        currentPage = currentPage;
        totalPages = totalPages;

        renderProfiles(profiles);
    } catch (error) {
        console.error(error);
    }
}

// 이전 페이지로 이동
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchProfiles(currentPage);
    }
}

// 다음 페이지로 이동
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchProfiles(currentPage);
    }
}

// 프로필 카드 렌더링
function renderProfiles(profiles) {
    const profileZone = document.getElementById('profileZone');
    profileZone.innerHTML = '';

    profiles.forEach(profile => {
        const profileCard = createProfileCard(profile);
        profileZone.appendChild(profileCard);
    });

    updatePagination();
}

// 페이지네이션 업데이트
function updatePagination() {
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// 이전 페이지 버튼에 이벤트 리스너 추가
document.getElementById('prevButton').addEventListener('click', prevPage);

// 다음 페이지 버튼에 이벤트 리스너 추가
document.getElementById('nextButton').addEventListener('click', nextPage);
