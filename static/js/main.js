// ─── State ───────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('lang') || 'fr';
let siteData = null;


// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchData();
    renderAll();
    initNav();
    initScrollAnimations();
    initLangToggle();
    initContactForm();
    initHamburger();
  } catch (error) {
    console.error('Erreur lors du chargement du site :', error);
  }
});


// ─── API Content ─────────────────────────────────────────────────────────────
async function fetchData() {
  const resp = await fetch('/api/content');

  if (!resp.ok) {
    throw new Error(`Erreur API : ${resp.status}`);
  }

  siteData = await resp.json();
}


// ─── Render ──────────────────────────────────────────────────────────────────
function renderAll() {
  if (!siteData) return;

  const L = currentLang;
  const d = siteData;

  // ─── NAV ───────────────────────────────────────────────────────────────────
  document.querySelectorAll('[data-nav-about]')
    .forEach(el => el.textContent = d.nav[L].about);

  document.querySelectorAll('[data-nav-skills]')
    .forEach(el => el.textContent = d.nav[L].skills);

  document.querySelectorAll('[data-nav-services]')
    .forEach(el => el.textContent = d.nav[L].services);

  document.querySelectorAll('[data-nav-projects]')
    .forEach(el => el.textContent = d.nav[L].projects);

  document.querySelectorAll('[data-nav-contact]')
    .forEach(el => el.textContent = d.nav[L].contact);


  // ─── HERO ──────────────────────────────────────────────────────────────────
  const hero = d.hero[L];

  setText('hero-name', hero.title);
  setText('hero-subtitle', hero.subtitle);
  setText('hero-tagline', hero.tagline);
  setText('hero-cta', hero.cta);


  // ─── ABOUT ─────────────────────────────────────────────────────────────────
  const about = d.about[L];

  setText('about-heading', about.heading);
  setText('about-desc', about.description);
  setText('about-value', about.value);
  setText('about-exp', about.experience);
  setText('about-projects', about.projects_done);
  setText('about-clients', about.clients);


  // ─── SKILLS ────────────────────────────────────────────────────────────────
  setText('skills-heading', d.skills[L].heading);

  renderSkills(
    d.skills.categories,
    L
  );


  // ─── SERVICES ──────────────────────────────────────────────────────────────
  setText('services-heading', d.services[L].heading);

  renderServices(
    d.services.items,
    L
  );


  // ─── PROJECTS ──────────────────────────────────────────────────────────────
  setText(
    'projects-heading',
    d.nav[L].projects
  );

  renderProjects(
    d.projects,
    L
  );


  // ─── CONTACT ───────────────────────────────────────────────────────────────
  const contact = d.contact[L];

  setText('contact-heading', contact.heading);
  setText('contact-subtitle', contact.subtitle);
  setText('contact-name-label', contact.name_label);
  setText('contact-email-label', contact.email_label);
  setText('contact-msg-label', contact.message_label);
  setText('contact-submit', contact.submit_label);
  setText('contact-email-link', contact.email);


  // Email
  const emailEl = document.getElementById('contact-email-link');

  if (emailEl) {
    const emailLink = emailEl.closest('a');

    if (emailLink) {
      emailLink.href = `mailto:${contact.email}`;
    }
  }


  // LinkedIn
  const liEl = document.getElementById('contact-linkedin');

  if (liEl) {
    liEl.href = contact.linkedin;
  }


  // GitHub
  const ghEl = document.getElementById('contact-github');

  if (ghEl) {
    ghEl.href = contact.github;
  }


  // ─── Language buttons ──────────────────────────────────────────────────────
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === currentLang;

    btn.classList.toggle(
      'active',
      isActive
    );

    btn.setAttribute(
      'aria-pressed',
      isActive ? 'true' : 'false'
    );
  });
}


// ─── Helper: Set Text ────────────────────────────────────────────────────────
function setText(id, text) {
  const el = document.getElementById(id);

  if (el) {
    el.textContent = text ?? '';
  }
}


// ─── Skills ──────────────────────────────────────────────────────────────────
function renderSkills(categories, L) {
  const container = document.getElementById('skills-grid');

  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div class="skill-card fade-up">

      <div class="skill-card__icon">
        ${cat.icon}
      </div>

      <div class="skill-card__name">
        ${L === 'fr' ? cat.name_fr : cat.name_en}
      </div>

      <div class="skill-tags">
        ${cat.items.map(t => `
          <span class="skill-tag">
            ${t}
          </span>
        `).join('')}
      </div>

    </div>
  `).join('');

  initScrollAnimations();
}


// ─── Services ────────────────────────────────────────────────────────────────
function renderServices(items, L) {
  const container = document.getElementById('services-grid');

  if (!container) return;

  container.innerHTML = items.map(svc => `
    <div class="service-card fade-up">

      <div class="service-card__icon">
        ${svc.icon}
      </div>

      <div class="service-card__title">
        ${L === 'fr' ? svc.title_fr : svc.title_en}
      </div>

      <div class="service-card__desc">
        ${L === 'fr' ? svc.desc_fr : svc.desc_en}
      </div>

    </div>
  `).join('');

  initScrollAnimations();
}


// ─── Projects ────────────────────────────────────────────────────────────────
function renderProjects(projects, L) {
  const container = document.getElementById('projects-grid');

  if (!container) return;

  container.innerHTML = projects.map((p, i) => `
    <div class="project-card fade-up">

      <div class="project-card__num">
        PROJECT ${String(i + 1).padStart(2, '0')}
      </div>

      <div class="project-card__title">
        ${L === 'fr' ? p.title_fr : p.title_en}
      </div>

      <div class="project-card__desc">
        ${L === 'fr' ? p.desc_fr : p.desc_en}
      </div>

      <div class="project-card__tech">

        ${p.tech.map(t => `
          <span class="skill-tag">
            ${t}
          </span>
        `).join('')}

      </div>

      <div class="project-card__result">
        ${L === 'fr' ? p.result_fr : p.result_en}
      </div>

    </div>
  `).join('');

  initScrollAnimations();
}


// ─── Language ────────────────────────────────────────────────────────────────
function initLangToggle() {

  document.querySelectorAll('.lang-btn').forEach(btn => {

    btn.addEventListener('click', () => {

      currentLang = btn.dataset.lang;

      localStorage.setItem(
        'lang',
        currentLang
      );

      renderAll();

      initScrollAnimations();
    });

  });
}


// ─── Navigation ──────────────────────────────────────────────────────────────
function initNav() {

  const nav = document.querySelector('.nav');

  if (!nav) return;

  window.addEventListener(
    'scroll',
    () => {

      nav.classList.toggle(
        'scrolled',
        window.scrollY > 40
      );

    },
    { passive: true }
  );
}


// ─── Hamburger ───────────────────────────────────────────────────────────────
function initHamburger() {

  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav__links');

  if (!btn || !links) return;

  btn.addEventListener(
    'click',
    () => {

      const isOpen = links.classList.toggle('open');

      btn.setAttribute(
        'aria-expanded',
        isOpen ? 'true' : 'false'
      );

    }
  );


  links.querySelectorAll('a').forEach(a => {

    a.addEventListener(
      'click',
      () => {

        links.classList.remove('open');

        btn.setAttribute(
          'aria-expanded',
          'false'
        );

      }
    );

  });
}


// ─── Scroll Animations ───────────────────────────────────────────────────────
function initScrollAnimations() {

  if (!('IntersectionObserver' in window)) {

    document
      .querySelectorAll(
        '.fade-up:not(.visible), .fade-in:not(.visible)'
      )
      .forEach(el => {
        el.classList.add('visible');
      });

    return;
  }


  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry, i) => {

        if (entry.isIntersecting) {

          setTimeout(
            () => {
              entry.target.classList.add('visible');
            },
            i * 80
          );

          observer.unobserve(
            entry.target
          );
        }

      });

    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );


  document
    .querySelectorAll(
      '.fade-up:not(.visible), .fade-in:not(.visible)'
    )
    .forEach(el => {

      observer.observe(el);

    });
}


// ─── Contact Form ─────────────────────────────────────────────────────────────
//
// IMPORTANT:
// The previous version did NOT send an email.
// It only displayed "Envoyé ✓".
//
// This version sends the form data to FormSubmit,
// which forwards the message to:
// ai.novacrew@gmail.com
//
// ─────────────────────────────────────────────────────────────────────────────

function initContactForm() {

  const form = document.getElementById('contact-form');

  if (!form) return;


  form.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();


      const btn = form.querySelector(
        'button[type="submit"]'
      );

      if (!btn) return;


      // ─── Read fields ───────────────────────────────────────────────────────
      const nameField =
        document.getElementById('f-name');

      const emailField =
        document.getElementById('f-email');

      const messageField =
        document.getElementById('f-message');


      const name =
        nameField?.value.trim() || '';

      const email =
        emailField?.value.trim() || '';

      const message =
        messageField?.value.trim() || '';


      // ─── Original button text ─────────────────────────────────────────────
      const originalText =
        siteData?.contact?.[currentLang]?.submit_label ||
        (currentLang === 'fr' ? 'Envoyer' : 'Send');


      // ─── Validation ──────────────────────────────────────────────────────
      if (!name || !email || !message) {

        alert(
          currentLang === 'fr'
            ? 'Veuillez remplir tous les champs.'
            : 'Please fill in all fields.'
        );

        return;
      }


      // Email validation
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailPattern.test(email)) {

        alert(
          currentLang === 'fr'
            ? 'Veuillez entrer une adresse courriel valide.'
            : 'Please enter a valid email address.'
        );

        emailField?.focus();

        return;
      }


      // ─── Disable button during submission ─────────────────────────────────
      btn.disabled = true;

      btn.textContent =
        currentLang === 'fr'
          ? 'Envoi en cours…'
          : 'Sending…';


      try {

        // ─── Send email ─────────────────────────────────────────────────────
        const response = await fetch(
          'https://formsubmit.co/ajax/ai.novacrew@gmail.com',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },

            body: JSON.stringify({

              name: name,

              email: email,

              message: message,

              _subject:
                'Nouveau message depuis le portfolio BI & AI',

              _template:
                'table',

              _captcha:
                'true'

            })
          }
        );


        // ─── Read response ──────────────────────────────────────────────────
        const result =
          await response.json().catch(
            () => ({})
          );


        // ─── Check response ─────────────────────────────────────────────────
        if (
          !response.ok ||
          result.success === false
        ) {

          throw new Error(
            'Le service de messagerie a refusé la demande.'
          );

        }


        // ─── Success ────────────────────────────────────────────────────────
        btn.textContent =
          currentLang === 'fr'
            ? 'Courriel envoyé ✓'
            : 'Email sent ✓';


        btn.style.background =
          '#10b981';


        // Clear form
        form.reset();


        // Restore button
        setTimeout(
          () => {

            btn.textContent =
              siteData?.contact?.[currentLang]?.submit_label ||
              originalText;

            btn.style.background = '';

            btn.disabled = false;

          },
          4000
        );


      } catch (error) {

        // ─── Error ──────────────────────────────────────────────────────────
        console.error(
          'Erreur formulaire de contact :',
          error
        );


        btn.textContent =
          originalText;


        btn.disabled = false;


        alert(
          currentLang === 'fr'
            ? 'Impossible d’envoyer le courriel pour le moment. Veuillez réessayer ou utiliser directement ai.novacrew@gmail.com.'
            : 'The email could not be sent right now. Please try again or email ai.novacrew@gmail.com directly.'
        );

      }

    }
  );
}
