// 프로필을 그려 넣어줄 요소
const profileZone = document.getElementById('profileZone');

// 마지막 요소 (버퍼링 포함)
const end = document.getElementById('end');

// 현재 페이지
let data = {
    Page: 0,
};


// 마이프로필 페이지로 이동
function getMyProfile() {
    location.href = '/mypage';
}

// 로그아웃 요청
async function userLogout() {
    const { status } = await fetch('/api/logout', {
        method: "post"
    });
    if (status === 200) {
        alert("성공적으로 로그아웃 하였습니다!");
        location.replace('/login');
    }
}


// 원하는 위치에 도착 하였는지 체크하는 함수
function checkVisible() {
    const screenHeight = screen.height; // 화면 높이
    const scroll = window.scrollY; // 현재 스크롤 바 위치
    const endTop = end.offsetTop; // 요소 top 위치
    // 화면에 안보여도 요소가 위에만 있으면 (페이지를 로드할때 스크롤이 밑으로 내려가 요소를 지나쳐 버릴경우)
    return ((endTop < (screenHeight + scroll)));
}

// 이벤트에 등록할 함수
const loadData = async function () {

    if (!checkVisible()) {
        return;
    }

    end.style.visibility = 'visible';

    // 스크롤 이벤트 삭제
    window.removeEventListener('scroll', loadData);
    // 프로필 데이터 요청 및 저장
    const profiles = await fetch('/users', {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then(res => res.json());

    data.Page += 1;

    // 프로필 데이터가 없을 경우
    if (profiles.length === 0) {
        end.style.display = "none";
        data.Page -= 1;
        return;
    }

    setTimeout(() => {
        // 받아온 프로필을 3초 후 화면에 랜더링
        profiles.forEach(profile => {
            const profileCard = document.createElement('div');
            profileCard.classList.add('profile_card');
            profileCard.innerHTML = `
                        <div class="profile_image"></div>
                        <div class="profile_text">
                            <div class="name">${profile.username}</div>
                            <div class="mail">${profile.email}</div>
                            <div class="comment">${profile.comments}</div>
                        </div>
                    `;
            profileZone.appendChild(profileCard);
        });
        end.style.visibility = 'hidden';
        // 추가 데이터가 존재할 수 있기 때문에 스크롤 이벤트 재등록
        window.addEventListener('scroll', loadData);
    }, 3000);

}

// 스크롤 이벤트 등록
window.addEventListener('scroll', loadData);
window.onload = loadData;