import { initializeTabs } from './ui/tabs.js';
import { initializePostInteractions } from './components/postInteractions.js';

// Função para carregar componentes HTML estáticos como header e footer
async function loadStaticComponent(containerId, filePath) {
    try {
        const container = document.getElementById(containerId);
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Falha ao carregar ${filePath}`);
        }
        container.innerHTML = await response.text();
    } catch (error) {
        console.error(`Erro ao carregar componente estático:`, error);
    }
}

// Função executada quando o DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
    // Carrega os componentes estáticos da página
    loadStaticComponent('header-container', 'components/header.html');
    loadStaticComponent('mobile-nav-container', 'components/mobile-nav.html');
    
    // Inicializa o sistema de abas com o 'feed' como padrão.
    // A função passada como segundo argumento será chamada toda vez que uma aba for carregada.
    initializeTabs('feed', (loadedTabContent) => {
        // Como os posts só existem na aba 'feed', inicializamos as interações
        // apenas quando essa aba (ou outra que contenha posts) for carregada.
        if (loadedTabContent.querySelector('.post')) {
            initializePostInteractions(loadedTabContent);
        }
    });
});