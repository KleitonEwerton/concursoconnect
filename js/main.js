// js/main.js

import { initializeTabs } from "./ui/tabs.js";
import { initializePostInteractions } from "./components/postInteractions.js";
import { openModal } from "./ui/modal.js";

async function loadStaticComponent(containerId, filePath) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return;
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Falha ao carregar ${filePath}`);
    }
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`Erro ao carregar componente estático:`, error);
  }
}

function handleDynamicInteractions(container) {
  // Interações com os posts (curtir, salvar)
  if (container.querySelector(".post")) {
    initializePostInteractions(container);
  }

  // Gatilho para abrir o modal de criação de post
  const createPostTrigger = container.querySelector("#create-post-trigger-btn");
  if (createPostTrigger) {
    createPostTrigger.addEventListener("click", () => {
      // Abre o modal e, QUANDO estiver pronto, adiciona a lógica interna dele
      openModal("components/modal-create-post.html").then(() => {
        const postTypeSelector = document.getElementById("post-type-selector");
        const questionSection = document.getElementById("question-section");

        if (postTypeSelector && questionSection) {
          postTypeSelector.addEventListener("change", (e) => {
            questionSection.classList.toggle("hidden", e.target.value !== "question");
          });
        }
      });
    });
  }
}

// PONTO DE ENTRADA ÚNICO DA APLICAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  // Carrega os componentes estáticos que não mudam (header, nav)
  Promise.all([
    loadStaticComponent("header-container", "components/header.html"),
    loadStaticComponent("mobile-nav-container", "components/mobile-nav.html"),
  ]).then(() => {
    // Após carregar a base, inicializa o sistema de abas.
    // A função de callback 'handleDynamicInteractions' será executada a cada troca de aba.
    initializeTabs("feed", handleDynamicInteractions);
  });
});