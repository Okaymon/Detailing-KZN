/* ═══════════════════════════════════════════════════
   MS Detailing Carbon — Telegram Mini App logic
   ═══════════════════════════════════════════════════ */

const TMA = (() => {

  /* ── Telegram WebApp ──────────────────────────── */
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user || null;

  /* ── State ────────────────────────────────────── */
  let currentTab = 'home';
  let tryonImg = null;
  let tryonTreatment = 'original';
  let tryonColor = 'none';

  /* ── Storage (localStorage) ───────────────────── */
  const STORAGE_KEY = 'msdc_bookings_v1';
  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveBooking(b) {
    const list = loadBookings();
    list.unshift(b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  }

  /* ── Init ─────────────────────────────────────── */
  function init() {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#18181b');
      tg.setBackgroundColor('#18181b');
    }
    setupUser();
    setupBookingForm();
    setupPhotoPreview();
    renderCabinet();
  }

  /* ── User setup ───────────────────────────────── */
  function setupUser() {
    if (!user) return;

    /* Booking form greet */
    const greet = document.getElementById('tmaUserGreet');
    const avatarEl = document.getElementById('tmaUserAvatar');
    const nameEl = document.getElementById('tmaUserName');
    if (greet) {
      greet.style.display = 'flex';
      const initials = ((user.first_name || '')[0] || '') + ((user.last_name || '')[0] || '');
      avatarEl.textContent = initials || '👤';
      nameEl.textContent = [user.first_name, user.last_name].filter(Boolean).join(' ');
    }

    /* Pre-fill name field */
    const bName = document.getElementById('bName');
    if (bName && user.first_name) {
      bName.value = [user.first_name, user.last_name].filter(Boolean).join(' ');
    }

    /* Hide phone — we know who the user is via Telegram */
    const fieldPhone = document.getElementById('fieldPhone');
    if (fieldPhone) fieldPhone.style.display = 'none';
  }

  /* ── Navigation ───────────────────────────────── */
  function goTo(tab) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tma-nav-btn[data-tab]').forEach(b => b.classList.remove('active'));

    const screen = document.getElementById('screen-' + tab);
    if (screen) screen.classList.add('active');

    const navBtn = document.querySelector(`.tma-nav-btn[data-tab="${tab}"]`);
    if (navBtn) navBtn.classList.add('active');

    currentTab = tab;

    if (tg) {
      if (tab === 'home') tg.BackButton.hide();
      else {
        tg.BackButton.show();
        tg.BackButton.onClick(() => goTo('home'));
      }
    }

    if (tab === 'cabinet') renderCabinet();
  }

  /* ── Booking form ─────────────────────────────── */
  function openBooking(service) {
    const section = document.getElementById('bookingSection');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (service) {
      document.getElementById('bService').value = service;
    }
  }

  function closeBooking() {
    document.getElementById('bookingSection').style.display = 'none';
  }

  function bookService(service) {
    goTo('home');
    setTimeout(() => openBooking(service), 100);
  }

  function setupPhotoPreview() {
    const input = document.getElementById('bPhotos');
    const preview = document.getElementById('bPhotoPreview');
    if (!input) return;
    input.addEventListener('change', () => {
      preview.innerHTML = '';
      Array.from(input.files).slice(0, 5).forEach(f => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(f);
        preview.appendChild(img);
      });
    });
  }

  function setupBookingForm() {
    const form = document.getElementById('tmaBookingForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitBooking();
    });
  }

  async function submitBooking() {
    const btn = document.getElementById('bSubmit');
    const result = document.getElementById('bResult');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Отправляем...';
    result.className = 'form-result';
    result.textContent = '';

    const name    = document.getElementById('bName').value.trim();
    const phone   = document.getElementById('bPhone')?.value.trim() || '';
    const service = document.getElementById('bService').value;
    const comment = document.getElementById('bComment').value.trim();
    const photos  = document.getElementById('bPhotos').files;

    /* Build telegram handle */
    const tgInfo = user
      ? `@${user.username || ''} (id: ${user.id}, ${[user.first_name, user.last_name].filter(Boolean).join(' ')})`
      : '';

    const request = [service, comment, tgInfo ? `Telegram: ${tgInfo}` : ''].filter(Boolean).join('\n');

    const fd = new FormData();
    fd.append('name', name || (user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : ''));
    fd.append('phone', phone);
    fd.append('request', request);
    fd.append('source', 'telegram_mini_app');
    for (const f of photos) fd.append('photos', f);

    try {
      const res = await fetch('/submit', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.ok) {
        result.className = 'form-result ok';
        result.textContent = '✓ Заявка отправлена! Ответим в течение 15 минут.';
        btn.querySelector('span').textContent = '✓ Отправлено';

        /* Save to local history */
        saveBooking({
          id: Date.now(),
          service: service || 'Консультация',
          comment,
          date: new Date().toLocaleDateString('ru-RU'),
          status: 'Принята'
        });

        if (tg) {
          tg.HapticFeedback.notificationOccurred('success');
          setTimeout(() => tg.showAlert('Заявка принята! Мастер свяжется с вами в течение 15 минут.'), 400);
        }

        /* Reset form */
        setTimeout(() => {
          document.getElementById('bService').value = '';
          document.getElementById('bComment').value = '';
          document.getElementById('bPhotos').value = '';
          document.getElementById('bPhotoPreview').innerHTML = '';
          document.getElementById('bPhone') && (document.getElementById('bPhone').value = '');
          btn.querySelector('span').textContent = 'Отправить заявку';
          btn.disabled = false;
          result.textContent = '';
          closeBooking();
        }, 3000);
      } else {
        throw new Error(data.error || 'Ошибка сервера');
      }
    } catch (err) {
      result.className = 'form-result err';
      result.textContent = '⚠ ' + (err.message || 'Попробуйте ещё раз');
      btn.querySelector('span').textContent = 'Отправить заявку';
      btn.disabled = false;
      if (tg) tg.HapticFeedback.notificationOccurred('error');
    }
  }

  /* ── Book from try-on ─────────────────────────── */
  function bookFromTryon() {
    const labels = {
      polish:   'Блеск — Полировка кузова (от 8 000 ₽)',
      ceramic:  'Защита — Керамическое покрытие (от 25 000 ₽)',
      ppf:      'Защита — Бронирование PPF (от 15 000 ₽)',
      tint:     'Тонировка стёкол',
      original: ''
    };
    goTo('home');
    setTimeout(() => openBooking(labels[tryonTreatment] || ''), 100);
  }

  /* ── Cabinet ──────────────────────────────────── */
  function renderCabinet() {
    /* Profile */
    const cpName = document.getElementById('cpName');
    const cpId   = document.getElementById('cpId');
    const cpAvatar = document.getElementById('cpAvatar');
    if (user) {
      cpName.textContent = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь';
      cpId.textContent = user.username ? '@' + user.username : 'ID: ' + user.id;
      const initials = ((user.first_name || '')[0] || '') + ((user.last_name || '')[0] || '');
      cpAvatar.textContent = initials || '👤';
    } else {
      cpName.textContent = 'Войдите через Telegram';
      cpId.textContent = 'Откройте приложение в боте';
    }

    /* Bookings */
    const bookings = loadBookings();
    const list = document.getElementById('bookingsList');
    const statsEl = document.getElementById('cabinetStats');

    if (bookings.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="es-icon">📋</div>
          <div class="es-text">Заявок пока нет</div>
          <div class="es-sub">Запишитесь на услугу — история появится здесь</div>
          <button class="tma-submit" style="width:auto;padding:12px 24px" onclick="TMA.goTo('home');TMA.openBooking()">Записаться</button>
        </div>`;
      statsEl.style.display = 'none';
      return;
    }

    statsEl.style.display = 'grid';
    document.getElementById('statCount').textContent = bookings.length;
    document.getElementById('statLast').textContent = bookings[0].date;

    list.innerHTML = bookings.map(b => `
      <div class="booking-item">
        <div class="bi-header">
          <div class="bi-service">${b.service}</div>
          <span class="bi-status">${b.status}</span>
        </div>
        <div class="bi-date">${b.date}</div>
        ${b.comment ? `<div class="bi-comment">${b.comment}</div>` : ''}
      </div>
    `).join('');
  }

  /* ══════════════════════════════════════════════
     TRY-ON — Canvas-based visual simulation
     ══════════════════════════════════════════════ */

  const TREATMENTS = {
    original: {
      label: 'Оригинал',
      desc: 'Исходное состояние автомобиля.',
      filter: 'none',
      overlayColor: null,
      overlayOpacity: 0,
      service: null
    },
    polish: {
      label: 'Полировка',
      desc: '✨ После полировки лакокрасочное покрытие приобретает зеркальный блеск. Убираются царапины от мойки, голограммы, потёртости. Цвет становится глубже и насыщеннее.',
      filter: 'contrast(1.12) saturate(1.35) brightness(1.08)',
      overlayColor: null,
      overlayOpacity: 0,
      service: 'polish'
    },
    ceramic: {
      label: 'Керамика',
      desc: '🛡️ Керамическое покрытие создаёт защитный слой толщиной ~1 мкм. Поверхность становится гидрофобной — вода скатывается каплями. Блеск усиливается, глубина цвета возрастает.',
      filter: 'contrast(1.18) saturate(1.4) brightness(1.12)',
      overlayColor: '#ffffff',
      overlayOpacity: 0.06,
      service: 'ceramic'
    },
    ppf: {
      label: 'PPF плёнка',
      desc: '🏎️ Полиуретановая плёнка защищает от камней, сколов и царапин. Доступна прозрачная (сохраняет цвет) или цветная (сменить цвет кузова). Самовосстанавливается от мелких царапин.',
      filter: 'contrast(1.05) saturate(1.1)',
      overlayColor: null,
      overlayOpacity: 0,
      service: 'ppf'
    },
    tint: {
      label: 'Тонировка',
      desc: '🪟 Плёнка на стёклах снижает нагрев салона, защищает от UV и придаёт автомобилю стильный вид. Степень затемнения — от 5% (сильная) до 70% (лёгкая).',
      filter: 'contrast(1.03) brightness(0.95)',
      overlayColor: '#111111',
      overlayOpacity: 0.25,
      service: 'tint'
    }
  };

  function tryOnLoad(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      tryonImg = new Image();
      tryonImg.onload = () => {
        document.getElementById('tryonUpload').style.display = 'none';
        document.getElementById('tryonWorkspace').style.display = 'block';
        applyTreatment('original');
      };
      tryonImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function applyTreatment(t) {
    tryonTreatment = t;
    const config = TREATMENTS[t];

    /* Canvas render */
    const canvas = document.getElementById('tryonCanvas');
    const ctx = canvas.getContext('2d');
    const maxW = canvas.parentElement.clientWidth;
    const ratio = tryonImg.naturalHeight / tryonImg.naturalWidth;
    canvas.width = Math.min(maxW * window.devicePixelRatio, 1200);
    canvas.height = canvas.width * ratio;
    canvas.style.width = maxW + 'px';
    canvas.style.height = (maxW * ratio) + 'px';
    ctx.drawImage(tryonImg, 0, 0, canvas.width, canvas.height);

    /* CSS filter on canvas */
    canvas.style.filter = config.filter;
    canvas.style.transition = 'filter .5s ease';

    /* Colour overlay */
    const overlay = document.getElementById('tryonOverlay');
    if (t === 'ppf' && tryonColor !== 'none') {
      overlay.style.background = tryonColor;
      overlay.style.opacity = '0.45';
    } else if (config.overlayColor) {
      overlay.style.background = config.overlayColor;
      overlay.style.opacity = String(config.overlayOpacity);
    } else {
      overlay.style.opacity = '0';
    }

    /* Label */
    document.getElementById('tryonLabel').textContent = config.label;

    /* Description */
    document.getElementById('treatmentDesc').textContent = config.desc;

    /* Colour picker — show only for PPF */
    document.getElementById('colorSection').style.display = (t === 'ppf') ? 'block' : 'none';

    /* CTA button */
    const ctaBtn = document.getElementById('tryonCta');
    ctaBtn.style.display = (t !== 'original') ? 'flex' : 'none';
    if (t !== 'original') ctaBtn.textContent = `Записаться на ${config.label.toLowerCase()} →`;

    /* Tab highlight */
    document.querySelectorAll('.tt-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tt-btn[data-t="${t}"]`)?.classList.add('active');

    if (tg) tg.HapticFeedback.selectionChanged();
  }

  function setColor(color) {
    tryonColor = color;
    document.querySelectorAll('.cs-swatch').forEach(s => s.classList.remove('active'));
    document.querySelector(`.cs-swatch[data-color="${color}"]`)?.classList.add('active');

    const overlay = document.getElementById('tryonOverlay');
    if (color === 'none') {
      overlay.style.opacity = '0';
    } else {
      overlay.style.background = color;
      overlay.style.opacity = '0.45';
    }
    if (tg) tg.HapticFeedback.selectionChanged();
  }

  function tryOnReset() {
    tryonImg = null;
    tryonTreatment = 'original';
    tryonColor = 'none';
    document.getElementById('tryonUpload').style.display = 'block';
    document.getElementById('tryonWorkspace').style.display = 'none';
    document.getElementById('tryonFile').value = '';
  }

  /* ── Public API ───────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  return {
    goTo,
    openBooking,
    closeBooking,
    bookService,
    bookFromTryon,
    tryOnLoad,
    applyTreatment,
    setColor,
    tryOnReset,
  };

})();
