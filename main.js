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

if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startSlideshow(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startSlideshow(); });

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

document.querySelectorAll('.process-card').forEach(el => revealObserver.observe(el));

function addReveal(selector, stagger = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (!el.classList.contains('reveal-up')) el.classList.add('reveal-up');
    if (!el.dataset.delay) el.dataset.delay = i * stagger;
    revealObserver.observe(el);
  });
}

addReveal('.service-item', 80);
addReveal('.stat-block', 100);
addReveal('.pkg-card', 80);
addReveal('.gc-card', 80);

const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.eyebrow, .section-title, .sh-right > p, .about-lead, .about-content > p, .ph-right > p, .guarantee-text, .cases-hint').forEach((el, i) => {
      el.classList.add('reveal-up');
      el.style.transitionDelay = (i * 0.1) + 's';
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
    headerObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  '.services-header, .gallery-header, .about-content, .process-header, .reviews-header, .contact-left, .packages-header, .cases-header, .guarantee-left'
).forEach(el => headerObserver.observe(el));

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
const reviewsRange = document.getElementById('reviewsRange');
const reviewCards = document.querySelectorAll('.review-card');

let currentReview = 0;
const totalReviews = reviewCards.length;
let reviewsPerView = getReviewsPerView();
let maxReviewSlide = 0;

function getReviewsPerView() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function updateReviewSlider() {
  reviewsPerView = getReviewsPerView();
  maxReviewSlide = Math.max(0, totalReviews - reviewsPerView);
  currentReview = Math.min(currentReview, maxReviewSlide);

  if (reviewsTrack && reviewCards.length) {
    reviewsTrack.style.setProperty('--reviews-per-view', reviewsPerView);
    const cardWidth = reviewCards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(reviewsTrack).gap) || 0;
    reviewsTrack.style.transform = `translateX(-${currentReview * (cardWidth + gap)}px)`;
  }

  if (reviewsRange) {
    reviewsRange.max = maxReviewSlide;
    reviewsRange.value = currentReview;
    reviewsRange.disabled = maxReviewSlide === 0;
    const progress = maxReviewSlide ? (currentReview / maxReviewSlide) * 100 : 0;
    reviewsRange.style.setProperty('--range-progress', `${progress}%`);
  }
  rvDots.forEach((dot, i) => {
    dot.hidden = i > maxReviewSlide;
    dot.classList.toggle('active', i === currentReview);
  });
}

if (rvPrev) rvPrev.addEventListener('click', () => { currentReview = Math.max(0, currentReview - 1); updateReviewSlider(); });
if (rvNext) rvNext.addEventListener('click', () => { currentReview = Math.min(maxReviewSlide, currentReview + 1); updateReviewSlider(); });
if (reviewsRange) reviewsRange.addEventListener('input', e => { currentReview = Number(e.target.value); updateReviewSlider(); });

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

window.addEventListener('resize', () => { reviewsPerView = getReviewsPerView(); updateReviewSlider(); }, { passive: true });
updateReviewSlider();

// ─── FLOATING CTA ───────────────────────────────
const floatingCta = document.getElementById('floatingCta');
const heroSection  = document.getElementById('hero');

const floatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (floatingCta) floatingCta.classList.toggle('visible', !entry.isIntersecting);
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
  item.addEventListener('mouseleave', () => { item.style.transform = ''; });
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

document.querySelectorAll('.js-modal').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); openModal(); });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

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

async function submitToTelegram(fd, btn, spanEl, successHtml, resetFn) {
  btn.disabled = true;
  spanEl.textContent = 'Отправляем…';
  try {
    const res  = await fetch('/submit', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.ok) {
      if (successHtml) btn.closest('form').innerHTML = successHtml;
      if (resetFn) resetFn();
      return true;
    } else {
      throw new Error(data.error || 'Ошибка сервера');
    }
  } catch (err) {
    spanEl.textContent = 'Ошибка — попробуйте ещё раз';
    btn.disabled = false;
    console.error(err);
    return false;
  }
}

// Modal form submit
modalForm.addEventListener('submit', async e => {
  e.preventDefault();
  const btn  = document.getElementById('mfSubmit');
  const span = btn.querySelector('span');

  const fd = new FormData();
  fd.append('name',    document.getElementById('mfName').value.trim());
  fd.append('phone',   document.getElementById('mfPhone').value.trim());
  fd.append('request', document.getElementById('mfRequest').value.trim());
  selectedFiles.forEach(f => fd.append('photos', f));

  const successHtml = `
    <div class="mf-success">
      <div class="mf-success-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h4>Заявка отправлена!</h4>
      <p>Мы перезвоним вам<br/>в течение 15 минут.</p>
    </div>`;

  const ok = await submitToTelegram(fd, btn, span, successHtml, null);
  if (ok) {
    selectedFiles = [];
    setTimeout(closeModal, 3000);
  }
});

// ─── CONTACT FORM (section) ──────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = document.getElementById('cfSubmit');
    const span = btn.querySelector('span');

    const name    = document.getElementById('cfName').value.trim();
    const phone   = document.getElementById('cfPhone').value.trim();
    const car     = document.getElementById('cfCar').value.trim();
    const service = document.getElementById('cfService').value.trim();
    const msg     = document.getElementById('cfMsg').value.trim();

    const requestParts = [];
    if (car)     requestParts.push(`Автомобиль: ${car}`);
    if (service) requestParts.push(`Услуга: ${service}`);
    if (msg)     requestParts.push(`Комментарий: ${msg}`);

    const fd = new FormData();
    fd.append('name',    name);
    fd.append('phone',   phone);
    fd.append('request', requestParts.join('\n'));

    btn.disabled = true;
    span.textContent = 'Отправляем…';

    try {
      const res  = await fetch('/submit', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.ok) {
        contactForm.innerHTML = `
          <div class="cf-success">
            <div class="cf-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h4>Заявка принята!</h4>
            <p>Перезвоним в течение 15 минут.<br/>Пн–Сб: 9:00–20:00</p>
          </div>`;
      } else {
        throw new Error(data.error || 'Ошибка');
      }
    } catch (err) {
      span.textContent = 'Ошибка — попробуйте ещё раз';
      btn.disabled = false;
      console.error(err);
    }
  });
}

// ─── MAGNETIC BUTTONS ───────────────────────────
function addMagnet(selector, strength = 0.35) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * strength;
      const y = (e.clientY - rect.top  - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

addMagnet('.nav-cta', 0.25);
addMagnet('.slide-prev, .slide-next, .rv-prev, .rv-next', 0.3);
addMagnet('.floating-cta', 0.2);

// ─── GALLERY TABS ────────────────────────────────
const gtabs   = document.querySelectorAll('.gtab');
const gpPhotos = document.getElementById('gpPhotos');
const gpVideos = document.getElementById('gpVideos');
let videosInited = false;

gtabs.forEach(tab => {
  tab.addEventListener('click', () => {
    gtabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const which = tab.dataset.tab;
    if (which === 'photos') {
      gpPhotos.classList.remove('hidden');
      gpVideos.classList.add('hidden');
    } else {
      gpPhotos.classList.add('hidden');
      gpVideos.classList.remove('hidden');
      if (!videosInited) { initGalleryVideos(); videosInited = true; }
    }
  });
});

// ─── GENERATED GALLERY VIDEOS ────────────────────
function initGalleryVideos() {
  const items  = document.querySelectorAll('.gv-item');
  const videos = document.querySelectorAll('.gv-video');

  videos.forEach(video => { video.play().catch(() => {}); });

  items.forEach(item => {
    const overlay = item.querySelector('.gv-overlay');
    const video   = item.querySelector('.gv-video');
    if (!overlay || !video) return;

    overlay.addEventListener('click', () => {
      videos.forEach(other => {
        const otherItem = other.closest('.gv-item');
        if (other === video) {
          other.muted = false;
          other.volume = 1;
          otherItem.classList.add('unmuted');
          other.play().catch(() => {});
        } else {
          other.muted = true;
          otherItem.classList.remove('unmuted');
        }
      });
    });
  });
}

// ─── BEFORE / AFTER SLIDERS ──────────────────────
function initBASlider(sliderEl, afterEl, handleEl) {
  if (!sliderEl || !afterEl || !handleEl) return;

  let isDragging = false;
  let pos = 50; // percentage

  function setPos(pct) {
    pos = Math.max(2, Math.min(98, pct));
    afterEl.style.clipPath   = `inset(0 ${100 - pos}% 0 0)`;
    handleEl.style.left      = pos + '%';
  }

  // Init at 50%
  setPos(50);

  function getPercent(clientX) {
    const rect = sliderEl.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  // Mouse events
  handleEl.addEventListener('mousedown', e => {
    e.preventDefault();
    isDragging = true;
    sliderEl.classList.add('dragging');
  });

  sliderEl.addEventListener('mousemove', e => {
    if (!isDragging) return;
    setPos(getPercent(e.clientX));
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) { isDragging = false; sliderEl.classList.remove('dragging'); }
  });

  // Touch events
  handleEl.addEventListener('touchstart', e => {
    e.preventDefault();
    isDragging = true;
    sliderEl.classList.add('dragging');
  }, { passive: false });

  sliderEl.addEventListener('touchmove', e => {
    if (!isDragging) return;
    e.preventDefault();
    setPos(getPercent(e.touches[0].clientX));
  }, { passive: false });

  sliderEl.addEventListener('touchend', () => {
    isDragging = false;
    sliderEl.classList.remove('dragging');
  });

  // Click anywhere on slider
  sliderEl.addEventListener('click', e => {
    if (e.target === handleEl || handleEl.contains(e.target)) return;
    setPos(getPercent(e.clientX));
  });
}

// Init all 3 sliders
initBASlider(
  document.getElementById('ba0'),
  document.getElementById('ba0-after'),
  document.getElementById('ba0-handle')
);
initBASlider(
  document.getElementById('ba1'),
  document.getElementById('ba1-after'),
  document.getElementById('ba1-handle')
);
initBASlider(
  document.getElementById('ba2'),
  document.getElementById('ba2-after'),
  document.getElementById('ba2-handle')
);

// ─── CARBON HUNT — Gamified Discount ─────────────
(function () {
  const TOTAL       = 10;
  const STORE_KEY   = 'msdc_sparks_v1';
  const HINT_KEY    = 'msdc_hint_seen';

  const toast       = document.getElementById('sparkToast');
  const tracker     = document.getElementById('carbonTracker');
  const countEl     = document.getElementById('carbonCount');
  const hint        = document.getElementById('carbonHint');
  const hintClose   = document.getElementById('carbonHintClose');
  const modal       = document.getElementById('carbonModal');
  const cmBackdrop  = document.getElementById('cmBackdrop');
  const cmCopy      = document.getElementById('cmCopy');
  const cmCta       = document.getElementById('cmCta');
  const cmCloseBtn  = document.getElementById('cmCloseBtn');

  // Load progress
  let found = new Set();
  try { found = new Set(JSON.parse(localStorage.getItem(STORE_KEY) || '[]')); } catch (_) {}

  const toastMessages = [
    '✦ Первая искра найдена! 1 из 10',
    '✦ Отлично! 2 из 10 — ищите дальше',
    '✦ Горячо! 3 из 10 — искра рядом',
    '✦ Уже 4 из 10 — продолжайте охоту',
    '✦ Пятая искра найдена! Половина пути',
    '✦ Великолепно! 6 из 10',
    '✦ Седьмая искра найдена — ещё немного',
    '✦ 8 из 10 — бонус уже близко',
    '✦ Осталась последняя искра!',
    '✦ Все 10 искр найдены! Получите скидку 25%'
  ];

  function save()         { localStorage.setItem(STORE_KEY, JSON.stringify([...found])); }
  function updateCount()  { countEl.textContent = found.size; }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('visible'), 2400);
  }

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Init: hide already-collected sparks; mark tracker complete if all found
  document.querySelectorAll('.carbon-spark').forEach(el => {
    const id = el.dataset.spark;
    if (found.has(id)) { el.style.display = 'none'; return; }

    el.addEventListener('click', () => {
      if (found.has(id)) return;
      found.add(id);
      save();

      // Burst animation then hide
      el.classList.add('found');
      setTimeout(() => { el.style.display = 'none'; }, 560);

      updateCount();
      showToast(toastMessages[found.size - 1] || '✦ Искра найдена!');

      // Dismiss hint if visible
      if (hint.classList.contains('visible')) {
        hint.classList.add('hiding');
        setTimeout(() => { hint.classList.remove('visible', 'hiding'); }, 420);
      }

      // Celebrate tracker
      tracker.classList.remove('complete');
      void tracker.offsetWidth; // reflow to restart animation
      if (found.size === TOTAL) tracker.classList.add('complete');

      // Open reward modal after brief pause
      if (found.size === TOTAL) setTimeout(openModal, 750);
    });
  });

  updateCount();
  if (found.size === TOTAL) tracker.classList.add('complete');

  // Show hint after 4 s on first visit (if not all found)
  if (found.size < TOTAL && !localStorage.getItem(HINT_KEY)) {
    setTimeout(() => hint.classList.add('visible'), 4000);
  }

  hintClose?.addEventListener('click', () => {
    hint.classList.add('hiding');
    setTimeout(() => { hint.classList.remove('visible', 'hiding'); }, 420);
    localStorage.setItem(HINT_KEY, '1');
  });

  cmBackdrop?.addEventListener('click', closeModal);
  cmCloseBtn?.addEventListener('click', closeModal);
  cmCta?.addEventListener('click', closeModal);

  cmCopy?.addEventListener('click', () => {
    const code = 'CARBON25';
    navigator.clipboard.writeText(code).then(() => {
      cmCopy.textContent = 'Скопировано ✓';
    }).catch(() => {
      // fallback for old browsers
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('cmCode'));
      sel.removeAllRanges();
      sel.addRange(range);
      cmCopy.textContent = 'Скопировано ✓';
    });
    setTimeout(() => { cmCopy.textContent = 'Скопировать'; }, 2200);
  });
})();
