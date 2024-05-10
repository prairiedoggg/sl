const pageSize = 9; // 페이지당 프로필 수
let current = 1; // 현재 페이지
let total = 1; // 전체 페이지 수 초기값 설정

const pages = document.getElementById("currentPage");

// 이전 페이지로 이동
function prevPage() {
    if (current > 1) {
        current--;
        fetchProfiles(current);
        pages.innerText = current;
    } else {
        alert("이전페이지가 존재하지 않습니다!");
    }
}

// 다음 페이지로 이동
function nextPage() {
    console.log("다음페이지");
    if (current < total) {
        current++;
        fetchProfiles(current);
        pages.innerText = current;
    } else {
        alert("다음페이지가 존재하지 않습니다!");
    }
}

// 프로필 카드를 생성하는 함수
function createProfileCard(profile) {
    const profileCard = document.createElement("a");
    profileCard.classList.add("profile_card");

    const profileImage = document.createElement("div");
    profileImage.classList.add("profile_image");
    profileImage.style.backgroundImage = `url('${profile.profilePictureUrl}')`; // 프로필 이미지 설정

    const profileText = document.createElement("div");
    profileText.classList.add("profile_text");

    const name = document.createElement("div");
    name.classList.add("name");
    name.textContent = profile.username;

    const mail = document.createElement("div");
    mail.classList.add("mail");
    mail.textContent = profile.email;

    const comment = document.createElement("div");
    comment.classList.add("comment");
    comment.textContent = profile.comments;

    // 프로필 카드를 클릭하면 해당 사용자의 프로필을 보여주는 페이지로 이동하는 링크 추가
    profileCard.href = `/userPage/userpage.html?username=${profile.username}`;

    profileText.appendChild(name);
    profileText.appendChild(mail);
    profileText.appendChild(comment);

    profileCard.appendChild(profileImage);
    profileCard.appendChild(profileText);

    return profileCard;
}

async function fetchProfiles(page) {
    try {
        const response = await fetch(`/api/users?page=${page}`, {
            method: "GET",
        }); // 서버에서 데이터를 가져오는 API 엔드포인트
        if (!response.ok) {
            throw new Error("서버로부터 데이터를 가져오는 데 실패했습니다.");
        }
        const { currentPage, totalPages, users } = await response.json();

        current = currentPage ? currentPage : current;
        total = totalPages ? totalPages : total;

        renderProfiles(users);
    } catch (error) {
        console.error(error);
    }
}

// 페이지 로드 시 프로필 데이터를 가져와서 프로필 카드를 추가
document.addEventListener("DOMContentLoaded", () => {
    createHeader({ text: "마이페이지", link: "/mypage" });
    fetchProfiles(current);
});

// 프로필 카드 렌더링
function renderProfiles(user) {
    const profileZone = document.getElementById("profileZone");
    profileZone.innerHTML = "";

    user.forEach((data) => {
        const profileCard = createProfileCard(data);
        profileZone.appendChild(profileCard);
    });
}
