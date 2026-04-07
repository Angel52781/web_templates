import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import '../styles/main.css'

// Registrar plugins de Alpine
Alpine.plugin(collapse)

// Registrar Alpine.js globalmente
window.Alpine = Alpine

// Iniciar Alpine
Alpine.start()

/**
 * Lógica para el Comparador de Antes y Después (Vanilla JS)
 */
function initBeforeAfter() {
    const containers = document.querySelectorAll('.ba-container');
    
    containers.forEach(container => {
        const afterImg = container.querySelector('.ba-after');
        const handle = container.querySelector('.ba-handle');
        
        if (!afterImg || !handle) return;

        let isDragging = false;

        const setPosition = (x) => {
            const rect = container.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Limitadores
            if (position < 0) position = 0;
            if (position > 100) position = 100;
            
            afterImg.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
            handle.style.left = `${position}%`;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            setPosition(x);
        };

        const startDragging = (e) => {
            isDragging = true;
            onMove(e);
        };

        const stopDragging = () => {
            isDragging = false;
        };

        // Eventos de ratón
        handle.addEventListener('mousedown', startDragging);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', stopDragging);

        // Eventos táctiles
        handle.addEventListener('touchstart', startDragging);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', stopDragging);
        
        // Inicializar al 50%
        afterImg.style.clipPath = `inset(0 50% 0 0)`;
        handle.style.left = `50%`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initBeforeAfter();
    console.log('Premium Aesthetic Clinic - Ready 🕊️✨');
});
