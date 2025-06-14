const mainContent = document.getElementById('main-content');
let onTabLoadCallback = () => {};

/**
 * Carrega o conteúdo de uma aba dinamicamente a partir de um arquivo HTML.
 * @param {string} tabName - O nome da aba (ex: 'feed', 'network').
 */
async function loadTabContent(tabName) {
    try {
        const response = await fetch(`components/${tabName}.html`);
        if (!response.ok) {
            throw new Error(`Não foi possível carregar a aba: ${tabName}`);
        }
        mainContent.innerHTML = await response.text();
        updateActiveButtons(tabName);
        
        // Executa o callback após o conteúdo ser carregado
        if (typeof onTabLoadCallback === 'function') {
            onTabLoadCallback(mainContent);
        }
    } catch (error) {
        console.error('Erro ao carregar conteúdo da aba:', error);
        mainContent.innerHTML = `<p class="text-red-500 text-center">Erro ao carregar o conteúdo. Tente novamente mais tarde.</p>`;
    }
}

/**
 * Atualiza o estado visual (ativo/inativo) dos botões de navegação.
 * @param {string} activeTabName - O nome da aba que está ativa.
 */
function updateActiveButtons(activeTabName) {
    // Botões do Desktop
    document.querySelectorAll('.tab-button-desktop').forEach(btn => {
        btn.classList.toggle('active-tab', btn.dataset.tab === activeTabName);
    });

    // Botões do Mobile
    document.querySelectorAll('.tab-button-mobile').forEach(btn => {
        btn.classList.toggle('active-tab', btn.dataset.tab === activeTabName);
    });
}

/**
 * Inicializa o sistema de abas.
 * @param {string} defaultTab - A aba que deve ser carregada por padrão.
 * @param {function} onTabLoad - Função a ser chamada sempre que uma nova aba é carregada.
 */
export function initializeTabs(defaultTab, onTabLoad) {
    if (typeof onTabLoad === 'function') {
        onTabLoadCallback = onTabLoad;
    }
    
    document.body.addEventListener('click', (event) => {
        const tabButton = event.target.closest('[data-tab]');
        if (tabButton) {
            const tabName = tabButton.dataset.tab;
            loadTabContent(tabName);
        }
    });

    // Carrega a aba inicial
    loadTabContent(defaultTab);
}