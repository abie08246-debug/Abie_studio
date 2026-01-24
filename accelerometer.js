// accelerometer.js
class ShakeDetector {
    constructor() {
        this.threshold = 15; // Минимальная сила встряхивания
        this.timeout = 2000; // Задержка между обнаружением встряхиваний (2 секунды)
        this.lastShake = 0;
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
        this.isEffectActive = false;
        
        this.init();
    }

    init() {
        if (typeof DeviceMotionEvent !== 'undefined' && 
            typeof DeviceMotionEvent.requestPermission === 'function') {
            // iOS 13+ требует разрешение
            this.requestPermission();
        } else {
            this.startDetection();
        }
        
        // Предзагрузка изображения
        this.preloadImage();
    }

    preloadImage() {
        const img = new Image();
        img.src = 'Стекло1.png';
        img.onload = () => {
            console.log('Изображение разбитого стекла загружено');
        };
        img.onerror = () => {
            console.error('Ошибка загрузки изображения разбитого стекла');
        };
    }

    async requestPermission() {
        try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission === 'granted') {
                this.startDetection();
            } else {
                this.showPermissionDeniedMessage();
            }
        } catch (error) {
            console.error('Ошибка при запросе разрешения:', error);
        }
    }

    showPermissionDeniedMessage() {
        const info = document.querySelector('.shake-info');
        if (info) {
            info.innerHTML = `
                <p>⚠️ <strong>Разрешение не предоставлено</strong></p>
                <p style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
                    Для работы функции встряхивания необходимо разрешить доступ к датчикам движения
                </p>
            `;
        }
    }

    startDetection() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
            console.log('Детектор встряхивания активирован');
        } else {
            this.showNotSupportedMessage();
        }
    }

    showNotSupportedMessage() {
        const info = document.querySelector('.shake-info');
        if (info) {
            info.innerHTML = `
                <p>📱 <strong>Функция не поддерживается</strong></p>
                <p style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
                    Ваше устройство не поддерживает датчики движения
                </p>
            `;
        }
    }

    handleMotion(event) {
        const acceleration = event.accelerationIncludingGravity;
        const currentTime = Date.now();
        
        if ((currentTime - this.lastShake) > this.timeout && !this.isEffectActive) {
            const x = acceleration.x;
            const y = acceleration.y;
            const z = acceleration.z;
            
            if (this.lastX !== null && this.lastY !== null && this.lastZ !== null) {
                const deltaX = Math.abs(x - this.lastX);
                const deltaY = Math.abs(y - this.lastY);
                const deltaZ = Math.abs(z - this.lastZ);
                
                const total = deltaX + deltaY + deltaZ;
                
                if (total > this.threshold) {
                    this.lastShake = currentTime;
                    this.onShakeDetected();
                }
            }
            
            this.lastX = x;
            this.lastY = y;
            this.lastZ = z;
        }
    }

    onShakeDetected() {
        console.log('📱 Обнаружено встряхивание!');
        this.showGlassBreakEffect();
        
        // Вибрация (если поддерживается)
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    showGlassBreakEffect() {
        if (this.isEffectActive) return;
        
        this.isEffectActive = true;
        const effect = document.getElementById('glass-break-effect');
        const homeNav = document.getElementById('home-nav');
        const servicesNav = document.getElementById('services-nav');
        
        // Показываем эффект разбитого стекла
        effect.style.display = 'flex';
        effect.classList.add('active');
        
        // Добавляем эффект на кнопки навигации
        this.addGlassEffectToElement(homeNav);
        this.addGlassEffectToElement(servicesNav);
        
        // Добавляем класс тряски для всего контейнера
        document.querySelector('.container').classList.add('shake-animation');
        
        // Звук разбития стекла
        this.playGlassBreakSound();
        
        // Скрываем инструкцию
        const shakeInfo = document.querySelector('.shake-info');
        if (shakeInfo) {
            shakeInfo.style.opacity = '0.5';
        }
        
        // Убираем эффект через 1.5 секунды
        setTimeout(() => {
            this.hideGlassBreakEffect();
        }, 1500);
    }

    hideGlassBreakEffect() {
        const effect = document.getElementById('glass-break-effect');
        const homeNav = document.getElementById('home-nav');
        const servicesNav = document.getElementById('services-nav');
        const container = document.querySelector('.container');
        const shakeInfo = document.querySelector('.shake-info');
        
        effect.classList.remove('active');
        effect.style.display = 'none';
        
        this.removeGlassEffectFromElement(homeNav);
        this.removeGlassEffectFromElement(servicesNav);
        
        if (container) {
            container.classList.remove('shake-animation');
        }
        
        if (shakeInfo) {
            shakeInfo.style.opacity = '1';
        }
        
        this.isEffectActive = false;
    }

    addGlassEffectToElement(element) {
        if (!element) return;
        
        element.classList.add('glass-effect-active');
        
        // Находим overlay и показываем его
        const overlay = element.querySelector('.glass-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.backgroundImage = 'url("Стекло1.png")';
        }
    }

    removeGlassEffectFromElement(element) {
        if (!element) return;
        
        element.classList.remove('glass-effect-active');
        
        // Скрываем overlay
        const overlay = element.querySelector('.glass-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.backgroundImage = 'none';
            }, 300);
        }
    }

    playGlassBreakSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Два осциллятора для более реалистичного звука
            oscillator1.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
            
            oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.4);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.5);
            oscillator2.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Аудио контекст не поддерживается');
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const shakeDetector = new ShakeDetector();
    
    // Добавляем возможность теста по клику (для десктопной версии)
    document.querySelector('.shake-info').addEventListener('click', () => {
        shakeDetector.onShakeDetected();
    });
});