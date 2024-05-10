// header 생성
createHeader({ text: "둘러보기", link: "/" });
//아래로 위치를 봐야함

// 프로필 이미지를 설정하는 함수
function setProfileImage(profileImageUrl) {
    document.querySelector(".profile-image").style.backgroundImage = `url(${profileImageUrl})`;
}

// 사용자 데이터를 페이지에 표시하는 함수
function displayUserData(userData) {
    console.log(userData);
    const { username, email, comments, award, certificate, education, portfolioUrl } = userData;
    // 이름 설정
    document.querySelector("h1").textContent = username;

    // 이메일 설정
    // p:nt말고 정확하게
    document.querySelector("p:nth-of-type(1)").textContent = email;

    // 자기 소개 설정
    document.querySelector("p:nth-of-type(2)").textContent = comments;

    // 포트폴리오 섹션의 제목 설정 (username님의 포트폴리오)
    document.querySelector(".portfolio-section h2").textContent = `${username}님의 포트폴리오`;

    // 학력 설정
    const educationList = document.querySelector(".education ul");
    education.forEach((education) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${education.schoolName}, ${education.fieldOfStudy}, ${education.degree}`;
        educationList.appendChild(listItem);
    });

    // 수상 이력 설정
    const awardList = document.querySelector(".awards ul");
    award.forEach((award) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${award.awardName}`;
        awardList.appendChild(listItem);
    });

    // 자격증 설정
    const certificationList = document.querySelector(".certifications ul");
    certificate.forEach((certificate) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${certificate.name}`;
        certificationList.appendChild(listItem);
    });

    // 포트폴리오 설정
    const portfolioList = document.querySelector(".portfolio");
    portfolioUrl.forEach((portfolio) => {
        const portfolioItem = document.createElement("div");
        portfolioItem.textContent = portfolio.link; // 포트폴리오의 링크를 표시하거나 다른 방식으로 표현할 수 있음
        portfolioList.appendChild(portfolioItem);
    });
}


// 페이지 초기화 함수
async function initializePage() {
    const urlSearch = new URLSearchParams(location.search);
    const username = urlSearch.get("username");
    const query = await fetch(`/api/users/${username}`, {
        method: "GET"
    })
        .then(data => data.json())
        .catch(err => location.replace('/'));

    setProfileImage(query.profilePictureUrl);
    displayUserData(query);
}

document.addEventListener("DOMContentLoaded", initializePage);
