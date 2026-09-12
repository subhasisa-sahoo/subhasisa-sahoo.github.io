/* ============================================================
  PORTFOLIO LOADER
============================================================ */
const portfolioLoader = document.getElementById('portfolio-loader');
if (portfolioLoader) {
  const hideLoader = () => portfolioLoader.classList.add('is-hidden');
  window.addEventListener('load', () => setTimeout(hideLoader, 4800), { once: true });
  setTimeout(hideLoader, 6500);
}

/* ============================================================
   MOBILE NAV
============================================================ */
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

mobileMenu.addEventListener('click', () => {
  navList.classList.toggle('active');
  mobileMenu.classList.toggle('change');
});

navList.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navList.classList.remove('active');
    mobileMenu.classList.remove('change');
  });
});

/* ============================================================
   THEME TOGGLE (persisted)
============================================================ */
const storageKey = 'theme-preference';
const getColorPreference = () =>
  localStorage.getItem(storageKey) ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

const theme = { value: getColorPreference() };

const reflectPreference = () => {
  document.body.setAttribute('data-theme', theme.value);
  document.getElementById('theme-toggle')?.setAttribute('aria-label', theme.value);
};
reflectPreference();

document.getElementById('theme-toggle').addEventListener('click', () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem(storageKey, theme.value);
  reflectPreference();
});

/* ============================================================
   SCROLL PROGRESS BAR
============================================================ */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ============================================================
   REDUCED MOTION CHECK
============================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   SPARKLE / STARFIELD CANVAS (fixed backdrop)
============================================================ */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
let starOffset = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.2,
    speed: Math.random() * 0.4 + 0.05,
    twinkle: Math.random() * Math.PI * 2,
  }));
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(t / 900 + s.twinkle);
    ctx.globalAlpha = 0.25 + twinkle * 0.75;
    ctx.fillStyle = '#fff';
    const y = (s.y + starOffset * s.speed) % (canvas.height + 20);
    ctx.beginPath();
    ctx.arc(s.x, y < 0 ? y + canvas.height : y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

if (!reduceMotion) {
  function loop(t) {
    drawStars(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
} else {
  drawStars(0);
}

/* ============================================================
   PARALLAX (stars drift + floating blobs) on scroll
============================================================ */
const parallaxEls = document.querySelectorAll('[data-parallax]');
let ticking = false;
function onScrollParallax() {
  const y = window.scrollY;
  starOffset = y * 0.15;
  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.1;
    el.style.transform = `translate3d(0, ${y * speed * -0.3}px, 0)`;
  });
  ticking = false;
}
window.addEventListener(
  'scroll',
  () => {
    if (!ticking && !reduceMotion) {
      requestAnimationFrame(onScrollParallax);
      ticking = true;
    }
  },
  { passive: true }
);

/* ============================================================
   HERO NAME — letter-by-letter reveal
============================================================ */
const heroName = document.getElementById('hero-name');
if (heroName) {
  const text = heroName.textContent.replace(/\s+/g, ' ').trim();
  heroName.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.setProperty('--i', i);
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    heroName.appendChild(span);
  });
  heroName.setAttribute('aria-label', text);
}

/* ============================================================
   TYPED ROTATING ROLE TEXT
============================================================ */
const dynamicText = document.querySelector('.dynamic-text');
const phrases = ['Web Developer', 'Programmer', 'System Engineer @ TCS'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  dynamicText.textContent = current.substring(0, charIndex);

  let delay = deleting ? 55 : 110;

  if (!deleting && charIndex === current.length) {
    delay = 1400;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }
  setTimeout(type, delay);
}
if (dynamicText) setTimeout(type, 600);

/* ============================================================
   SCROLL REVEAL (lightweight replacement for AOS)
============================================================ */
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ============================================================
   PROJECT MODALS
============================================================ */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  // next frame, so the display:block is committed before we animate opacity/transform in
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('show')));
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (!modal.classList.contains('show')) modal.style.display = 'none';
  }, 300);
}
window.openModal = openModal;
window.closeModal = closeModal;

window.addEventListener('click', (event) => {
  document.querySelectorAll('.modal.show').forEach((modal) => {
    if (event.target === modal) closeModal(modal.id);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach((modal) => closeModal(modal.id));
  }
});

/* ============================================================
   FOOTER YEAR
============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
