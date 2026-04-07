import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import '../styles/main.css'

// Registrar plugins de Alpine
Alpine.plugin(collapse)

// Registrar Alpine.js globalmente
window.Alpine = Alpine

// Iniciar Alpine
Alpine.start()

document.addEventListener('DOMContentLoaded', () => {
    console.log('Odonto Yes! Perú - Landing Demo Initialized ✨');
});
