// ===================================== MENU =====================================
const menu = document.querySelector('.menu');
const NavMenu = document.querySelector('.nav-menu');

menu.addEventListener('click', () => {
    menu.classList.toggle('ativo');
    NavMenu.classList.toggle('ativo');
});

function fecharMenu() {
    document.querySelector(".nav-menu").classList.remove("ativo");
    document.querySelector(".menu").classList.remove("ativo");

    menu.addEventListener('click' , () => {
        menu.classList.toggle('desativar');
        NavMenu.classList.toggle('desativar');
        });
}

// ===================================== Main =====================================
// ===================================== Carrossel =====================================
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".carousel-slide");
  const dotsContainer = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  let currentIndex = 0;

  function atualizarCarrossel() {
      slides.forEach((slide, index) => {
          slide.classList.toggle("active", index === currentIndex);
      });

      document.querySelectorAll(".carousel-dots span").forEach((dot, index) => {
          dot.classList.toggle("active-dot", index === currentIndex);
      });
  }

  function criarIndicadores() {
      slides.forEach((_, index) => {
          const dot = document.createElement("span");
          dot.addEventListener("click", () => {
              currentIndex = index;
              atualizarCarrossel();
          });
          dotsContainer.appendChild(dot);
      });
  }

  function proximoSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      atualizarCarrossel();
  }

  function slideAnterior() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      atualizarCarrossel();
  }

  prevBtn.addEventListener("click", slideAnterior);
  nextBtn.addEventListener("click", proximoSlide);

  criarIndicadores();
  atualizarCarrossel();
  setInterval(proximoSlide, 3000); // Troca automática a cada s
});