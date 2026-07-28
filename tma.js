/* ═══════════════════════════════════════════════
   MS Detailing Carbon — Telegram Mini App v2
   ═══════════════════════════════════════════════ */

const TMA = (() => {

  /* ── Telegram WebApp ─────────────────── */
  const tg   = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user || null;

  /* ── Navigation history ──────────────── */
  let history = ['home'];

  /* ── Storage ─────────────────────────── */
  const STORAGE = 'msdc_v2';
  const loadBookings = () => { try { return JSON.parse(localStorage.getItem(STORAGE)) || []; } catch { return []; } };
  const saveBooking  = b  => {
    const list = loadBookings();
    list.unshift(b);
    localStorage.setItem(STORAGE, JSON.stringify(list.slice(0, 50)));
  };

  /* ── Try-On state ─────────────────────── */
  let tryonImg       = null;
  let tryonTreatment = 'original';
  let tryonColor     = 'none';

  /* ── Treatments ───────────────────────── */
  const TREATMENTS = {
    original: {
      label:  'Оригинал',
      filter: 'none',
      color:  null, opacity: 0,
      desc:   'Исходное состояние автомобиля без каких-либо обработок.',
      cta:    false,
    },
    polish: {
      label:  'Полировка',
      filter: 'contrast(1.14) saturate(1.4) brightness(1.09)',
      color:  null, opacity: 0,
      desc:   '✨ После полировки ЛКП приобретает зеркальный блеск. Убираются царапины от мойки, голограммы, потёртости. Цвет становится глубже и насыщеннее — как у нового автомобиля.',
      cta:    'Записаться на полировку',
    },
    ceramic: {
      label:  'Керамика',
      filter: 'contrast(1.2) saturate(1.45) brightness(1.14)',
      color:  '#ffffff', opacity: 0.07,
      desc:   '🛡️ Керамическое покрытие создаёт защитный нанослой. Вода скатывается каплями, грязь не прилипает. Блеск усиливается, цвет становится глубже. Защита на 3–5 лет.',
      cta:    'Записаться на керамику',
    },
    ppf: {
      label:  'PPF плёнка',
      filter: 'contrast(1.06) saturate(1.12)',
      color:  null, opacity: 0,
      desc:   '🏎️ Полиуретановая плёнка защищает от камней, сколов и царапин. Доступна прозрачная (сохраняет цвет) или цветная (смена цвета кузова). Самовосстановление мелких царапин.',
      cta:    'Записаться на PPF',
    },
    tint: {
      label:  'Тонировка',
      filter: 'contrast(1.04) brightness(0.94)',
      color:  '#0a0a0a', opacity: 0.22,
      desc:   '🪟 Плёнка на стёклах: защита от UV и нагрева, стильный вид. Затемнение от 5% до 70%. Плёнки Llumar и SolarGard — длительная гарантия без пузырей и отслоений.',
      cta:    'Записаться на тонировку',
    },
  };

  /* ══════════════════════════════════════
     INIT
     ══════════════════════════════════════ */
  function init() {
    if (tg) {
      tg.ready();
      tg.expand();
      try { tg.setHeaderColor('#131316'); } catch {}
      try { tg.setBackgroundColor('#131316'); } catch {}
    }
    setupUser();
    setupBookingForm();
    setupPhotoPreview();
  }

  /* ── User ────────────────────────────── */
  function setupUser() {
    if (!user) return;
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
    const initials = ((user.first_name || '')[0] || '') + ((user.last_name || '')[0] || '');

    /* Home banner */
    const banner = document.getElementById('userBanner');
    if (banner) {
      banner.style.display = 'flex';
      const av = document.getElementById('ubAvatar');
      const nm = document.getElementById('ubName');
      if (av) av.textContent = initials || '👤';
      if (nm) nm.textContent = `Привет, ${user.first_name || 'друг'}!`;
    }

    /* Booking user card */
    const card = document.getElementById('bookingUserCard');
    if (card) {
      card.style.display = 'flex';
      const av2 = document.getElementById('bucAvatar');
      const nm2 = document.getElementById('bucName');
      if (av2) av2.textContent = initials || '👤';
      if (nm2) nm2.textContent = fullName;
    }

    /* Pre-fill name; hide phone field */
    const bName = document.getElementById('bName');
    if (bName && fullName) bName.value = fullName;
    const grpPhone = document.getElementById('bfGroupPhone');
    if (grpPhone) grpPhone.style.display = 'none';
  }

  /* ══════════════════════════════════════
     NAVIGATION
     ══════════════════════════════════════ */
  function goTo(tab) {
    const current = history[history.length - 1];
    if (current === tab) return;

    /* Hide current */
    const old = document.getElementById('screen-' + current);
    if (old) { old.classList.remove('active'); }

    /* Show new */
    const next = document.getElementById('screen-' + tab);
    if (next) {
      next.classList.add('active', 'slide-in');
      next.addEventListener('animationend', () => next.classList.remove('slide-in'), { once: true });
    }

    /* Nav tabs */
    document.querySelectorAll('.bn-btn[data-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });

    history.push(tab);

    /* Telegram back button */
    if (tg) {
      if (history.length > 1) tg.BackButton.show();
      else                     tg.BackButton.hide();
      tg.BackButton.onClick(goBack);
    }

    /* Cabinet: render on open */
    if (tab === 'cabinet') renderCabinet();

    haptic('light');
  }

  function goBack() {
    if (history.length <= 1) return;
    history.pop();
    const prev = history[history.length - 1];
    const current = document.querySelector('.screen.active');
    if (current) current.classList.remove('active');

    const target = document.getElementById('screen-' + prev);
    if (target) target.classList.add('active');

    document.querySelectorAll('.bn-btn[data-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === prev);
    });

    if (tg) {
      if (history.length <= 1) tg.BackButton.hide();
    }
    haptic('light');
  }

  function goToBooking(service) {
    goTo('booking');
    setTimeout(() => {
      const sel = document.getElementById('bService');
      if (sel) sel.value = service;
    }, 50);
  }

  /* ══════════════════════════════════════
     BOOKING FORM
     ══════════════════════════════════════ */
  function setupBookingForm() {
    const form = document.getElementById('tmaBookingForm');
    if (form) form.addEventListener('submit', e => { e.preventDefault(); submitBooking(); });
  }

  function setupPhotoPreview() {
    const input   = document.getElementById('bPhotos');
    const preview = document.getElementById('bPhotoPreview');
    if (!input || !preview) return;
    input.addEventListener('change', () => {
      preview.innerHTML = '';
      Array.from(input.files).slice(0, 5).forEach(f => {
        const img = new Image();
        img.src = URL.createObjectURL(f);
        preview.appendChild(img);
      });
    });
  }

  /* alias called from inline onchange */
  function onPhotoChange() {
    setupPhotoPreview();
    const input   = document.getElementById('bPhotos');
    const preview = document.getElementById('bPhotoPreview');
    if (!input || !preview) return;
    preview.innerHTML = '';
    Array.from(input.files).slice(0, 5).forEach(f => {
      const img = new Image();
      img.src = URL.createObjectURL(f);
      preview.appendChild(img);
    });
  }

  async function submitBooking() {
    const btn     = document.getElementById('bSubmit');
    const btnText = document.getElementById('bSubmitText');
    const result  = document.getElementById('bResult');

    btn.disabled = true;
    btnText.textContent = 'Отправляем...';
    result.className = 'bf-result';
    result.textContent = '';

    const name    = (document.getElementById('bName')?.value   || '').trim();
    const phone   = (document.getElementById('bPhone')?.value  || '').trim();
    const service = (document.getElementById('bService')?.value || '').trim();
    const comment = (document.getElementById('bComment')?.value || '').trim();
    const photos  = document.getElementById('bPhotos')?.files || [];

    const tgLine = user
      ? `Telegram: @${user.username || '—'} (ID ${user.id}, ${[user.first_name, user.last_name].filter(Boolean).join(' ')})`
      : '';

    const requestText = [service, comment, tgLine].filter(Boolean).join('\n');

    const fd = new FormData();
    fd.append('name',    name || (user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : 'Не указано'));
    fd.append('phone',   phone);
    fd.append('request', requestText);
    fd.append('source',  'telegram_mini_app');
    for (const f of photos) fd.append('photos', f);

    try {
      const res  = await fetch('/submit', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.ok) {
        result.className = 'bf-result ok';
        result.textContent = '✓ Заявка принята! Ответим в течение 15 минут.';
        btnText.textContent = '✓ Отправлено';
        haptic('success');

        saveBooking({
          id:      Date.now(),
          service: service || 'Консультация',
          comment,
          date:    new Date().toLocaleDateString('ru-RU'),
          status:  'Принята',
        });

        if (tg) {
          setTimeout(() => tg.showAlert('✓ Заявка принята!\n\nМастер свяжется с вами в течение 15 минут.'), 300);
        }

        setTimeout(() => {
          document.getElementById('bService').value  = '';
          document.getElementById('bComment').value  = '';
          if (document.getElementById('bPhone')) document.getElementById('bPhone').value = '';
          document.getElementById('bPhotos').value   = '';
          document.getElementById('bPhotoPreview').innerHTML = '';
          btnText.textContent = 'Отправить заявку';
          btn.disabled        = false;
          result.textContent  = '';
          goTo('home');
        }, 3200);

      } else {
        throw new Error(data.error || 'Ошибка сервера');
      }
    } catch (err) {
      result.className = 'bf-result err';
      result.textContent = '⚠ ' + (err.message || 'Попробуйте ещё раз');
      btnText.textContent = 'Отправить заявку';
      btn.disabled = false;
      haptic('error');
    }
  }

  /* ══════════════════════════════════════
     TRY-ON
     ══════════════════════════════════════ */
  function tryOnLoad(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
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
    const cfg = TREATMENTS[t];

    /* Draw on canvas */
    const canvas = document.getElementById('tryonCanvas');
    const ctx    = canvas.getContext('2d');
    const wrap   = canvas.parentElement;
    const maxW   = wrap.clientWidth;
    const ratio  = tryonImg.naturalHeight / tryonImg.naturalWidth;
    canvas.width  = Math.min(maxW * window.devicePixelRatio, 1400);
    canvas.height = canvas.width * ratio;
    canvas.style.width  = maxW + 'px';
    canvas.style.height = (maxW * ratio) + 'px';
    ctx.drawImage(tryonImg, 0, 0, canvas.width, canvas.height);

    /* CSS filter */
    canvas.style.filter = cfg.filter;

    /* Colour overlay */
    const overlay = document.getElementById('tryonOverlay');
    if (t === 'ppf' && tryonColor !== 'none') {
      overlay.style.background = tryonColor;
      overlay.style.opacity    = '0.42';
    } else if (cfg.color) {
      overlay.style.background = cfg.color;
      overlay.style.opacity    = String(cfg.opacity);
    } else {
      overlay.style.opacity = '0';
    }

    /* Badge */
    document.getElementById('tryonBadge').textContent = cfg.label;

    /* Description */
    document.getElementById('treatmentDesc').textContent = cfg.desc;

    /* Color picker — PPF only */
    document.getElementById('colorSection').style.display = t === 'ppf' ? 'block' : 'none';

    /* CTA */
    const actions = document.getElementById('tryonActions');
    if (cfg.cta) {
      actions.style.display = 'block';
      actions.querySelector('button').textContent = cfg.cta + ' →';
    } else {
      actions.style.display = 'none';
    }

    /* Tab highlight */
    document.querySelectorAll('.tg-btn').forEach(b => b.classList.toggle('active', b.dataset.t === t));

    haptic('selection');
  }

  function setColor(color) {
    tryonColor = color;
    document.querySelectorAll('.cr-swatch').forEach(s => s.classList.toggle('active', s.dataset.color === color));
    const overlay = document.getElementById('tryonOverlay');
    if (color === 'none') {
      overlay.style.opacity = '0';
    } else {
      overlay.style.background = color;
      overlay.style.opacity    = '0.42';
    }
    haptic('selection');
  }

  function tryOnReset() {
    tryonImg       = null;
    tryonTreatment = 'original';
    tryonColor     = 'none';
    document.getElementById('tryonUpload').style.display    = 'block';
    document.getElementById('tryonWorkspace').style.display = 'none';
    document.getElementById('tryonFile').value = '';
  }

  function bookFromTryon() {
    const serviceMap = {
      polish:  'Блеск — Полировка кузова (от 8 000 ₽)',
      ceramic: 'Защита — Керамическое покрытие (от 25 000 ₽)',
      ppf:     'Защита — Бронирование PPF (от 15 000 ₽)',
      tint:    'Тонировка стёкол (от 5 000 ₽)',
    };
    goToBooking(serviceMap[tryonTreatment] || '');
  }

  /* ══════════════════════════════════════
     CABINET
     ══════════════════════════════════════ */
  function renderCabinet() {
    /* Profile */
    const nm = document.getElementById('profileName');
    const sb = document.getElementById('profileSub');
    const av = document.getElementById('profileAvatar');
    if (user) {
      const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
      const init = ((user.first_name || '')[0] || '') + ((user.last_name || '')[0] || '');
      if (nm) nm.textContent = full || 'Пользователь';
      if (sb) sb.textContent = user.username ? '@' + user.username : 'ID: ' + user.id;
      if (av) av.textContent = init || '👤';
    } else {
      if (nm) nm.textContent = 'Откройте в боте';
      if (sb) sb.textContent = 'Необходим Telegram аккаунт';
    }

    /* Bookings */
    const bookings = loadBookings();
    const list     = document.getElementById('bookingsList');
    const stats    = document.getElementById('cabinetStats');

    if (!bookings.length) {
      if (stats) stats.style.display = 'none';
      if (list) list.innerHTML = `
        <div class="empty-state">
          <div class="es-icon">📋</div>
          <div class="es-title">Заявок пока нет</div>
          <div class="es-sub">Запишитесь на услугу — история появится здесь</div>
          <button class="es-btn" onclick="TMA.goTo('booking')">Записаться</button>
        </div>`;
      return;
    }

    if (stats) {
      stats.style.display = 'grid';
      const sc = document.getElementById('statCount');
      const sl = document.getElementById('statLast');
      if (sc) sc.textContent = bookings.length;
      if (sl) sl.textContent = bookings[0].date;
    }

    if (list) list.innerHTML = bookings.map(b => `
      <div class="booking-item">
        <div class="bi-row">
          <div class="bi-service">${b.service}</div>
          <span class="bi-status">${b.status}</span>
        </div>
        <div class="bi-date">${b.date}</div>
        ${b.comment ? `<div class="bi-comment">${b.comment}</div>` : ''}
      </div>
    `).join('');
  }

  /* ── Haptic ──────────────────────────── */
  function haptic(type) {
    if (!tg?.HapticFeedback) return;
    try {
      if (type === 'success' || type === 'error') tg.HapticFeedback.notificationOccurred(type);
      else if (type === 'selection') tg.HapticFeedback.selectionChanged();
      else tg.HapticFeedback.impactOccurred(type || 'light');
    } catch {}
  }

  /* ── Boot ────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  /* ── Public API ──────────────────────── */
  return { goTo, goBack, goToBooking, onPhotoChange, tryOnLoad, applyTreatment, setColor, tryOnReset, bookFromTryon };

})();
