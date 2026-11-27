/* CG Mídia — interações sem bibliotecas externas */
(() => {
  'use strict';

  // Configure o telefone com DDI + DDD + número, somente dígitos.
  const WHATSAPP_NUMBER = '5511968211709';

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    const message = link.dataset.whatsapp || 'Olá! Gostaria de falar com a CG Mídia.';
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  // Menu mobile acessível.
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');

  if (menuButton && navigation) {
    const closeMenu = () => {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Portfólio interativo.
  const tabs = [...document.querySelectorAll('.tab-button')];

  const panels = {
    sites: document.getElementById('panel-sites'),
    feed: document.getElementById('panel-feed')
  };

  const previousButton = document.getElementById('portfolio-prev');
  const nextButton = document.getElementById('portfolio-next');

  const categories = ['sites', 'feed'];
  let activeCategory = 'sites';

  function showPortfolio(category, moveFocus = false) {
    if (!panels[category]) return;

    activeCategory = category;

    tabs.forEach((tab) => {
      const active = tab.dataset.target === category;

      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;

      if (active && moveFocus) tab.focus();
    });

    Object.entries(panels).forEach(([key, panel]) => {
      const active = key === category;

      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      showPortfolio(tab.dataset.target);
    });
  });

  function movePortfolio(direction) {
    const currentIndex = categories.indexOf(activeCategory);

    const nextIndex =
      (currentIndex + direction + categories.length) % categories.length;

    showPortfolio(categories[nextIndex]);
  }

  previousButton?.addEventListener('click', () => {
    movePortfolio(-1);
  });

  nextButton?.addEventListener('click', () => {
    movePortfolio(1);
  });

  document.querySelector('.portfolio-shell')?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') movePortfolio(-1);
    if (event.key === 'ArrowRight') movePortfolio(1);
  });

  // Animação de entrada ao rolar usando IntersectionObserver.
  const revealElements = document.querySelectorAll('.reveal');

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -35px 0px'
    });

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {
    revealElements.forEach((element) => {
      element.classList.add('is-visible');
    });
  }

  // Ano automático no rodapé.
  const yearElement = document.getElementById('current-year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Estado inicial do portfólio.
  showPortfolio('sites');

})();
