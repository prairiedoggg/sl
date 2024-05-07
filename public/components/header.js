import { sendRequest } from "../utils/transferManager.js";

function move(link) {
    location.href = link;
}

async function userLogout() {
    const { response } = await sendRequest('/api/logout', {
        Method: "POST"
    });
    if (response.ok) {
        alert("계정이 로그아웃 되셨습니다!");
        location.replace('/login');
    }
}

export function createHeader(page) {
    const { mode } = page;
    const header = document.querySelector('header');
    const headerImg = document.createElement('img');
    const ol = document.createElement('ol');

    headerImg.src = '../img/sharelioLogo.png';

    const linkButton = document.createElement('li');
    const logout = document.createElement('li');

    if (mode) {
        linkButton.onclick = () => { move('/') };
    } else {
        linkButton.onclick = () => { move('/mypage') };
    }
    logout.onclick = userLogout;

    if (mode) {
        linkButton.innerText = "홈으로"
    } else {
        linkButton.innerText = "내 프로필"
    }
    logout.innerText = "로그아웃";

    ol.appendChild(linkButton);
    ol.appendChild(logout);

    header.appendChild(headerImg);
    header.appendChild(ol);
}