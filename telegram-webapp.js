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

// Проверка поддержки DeviceMotion API
function checkMotionSupport() {
    if ('DeviceMotionEvent' in window) {
        console.log('DeviceMotion API поддерживается');
        return true;
    } else {
        console.warn('DeviceMotion API не поддерживается');
        // Показываем альтернативное сообщение
        const content = document.querySelector('.content');
        if (content) {
            const warning = document.createElement('div');
            warning.className = 'shake-info';
            warning.innerHTML = `
                <p>⚠️ Акселерометр не поддерживается</p>
                <p style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
                    Ваше устройство не поддерживает функцию встряхивания
                </p>
            `;
            content.appendChild(warning);
        }
        return false;
    }
}

// Инициализация после загрузки профиля
window.addEventListener('load', () => {
    updateUserProfile();
    checkMotionSupport();
});

window.addEventListener('load', updateUserProfile);