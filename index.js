document.addEventListener('DOMContentLoaded', function() {
    const tabs = ['feed', 'network', 'settings'];
    const tabContents = document.querySelectorAll('.tab-content');

    // Botões do Desktop
    const feedBtnDesktop = document.getElementById('feed-btn-desktop');
    const networkBtnDesktop = document.getElementById('network-btn-desktop');
    const settingsBtnDesktop = document.getElementById('settings-btn-desktop');
    const desktopButtons = [feedBtnDesktop, networkBtnDesktop, settingsBtnDesktop];

    // Botões do Mobile
    const feedBtnMobile = document.getElementById('feed-btn-mobile');
    const networkBtnMobile = document.getElementById('network-btn-mobile');
    const settingsBtnMobile = document.getElementById('settings-btn-mobile');
    const mobileButtons = [feedBtnMobile, networkBtnMobile, settingsBtnMobile];

    function switchTab(tabName) {
        // Esconde todos os conteúdos das abas
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Mostra o conteúdo da aba selecionada
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Atualiza os estilos dos botões do desktop
        desktopButtons.forEach(btn => {
            btn.classList.remove('active-tab');
            if (btn.id.startsWith(tabName)) {
                btn.classList.add('active-tab');
            }
        });

        // Atualiza os estilos dos botões do mobile
        mobileButtons.forEach(btn => {
            btn.classList.remove('text-teal-500');
            btn.classList.add('text-gray-500');
            if (btn.id.startsWith(tabName)) {
                btn.classList.remove('text-gray-500');
                btn.classList.add('text-teal-500');
            }
        });
    }

    // Adiciona os eventos de clique para os botões do desktop
    feedBtnDesktop.addEventListener('click', () => switchTab('feed'));
    networkBtnDesktop.addEventListener('click', () => switchTab('network'));
    settingsBtnDesktop.addEventListener('click', () => switchTab('settings'));

    // Adiciona os eventos de clique para os botões do mobile
    feedBtnMobile.addEventListener('click', () => switchTab('feed'));
    networkBtnMobile.addEventListener('click', () => switchTab('network'));
    settingsBtnMobile.addEventListener('click', () => switchTab('settings'));

    // Funcionalidade de Curtir e Salvar (Exemplo)
    const likeButtons = document.querySelectorAll('.like-button');
    const bookmarkButtons = document.querySelectorAll('.bookmark-button');

    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });
    });

    bookmarkButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const span = button.querySelector('span');
            if (button.classList.contains('active')) {
                span.textContent = 'Salvo';
            } else {
                span.textContent = 'Salvar';
            }
        });
    });
});