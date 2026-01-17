const tg = window.Telegram.WebApp;
    tg.expand();

function updateUserProfile() {
    const user = tg.initDataUnsafe.user;

    const avatar = document.getElementById('user-avatar');
    const name = document.getElementById('user-name');
    const status = document.getElementById('user-status');

    if (!user) {
        name.textContent = 'Откройте через Telegram';
        status.textContent = 'Mini App';
        return;
    }

    const displayName = user.first_name || user.username || 'Пользователь';
    name.textContent = displayName;

    if (user.username) {
        status.textContent = '@' + user.username;
    } else {
        status.textContent = 'Telegram';
    }

    if (user.photo_url) {
        avatar.innerHTML = `<img src="${user.photo_url}">`;
    } else {
        avatar.textContent = displayName[0].toUpperCase();
    }
}

window.addEventListener('load', updateUserProfile);