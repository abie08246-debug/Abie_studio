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
        console.log('✅ DeviceMotion API поддерживается');
        
        // Показываем инструкцию для iOS 13+
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            const info = document.querySelector('.shake-info');
            if (info) {
                info.innerHTML = `
                    <p>📱 <strong>Нажмите для разрешения</strong></p>
                    <p style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
                        Требуется разрешение на доступ к датчикам движения
                    </p>
                `;
            }
        }
        
        return true;
    } else {
        console.warn('⚠️ DeviceMotion API не поддерживается');
        const info = document.querySelector('.shake-info');
        if (info) {
            info.innerHTML = `
                <p>📱 <strong>Функция не поддерживается</strong></p>
                <p style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
                    Ваше устройство не поддерживает датчики движения
                </p>
            `;
            info.style.animation = 'none';
            info.style.opacity = '0.7';
        }
        return false;
    }
}

// Инициализация после загрузки профиля
window.addEventListener('load', () => {
    updateUserProfile();
    checkMotionSupport();
    
    // Инициализируем тему Telegram
    document.body.classList.add(tg.colorScheme);
    
    // Обновляем тему при изменении
    tg.onEvent('themeChanged', () => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(tg.colorScheme);
    });
});