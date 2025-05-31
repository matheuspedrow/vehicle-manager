'use strict';

import { vehicleManager } from './modules/vehicleManager.js';

// Expor o gerenciador de veículos globalmente
window.vehicleManager = vehicleManager;

// Garantir que o DOM está carregado antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a lista de veículos
    vehicleManager.listVehicles();
});