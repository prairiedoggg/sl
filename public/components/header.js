function move(link) {
    location.href = link;
}

async function userLogout() {
    const { response } = await sendRequest("/api/users/logout", {
        Method: "POST",
    });
    if (response.ok) {
        alert("계정이 로그아웃 되셨습니다!");
        location.replace('/login');
    }
}

function createHeader(data) {
    const { text, link } = data;
    const header = document.querySelector('header');
    const headerImg = document.createElement('img');
    const ol = document.createElement('ol');

    headerImg.src = '../img/sharelioLogo.png';

    const linkButton = document.createElement('li');
    const logout = document.createElement('li');

    linkButton.onclick = () => { move(link) };
    logout.onclick = userLogout;

    linkButton.innerText = text;
    logout.innerText = "로그아웃";

    ol.appendChild(linkButton);
    ol.appendChild(logout);

    header.appendChild(headerImg);
    header.appendChild(ol);
}