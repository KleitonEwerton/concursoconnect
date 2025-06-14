/**
 * Inicializa os ouvintes de evento para os botões de interação dos posts (curtir e salvar).
 * @param {HTMLElement} container - O elemento que contém os posts a serem observados.
 */
export function initializePostInteractions(container) {
    container.addEventListener('click', (event) => {
        const likeButton = event.target.closest('.like-button');
        const bookmarkButton = event.target.closest('.bookmark-button');

        if (likeButton) {
            handleLike(likeButton);
        }

        if (bookmarkButton) {
            handleBookmark(bookmarkButton);
        }
    });
}

function handleLike(button) {
    button.classList.toggle('active');
    // Aqui você pode adicionar lógica para atualizar a contagem de curtidas
}

function handleBookmark(button) {
    button.classList.toggle('active');
    const span = button.querySelector('span');
    if (span) {
        span.textContent = button.classList.contains('active') ? 'Salvo' : 'Salvar';
    }
}