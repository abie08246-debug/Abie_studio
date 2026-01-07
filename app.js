// Инициализация Telegram Web App
        const tg = window.Telegram.WebApp;
        
        // Расширяем приложение на весь экран
        tg.expand();
        
        // Применяем тему Telegram
        document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
        document.body.style.color = tg.themeParams.text_color || '#000000';
        
        // Обновление профиля пользователя Telegram
        
        function updateUserProfile() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        console.warn('Telegram WebApp недоступен');
        return;
    }

    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;

    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userStatus = document.getElementById('user-status');

    // 🔹 Fallback (если открыто вне Telegram)
    if (!user) {
        userName.textContent = 'Гость';
        userStatus.textContent = 'Telegram Mini App';
        userAvatar.textContent = '👤';
        userProfile.style.display = 'flex';
        return;
    }

    const displayName =
        user.first_name ||
        user.username ||
        'Пользователь';

    userName.textContent = displayName;

    // 🔹 Аватар
    userAvatar.innerHTML = '';
    userAvatar.style.background = '';

    if (user.photo_url) {
        const img = document.createElement('img');
        img.src = user.photo_url;
        img.alt = displayName;
        userAvatar.appendChild(img);
    } else {
        userAvatar.textContent = displayName.charAt(0).toUpperCase();

        const colors = [
            ['#667eea', '#764ba2'],
            ['#f093fb', '#f5576c'],
            ['#4facfe', '#00f2fe'],
            ['#43e97b', '#38f9d7'],
            ['#fa709a', '#fee140']
        ];
        const colorIndex = user.id % colors.length;
        userAvatar.style.background =
            `linear-gradient(135deg, ${colors[colorIndex][0]}, ${colors[colorIndex][1]})`;
    }

    // 🔹 Статус
    if (user.username) {
        userStatus.textContent = `@${user.username}`;
    } else if (user.last_name) {
        userStatus.textContent = user.last_name;
    } else {
        userStatus.textContent = 'Telegram';
    }

    userProfile.style.display = 'flex';
}

        
        // API ключ для OpenWeatherMap
        const API_KEY = '71b79eb28b25abb409de841a1ff76818';
        
        // Элементы DOM
        const cityInput = document.getElementById('city-input');
        const searchBtn = document.getElementById('search-btn');
        
        const weatherCard = document.getElementById('weather-card');
        const errorMessage = document.getElementById('error-message');
        const loading = document.getElementById('loading');
        
        // Элементы для отображения данных
        const cityName = document.getElementById('city-name');
        const weatherDescription = document.getElementById('weather-description');
        const temperature = document.getElementById('temperature');
        const weatherIcon = document.getElementById('weather-icon');
        const feelsLike = document.getElementById('feels-like');
        const humidity = document.getElementById('humidity');
        const pressure = document.getElementById('pressure');
        const windSpeed = document.getElementById('wind-speed');
        const visibility = document.getElementById('visibility');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        
        // Показать/скрыть загрузку
        function showLoading(show) {
            loading.style.display = show ? 'block' : 'none';
            if (show) {
                weatherCard.style.display = 'none';
                errorMessage.style.display = 'none';
            }
        }
        
        // Функция для получения погоды по городу
        async function getWeatherData(city) {
            showLoading(true);
            
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('Город не найден');
                }
                
                const data = await response.json();
                updateWeatherUI(data);
                showLoading(false);
                weatherCard.style.display = 'block';
                
            } catch (error) {
                showLoading(false);
                errorMessage.style.display = 'block';
                weatherCard.style.display = 'none';
                console.error('Ошибка:', error);
                
                // Вибрация при ошибке (если поддерживается)
                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }
            }
        }
        
        // Функция для получения погоды по координатам
        async function getWeatherByCoords(lat, lon) {
            showLoading(true);
            
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('Ошибка получения данных');
                }
                
                const data = await response.json();
                updateWeatherUI(data);
                showLoading(false);
                weatherCard.style.display = 'block';
                
            } catch (error) {
                showLoading(false);
                errorMessage.textContent = 'Не удалось получить данные о местоположении';
                errorMessage.style.display = 'block';
                weatherCard.style.display = 'none';
            }
        }
        
        // Обновление интерфейса
        function updateWeatherUI(data) {
            // Основные данные
            cityName.textContent = `${data.name}, ${data.sys.country}`;
            weatherDescription.textContent = data.weather[0].description;
            temperature.textContent = `${Math.round(data.main.temp)}°C`;
            
            // Иконка погоды
            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.alt = data.weather[0].description;
            
            // Дополнительные данные
            feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
            humidity.textContent = `${data.main.humidity}%`;
            pressure.textContent = `${data.main.pressure} hPa`;
            windSpeed.textContent = `${data.wind.speed} м/с`;
            visibility.textContent = `${(data.visibility / 1000).toFixed(1)} км`;
            
            // Время восхода и закат
            const sunriseTime = new Date(data.sys.sunrise * 1000);
            const sunsetTime = new Date(data.sys.sunset * 1000);
            
            sunrise.textContent = `${sunriseTime.getHours().toString().padStart(2, '0')}:${sunriseTime.getMinutes().toString().padStart(2, '0')}`;
            sunset.textContent = `${sunsetTime.getHours().toString().padStart(2, '0')}:${sunsetTime.getMinutes().toString().padStart(2, '0')}`;
            
            // Изменяем цвет температуры в зависимости от значения
            const temp = data.main.temp;
            if (temp > 25) {
                temperature.style.color = '#ff6b6b'; // Тепло
            } else if (temp < 0) {
                temperature.style.color = '#74b9ff'; // Холодно
            } else {
                temperature.style.color = 'var(--tg-theme-text-color, #000000)';
            }
        }
        
        // Получение местоположения пользователя
        function getUserLocation() {
            if (!navigator.geolocation) {
                errorMessage.textContent = 'Геолокация не поддерживается вашим браузером';
                errorMessage.style.display = 'block';
                return;
            }
            
            showLoading(true);
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    showLoading(false);
                    errorMessage.textContent = 'Не удалось получить местоположение. Разрешите доступ к геолокации.';
                    errorMessage.style.display = 'block';
                    console.error('Ошибка геолокации:', error);
                },
                { timeout: 10000 }
            );
        }
        
        // Обработчики событий
        searchBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                getWeatherData(city);
                cityInput.blur(); // Скрываем клавиатуру на мобильных устройствах
            }
        });
        
        
        
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = cityInput.value.trim();
                if (city) {
                    getWeatherData(city);
                    cityInput.blur();
                }
            }
        });
        
        // Инициализация при загрузке
        Telegram.WebApp.ready();
            updateUserProfile();

        
        // Обработка кнопки "Назад" в Telegram
        tg.onEvent('backButtonClicked', () => {
            if (weatherCard.style.display === 'block') {
                weatherCard.style.display = 'none';
                cityInput.value = '';
                cityInput.focus();
                tg.BackButton.hide();
            } else {
                tg.close();
            }
        });
        
        // Обработка клика по профилю пользователя
        document.getElementById('user-profile').addEventListener('click', () => {
            const user = tg.initDataUnsafe.user;
            if (user && user.username) {
                // Показываем информацию о пользователе
                tg.showAlert(`👤 ${user.first_name || ''} ${user.last_name || ''}\n@${user.username}`);
            } else {
                tg.showAlert('Информация о пользователе доступна только в Telegram');
            }
        });