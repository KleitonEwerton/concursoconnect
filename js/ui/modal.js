// js/ui/modal.js

const modalContainer = document.getElementById("modal-container");

/**
 * Carrega e abre um modal a partir de um arquivo HTML.
 * @param {string} modalComponentPath - O caminho para o arquivo HTML do modal (ex: 'components/modal-create-post.html').
 */
export async function openModal(modalComponentPath) {
  try {
    const response = await fetch(modalComponentPath);
    if (!response.ok)
      throw new Error(
        `Não foi possível carregar o modal: ${modalComponentPath}`
      );

    modalContainer.innerHTML = await response.text();
    modalContainer.classList.remove("hidden");

    // Adiciona ouvintes para fechar o modal
    const modal = modalContainer.querySelector(".modal-overlay");
    if (modal) {
      // Fechar ao clicar fora do conteúdo
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });

      // Fechar ao clicar nos botões [data-close-button]
      modal.querySelectorAll("[data-close-button]").forEach((button) => {
        button.addEventListener("click", () => closeModal());
      });
    }
  } catch (error) {
    console.error("Erro ao abrir o modal:", error);
  }
}

/**
 * Fecha o modal atualmente aberto.
 */
export function closeModal() {
  modalContainer.classList.add("hidden");
  modalContainer.innerHTML = ""; // Limpa o conteúdo para economizar memória
}
