import { initializeTabs } from "./ui/tabs.js";
import { initializePostInteractions } from "./components/postInteractions.js";
import { openModal, closeModal } from "./ui/modal.js";

async function loadStaticComponent(containerId, filePath) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Falha ao carregar ${filePath}`);
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`Erro ao carregar componente estático:`, error);
  }
}

/**
 * NOVO: Função "Fábrica" que cria o elemento de um post.
 * Ela recebe os dados do post e retorna um elemento HTML pronto para ser inserido no DOM.
 * @param {object} postData - Os dados do novo post.
 * @returns {HTMLElement} O elemento do post.
 */
function createPostElement(postData) {
    const postElement = document.createElement('div');
    postElement.className = 'post bg-white rounded-xl shadow-sm overflow-hidden';

    let contentSpecificHtml = `<p class="text-gray-700">${postData.content}</p>`;

    // Gera o HTML específico para o tipo "Questão"
    if (postData.type === 'question' && postData.questionDetails) {
        let optionsHtml = '';
        postData.questionDetails.options.forEach((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C...
            optionsHtml += `
                <div class="flex items-start">
                    <span class="font-medium mr-2">${letter})</span>
                    <p class="text-gray-700">${option}</p>
                </div>
            `;
        });

        contentSpecificHtml = `
            <p class="text-gray-700">${postData.content}</p>
            <div class="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p class="text-gray-800 font-medium">${postData.questionDetails.title}</p>
                <div class="mt-2 space-y-2">${optionsHtml}</div>
            </div>
        `;
    }
    
    // O template completo do post
    postElement.innerHTML = `
        <div class="p-4">
            <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800">Você</h3>
                    <p class="text-xs text-gray-500">agora mesmo • ${postData.topic}</p>
                </div>
            </div>
            <div class="mb-3">${contentSpecificHtml}</div>
            <div class="flex justify-between text-gray-500 border-t border-gray-100 pt-3">
                <button class="like-button flex items-center space-x-1 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span>0</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span>Comentar</span>
                </button>
                <button class="bookmark-button flex items-center space-x-1 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    <span>Salvar</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    <span>Compartilhar</span>
                </button>
            </div>
        </div>
    `;
    return postElement;
}


function handleDynamicInteractions(container) {
  if (container.querySelector(".post")) {
    initializePostInteractions(container);
  }

  const createPostTrigger = container.querySelector("#create-post-trigger-btn");
  if (createPostTrigger) {
    createPostTrigger.addEventListener("click", () => {
      openModal("components/modal-create-post.html").then(() => {
        const postTypeSelector = document.getElementById("post-type-selector");
        const questionSection = document.getElementById("question-section");
        const publishModalBtn = document.getElementById("publish-modal-btn");

        if (postTypeSelector && questionSection) {
          postTypeSelector.addEventListener("change", (e) => {
            questionSection.classList.toggle("hidden", e.target.value !== "question");
          });
        }
        
        // NOVO: Adicionando o evento de clique ao botão de publicar do MODAL
        if (publishModalBtn) {
            publishModalBtn.addEventListener('click', () => {
                // 1. Coletar dados do formulário do modal
                const postData = {
                    topic: document.getElementById('post-topic').value || "Geral",
                    content: document.getElementById('post-content').value,
                    type: postTypeSelector.value,
                };

                // Validação simples
                if (!postData.content.trim()) {
                    alert("Por favor, escreva algo em sua publicação.");
                    return;
                }

                // 2. Se for uma questão, coletar os detalhes da questão
                if (postData.type === 'question') {
                    const options = [];
                    document.querySelectorAll('#question-options-container input').forEach(input => {
                        if (input.value.trim()) {
                            options.push(input.value.trim());
                        }
                    });

                    postData.questionDetails = {
                        title: document.getElementById('question-title').value || "Questão",
                        options: options
                    };
                }

                // 3. Criar o novo elemento de post usando a função fábrica
                const newPost = createPostElement(postData);

                // 4. Adicionar o novo post ao topo do feed
                const feedContainer = document.getElementById('feed-posts-container');
                if (feedContainer) {
                    feedContainer.prepend(newPost);
                }

                // 5. Fechar o modal
                closeModal();
            });
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    loadStaticComponent("header-container", "components/header.html"),
    loadStaticComponent("mobile-nav-container", "components/mobile-nav.html"),
  ]).then(() => {
    initializeTabs("feed", handleDynamicInteractions);
  });
});