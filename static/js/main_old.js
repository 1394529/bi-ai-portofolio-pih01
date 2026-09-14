// ─── State ───────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('lang') || 'fr';
let siteData = null;

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await fetchData();
  renderAll();
  initNav();
  initScrollAnimations();
  initLangToggle();
  initContactForm();
  initHamburger();
});

async function fetchData() {
  const resp = await fetch('/api/content');
  siteData = await resp.json();
}

// ─── Render ──────────────────────────────────────────────────────────────────
function renderAll() {
  const L = currentLang;
  const d = siteData;

  // NAV
  document.querySelectorAll('[data-nav-about]').forEach(el => el.textContent = d.nav[L].about);
  document.querySelectorAll('[data-nav-skills]').forEach(el => el.textContent = d.nav[L].skills);
  document.querySelectorAll('[data-nav-services]').forEach(el => el.textContent = d.nav[L].services);
  document.querySelectorAll('[data-nav-projects]').forEach(el => el.textContent = d.nav[L].projects);
  document.querySelectorAll('[data-nav-contact]').forEach(el => el.textContent = d.nav[L].contact);

  // HERO
  const hero = d.hero[L];
  setText('hero-name', hero.title);
  setText('hero-subtitle', hero.subtitle);
  setText('hero-tagline', hero.tagline);
  setText('hero-cta', hero.cta);

  // ABOUT
  const about = d.about[L];
  setText('about-heading', about.heading);
  setText('about-desc', about.description);
  setText('about-value', about.value);
  setText('about-exp', about.experience);
  setText('about-projects', about.projects_done);
  setText('about-clients', about.clients);

  // SKILLS
  setText('skills-heading', d.skills[L].heading);
  renderSkills(d.skills.categories, L);

  // SERVICES
  setText('services-heading', d.services[L].heading);
  renderServices(d.services.items, L);

  // PROJECTS
  setText('projects-heading', d.nav[L].projects);
  renderProjects(d.projects, L);

  // CONTACT
  const contact = d.contact[L];
  setText('contact-heading', contact.heading);
  setText('contact-subtitle', contact.subtitle);
  setText('contact-name-label', contact.name_label);
  setText('contact-email-label', contact.email_label);
  setText('contact-msg-label', contact.message_label);
  setText('contact-submit', contact.submit_label);
  setText('contact-email-link', contact.email);
  const emailEl = document.getElementById('contact-email-link');
  if (emailEl) emailEl.closest('a').href = 'mailto:' + contact.email;
  const liEl = document.getElementById('contact-linkedin');
  if (liEl) liEl.href = contact.linkedin;
  const ghEl = document.getElementById('contact-github');
  if (ghEl) ghEl.href = contact.github;

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderSkills(categories, L) {
  const container = document.getElementById('skills-grid');
  if (!container) return;
  container.innerHTML = categories.map(cat => `
    <div class="skill-card fade-up">
      <div class="skill-card__icon">${cat.icon}</div>
      <div class="skill-card__name">${L === 'fr' ? cat.name_fr : cat.name_en}</div>
      <div class="skill-tags">
        ${cat.items.map(t => `<span class="skill-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
  initScrollAnimations();
}

function renderServices(items, L) {
  const container = document.getElementById('services-grid');
  if (!container) return;
  container.innerHTML = items.map(svc => `
    <div class="service-card fade-up">
      <div class="service-card__icon">${svc.icon}</div>
      <div class="service-card__title">${L === 'fr' ? svc.title_fr : svc.title_en}</div>
      <div class="service-card__desc">${L === 'fr' ? svc.desc_fr : svc.desc_en}</div>
    </div>
  `).join('');
  initScrollAnimations();
}

function renderProjects(projects, L) {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  container.innerHTML = projects.map((p, i) => `
    <div class="project-card fade-up">
      <div class="project-card__num">PROJECT 0${i + 1}</div>
      <div class="project-card__title">${L === 'fr' ? p.title_fr : p.title_en}</div>
      <div class="project-card__desc">${L === 'fr' ? p.desc_fr : p.desc_en}</div>
      <div class="project-card__tech">
        ${p.tech.map(t => `<span class="skill-tag">${t}</span>`).join('')}
      </div>
      <div class="project-card__result">${L === 'fr' ? p.result_fr : p.result_en}</div>
    </div>
  `).join('');
  initScrollAnimations();
}

// ─── Lang ────────────────────────────────────────────────────────────────────
function initLangToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('lang', currentLang);
      renderAll();
      initScrollAnimations();
    });
  });
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav__links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// ─── Scroll Animations ────────────────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up:not(.visible), .fade-in:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = currentLang === 'fr' ? 'Envoyé ✓' : 'Sent ✓';
    btn.style.background = '#10b981';
    setTimeout(() => {
      form.reset();
      btn.textContent = siteData.contact[currentLang].submit_label;
      btn.style.background = '';
    }, 3000);
  });
}
