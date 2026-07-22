/* =============================================
   MS DETAILING — MAIN JAVASCRIPT
   ============================================= */

// ─── NAV SCROLL BEHAVIOR ───────────────────────
const nav = document.getElementById('nav');
const hero = document.getElementById('hero');

function updateNav() {
  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom < 80) {
    nav.classList.add('scrolled');
    nav.classList.remove('hero-nav');
  } else {
    nav.classList.remove('scrolled');
    nav.classList.add('hero-nav');
  }
}

nav.classList.add('hero-nav');
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─── MOBILE MENU ────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── HERO SLIDESHOW ─────────────────────────────
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let currentSlide = 0;
let slideTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  // Reset animation
  slides[index].style.animation = 'none';
  slides[index].offsetHeight; // trigger reflow
  slides[index].style.animation = '';

  currentSlide = index;
  slides[currentSlide].classList.add('active');

  // Restart the appropriate kenBurns animation
  const animMap = ['kenBurns1', 'kenBurns2', 'kenBurns3', 'kenBurns4'];
  slides[currentSlide].style.animationName = animMap[currentSlide % animMap.length];
}

function nextSlide() {
  const next = (currentSlide + 1) % totalSlides;
  goToSlide(next);
}

function startSlideshow() {
  slideTimer = setInterval(nextSlide, 5500);
}

startSlideshow();

// ─── SHINE PARTICLE CANVAS ──────────────────────
const canvas = document.getElementById('shineCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class ShineParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 0.5;
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.8 + 0.2;
    this.speed = Math.random() * 0.3 + 0.1;
    this.phase = Math.random() * Math.PI * 2;
    this.rising = true;
    this.dx = (Math.random() - 0.5) * 0.4;
    this.dy = (Math.random() - 0.5) * 0.3;
    // Gold / white sparkle colors
    const colors = [
      'rgba(255, 248, 200,',
      'rgba(255, 255, 255,',
      'rgba(212, 175, 106,',
      'rgba(255, 240, 160,',
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.phase += this.speed * 0.04;
    this.x += this.dx;
    this.y += this.dy;

    if (this.rising) {
      this.opacity += 0.012;
      if (this.opacity >= this.maxOpacity) {
        this.rising = false;
      }
    } else {
      this.opacity -= 0.008;
      if (this.opacity <= 0) {
        this.reset();
      }
    }
  }

  draw() {
    const pulse = 1 + Math.sin(this.phase) * 0.3;
    const r = this.size * pulse;

    // Glow
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 4);
    grd.addColorStop(0, `${this.color}${this.opacity})`);
    grd.addColorStop(0.3, `${this.color}${this.opacity * 0.5})`);
    grd.addColorStop(1, `${this.color}0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 4, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = `${this.color}${Math.min(this.opacity * 1.5, 1)})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();

    // Cross sparkle
    const len = r * 5 * pulse;
    ctx.strokeStyle = `${this.color}${this.opacity * 0.6})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(this.x - len, this.y);
    ctx.lineTo(this.x + len, this.y);
    ctx.moveTo(this.x, this.y - len);
    ctx.lineTo(this.x, this.y + len);
    ctx.stroke();
  }
}

// Initialize particles
for (let i = 0; i < 60; i++) {
  const p = new ShineParticle();
  p.opacity = Math.random() * p.maxOpacity; // start at random opacity
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

animateParticles();

// ─── LENS FLARE MOVEMENT ─────────────────────────
const lensFlare = document.getElementById('lensFlare');
let mouseX = window.innerWidth * 0.3;
let mouseY = window.innerHeight * 0.3;
let flareX = mouseX;
let flareY = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX - 150;
  mouseY = e.clientY - 150;
}, { passive: true });

function animateFlare() {
  flareX += (mouseX - flareX) * 0.04;
  flareY += (mouseY - flareY) * 0.04;
  lensFlare.style.left = flareX + 'px';
  lensFlare.style.top = flareY + 'px';
  requestAnimationFrame(animateFlare);
}
animateFlare();

// ─── COUNTER ANIMATION ──────────────────────────
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else counter.textContent = target;
    }

    requestAnimationFrame(step);
  });
}

// ─── SCROLL REVEAL OBSERVER ──────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Delay for cards
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Observe all reveal elements
document.querySelectorAll('.reveal, .service-card, .testimonial-card, .gallery-item').forEach(el => {
  revealObserver.observe(el);
});

// Trigger hero reveals immediately after a moment
setTimeout(() => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}, 300);

// Stats counter trigger
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats-bar');
if (statsSection) statsObserver.observe(statsSection);

// Observe stat items for reveal
document.querySelectorAll('.stat-item').forEach((el, i) => {
  el.dataset.delay = i * 100;
  revealObserver.observe(el);
});

// ─── FORM SUBMISSION ────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Заявка отправлена ✓';
    btn.style.background = '#2d6e4e';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Отправить заявку';
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });
}

// ─── SMOOTH SCROLL FOR NAV LINKS ────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── PARALLAX ON HERO ───────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;
  if (scrollY <= heroHeight) {
    const parallaxAmount = scrollY * 0.35;
    const slides = document.querySelectorAll('.slide.active');
    slides.forEach(slide => {
      slide.style.transform = `translateY(${parallaxAmount}px)`;
    });
  }
}, { passive: true });
