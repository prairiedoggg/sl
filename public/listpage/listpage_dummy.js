createHeader({ text: "마이페이지", link: "/mypage" });

// 더미 데이터
const dummyData = [
    {
        name: 'Alice',
        email: 'alice@example.com',
        comment: '안녕하세요!',
        profilePictureUrl: 'https://example.com/profiles/alice.jpg' // 예시 URL
    },
    {
        name: 'Bob',
        email: 'bob@example.com',
        comment: '잘 부탁드립니다.',
        profilePictureUrl: 'https://example.com/profiles/bob.jpg' // 예시 URL
    },
    {
        name: 'Charlie',
        email: 'charlie@example.com',
        comment: '반갑습니다.',
        profilePictureUrl: 'https://example.com/profiles/charlie.jpg' // 예시 URL
    },
    {
        name: 'David',
        email: 'david@example.com',
        comment: '안녕하세요!',
        profilePictureUrl: 'https://example.com/profiles/david.jpg' // 예시 URL
    },
    {
        name: 'Emma',
        email: 'emma@example.com',
        comment: '잘 부탁드립니다.',
        profilePictureUrl: 'https://example.com/profiles/emma.jpg' // 예시 URL
    },
    {
        name: 'Frank',
        email: 'frank@example.com',
        comment: '반갑습니다.',
        profilePictureUrl: 'https://example.com/profiles/frank.jpg' // 예시 URL
    },
    {
        name: 'Grace',
        email: 'grace@example.com',
        comment: '안녕하세요!',
        profilePictureUrl: 'https://example.com/profiles/grace.jpg' // 예시 URL
    },
    {
        name: 'Henry',
        email: 'henry@example.com',
        comment: '잘 부탁드립니다.',
        profilePictureUrl: 'https://example.com/profiles/henry.jpg' // 예시 URL
    },
    {
        name: 'Isabella',
        email: 'isabella@example.com',
        comment: '반갑습니다.',
        profilePictureUrl: 'https://example.com/profiles/isabella.jpg' // 예시 URL
    },
    {
        name: 'Jack',
        email: 'jack@example.com',
        comment: '안녕하세요!',
        profilePictureUrl: 'https://example.com/profiles/jack.jpg' // 예시 URL
    },
];



const pageSize = 12; // 페이지당 프로필 수
let currentPage = 1; // 현재 페이지
let totalPages = Math.ceil(dummyData.length / pageSize); // 전체 페이지 수

// 프로필 카드를 생성하는 함수
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
    renderProfiles();
});

// 이전 페이지로 이동
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderProfiles();
    }
}

// 다음 페이지로 이동
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderProfiles();
    }
}

// 프로필 카드 렌더링
function renderProfiles() {
    const profileZone = document.getElementById('profileZone');
    profileZone.innerHTML = '';

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, dummyData.length);

    for (let i = startIndex; i < endIndex; i++) {
        const profileCard = createProfileCard(dummyData[i]);
        profileZone.appendChild(profileCard);
    }

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