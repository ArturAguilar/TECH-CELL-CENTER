document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.menu-navegacao');

    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('ativo');
        menuToggle.classList.toggle('ativo');
    });
});

function fecharMenu() {
    const navMenu = document.querySelector('.menu-navegacao');
    const menuToggle = document.getElementById('menuToggle');
    navMenu.classList.remove('ativo');
    menuToggle.classList.remove('ativo');
}