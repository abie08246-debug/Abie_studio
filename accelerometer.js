// accelerometer.js
class ShakeDetector {
    constructor() {
        this.threshold = 15; // Минимальная сила встряхивания
        this.timeout = 1000; // Задержка между обнаружением встряхиваний
        this.lastShake = 0;
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
        
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
    }

    async requestPermission() {
        try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission === 'granted') {
                this.startDetection();
            } else {
                console.log('Разрешение на доступ к акселерометру не предоставлено');
            }
        } catch (error) {
            console.error('Ошибка при запросе разрешения:', error);
        }
    }

    startDetection() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.handleMotion.bind(this));
            console.log('Детектор встряхивания активирован');
        } else {
            console.warn('DeviceMotion не поддерживается');
        }
    }

    handleMotion(event) {
        const acceleration = event.accelerationIncludingGravity;
        const currentTime = Date.now();
        
        if ((currentTime - this.lastShake) > this.timeout) {
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
    }

    showGlassBreakEffect() {
        const effect = document.getElementById('glass-break-effect');
        const homeNav = document.getElementById('home-nav');
        const servicesNav = document.getElementById('services-nav');
        
        // Создаем эффект разбитого стекла
        effect.innerHTML = '';
        effect.style.display = 'block';
        
        // Добавляем трещины на кнопки навигации
        this.addCracksToElement(homeNav);
        this.addCracksToElement(servicesNav);
        
        // Звук разбития стекла (опционально)
        this.playGlassBreakSound();
        
        // Убираем эффект через 2 секунды
        setTimeout(() => {
            effect.style.display = 'none';
            this.removeCracksFromElement(homeNav);
            this.removeCracksFromElement(servicesNav);
        }, 2000);
    }

    addCracksToElement(element) {
        if (!element) return;
        
        // Добавляем класс с трещинами
        element.classList.add('glass-cracked');
        
        // Создаем SVG трещин
        const cracks = document.createElement('div');
        cracks.className = 'glass-cracks';
        cracks.innerHTML = `
            <svg class="crack-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M10,10 L40,40 L60,20 L90,90" class="crack-line"/>
                <path d="M30,5 L50,50 L70,30" class="crack-line"/>
                <path d="M5,60 L40,70 L80,40" class="crack-line"/>
            </svg>
        `;
        
        element.appendChild(cracks);
    }

    removeCracksFromElement(element) {
        if (!element) return;
        
        element.classList.remove('glass-cracked');
        const cracks = element.querySelector('.glass-cracks');
        if (cracks) {
            cracks.remove();
        }
    }

    playGlassBreakSound() {
        // Создаем звук разбития стекла
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Аудио контекст не поддерживается');
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создаем стили для эффекта
    const style = document.createElement('style');
    style.textContent = `
        .glass-break-effect {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.1) 70%);
            pointer-events: none;
            z-index: 9999;
            display: none;
            animation: glassFlash 0.5s ease-out;
        }
        
        @keyframes glassFlash {
            0% { opacity: 0; }
            10% { opacity: 1; background: rgba(255,255,255,0.3); }
            100% { opacity: 0; }
        }
        
        .glass-cracked {
            position: relative;
            overflow: hidden;
        }
        
        .glass-cracked::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.1);
            z-index: 1;
        }
        
        .glass-cracks {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        }
        
        .crack-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .crack-line {
            stroke: rgba(255, 255, 255, 0.8);
            stroke-width: 2;
            stroke-linecap: round;
            fill: none;
            animation: crackAppear 0.3s ease-out forwards;
        }
        
        @keyframes crackAppear {
            0% { stroke-dasharray: 0, 1000; }
            100% { stroke-dasharray: 1000, 0; }
        }
        
        .shake-info {
            text-align: center;
            padding: 20px;
            background: var(--tg-theme-secondary-bg-color, #f1f1f1);
            border-radius: 16px;
            margin: 20px 0;
            color: var(--tg-theme-text-color, #000);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
        
        .bottom-nav {
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
    
    // Инициализируем детектор встряхивания
    const shakeDetector = new ShakeDetector();
    
    // Добавляем информацию о встряхивании
    const content = document.querySelector('.content');
    if (content) {
        const shakeInfo = document.createElement('div');
        shakeInfo.className = 'shake-info';
        shakeInfo.innerHTML = `
            <p>📱 <strong>Встряхните телефон</strong></p>
            <p style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
                чтобы увидеть эффект разбитого стекла на кнопках навигации!
            </p>
        `;
        content.appendChild(shakeInfo);
    }
});