// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

// Create overlay
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

function openMenu() {
  nav.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
}

function closeMenu() {
  nav.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
  menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
}

menuToggle.addEventListener('click', () => {
  nav.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

// Close menu on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Contact form
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensaje enviado. Nos pondremos en contacto contigo pronto.');
    form.reset();
  });
}
