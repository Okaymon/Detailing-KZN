/* =============================================
   MS DETAILING — DARK LUXURY JS
   ============================================= */

'use strict';

// ─── LOADER ─────────────────────────────────────
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    initHeroAnimation();
  }, 200);
});

// ─── CUSTOM CURSOR ──────────────────────────────
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  }, { passive: true });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('[data-cursor="link"]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  document.querySelectorAll('[data-cursor="zoom"]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('zooming'));
    el.addEventListener('mouseleave', () => ring.classList.remove('zooming'));
  });
}

// ─── NAV ────────────────────────────────────────
const nav    = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ─── HERO SLIDESHOW ─────────────────────────────
const slides      = document.querySelectorAll('.hero-slide');
const counterEl   = document.getElementById('slideCurrentNum');
const progressBar = document.getElementById('heroProgressBar');
const prevBtn     = document.getElementById('slidePrev');
const nextBtn     = document.getElementById('slideNext');

let currentSlide    = 0;
let slideInterval   = null;
let progressInterval = null;
const SLIDE_DURATION = 5500;
const TOTAL_SLIDES   = slides.length;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + TOTAL_SLIDES) % TOTAL_SLIDES;
  slides[currentSlide].classList.add('active');
  if (counterEl) counterEl.textContent = currentSlide + 1;
}

function startProgress() {
  if (progressBar) progressBar.style.width = '0%';
  clearInterval(progressInterval);
  let elapsed = 0;
  const step = 50;
  progressInterval = setInterval(() => {
    elapsed += step;
    const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
    if (progressBar) progressBar.style.width = pct + '%';
    if (elapsed >= SLIDE_DURATION) clearInterval(progressInterval);
  }, step);
}

function startSlideshow() {
  clearInterval(slideInterval);
  startProgress();
  slideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
    startProgress();
  }, SLIDE_DURATION);
}

function initHeroAnimation() {
  startSlideshow();
}

if (prevBtn) prevBtn.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  startSlideshow();
});

if (nextBtn) nextBtn.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  startSlideshow();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); startSlideshow(); }
  if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startSlideshow(); }
});

// ─── MARQUEE DUPLICATE ──────────────────────────
const marqueeInner = document.querySelector('.marquee-inner');
if (marqueeInner) {
  const clone = marqueeInner.cloneNode(true);
  marqueeInner.parentNode.appendChild(clone);
}

// ─── SCROLL REVEAL ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });

// Observe process cards
document.querySelectorAll('.process-card').forEach(el => revealObserver.observe(el));

// Generic reveal-up
function addReveal(selector, stagger = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal-up');
    el.dataset.delay = i * stagger;
    revealObserver.observe(el);
  });
}

addReveal('.service-item', 80);
addReveal('.review-card', 80);
addReveal('.stat-block', 100);

// Section headers reveal
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.eyebrow, .section-title, .sh-right > p, .about-lead, .about-content > p').forEach((el, i) => {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 0.1) + 's';
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
    headerObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.services-header, .gallery-header, .about-content, .process-header, .reviews-header, .contact-left').forEach(el => {
  headerObserver.observe(el);
});

// ─── STAT COUNTERS ──────────────────────────────
let countersTriggered = false;

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || countersTriggered) return;
    countersTriggered = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      animateCount(el, target, 2000);
    });
    statObserver.disconnect();
  });
}, { threshold: 0.4 });

const statsEl = document.querySelector('.stats-section');
if (statsEl) statObserver.observe(statsEl);

function animateCount(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

// ─── REVIEWS SLIDER ─────────────────────────────
const reviewsTrack = document.getElementById('reviewsTrack');
const rvPrev   = document.getElementById('rvPrev');
const rvNext   = document.getElementById('rvNext');
const rvDots   = document.querySelectorAll('.rv-dot');
const reviewCards = document.querySelectorAll('.review-card');

let currentReview = 0;
const totalReviews = reviewCards.length;
let reviewsPerView = getReviewsPerView();

function getReviewsPerView() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 4;
}

function updateReviewSlider() {
  reviewsPerView = getReviewsPerView();
  const maxSlide = Math.max(0, totalReviews - reviewsPerView);
  currentReview = Math.min(currentReview, maxSlide);

  if (reviewsTrack) {
    const cardWidth = reviewCards[0].offsetWidth + 20;
    reviewsTrack.style.transform = `translateX(-${currentReview * cardWidth}px)`;
  }

  // Update dots
  rvDots.forEach((dot, i) => dot.classList.toggle('active', i === currentReview));
}

if (rvPrev) rvPrev.addEventListener('click', () => {
  currentReview = Math.max(0, currentReview - 1);
  updateReviewSlider();
});

if (rvNext) rvNext.addEventListener('click', () => {
  const maxSlide = Math.max(0, totalReviews - getReviewsPerView());
  currentReview = Math.min(maxSlide, currentReview + 1);
  updateReviewSlider();
});

// Touch/swipe for reviews
let touchStartX = 0;
if (reviewsTrack) {
  reviewsTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  reviewsTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) rvNext && rvNext.click();
      else rvPrev && rvPrev.click();
    }
  }, { passive: true });
}

window.addEventListener('resize', () => {
  reviewsPerView = getReviewsPerView();
  updateReviewSlider();
}, { passive: true });

// ─── FLOATING CTA ───────────────────────────────
const floatingCta = document.getElementById('floatingCta');
const heroSection  = document.getElementById('hero');

const floatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (floatingCta) {
      floatingCta.classList.toggle('visible', !entry.isIntersecting);
    }
  });
}, { threshold: 0.1 });

if (heroSection) floatObserver.observe(heroSection);

// ─── PARALLAX ───────────────────────────────────
const statsBg = document.querySelector('.stats-bg');

window.addEventListener('scroll', () => {
  if (!statsBg) return;
  const rect = statsBg.closest('.stats-section').getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;
  const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  statsBg.style.transform = `scale(1.04) translateY(${(progress - 0.5) * 60}px)`;
}, { passive: true });

// ─── SERVICE ITEM HOVER IMAGE ────────────────────
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const img = item.querySelector('.si-img');
    if (img) img.style.opacity = '1';
  });
  item.addEventListener('mouseleave', () => {
    const img = item.querySelector('.si-img');
    if (img && !item.classList.contains('featured-service')) img.style.opacity = '0.7';
  });
});

// ─── SMOOTH SCROLL ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── GALLERY MOSAIC hover depth ─────────────────
document.querySelectorAll('.gm-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    item.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ─── MODAL FORM ─────────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalForm    = document.getElementById('modalForm');
const mfPhotos     = document.getElementById('mfPhotos');
const mfPreview    = document.getElementById('mfPreview');
const uploadArea   = document.getElementById('uploadArea');

let selectedFiles = [];

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Open on all .js-modal links
document.querySelectorAll('.js-modal').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); openModal(); });
});

// Close on backdrop click / close button / Escape
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Photo preview
function renderPreviews() {
  mfPreview.innerHTML = '';
  uploadArea.classList.toggle('has-files', selectedFiles.length > 0);
  selectedFiles.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const wrap = document.createElement('div');
      wrap.className = 'mf-preview-item';
      wrap.innerHTML = `<img src="${ev.target.result}" alt="фото ${i+1}"/>
        <button class="mf-remove" type="button" data-index="${i}">✕</button>`;
      wrap.querySelector('.mf-remove').addEventListener('click', () => {
        selectedFiles.splice(i, 1);
        renderPreviews();
      });
      mfPreview.appendChild(wrap);
    };
    reader.readAsDataURL(file);
  });
}

mfPhotos.addEventListener('change', () => {
  selectedFiles = [...selectedFiles, ...Array.from(mfPhotos.files)];
  mfPhotos.value = '';
  renderPreviews();
});

// Submit via fetch → /submit
modalForm.addEventListener('submit', async e => {
  e.preventDefault();
  const btn  = document.getElementById('mfSubmit');
  const span = btn.querySelector('span');
  btn.disabled = true;
  span.textContent = 'Отправляем…';

  const fd = new FormData();
  fd.append('name',    document.getElementById('mfName').value.trim());
  fd.append('tg_nick', document.getElementById('mfTg').value.trim());
  fd.append('request', document.getElementById('mfRequest').value.trim());
  selectedFiles.forEach(f => fd.append('photos', f));

  try {
    const res = await fetch('/submit', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.ok) {
      modalForm.innerHTML = `
        <div class="mf-success">
          <div class="mf-success-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h4>Заявка отправлена!</h4>
          <p>Мы напишем вам в Telegram<br/>в ближайшее время.</p>
        </div>`;
      selectedFiles = [];
      setTimeout(closeModal, 3000);
    } else {
      throw new Error(data.error || 'Ошибка сервера');
    }
  } catch (err) {
    span.textContent = 'Ошибка — попробуйте ещё раз';
    btn.disabled = false;
    console.error(err);
  }
});

// ─── MAGNETIC BUTTONS ───────────────────────────
function addMagnet(selector, strength = 0.35) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * strength;
      const y = (e.clientY - rect.top  - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

addMagnet('.nav-cta', 0.25);
addMagnet('.slide-prev, .slide-next, .rv-prev, .rv-next', 0.3);
addMagnet('.floating-cta', 0.2);
