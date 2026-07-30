/* ═══════════════════════════════════════════════
   MS Detailing Carbon — Native App v3
   Router · 12 Screens · Swipe Gestures
   ═══════════════════════════════════════════════ */

/* ── Telegram ─────────────────────────────────── */
const tg   = window.Telegram?.WebApp;
const tgUser = tg?.initDataUnsafe?.user || null;

/* ── Data ─────────────────────────────────────── */
const SERVICES = [
  {
    id: 'complex',
    name: 'Комплексный детейлинг',
    short: 'Комплекс',
    tag: 'Лучший выбор',
    tagStyle: 'gold',
    price: 'от 35 000 ₽',
    time: '3–5 дней',
    img: 'assets/gwagon-after.jpg',
    desc: 'Полное преображение автомобиля: полировка ЛКП, нанесение керамического покрытия, профессиональная химчистка салона, обработка всех поверхностей. Результат — как у нового авто.',
    includes: ['Машинная полировка кузова', 'Нанесение керамики 9H', 'Химчистка салона', 'Обработка резины и пластика', 'Полировка стёкол', 'Финальный инспекционный контроль'],
    category: 'complex',
    booking: 'Полный уход — Комплексный детейлинг (от 35 000 ₽)',
  },
  {
    id: 'polish',
    name: 'Полировка кузова',
    short: 'Полировка',
    tag: 'Популярно',
    tagStyle: 'blue',
    price: 'от 8 000 ₽',
    time: '1–2 дня',
    img: 'assets/polishing.jpg',
    desc: 'Машинная полировка устраняет царапины от мойки, голограммы, потёртости. Восстанавливает зеркальный блеск и глубину цвета. Результат держится до 6 месяцев.',
    includes: ['Стадийная полировка 2-3 прохода', 'Устранение голограмм', 'Устранение царапин до 1-й стадии', 'Нанесение финишного защитного воска', 'Полировка пластиковых элементов'],
    category: 'gloss',
    booking: 'Блеск — Полировка кузова (от 8 000 ₽)',
  },
  {
    id: 'ceramic',
    name: 'Керамическое покрытие',
    short: 'Керамика',
    tag: 'Защита',
    tagStyle: 'green',
    price: 'от 25 000 ₽',
    time: '2–3 дня',
    img: 'assets/ceramic-apply.jpg',
    desc: 'Нанокерамика создаёт стеклоподобный защитный слой твёрдостью 9H. Гидрофобность, защита от UV, химии и мелких царапин. Гарантия блеска 3–5 лет.',
    includes: ['Полировка перед нанесением', 'Обезжиривание ЛКП IPA', 'Нанесение керамики 9H (2 слоя)', 'Выдержка в инфракрасной кабине', 'Гидрофобная защита стёкол', 'Сертификат с гарантией'],
    category: 'protection',
    booking: 'Защита — Керамическое покрытие (от 25 000 ₽)',
  },
  {
    id: 'ppf',
    name: 'Бронирование PPF',
    short: 'PPF',
    tag: 'Броня',
    tagStyle: 'dim',
    price: 'от 15 000 ₽',
    time: '2–5 дней',
    img: 'assets/ppf-apply.jpg',
    desc: 'Полиуретановая плёнка защищает кузов от сколов, царапин, реагентов. Самовосстанавливается при нагреве. Доступна прозрачная и цветная плёнка.',
    includes: ['Предварительная полировка', 'Полиуретановая плёнка Llumar', 'Самовосстановление мелких царапин', 'Бесцветная или цветная версия', 'Защита порогов, капота, зеркал', 'Гарантия 3 года'],
    category: 'protection',
    booking: 'Защита — Бронирование PPF (от 15 000 ₽)',
  },
  {
    id: 'cleaning',
    name: 'Химчистка салона',
    short: 'Химчистка',
    tag: 'Салон',
    tagStyle: 'dim',
    price: 'от 6 000 ₽',
    time: '1 день',
    img: 'assets/bmw-interior-after.jpg',
    desc: 'Профессиональная глубокая очистка всего салона: обивка, кожа, пластик, ковры, потолок. Устранение любых запахов (животные, курение, еда). Обработка кожи кондиционером.',
    includes: ['Пароочистка всех поверхностей', 'Экстракторная чистка ковров', 'Очистка кожи и пластика', 'Полировка стёкол изнутри', 'Устранение запахов озоном', 'Обработка кожи кондиционером'],
    category: 'interior',
    booking: 'Химчистка салона (от 6 000 ₽)',
  },
  {
    id: 'headlights',
    name: 'Восстановление фар',
    short: 'Фары',
    tag: 'Быстро',
    tagStyle: 'green',
    price: 'от 3 000 ₽',
    time: '2–4 часа',
    img: 'assets/gwagon-front.jpg',
    desc: 'Полировка и восстановление мутных, пожелтевших фар. Нанесение UV-защитного покрытия. Фары снова прозрачные — улучшается видимость и внешний вид.',
    includes: ['Полировка фар (3 стадии)', 'Нанесение UV-лака', 'Герметизация поверхности', 'Результат на 2–3 года'],
    category: 'express',
    booking: 'Восстановление фар (от 3 000 ₽)',
  },
  {
    id: 'tint',
    name: 'Тонировка стёкол',
    short: 'Тонировка',
    tag: 'Стиль',
    tagStyle: 'dim',
    price: 'от 5 000 ₽',
    time: '3–5 часов',
    img: 'assets/gwagon-body.jpg',
    desc: 'Оклейка стёкол плёнкой Llumar или SolarGard. Защита от UV, снижение нагрева, конфиденциальность. Затемнение 5–70%. Без пузырей и отслоений — гарантия.',
    includes: ['Плёнки Llumar / SolarGard', 'Затемнение от 5% до 70%', 'Защита UV 99%', 'Снижение нагрева до 60%', 'Монтаж без пузырей', 'Гарантия 2 года'],
    category: 'style',
    booking: 'Тонировка стёкол (от 5 000 ₽)',
  },
];

const REVIEWS = [
  { name: 'Александр М.', initials: 'АМ', stars: 5, date: '14 июля 2025', service: 'Керамическое покрытие', text: 'Сдал BMW X5 на керамику — результат превзошёл ожидания. Машина блестит как зеркало, вода скатывается шариками. Мастера профессиональные, всё сделали в срок.' },
  { name: 'Эльвира Р.', initials: 'ЭР', stars: 5, date: '2 июля 2025', service: 'Химчистка салона', text: 'Привезла Cayenne после 5 лет эксплуатации — запах сигарет и потёртая кожа. Вернули мне машину как из салона. Отдельное спасибо за озонирование — ни следа от запаха!' },
  { name: 'Тимур К.', initials: 'ТК', stars: 5, date: '20 июня 2025', service: 'Комплексный детейлинг', text: 'Сделал полный комплекс на G-Wagon перед продажей. Цену на машину поднял на 200 тысяч — окупилось с лихвой. Рекомендую всем, кто хочет продать авто дороже.' },
  { name: 'Диана С.', initials: 'ДС', stars: 5, date: '8 июня 2025', service: 'Полировка + PPF', text: 'Сначала скептически отнеслась к цене, но после результата поняла — оно того стоит. Царапины исчезли, плёнка практически незаметна. Теперь не боюсь парковок!' },
  { name: 'Игорь В.', initials: 'ИВ', stars: 5, date: '25 мая 2025', service: 'Восстановление фар', text: 'За 2.5 часа полностью восстановили фары на Lexus — как новые! Цена смешная за такое качество. Буду делать каждый год теперь.' },
];

const GALLERY_ITEMS = [
  { before: 'assets/gwagon-body.jpg', after: 'assets/gwagon-after.jpg', service: 'Полировка + Керамика', car: 'Mercedes G-Wagon' },
  { before: 'assets/gwagon-front.jpg', after: 'assets/gwagon-body.jpg', service: 'PPF бронирование', car: 'BMW X5' },
  { before: 'assets/gwagon-door-open.jpg', after: 'assets/gwagon-interior.jpg', service: 'Химчистка салона', car: 'Porsche Cayenne' },
  { before: 'assets/gwagon-body.jpg', after: 'assets/ceramic-apply.jpg', service: 'Керамическое покрытие', car: 'Range Rover' },
];

const STORAGE_KEY = 'msdc_v3';
const loadBookings = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const saveBooking  = b => {
  const list = loadBookings();
  list.unshift(b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
};

/* ── Router ───────────────────────────────────── */
class Router {
  constructor() {
    this.tabs = ['home', 'services', 'tryon', 'profile'];
    this.activeTab = 'home';
    this.stacks = { home: [], services: [], tryon: [], profile: [] };
    this.currentScreen = null;
    this.isAnimating = false;
  }

  init() {
    this.push('home', {}, 'tab');
  }

  push(name, params = {}, type = 'push') {
    if (this.isAnimating) return;

    const tabForScreen = this._tabFor(name);
    const isTabSwitch = type === 'tab' || (tabForScreen && tabForScreen !== this.activeTab);

    if (isTabSwitch) {
      this.activeTab = tabForScreen || this.activeTab;
      this.stacks[this.activeTab] = [{ name, params }];
    } else {
      this.stacks[this.activeTab].push({ name, params });
    }

    this._render(isTabSwitch ? 'tab' : 'push');
    this._updateTabBar();
  }

  pop() {
    const stack = this.stacks[this.activeTab];
    if (stack.length <= 1) return false;
    stack.pop();
    this._render('pop');
    this._updateTabBar();
    return true;
  }

  switchTab(tab) {
    if (tab === this.activeTab) {
      // Scroll to top of current tab
      this.stacks[tab] = [this.stacks[tab][0]];
      this._render('tab');
      return;
    }
    this.activeTab = tab;
    if (!this.stacks[tab].length) {
      this.stacks[tab] = [{ name: tab, params: {} }];
    }
    this._render('tab');
    this._updateTabBar();
  }

  _tabFor(name) {
    if (['home'].includes(name)) return 'home';
    if (['services', 'service-detail'].includes(name)) return 'services';
    if (['tryon'].includes(name)) return 'tryon';
    if (['profile', 'promo'].includes(name)) return 'profile';
    return null;
  }

  _currentEntry() {
    const stack = this.stacks[this.activeTab];
    return stack[stack.length - 1] || { name: 'home', params: {} };
  }

  _render(transition) {
    const entry = this._currentEntry();
    const el = buildScreen(entry.name, entry.params);

    const root = document.getElementById('screen-root');
    const old  = this.currentScreen;

    if (old) {
      const exitClass = transition === 'pop'  ? 'screen--pop-exit'
                      : transition === 'tab'  ? 'screen--tab-exit'
                      : 'screen--push-exit';
      old.classList.add(exitClass);
      old.addEventListener('animationend', () => old.remove(), { once: true });
      setTimeout(() => { if (old.parentNode) old.remove(); }, 400);
    }

    root.appendChild(el);
    this.isAnimating = true;
    setTimeout(() => { this.isAnimating = false; }, 360);

    if (old) {
      const enterClass = transition === 'pop'  ? 'screen--pop-enter'
                       : transition === 'tab'  ? 'screen--tab-enter'
                       : 'screen--push-enter';
      el.classList.add(enterClass);
      el.addEventListener('animationend', () => el.classList.remove(enterClass), { once: true });
    }

    this.currentScreen = el;

    // Telegram back button
    if (tg) {
      const stack = this.stacks[this.activeTab];
      if (stack.length > 1) { tg.BackButton.show(); tg.BackButton.onClick(() => router.pop()); }
      else tg.BackButton.hide();
    }

    afterRender(entry.name, entry.params, el);
  }

  _updateTabBar() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('tab-btn--active', btn.dataset.tab === this.activeTab);
    });
  }

  canPop() {
    return this.stacks[this.activeTab].length > 1;
  }
}

const router = new Router();

/* ── Swipe-back gesture ───────────────────────── */
class SwipeBack {
  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.active = false;
    this.el = null;

    const root = document.getElementById('screen-root');
    root.addEventListener('touchstart',  this.onStart.bind(this), { passive: true });
    root.addEventListener('touchmove',   this.onMove.bind(this),  { passive: false });
    root.addEventListener('touchend',    this.onEnd.bind(this),   { passive: true });
    root.addEventListener('touchcancel', this.onEnd.bind(this),   { passive: true });
  }

  onStart(e) {
    const t = e.touches[0];
    this.startX = t.clientX;
    this.startY = t.clientY;
    this.active = t.clientX < 28 && router.canPop();
    this.el = router.currentScreen;
  }

  onMove(e) {
    if (!this.active || !this.el) return;
    const dx = e.touches[0].clientX - this.startX;
    const dy = e.touches[0].clientY - this.startY;
    if (Math.abs(dy) > Math.abs(dx) * 1.8) { this.active = false; return; }
    e.preventDefault();
    const clamped = Math.max(0, dx);
    this.el.classList.add('screen--dragging');
    this.el.style.transform = `translateX(${clamped}px)`;
    this.el.style.boxShadow = clamped > 0 ? `-8px 0 32px rgba(0,0,0,.4)` : '';
  }

  onEnd(e) {
    if (!this.active || !this.el) return;
    const dx = (e.changedTouches[0]?.clientX || this.startX) - this.startX;
    this.el.classList.remove('screen--dragging');
    this.el.style.transform = '';
    this.el.style.boxShadow = '';
    if (dx > 90) {
      router.pop();
      haptic('light');
    }
    this.active = false;
    this.el = null;
  }
}

/* ── Haptic ───────────────────────────────────── */
function haptic(type) {
  if (!tg?.HapticFeedback) return;
  try {
    if (type === 'success' || type === 'error') tg.HapticFeedback.notificationOccurred(type);
    else if (type === 'selection') tg.HapticFeedback.selectionChanged();
    else tg.HapticFeedback.impactOccurred(type || 'light');
  } catch {}
}

/* ── Toast ────────────────────────────────────── */
function showToast(msg, type = '') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}</span> ${msg}`;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => { if (el.classList.contains('toast')) el.remove(); }, { once: true });
  setTimeout(() => el.remove(), 2800);
}

/* ── Screen builder ───────────────────────────── */
function buildScreen(name, params) {
  const el = document.createElement('div');
  el.className = 'screen';
  el.dataset.screen = name;

  const renderers = {
    home:            renderHome,
    services:        renderServices,
    'service-detail': renderServiceDetail,
    booking:         renderBooking,
    payment:         renderPayment,
    'payment-processing': renderPaymentProcessing,
    'booking-success': renderBookingSuccess,
    tryon:           renderTryOn,
    studio:          renderStudio,
    gallery:         renderGallery,
    reviews:         renderReviews,
    about:           renderAbout,
    profile:         renderProfile,
    promo:           renderPromo,
  };

  el.innerHTML = (renderers[name] || renderHome)(params);
  return el;
}

/* ══════════════════════════════════════════════
   SCREEN RENDERERS
   ══════════════════════════════════════════════ */

/* ── HOME ─────────────────────────────────────── */
function renderHome() {
  const name   = tgUser ? tgUser.first_name : null;
  const inits  = tgUser ? ((tgUser.first_name||'')[0]||'') + ((tgUser.last_name||'')[0]||'') : '';
  const full   = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : '';

  const greetingBar = tgUser ? `
    <div class="greeting-bar">
      <div class="greeting-bar__avatar">${inits || '👤'}</div>
      <div class="greeting-bar__text">
        <div class="greeting-bar__name">Привет, ${name}! 👋</div>
        <div class="greeting-bar__sub">Telegram подтверждён ✓</div>
      </div>
      <div class="greeting-bar__vip">VIP</div>
    </div>` : '';

  const popular = SERVICES.slice(0, 4).map(s => `
    <div class="promo-card" onclick="router.push('service-detail',{id:'${s.id}'})">
      <div class="promo-card__img" style="background-image:url('${s.img}')"></div>
      <div class="promo-card__body">
        <div class="promo-card__tag">${s.tag}</div>
        <div class="promo-card__name">${s.short}</div>
        <div class="promo-card__price">${s.price}</div>
      </div>
    </div>`).join('');

  return `
    <div class="screen-body">
      <div class="home-hero">
        <div class="home-hero__bg" id="heroBg" style="background-image:url('assets/gwagon-front.jpg')"></div>
        <div class="home-hero__grad"></div>
        <div class="home-hero__content">
          <div class="home-hero__badge">✦ Казань · Премиум детейлинг</div>
          <div class="home-hero__title">MS Detailing<br>Carbon</div>
          <div class="home-hero__sub">Щербаковский пер., 7 · Пн–Сб 9:00–20:00</div>
        </div>
      </div>

      ${greetingBar}

      <div class="quick-grid">
        <button class="quick-btn quick-btn--primary" onclick="router.push('booking',{})">
          <div class="quick-btn__icon">📋</div>
          <div class="quick-btn__label">Записаться</div>
          <div class="quick-btn__sub">Ответим за 15 мин</div>
        </button>
        <button class="quick-btn" onclick="router.push('services',{})">
          <div class="quick-btn__icon">💎</div>
          <div class="quick-btn__label">Услуги и цены</div>
          <div class="quick-btn__sub">7 направлений</div>
        </button>
        <button class="quick-btn" onclick="router.push('gallery',{})">
          <div class="quick-btn__icon">📸</div>
          <div class="quick-btn__label">Галерея работ</div>
          <div class="quick-btn__sub">До и после</div>
        </button>
        <button class="quick-btn" onclick="router.push('reviews',{})">
          <div class="quick-btn__icon">⭐</div>
          <div class="quick-btn__label">Отзывы</div>
          <div class="quick-btn__sub">★ 5.0 · 200+ клиентов</div>
        </button>
      </div>

      <div class="section-title">Популярные услуги</div>
      <div class="hscroll">${popular}</div>

      <div class="stats-strip">
        <div class="stat-cell">
          <div class="stat-cell__num">7</div>
          <div class="stat-cell__lbl">лет опыта</div>
        </div>
        <div class="stat-cell">
          <div class="stat-cell__num">1200<sup style="font-size:14px">+</sup></div>
          <div class="stat-cell__lbl">автомобилей</div>
        </div>
        <div class="stat-cell">
          <div class="stat-cell__num">★ 5.0</div>
          <div class="stat-cell__lbl">оценка</div>
        </div>
      </div>

      <div class="section-title">О студии</div>
      <div class="info-cards">
        <div class="info-card" onclick="router.push('about',{})">
          <div class="info-card__icon">🏆</div>
          <div class="info-card__title">Наша история</div>
          <div class="info-card__sub">7 лет в детейлинге</div>
        </div>
        <div class="info-card" onclick="router.push('studio',{})">
          <div class="info-card__icon">🎨</div>
          <div class="info-card__title">Студия</div>
          <div class="info-card__sub">Оборудование</div>
        </div>
      </div>

      <div class="section-title">Контакты</div>
      <div class="contacts-block" style="margin:0 16px 24px">
        <a href="tel:+79991576971" class="contact-row">
          <div class="contact-row__icon">📞</div>
          <div class="contact-row__body">
            <div class="contact-row__label">Телефон</div>
            <div class="contact-row__val">+7 (999) 157-69-71</div>
          </div>
          <div class="contact-row__arrow">›</div>
        </a>
        <a href="https://yandex.ru/maps/?pt=49.1064,55.7960&z=16" target="_blank" class="contact-row">
          <div class="contact-row__icon">📍</div>
          <div class="contact-row__body">
            <div class="contact-row__label">Адрес</div>
            <div class="contact-row__val">Щербаковский пер., 7, Казань</div>
          </div>
          <div class="contact-row__arrow">›</div>
        </a>
        <div class="contact-row">
          <div class="contact-row__icon">🕐</div>
          <div class="contact-row__body">
            <div class="contact-row__label">Режим работы</div>
            <div class="contact-row__val">Пн–Сб: 9:00–20:00</div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── SERVICES ─────────────────────────────────── */
function renderServices() {
  const cards = SERVICES.map(s => `
    <div class="service-card" onclick="router.push('service-detail',{id:'${s.id}'})">
      <div class="service-card__img" style="background-image:url('${s.img}')"></div>
      <div class="service-card__body">
        <div class="service-card__name">${s.name}</div>
        <div class="service-card__desc">${s.desc}</div>
        <div class="service-card__footer">
          <span class="service-card__price">${s.price}</span>
          <span class="service-card__time">⏱ ${s.time}</span>
        </div>
      </div>
      <div class="service-card__arrow">›</div>
    </div>`).join('');

  const filterMap = [
    { id: 'all', label: 'Все' },
    { id: 'protection', label: '🛡 Защита' },
    { id: 'gloss', label: '✨ Блеск' },
    { id: 'interior', label: '🪑 Салон' },
    { id: 'express', label: '⚡ Экспресс' },
  ];
  const chips = filterMap.map(f => `
    <button class="filter-chip ${f.id==='all'?'filter-chip--active':''}" data-filter="${f.id}"
      onclick="filterServices(this,'${f.id}')">${f.label}</button>`).join('');

  return `
    <div class="nav-header">
      <div class="nav-header__title">Услуги и цены</div>
    </div>
    <div class="filter-row">${chips}</div>
    <div class="screen-body" id="servicesList">
      ${cards}
      <div style="height:8px"></div>
    </div>`;
}

/* ── SERVICE DETAIL ───────────────────────────── */
function renderServiceDetail({ id } = {}) {
  const s = SERVICES.find(x => x.id === id) || SERVICES[0];
  const tagColors = { gold: 'badge--gold', blue: 'badge--blue', green: 'badge--green', dim: 'badge--dim' };
  const includes = s.includes.map(i => `
    <div class="includes-item">
      <div class="includes-item__check">✓</div>
      ${i}
    </div>`).join('');

  return `
    <div class="detail-hero">
      <div style="position:absolute;inset:0;background-size:cover;background-position:center;background-image:url('${s.img}')"></div>
      <div class="detail-hero__grad"></div>
      <button class="detail-hero__back" onclick="router.pop()">‹</button>
      <div class="detail-hero__badge">
        <span class="badge ${tagColors[s.tagStyle]||'badge--dim'}">${s.tag}</span>
      </div>
      <div class="detail-hero__price">${s.price}</div>
    </div>
    <div class="screen-body">
      <div class="detail-name">${s.name}</div>
      <div class="detail-meta">
        <span class="badge badge--dim">⏱ ${s.time}</span>
        <span class="badge badge--gold">✦ Гарантия качества</span>
      </div>
      <p class="detail-desc">${s.desc}</p>

      <div class="section-title--sm" style="padding-top:0">Что включено</div>
      <div class="includes-list">${includes}</div>

      <div style="height:80px"></div>
    </div>
    <div class="detail-book-bar">
      <button class="btn btn--gold" onclick="router.push('booking',{service:'${s.booking}',img:'${s.img}',name:'${s.name}',price:'${s.price}'})">
        Записаться · ${s.price}
      </button>
    </div>`;
}

/* ── BOOKING ──────────────────────────────────── */
function renderBooking({ service = '', img = '', name: svcName = '', price = '' } = {}) {
  const tgName = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : '';
  const tgInits = tgUser ? ((tgUser.first_name||'')[0]||'') + ((tgUser.last_name||'')[0]||'') : '';

  const serviceHeader = svcName ? `
    <div class="booking-header">
      <div class="booking-header__service">
        <div class="booking-header__img" style="background-image:url('${img}')"></div>
        <div>
          <div class="booking-header__name">${svcName}</div>
          <div class="booking-header__price">${price}</div>
        </div>
      </div>
    </div>` : `<div style="height:16px"></div>`;

  const options = SERVICES.map(s =>
    `<option value="${s.booking}" ${service === s.booking ? 'selected' : ''}>${s.name} — ${s.price}</option>`
  ).join('');

  const tgCard = tgUser ? `
    <div style="display:flex;align-items:center;gap:12px;margin:0 16px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px">
      <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-weight:800;font-size:15px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${tgInits||'👤'}</div>
      <div>
        <div style="font-size:14px;font-weight:700">${tgName}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:2px">Telegram подтверждён ✓ · Телефон необязателен</div>
      </div>
    </div>` : '';

  return `
    <div class="nav-header">
      <button class="nav-header__back" onclick="router.pop()">‹</button>
      <div class="nav-header__title">Запись на услугу</div>
    </div>
    <div class="screen-body">
      ${serviceHeader}
      ${tgCard}

      <form id="bookingForm" onsubmit="submitBooking(event)">
        <div class="form-group">
          <label class="form-label">Ваше имя</label>
          <input class="form-input" type="text" id="bName" value="${tgName}" placeholder="Имя и фамилия" required>
        </div>

        <div class="form-group" ${tgUser ? 'style="display:none"' : ''} id="phoneGroup">
          <label class="form-label">Телефон</label>
          <input class="form-input" type="tel" id="bPhone" placeholder="+7 (___) ___-__-__">
        </div>

        <div class="form-group">
          <label class="form-label">Услуга</label>
          <div class="form-select-wrap">
            <select class="form-select" id="bService">
              <option value="">Выберите услугу...</option>
              ${options}
              <option value="Консультация — не знаю что нужно">Не знаю, нужна консультация</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Марка и модель автомобиля</label>
          <input class="form-input" type="text" id="bCar" placeholder="Например: BMW X5 2020">
        </div>

        <div class="form-group">
          <label class="form-label">Пожелания <span style="color:var(--text3);font-size:11px;text-transform:none;letter-spacing:0">необязательно</span></label>
          <textarea class="form-textarea" id="bComment" placeholder="Опишите состояние авто и что хотите получить в результате"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Фото <span style="color:var(--text3);font-size:11px;text-transform:none;letter-spacing:0">необязательно</span></label>
          <input type="file" id="bPhotos" accept="image/*" multiple style="display:none">
          <div class="photo-btn" onclick="document.getElementById('bPhotos').click()">
            <span>📷</span> Прикрепить фото
          </div>
          <div class="photo-preview" id="photoPreview"></div>
        </div>

        <div style="padding:8px 16px 8px">
          <button type="submit" class="btn btn--gold" id="bSubmit">
            <span id="bSubmitText">Отправить заявку</span>
          </button>
          <p style="text-align:center;font-size:12px;color:var(--text3);margin-top:8px">Ответим в течение 15 минут</p>
        </div>

        <div id="bResult" style="padding:0 16px 8px"></div>
        <div style="height:16px"></div>
      </form>
    </div>`;
}

/* ── PAYMENT ──────────────────────────────────── */
function renderPayment({ service = '', price = '', img = '' } = {}) {
  const amount = price || 'от 8 000 ₽';
  return `
    <div class="nav-header">
      <button class="nav-header__back" onclick="router.pop()">‹</button>
      <div class="nav-header__title">Онлайн-оплата</div>
    </div>
    <div class="screen-body">

      <div class="pay-order-card">
        <div class="pay-order-img" style="background-image:url('${img || 'assets/gwagon-front.jpg'}')"></div>
        <div class="pay-order-body">
          <div class="pay-order-label">Заявка принята ✓</div>
          <div class="pay-order-service">${service || 'Детейлинг'}</div>
          <div class="pay-order-price">${amount}</div>
        </div>
      </div>

      <div class="section-title--sm">Данные карты</div>
      <div class="pay-card-widget" id="payCardWidget">
        <div class="pay-card-preview" id="payCardPreview">
          <div class="pcp-chip">▬▬</div>
          <div class="pcp-number" id="pcpNumber">•••• •••• •••• ••••</div>
          <div class="pcp-row">
            <div>
              <div class="pcp-sublabel">ДЕРЖАТЕЛЬ</div>
              <div class="pcp-holder" id="pcpHolder">ИМЯ ФАМИЛИЯ</div>
            </div>
            <div>
              <div class="pcp-sublabel">СРОК</div>
              <div class="pcp-expiry" id="pcpExpiry">ММ/ГГ</div>
            </div>
            <div class="pcp-logo" id="pcpLogo"></div>
          </div>
        </div>

        <div class="pay-fields">
          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Номер карты</label>
            <input class="form-input pay-input" type="tel" id="payCardNum"
              placeholder="0000 0000 0000 0000" maxlength="19"
              oninput="fmtCard(this)" autocomplete="cc-number">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px;margin-bottom:12px">
            <div>
              <label class="form-label">Срок</label>
              <input class="form-input pay-input" type="tel" id="payExpiry"
                placeholder="ММ/ГГ" maxlength="5"
                oninput="fmtExpiry(this)" autocomplete="cc-exp">
            </div>
            <div>
              <label class="form-label">CVV</label>
              <input class="form-input pay-input" type="tel" id="payCVV"
                placeholder="•••" maxlength="3"
                oninput="fmtCVV(this)" autocomplete="cc-csc">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Имя на карте</label>
            <input class="form-input pay-input" type="text" id="payName"
              placeholder="IVAN IVANOV" style="text-transform:uppercase"
              oninput="fmtName(this)" autocomplete="cc-name">
          </div>
        </div>
      </div>

      <div style="padding:20px 16px 8px">
        <button class="btn btn--gold" id="payBtn" onclick="startPayment()">
          <span id="payBtnText">Оплатить ${amount}</span>
        </button>
      </div>

      <div class="pay-secure-row">
        <span>🔒</span>
        <span>Защита платежей · SSL · 3D‑Secure</span>
        <span class="pay-bank-logos">VISA &nbsp;MC &nbsp;МИР</span>
      </div>

      <div class="pay-disclaimer">
        MS Detailing Carbon не хранит данные ваших карт, они находятся у вашего банка.
      </div>

      <div style="height:16px"></div>
    </div>`;
}

/* ── PAYMENT PROCESSING ───────────────────────── */
function renderPaymentProcessing({ service = '', amount = '' } = {}) {
  return `
    <div class="pay-processing-screen" id="payProcScreen">
      <div class="pay-proc-ring" id="payProcRing">
        <svg viewBox="0 0 80 80" class="pay-proc-svg" id="payProcSvg">
          <circle cx="40" cy="40" r="34" class="pay-proc-track"/>
          <circle cx="40" cy="40" r="34" class="pay-proc-fill" id="payProcCircle"/>
        </svg>
        <div class="pay-proc-icon" id="payProcIcon">💳</div>
      </div>
      <div class="pay-proc-title" id="payProcTitle">Проверяем карту...</div>
      <div class="pay-proc-sub" id="payProcSub">Пожалуйста, не закрывайте приложение</div>

      <div class="pay-proc-steps" id="payProcSteps">
        <div class="pay-proc-step" id="step1">
          <span class="pps-dot"></span>Проверка карты
        </div>
        <div class="pay-proc-step" id="step2">
          <span class="pps-dot"></span>Авторизация банка
        </div>
        <div class="pay-proc-step" id="step3">
          <span class="pps-dot"></span>Подтверждение платежа
        </div>
      </div>
    </div>`;
}

/* ── BOOKING SUCCESS ──────────────────────────── */
function renderBookingSuccess({ service = '', paid = false, amount = '' } = {}) {
  const payRow = paid ? `
    <div class="success-detail__row">
      <span class="success-detail__label">Оплата</span>
      <span class="success-detail__value" style="color:var(--green)">✓ Оплачено ${amount}</span>
    </div>` : `
    <div class="success-detail__row">
      <span class="success-detail__label">Промокод</span>
      <span class="success-detail__value" style="color:var(--gold)">CARBON25 = −25%</span>
    </div>`;

  return `
    <div class="success-screen">
      <div class="success-checkmark" style="${paid ? 'background:linear-gradient(135deg,var(--green),#30d158)' : ''}">✓</div>
      <div class="success-title">${paid ? 'Оплата прошла!' : 'Заявка принята!'}</div>
      <div class="success-sub">${paid
        ? 'Оплата подтверждена. Мастер свяжется с вами в течение 15 минут.'
        : 'Наш мастер свяжется с вами в течение 15 минут и уточнит все детали.'
      }</div>
      <div class="success-detail">
        <div class="success-detail__row">
          <span class="success-detail__label">Услуга</span>
          <span class="success-detail__value">${service || 'Консультация'}</span>
        </div>
        <div class="success-detail__row">
          <span class="success-detail__label">Время ответа</span>
          <span class="success-detail__value">до 15 минут</span>
        </div>
        ${payRow}
      </div>
      <button class="btn btn--gold" style="max-width:280px" onclick="router.switchTab('home')">
        На главную
      </button>
      <button class="btn btn--ghost" style="max-width:280px;margin-top:10px" onclick="router.push('booking',{})">
        Ещё одна заявка
      </button>
    </div>`;
}

/* ── TRY-ON ───────────────────────────────────── */
function renderTryOn() {
  const tabs = [
    { id: 'body',     icon: '🚗', label: 'Кузов' },
    { id: 'tint',     icon: '🪟', label: 'Тонировка' },
    { id: 'wheels',   icon: '⚙️', label: 'Диски' },
    { id: 'interior', icon: '🪑', label: 'Салон' },
  ].map(m => `
    <button class="tryon-tab ${m.id === 'body' ? 'tryon-tab--active' : ''}" data-mode="${m.id}"
      onclick="setTryonMode('${m.id}')">
      <span>${m.icon}</span><span>${m.label}</span>
    </button>`).join('');

  return `
    <div class="nav-header">
      <div class="nav-header__title">Примерка услуг</div>
    </div>
    <div class="screen-body" id="tryonBody">

      <div class="tryon-tabs">${tabs}</div>

      <!-- Upload / Demo zone -->
      <div id="tryonUploadZone" class="tryon-upload">
        <input type="file" id="tryonFileMain" accept="image/*" style="display:none">
        <div class="tryon-upload__icon">🚗</div>
        <div class="tryon-upload__title">Загрузите фото автомобиля</div>
        <div class="tryon-upload__hint">Вид сбоку · хорошее освещение</div>
        <button class="btn btn--gold btn--sm" style="margin-top:16px;width:auto"
          onclick="document.getElementById('tryonFileMain').click()">📷 Выбрать фото</button>
        <div class="tryon-upload__or">или</div>
        <button class="btn btn--ghost btn--sm" style="width:auto"
          onclick="loadDemoCar()">🚙 Попробовать на G-Wagon</button>
      </div>

      <!-- Car workspace -->
      <div id="tryonWorkspace" style="display:none">
        <div class="tryon-canvas-wrap" id="tryonCanvasWrap">
          <canvas id="tryonCanvas"></canvas>
          <!-- Body hue overlay -->
          <div class="tryon-layer tryon-layer--body" id="layerBody"></div>
          <!-- Window tint overlay with trapezoid clip-path -->
          <div class="tryon-layer tryon-layer--tint" id="layerTint"
            style="clip-path:polygon(18% 10%,82% 10%,78% 53%,22% 53%)"></div>
          <!-- Wheel overlays -->
          <div class="tryon-layer-wheel" id="layerWheelL"
            style="left:12%;top:56%;width:26%;padding-bottom:26%"></div>
          <div class="tryon-layer-wheel" id="layerWheelR"
            style="left:62%;top:56%;width:26%;padding-bottom:26%"></div>
          <div class="tryon-badge" id="tryonBadge">Оригинал</div>
          <button class="tryon-reset-btn" onclick="resetTryon()" title="Сменить фото">✕</button>
        </div>
        <div id="tryonControls"></div>
        <div style="height:16px"></div>
      </div>

      <!-- Interior mode -->
      <div id="tryonInterior" style="display:none">
        <div class="section-title--sm">Химчистка салона · До и после</div>
        <div class="ba-wrap" id="baWrap">
          <img class="ba-img" src="assets/bmw-interior-before.jpg" alt="До" id="baImgBefore">
          <div class="ba-after-mask" id="baAfterMask" style="clip-path:inset(0 50% 0 0)">
            <img class="ba-img" src="assets/bmw-interior-after.jpg" alt="После">
          </div>
          <div class="ba-handle" id="baHandle" style="left:50%">
            <div class="ba-handle__bar"></div>
            <div class="ba-handle__knob">◀▶</div>
          </div>
          <span class="ba-label ba-label--l">ДО</span>
          <span class="ba-label ba-label--r">ПОСЛЕ</span>
        </div>
        <p class="tryon-desc">Перетаскивайте разделитель ← →. Профессиональная химчистка полностью восстанавливает салон: кожа, ковры, пластик, потолок. Запахи устраняются озоном.</p>
        <div style="padding:0 16px 16px">
          <button class="btn btn--gold" onclick="router.push('service-detail',{id:'cleaning'})">
            Записаться на химчистку →
          </button>
        </div>

        <div class="section-title--sm">Проверьте на вашем авто</div>
        <div class="tryon-upload tryon-upload--sm" onclick="document.getElementById('tryonInteriorFile').click()"
          style="margin:0 16px 16px;height:100px">
          <input type="file" id="tryonInteriorFile" accept="image/*" style="display:none">
          <div style="font-size:28px">📷</div>
          <div class="tryon-upload__title" style="font-size:14px;margin-bottom:0">Загрузите фото салона</div>
          <div class="tryon-upload__hint" style="font-size:11px">Покажем его в идеальном состоянии</div>
        </div>
        <div id="tryonInteriorResult" style="display:none;margin:0 16px 16px">
          <div class="ba-wrap" id="baUserWrap">
            <canvas class="ba-img" id="baUserBefore"></canvas>
            <div class="ba-after-mask" id="baUserAfterMask" style="clip-path:inset(0 50% 0 0)">
              <canvas class="ba-img" id="baUserAfter"></canvas>
            </div>
            <div class="ba-handle" id="baUserHandle" style="left:50%">
              <div class="ba-handle__bar"></div>
              <div class="ba-handle__knob">◀▶</div>
            </div>
            <span class="ba-label ba-label--l">ДО</span>
            <span class="ba-label ba-label--r">ПОСЛЕ</span>
          </div>
          <p style="font-size:12px;color:var(--text3);text-align:center;margin-top:8px">
            Симуляция результата профессиональной химчистки
          </p>
          <div style="padding:0 0 8px">
            <button class="btn btn--gold" onclick="router.push('service-detail',{id:'cleaning'})">
              Записаться на химчистку →
            </button>
          </div>
        </div>
        <div style="height:16px"></div>
      </div>

    </div>`;
}

/* ── STUDIO ───────────────────────────────────── */
function renderStudio() {
  return `
    <div class="nav-header">
      <div class="nav-header__title">Студия</div>
    </div>
    <div class="screen-body">
      <div class="studio-hero">
        <div class="studio-hero__imgs">
          <div class="studio-hero__img" style="background-image:url('assets/gwagon-body.jpg')"></div>
          <div class="studio-hero__img" style="background-image:url('assets/gwagon-front.jpg')"></div>
        </div>
        <div class="studio-hero__grad"></div>
        <div class="studio-hero__logo">MS · DETAILING · CARBON</div>
      </div>

      <div class="section-title">О студии</div>
      <div class="info-cards">
        <div class="info-card" onclick="router.push('gallery',{})">
          <div class="info-card__icon">📸</div>
          <div class="info-card__title">Галерея работ</div>
          <div class="info-card__sub">До и после</div>
        </div>
        <div class="info-card" onclick="router.push('reviews',{})">
          <div class="info-card__icon">⭐</div>
          <div class="info-card__title">Отзывы</div>
          <div class="info-card__sub">★ 5.0</div>
        </div>
        <div class="info-card" onclick="router.push('about',{})">
          <div class="info-card__icon">🏆</div>
          <div class="info-card__title">О компании</div>
          <div class="info-card__sub">История студии</div>
        </div>
        <div class="info-card" onclick="router.push('booking',{})">
          <div class="info-card__icon">📋</div>
          <div class="info-card__title">Записаться</div>
          <div class="info-card__sub">Быстрая запись</div>
        </div>
      </div>

      <div class="section-title">Оборудование</div>
      <div style="margin:0 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        ${[
          ['🔬', 'Полировальные машинки Rupes', 'Профессиональные серии BigFoot'],
          ['💧', 'Химия Koch Chemie', 'Немецкие профессиональные составы'],
          ['☀️', 'Инфракрасная кабина', 'Для полимеризации керамики'],
          ['🔦', 'LED инспекционные лампы', 'Panasonic · 5000+ люкс'],
          ['🌡️', 'Климат-контроль', 'Поддержание +18–22°C круглый год'],
        ].map(([icon, title, sub]) => `
          <div class="list-row" style="cursor:default">
            <div class="list-row__icon">${icon}</div>
            <div class="list-row__body">
              <div class="list-row__title">${title}</div>
              <div class="list-row__sub">${sub}</div>
            </div>
          </div>`).join('')}
      </div>
      <div style="height:16px"></div>
    </div>`;
}

/* ── GALLERY ──────────────────────────────────── */
function renderGallery() {
  const cards = GALLERY_ITEMS.map(g => `
    <div class="ba-card">
      <div class="ba-card__imgs">
        <div class="ba-card__img" data-label="До" style="background-image:url('${g.before}')"></div>
        <div class="ba-card__img" data-label="После" style="background-image:url('${g.after}')"></div>
      </div>
      <div class="ba-card__body">
        <div class="ba-card__service">${g.service}</div>
        <div class="ba-card__car">${g.car}</div>
      </div>
    </div>`).join('');

  return `
    <div class="nav-header">
      <button class="nav-header__back" onclick="router.pop()">‹</button>
      <div class="nav-header__title">Галерея работ</div>
    </div>
    <div class="screen-body">
      <div class="section-title--sm">До и после</div>
      ${cards}
      <div style="height:16px"></div>
    </div>`;
}

/* ── REVIEWS ──────────────────────────────────── */
function renderReviews() {
  const cards = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-card__header">
        <div class="review-card__avatar">${r.initials}</div>
        <div>
          <div class="review-card__name">${r.name}</div>
          <div class="review-card__meta">
            <span class="review-card__stars">★★★★★</span>
            <span class="review-card__date">${r.date}</span>
          </div>
        </div>
      </div>
      <div class="review-card__text">"${r.text}"</div>
      <div class="review-card__service">Услуга: ${r.service}</div>
    </div>`).join('');

  return `
    <div class="nav-header">
      <button class="nav-header__back" onclick="router.pop()">‹</button>
      <div class="nav-header__title">Отзывы клиентов</div>
    </div>
    <div class="screen-body">
      <div style="display:flex;align-items:center;gap:12px;margin:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px">
        <div style="font-size:40px;font-weight:900;color:var(--gold);line-height:1">5.0</div>
        <div>
          <div style="color:var(--gold);font-size:20px;letter-spacing:2px">★★★★★</div>
          <div style="font-size:13px;color:var(--text2);margin-top:2px">200+ довольных клиентов</div>
        </div>
      </div>
      ${cards}
      <div style="padding:0 16px 8px">
        <button class="btn btn--ghost" onclick="router.push('booking',{})">Стать следующим ✓</button>
      </div>
      <div style="height:16px"></div>
    </div>`;
}

/* ── ABOUT ────────────────────────────────────── */
function renderAbout() {
  return `
    <div class="nav-header">
      <button class="nav-header__back" onclick="router.pop()">‹</button>
      <div class="nav-header__title">О студии</div>
    </div>
    <div class="screen-body">
      <div style="height:16px"></div>
      <div class="about-section">
        <p>MS Detailing Carbon — премиум-студия детейлинга в Казани. Работаем с 2018 года. За это время обработали более 1200 автомобилей разных марок и классов.</p>
        <p>Мы специализируемся на защите и восстановлении лакокрасочных покрытий: полировка, нанокерамика, PPF-бронирование. Работаем только с профессиональными материалами: Koch Chemie, Rupes, Llumar, SolarGard.</p>
        <p>Каждый автомобиль получает индивидуальный подход. Мы не торопимся — качество для нас важнее скорости.</p>
      </div>

      <div class="section-title">Сертификаты и партнёры</div>
      <div class="cert-grid">
        ${[
          ['🏆', 'Koch Chemie', 'Авторизованный партнёр'],
          ['🛡️', 'Llumar', 'Сертифицированный установщик'],
          ['⭐', 'Rupes', 'Профессиональный дистрибьютор'],
          ['✅', 'ISO 9001', 'Система менеджмента качества'],
        ].map(([icon, name, sub]) => `
          <div class="cert-card">
            <div class="cert-card__icon">${icon}</div>
            <div class="cert-card__name">${name}</div>
            <div class="cert-card__sub">${sub}</div>
          </div>`).join('')}
      </div>

      <div class="section-title">Команда</div>
      <div style="margin:0 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        ${[
          ['🎯', 'Мухаммад', 'Основатель · Мастер полировки'],
          ['🔬', 'Сергей', 'Керамика и PPF · 5 лет опыта'],
          ['🪑', 'Айгуль', 'Химчистка салонов · Специалист по коже'],
          ['📋', 'Алина', 'Менеджер · Консультации и запись'],
        ].map(([icon, name, role]) => `
          <div class="list-row" style="cursor:default">
            <div class="list-row__icon">${icon}</div>
            <div class="list-row__body">
              <div class="list-row__title">${name}</div>
              <div class="list-row__sub">${role}</div>
            </div>
          </div>`).join('')}
      </div>

      <div style="padding:20px 16px">
        <button class="btn btn--gold" onclick="router.push('booking',{})">Записаться на услугу</button>
      </div>
    </div>`;
}

/* ── PROFILE ──────────────────────────────────── */
function renderProfile() {
  const name   = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : 'Гость';
  const sub    = tgUser ? (tgUser.username ? '@' + tgUser.username : 'ID: ' + tgUser.id) : 'Откройте в Telegram боте';
  const inits  = tgUser ? ((tgUser.first_name||'')[0]||'') + ((tgUser.last_name||'')[0]||'') : '👤';

  const bookings = loadBookings();
  const historyHtml = bookings.length ? bookings.slice(0, 5).map(b => `
    <div class="history-card">
      <div class="history-card__header">
        <div class="history-card__service">${b.service}</div>
        <div class="history-card__date">${b.date}</div>
      </div>
      ${b.comment ? `<div class="history-card__comment">${b.comment}</div>` : ''}
      <div style="margin-top:8px"><span class="badge badge--green">${b.status}</span></div>
    </div>`).join('') : `
      <div class="empty-state">
        <div class="empty-state__icon">📋</div>
        <div class="empty-state__title">Заявок пока нет</div>
        <div class="empty-state__sub">Запишитесь на услугу — история появится здесь</div>
        <button class="btn btn--gold btn--sm" onclick="router.push('booking',{})">Записаться</button>
      </div>`;

  return `
    <div class="nav-header">
      <div class="nav-header__title">Профиль</div>
      <button class="nav-header__action" onclick="router.push('promo',{})">🎁</button>
    </div>
    <div class="screen-body">
      <div class="profile-hero">
        <div class="profile-avatar">${inits}</div>
        <div class="profile-name">${name}</div>
        <div class="profile-sub">${sub}</div>
      </div>

      <div class="promo-banner" onclick="router.push('promo',{})">
        <div class="promo-banner__icon">🎁</div>
        <div>
          <div class="promo-banner__code">CARBON25</div>
          <div class="promo-banner__desc">Скидка 25% · Назовите мастеру</div>
        </div>
        <button class="promo-banner__copy" onclick="copyPromo(event)">Скопировать</button>
      </div>

      <div style="margin:0 16px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        <div class="list-row" onclick="router.push('booking',{})">
          <div class="list-row__icon">📋</div>
          <div class="list-row__body"><div class="list-row__title">Записаться</div><div class="list-row__sub">Новая заявка</div></div>
          <div class="list-row__right">›</div>
        </div>
        <div class="list-row" onclick="router.push('promo',{})">
          <div class="list-row__icon">🏆</div>
          <div class="list-row__body"><div class="list-row__title">Промокод и акции</div><div class="list-row__sub">CARBON25 · −25%</div></div>
          <div class="list-row__right">›</div>
        </div>
        <div class="list-row" onclick="router.push('about',{})">
          <div class="list-row__icon">ℹ️</div>
          <div class="list-row__body"><div class="list-row__title">О студии</div><div class="list-row__sub">История, команда</div></div>
          <div class="list-row__right">›</div>
        </div>
        <a href="tel:+79991576971" class="list-row" style="text-decoration:none;color:inherit">
          <div class="list-row__icon">📞</div>
          <div class="list-row__body"><div class="list-row__title">Позвонить</div><div class="list-row__sub">+7 (999) 157-69-71</div></div>
          <div class="list-row__right">›</div>
        </a>
      </div>

      <div class="section-title">История заявок</div>
      ${historyHtml}
      <div style="height:16px"></div>
    </div>`;
}

/* ── PROMO ────────────────────────────────────── */
function renderPromo() {
  return `
    <div class="nav-header">
      <button class="nav-header__back" onclick="router.pop()">‹</button>
      <div class="nav-header__title">Акции и промокод</div>
    </div>
    <div class="screen-body">
      <div class="promo-big-code">CARBON25</div>
      <div class="promo-discount">Скидка 25% на любую услугу</div>

      <div style="padding:0 16px 16px">
        <button class="btn btn--gold" onclick="copyPromo()">Скопировать промокод</button>
      </div>

      <div class="section-title--sm">Как воспользоваться</div>
      <div class="promo-rules" style="margin:0 16px">
        ${[
          ['Запишитесь на услугу через приложение или по телефону'],
          ['При записи или при приёмке авто назовите мастеру промокод CARBON25'],
          ['Получите скидку 25% от стоимости любой услуги'],
          ['Промокод действует для новых клиентов, 1 раз'],
        ].map(([text], i) => `
          <div class="promo-rule">
            <div class="promo-rule__num">${i+1}</div>
            <div class="promo-rule__text">${text}</div>
          </div>`).join('')}
      </div>

      <div style="padding:20px 16px 8px">
        <button class="btn btn--gold" onclick="router.push('booking',{})">
          Записаться со скидкой 25%
        </button>
      </div>

      <div class="section-title">Текущие акции</div>
      <div style="margin:0 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
        ${[
          ['🎁', 'Первый визит −25%', 'Промокод CARBON25 для новых клиентов'],
          ['🏎️', 'Комплекс — скидка 10%', 'При записи на полный детейлинг'],
          ['👥', 'Приведи друга', 'Скидка 5 000 ₽ за каждого рефераала'],
        ].map(([icon, title, sub]) => `
          <div class="list-row" style="cursor:default">
            <div class="list-row__icon">${icon}</div>
            <div class="list-row__body">
              <div class="list-row__title">${title}</div>
              <div class="list-row__sub">${sub}</div>
            </div>
          </div>`).join('')}
      </div>
      <div style="height:24px"></div>
    </div>`;
}

/* ══════════════════════════════════════════════
   AFTER-RENDER HOOKS (attach events after DOM)
   ══════════════════════════════════════════════ */
function afterRender(name, params, el) {
  if (name === 'home') {
    setTimeout(() => {
      const bg = el.querySelector('#heroBg');
      if (bg) bg.classList.add('home-hero__bg--anim');
    }, 50);
  }

  if (name === 'booking') {
    const photos = el.querySelector('#bPhotos');
    const preview = el.querySelector('#photoPreview');
    if (photos && preview) {
      photos.addEventListener('change', () => {
        preview.innerHTML = '';
        Array.from(photos.files).slice(0, 5).forEach(f => {
          const img = new Image();
          img.className = 'photo-thumb';
          img.src = URL.createObjectURL(f);
          preview.appendChild(img);
        });
      });
    }
  }

  if (name === 'tryon') {
    const fileMain = el.querySelector('#tryonFileMain');
    if (fileMain) fileMain.addEventListener('change', e => loadTryonPhoto(e.target));
    const fileInterior = el.querySelector('#tryonInteriorFile');
    if (fileInterior) fileInterior.addEventListener('change', e => loadInteriorPhoto(e.target));
  }
}

/* ══════════════════════════════════════════════
   SERVICES FILTER
   ══════════════════════════════════════════════ */
function filterServices(btn, filter) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('filter-chip--active'));
  btn.classList.add('filter-chip--active');
  haptic('selection');

  const list = document.getElementById('servicesList');
  if (!list) return;

  const cards = list.querySelectorAll('.service-card');
  cards.forEach(card => {
    const svcId = card.getAttribute('onclick').match(/'([^']+)'/)?.[1];
    const svc   = SERVICES.find(s => s.id === svcId);
    if (!svc) return;
    const show = filter === 'all' || svc.category === filter;
    card.style.display = show ? 'flex' : 'none';
  });
}

/* ══════════════════════════════════════════════
   BOOKING FORM SUBMIT
   ══════════════════════════════════════════════ */
async function submitBooking(e) {
  e.preventDefault();
  const btn      = document.getElementById('bSubmit');
  const btnText  = document.getElementById('bSubmitText');
  const result   = document.getElementById('bResult');

  btn.disabled = true;
  btnText.innerHTML = '<span class="spinner"></span>';

  const name    = (document.getElementById('bName')?.value || '').trim();
  const phone   = (document.getElementById('bPhone')?.value || '').trim();
  const service = (document.getElementById('bService')?.value || '').trim();
  const car     = (document.getElementById('bCar')?.value || '').trim();
  const comment = (document.getElementById('bComment')?.value || '').trim();
  const photos  = document.getElementById('bPhotos')?.files || [];

  const tgLine = tgUser
    ? `Telegram: @${tgUser.username || '—'} (ID ${tgUser.id}, ${[tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ')})`
    : '';

  const requestText = [service, car ? `Авто: ${car}` : '', comment, tgLine].filter(Boolean).join('\n');

  const fd = new FormData();
  fd.append('name',    name || (tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : 'Не указано'));
  fd.append('phone',   phone);
  fd.append('request', requestText);
  fd.append('source',  'tma_v3');
  for (const f of photos) fd.append('photos', f);

  try {
    const res  = await fetch('/submit', { method: 'POST', body: fd });
    const data = await res.json();

    if (data.ok) {
      haptic('success');
      saveBooking({ id: Date.now(), service: service || 'Консультация', comment: car, date: new Date().toLocaleDateString('ru-RU'), status: 'Принята' });
      // Find matching service for image
      const svcMatch = SERVICES.find(s => s.booking === service);
      router.push('payment', {
        service: service || 'Консультация',
        price:   svcMatch?.price || 'от 8 000 ₽',
        img:     svcMatch?.img   || 'assets/gwagon-front.jpg',
      });
    } else {
      throw new Error(data.error || 'Ошибка сервера');
    }
  } catch (err) {
    haptic('error');
    result.innerHTML = `<div style="color:var(--red);font-size:14px;padding:4px 0">⚠ ${err.message || 'Попробуйте ещё раз'}</div>`;
    btnText.textContent = 'Отправить заявку';
    btn.disabled = false;
  }
}

/* ══════════════════════════════════════════════
   TRY-ON v4 — Zone-aware visual customizer
   ══════════════════════════════════════════════ */

const WRAP_COLORS = [
  { id: 'ppf',   hex: null,      name: 'PPF',       sub: 'Прозрачный' },
  { id: 'blk_g', hex: '#0d0d0d', name: 'Чёрный',    sub: 'Глянец' },
  { id: 'blk_m', hex: '#2a2a2a', name: 'Чёрный',    sub: 'Матовый' },
  { id: 'wht',   hex: '#e8e8e8', name: 'Белый',     sub: 'Глянец' },
  { id: 'navy',  hex: '#0d30c4', name: 'Синий',     sub: 'Глянец' },
  { id: 'red',   hex: '#d00000', name: 'Красный',   sub: 'Глянец' },
  { id: 'grn',   hex: '#1a6624', name: 'Зелёный',   sub: 'Матовый' },
  { id: 'gld',   hex: '#c49a08', name: 'Золотой',   sub: 'Металлик' },
  { id: 'slv',   hex: '#909090', name: 'Серебро',   sub: 'Металлик' },
  { id: 'prp',   hex: '#6600cc', name: 'Фиолет.',   sub: 'Глянец' },
  { id: 'org',   hex: '#dd4400', name: 'Оранж.',    sub: 'Глянец' },
  { id: 'brz',   hex: '#8c5a20', name: 'Бронза',    sub: 'Металлик' },
];

const TINT_LEVELS = [
  { id: 't70', pct: '70%', name: 'Лёгкая',   opacity: 0.14 },
  { id: 't50', pct: '50%', name: 'Комфорт',  opacity: 0.30 },
  { id: 't35', pct: '35%', name: 'Тёмная',   opacity: 0.50 },
  { id: 't15', pct: '15%', name: 'Лимузин',  opacity: 0.70 },
  { id: 't05', pct: '5%',  name: 'Макс.',    opacity: 0.86 },
];

const WHEEL_COLORS = [
  { id: 'orig', hex: null,      name: 'Ориг.' },
  { id: 'blk',  hex: '#0a0a0a', name: 'Чёрн.' },
  { id: 'gry',  hex: '#555555', name: 'Серые' },
  { id: 'wht',  hex: '#dcdcdc', name: 'Белые' },
  { id: 'gld',  hex: '#c0920a', name: 'Золото' },
  { id: 'brz',  hex: '#7a4e20', name: 'Бронза' },
  { id: 'chr',  hex: '#ccd4db', name: 'Хром' },
];

let tryonMode     = 'body';
let tryonImg      = null;
let tryonBodyFx   = 'original';
let tryonWrapHex  = null;
let tryonTintId   = 't50';
let tryonWheelHex = null;
let tryonMask     = null;   // Float32Array — car body mask (0..1 per pixel)
let tryonSeedNX   = null;   // normalized seed X (0..1), null = auto-center
let tryonSeedNY   = null;   // normalized seed Y (0..1), null = auto

/* ── Mode switching ───────────────────────────── */
function setTryonMode(mode) {
  tryonMode = mode;
  haptic('selection');
  document.querySelectorAll('.tryon-tab').forEach(b =>
    b.classList.toggle('tryon-tab--active', b.dataset.mode === mode));

  const uploadZone = document.getElementById('tryonUploadZone');
  const workspace  = document.getElementById('tryonWorkspace');
  const interior   = document.getElementById('tryonInterior');

  if (mode === 'interior') {
    if (uploadZone) uploadZone.style.display = 'none';
    if (workspace)  workspace.style.display  = 'none';
    if (interior)   interior.style.display   = 'block';
    setTimeout(initBASlider, 80);
    return;
  }
  if (interior) interior.style.display = 'none';
  if (tryonImg) {
    if (uploadZone) uploadZone.style.display = 'none';
    if (workspace)  workspace.style.display  = 'block';
    renderTryonControls();
    applyTryonEffect();
  } else {
    if (uploadZone) uploadZone.style.display = 'flex';
    if (workspace)  workspace.style.display  = 'none';
  }
}

/* ── Controls rendering ───────────────────────── */
function renderTryonControls() {
  const el = document.getElementById('tryonControls');
  if (!el) return;
  if (tryonMode === 'body')        el.innerHTML = renderBodyControls();
  else if (tryonMode === 'tint')   el.innerHTML = renderTintControls();
  else if (tryonMode === 'wheels') el.innerHTML = renderWheelControls();
  else el.innerHTML = '';
}

function renderBodyControls() {
  const fxList = [
    { id: 'original', icon: '📸', name: 'Оригинал' },
    { id: 'polish',   icon: '✨', name: 'Полировка' },
    { id: 'ceramic',  icon: '🛡️', name: 'Керамика' },
    { id: 'ppf',      icon: '🏎️', name: 'PPF' },
    { id: 'wrap',     icon: '🎨', name: 'Цвет' },
  ];
  const fxBtns = fxList.map(t => `
    <button class="treatment-btn ${t.id === tryonBodyFx ? 'treatment-btn--active' : ''}"
      data-t="${t.id}" onclick="setBodyFx('${t.id}')">
      <span class="treatment-btn__icon">${t.icon}</span>
      <span class="treatment-btn__name">${t.name}</span>
    </button>`).join('');

  const showColors = tryonBodyFx === 'wrap' || tryonBodyFx === 'ppf';
  const tapHint = (showColors && tryonWrapHex) ? `
    <div class="tryon-tap-hint">
      <span class="tryon-tap-hint__icon">👆</span>
      Нажмите на кузов, чтобы уточнить выделение
    </div>` : '';
  const colorGrid = showColors ? `
    <div class="section-title--sm" style="margin-top:14px">Цвет плёнки</div>
    <div class="wrap-color-grid">
      ${WRAP_COLORS.map(c => `
        <button class="wrap-swatch ${isActiveWrap(c) ? 'wrap-swatch--active' : ''}"
          data-cid="${c.id}" onclick="setWrapColor('${c.id}','${c.hex}')">
          <span class="wrap-swatch__dot" style="${c.hex ? `background:${c.hex}` : 'background:linear-gradient(135deg,#ccc 50%,#666 50%)'}"></span>
          <span class="wrap-swatch__name">${c.name}</span>
          <span class="wrap-swatch__sub">${c.sub}</span>
        </button>`).join('')}
    </div>
    ${tapHint}` : '';

  const descMap = {
    original: 'Исходное состояние автомобиля без каких-либо обработок.',
    polish:   '✨ Машинная полировка устраняет царапины, голограммы, потёртости. Кузов приобретает зеркальный блеск.',
    ceramic:  '🛡️ Нанокерамика 9H создаёт стеклоподобный защитный слой. Гидрофобность и блеск на 3–5 лет.',
    ppf:      '🏎️ Полиуретановая плёнка от сколов и царапин. Прозрачная или выберите цвет кузова ниже.',
    wrap:     '🎨 Цветная виниловая плёнка полностью меняет цвет кузова. Глянец, матовый или металлик.',
  };
  const ctaId = { polish: 'polish', ceramic: 'ceramic', ppf: 'ppf', wrap: 'ppf' }[tryonBodyFx];

  return `
    <div class="treatment-grid">${fxBtns}</div>
    ${colorGrid}
    <div class="treatment-desc" style="margin-top:12px">${descMap[tryonBodyFx] || ''}</div>
    ${ctaId ? `<div style="padding:12px 16px 4px"><button class="btn btn--gold" onclick="router.push('service-detail',{id:'${ctaId}'})">Записаться →</button></div>` : ''}`;
}

function isActiveWrap(c) {
  if (c.id === 'ppf') return tryonBodyFx === 'ppf' && !tryonWrapHex;
  return tryonWrapHex === c.hex;
}

function renderTintControls() {
  const btns = TINT_LEVELS.map(t => `
    <button class="tint-btn ${t.id === tryonTintId ? 'tint-btn--active' : ''}"
      data-tid="${t.id}" onclick="setTintLevel('${t.id}')">
      <span class="tint-btn__glass" style="opacity:${0.12 + t.opacity * 0.9}"></span>
      <span class="tint-btn__pct">${t.pct}</span>
      <span class="tint-btn__name">${t.name}</span>
    </button>`).join('');
  return `
    <div class="section-title--sm" style="margin-top:14px">Степень затемнения</div>
    <div class="tint-grid">${btns}</div>
    <div class="treatment-desc" style="margin-top:12px">🪟 Плёнки Llumar / SolarGard. Защита UV 99%, снижение нагрева до 60%. Гарантия 2 года.</div>
    <div style="padding:12px 16px 4px">
      <button class="btn btn--gold" onclick="router.push('service-detail',{id:'tint'})">Записаться на тонировку →</button>
    </div>`;
}

function renderWheelControls() {
  const swatches = WHEEL_COLORS.map(c => `
    <button class="wheel-swatch ${isActiveWheel(c) ? 'wheel-swatch--active' : ''}"
      data-wid="${c.id}" onclick="setWheelColor('${c.id}','${c.hex}')">
      <span class="wheel-swatch__dot" style="${c.hex ? `background:${c.hex}` : 'background:conic-gradient(#aaa,#fff,#888,#555,#aaa)'}"></span>
      <span class="wheel-swatch__name">${c.name}</span>
    </button>`).join('');
  return `
    <div class="section-title--sm" style="margin-top:14px">Цвет дисков</div>
    <div class="wheel-swatches">${swatches}</div>
    <div class="treatment-desc" style="margin-top:12px">⚙️ Порошковая покраска и хромирование дисков. Полная смена цвета с подготовкой поверхности.</div>`;
}

function isActiveWheel(c) {
  if (c.id === 'orig') return !tryonWheelHex;
  return tryonWheelHex === c.hex;
}

/* ── Color helpers for canvas recoloring ────────── */
function _hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function _rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255;
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn;
  let h=0, s=0, l=(mx+mn)/2;
  if (d) {
    s = d / (1 - Math.abs(2*l - 1));
    switch(mx) {
      case r: h = (((g-b)/d % 6) + 6) % 6; break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}
function _hslToRgb(h,s,l) {
  const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h*6)%2-1)), m=l-c/2;
  let r=0,g=0,b=0;
  const hi=Math.floor(h*6);
  if(hi===0){r=c;g=x;} else if(hi===1){r=x;g=c;}
  else if(hi===2){g=c;b=x;} else if(hi===3){g=x;b=c;}
  else if(hi===4){r=x;b=c;} else{r=c;b=x;}
  return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
}

/* ── Perceptual color distance ──────────────────── */
function _colorDist(r1,g1,b1, r2,g2,b2) {
  const dr=r1-r2, dg=g1-g2, db=b1-b2;
  return Math.sqrt(2*dr*dr + 4*dg*dg + 3*db*db); // perceptual weights
}

/**
 * Flood-fill car mask at reduced resolution.
 * Dual constraint: step tolerance (stops at sharp paint/background edges)
 * + seed drift tolerance (prevents color-creep to far-away regions).
 */
function _floodFillMask(imgData, seedX, seedY) {
  const { data: d, width: w, height: h } = imgData;
  const n = w * h;
  const mask    = new Uint8Array(n);
  const visited = new Uint8Array(n);

  const sx = Math.max(0, Math.min(w-1, Math.round(seedX)));
  const sy = Math.max(0, Math.min(h-1, Math.round(seedY)));
  const si = (sy * w + sx) * 4;
  const SR = d[si], SG = d[si+1], SB = d[si+2];

  const STEP = 32;   // max Δ between adjacent pixels (blocks crossing hard edges)
  const DRIFT = 78;  // max total Δ from seed color (prevents runaway expansion)

  const queue = new Int32Array(n);
  let head = 0, tail = 0;
  const start = sy * w + sx;
  queue[tail++] = start;
  visited[start] = 1;
  mask[start] = 255;

  // Store each queued pixel's own color for step-comparison with its neighbors
  const CR = new Uint8Array(n), CG = new Uint8Array(n), CB = new Uint8Array(n);
  CR[start] = SR; CG[start] = SG; CB[start] = SB;

  while (head < tail) {
    const idx = queue[head++];
    const y = (idx / w) | 0, x = idx - y * w;
    const cr = CR[idx], cg = CG[idx], cb = CB[idx];

    const nbrs = [];
    if (x > 0)   nbrs.push(idx - 1);
    if (x < w-1) nbrs.push(idx + 1);
    if (y > 0)   nbrs.push(idx - w);
    if (y < h-1) nbrs.push(idx + w);

    for (let k = 0; k < nbrs.length; k++) {
      const ni = nbrs[k];
      if (visited[ni]) continue;
      visited[ni] = 1;
      const pi = ni * 4;
      const nr = d[pi], ng = d[pi+1], nb = d[pi+2];
      if (_colorDist(nr,ng,nb, cr,cg,cb) > STEP)  continue;
      if (_colorDist(nr,ng,nb, SR,SG,SB) > DRIFT) continue;
      mask[ni] = 255;
      CR[ni] = nr; CG[ni] = ng; CB[ni] = nb;
      queue[tail++] = ni;
    }
  }
  return mask;
}

/** Two-pass separable box blur → soft mask edges. */
function _softMask(hard, w, h) {
  const n = w * h;
  const f = new Float32Array(n);
  for (let i = 0; i < n; i++) f[i] = hard[i] / 255;

  const r = Math.max(2, (w * 0.014) | 0); // ~1.4% of width
  const t = new Float32Array(n);

  // Horizontal
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, c = 0;
      for (let k = -r; k <= r; k++) {
        const nx = x + k;
        if (nx >= 0 && nx < w) { s += f[y*w+nx]; c++; }
      }
      t[y*w+x] = s / c;
    }
  }
  // Vertical
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let s = 0, c = 0;
      for (let k = -r; k <= r; k++) {
        const ny = y + k;
        if (ny >= 0 && ny < h) { s += t[ny*w+x]; c++; }
      }
      f[y*w+x] = s / c;
    }
  }
  return f;
}

/** Bilinear upsample from (sw×sh) to (dw×dh). */
function _upsampleMask(src, sw, sh, dw, dh) {
  if (sw === dw && sh === dh) return src;
  const dst = new Float32Array(dw * dh);
  const rx = sw / dw, ry = sh / dh;
  for (let y = 0; y < dh; y++) {
    const sy = y * ry, y0 = sy | 0, y1 = Math.min(y0+1, sh-1), fy = sy - y0;
    for (let x = 0; x < dw; x++) {
      const sx = x * rx, x0 = sx | 0, x1 = Math.min(x0+1, sw-1), fx = sx - x0;
      dst[y*dw+x] = src[y0*sw+x0]*(1-fx)*(1-fy) + src[y0*sw+x1]*fx*(1-fy)
                  + src[y1*sw+x0]*(1-fx)*fy      + src[y1*sw+x1]*fx*fy;
    }
  }
  return dst;
}

/**
 * Build car body mask via flood-fill from a normalised seed point (0..1).
 * Works at a capped resolution (480 px wide) for speed, then upsamples.
 */
function buildCarMask(canvas, seedNX, seedNY) {
  const PROC_MAX = 480;
  const scale = Math.min(1, PROC_MAX / canvas.width);
  const pw = Math.round(canvas.width  * scale);
  const ph = Math.round(canvas.height * scale);

  const tmp = document.createElement('canvas');
  tmp.width = pw; tmp.height = ph;
  const tc = tmp.getContext('2d');
  tc.drawImage(tryonImg, 0, 0, pw, ph);
  const imgData = tc.getImageData(0, 0, pw, ph);

  const hard = _floodFillMask(imgData, seedNX * pw, seedNY * ph);
  const soft = _softMask(hard, pw, ph);
  return _upsampleMask(soft, pw, ph, canvas.width, canvas.height);
}

/**
 * Apply wrap color to canvas using the pre-computed car body mask.
 * Hue replaced → target, saturation boosted to rich level, lightness preserved.
 */
function applyColorWithMask(ctx, canvas, mask, targetHex) {
  const [tR,tG,tB] = _hexToRgb(targetHex);
  const [tH, tS]   = _rgbToHsl(tR,tG,tB);
  const isAchromatic = tS < 0.10;
  const RICH_S = Math.max(tS, 0.72);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    const blend = mask[i >> 2];
    if (blend < 0.01) continue;
    const [h, s, l] = _rgbToHsl(d[i], d[i+1], d[i+2]);
    let nr, ng, nb;
    if (isAchromatic) {
      const newS = s * (1 - blend * 0.86);
      [nr,ng,nb] = _hslToRgb(h, newS, l);
    } else {
      const newS = s + (RICH_S - s) * blend;
      [nr,ng,nb] = _hslToRgb(tH, Math.min(1, newS), l);
    }
    d[i]   = (d[i]   + (nr - d[i])   * blend + 0.5) | 0;
    d[i+1] = (d[i+1] + (ng - d[i+1]) * blend + 0.5) | 0;
    d[i+2] = (d[i+2] + (nb - d[i+2]) * blend + 0.5) | 0;
  }
  ctx.putImageData(imgData, 0, 0);
}

/* ── Apply visual effects ─────────────────────── */
function applyTryonEffect() {
  if (!tryonImg) return;
  const canvas = document.getElementById('tryonCanvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const wrap = document.getElementById('tryonCanvasWrap');
  const maxW = (wrap || canvas.parentElement).clientWidth;
  const ratio = tryonImg.naturalHeight / tryonImg.naturalWidth;
  const dpr   = window.devicePixelRatio || 1;
  canvas.width  = Math.min(maxW * dpr, 1200);
  canvas.height = canvas.width * ratio;
  canvas.style.width  = maxW + 'px';
  canvas.style.height = (maxW * ratio) + 'px';

  if (tryonMode === 'body') {
    const filters = {
      original: 'none',
      polish:   'contrast(1.15) saturate(1.4) brightness(1.08)',
      ceramic:  'contrast(1.2)  saturate(1.45) brightness(1.13)',
      ppf:      'contrast(1.06) saturate(1.12)',
      wrap:     'none',
    };
    canvas.style.filter = filters[tryonBodyFx] || 'none';
  } else {
    canvas.style.filter = 'none';
  }
  ctx.drawImage(tryonImg, 0, 0, canvas.width, canvas.height);

  // Flood-fill car mask → precise body recoloring
  if (tryonMode === 'body' && tryonWrapHex &&
      (tryonBodyFx === 'wrap' || tryonBodyFx === 'ppf')) {
    if (!tryonMask) {
      const nx = tryonSeedNX ?? 0.50;
      const ny = tryonSeedNY ?? 0.42; // slightly above centre → car body, not wheels
      tryonMask = buildCarMask(canvas, nx, ny);
    }
    applyColorWithMask(ctx, canvas, tryonMask, tryonWrapHex);
  }

  // Other layers (tint, wheels) stay CSS-based; body div is no longer used
  ['layerBody','layerTint','layerWheelL','layerWheelR'].forEach(id => {
    const l = document.getElementById(id);
    if (l) { l.style.display = 'none'; l.style.background = ''; }
  });

  if (tryonMode === 'tint') {
    const lv = TINT_LEVELS.find(t => t.id === tryonTintId) || TINT_LEVELS[1];
    const l  = document.getElementById('layerTint');
    if (l) { l.style.display = 'block'; l.style.background = `rgba(0,3,12,${lv.opacity})`; }
  }

  if (tryonMode === 'wheels' && tryonWheelHex) {
    ['layerWheelL','layerWheelR'].forEach(id => {
      const l = document.getElementById(id);
      if (l) { l.style.display = 'block'; l.style.background = tryonWheelHex; }
    });
  }

  const badge = document.getElementById('tryonBadge');
  if (!badge) return;
  if (tryonMode === 'body') {
    const labels = { original: 'Оригинал', polish: '✨ Полировка',
                     ceramic: '🛡️ Керамика', ppf: 'PPF', wrap: '🎨 Плёнка' };
    badge.textContent = labels[tryonBodyFx] || 'Оригинал';
  } else if (tryonMode === 'tint') {
    const lv = TINT_LEVELS.find(t => t.id === tryonTintId) || TINT_LEVELS[1];
    badge.textContent = `Тонировка ${lv.pct} · ${lv.name}`;
  } else if (tryonMode === 'wheels') {
    const wc = WHEEL_COLORS.find(c => c.hex === tryonWheelHex);
    badge.textContent = wc ? `Диски · ${wc.name}` : 'Оригинал';
  }
}

/* ── Photo loading ────────────────────────────── */
function loadTryonPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    tryonImg = new Image();
    tryonImg.onload = () => { _resetMask(); showTryonWorkspace(); };
    tryonImg.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function loadDemoCar() {
  haptic('light');
  tryonImg = new Image();
  tryonImg.onload = () => { _resetMask(); showTryonWorkspace(); };
  tryonImg.src = 'assets/gwagon-body.jpg';
}

function _resetMask() {
  tryonMask = null; tryonSeedNX = null; tryonSeedNY = null;
}

function showTryonWorkspace() {
  const uploadZone = document.getElementById('tryonUploadZone');
  const workspace  = document.getElementById('tryonWorkspace');
  if (uploadZone) uploadZone.style.display = 'none';
  if (workspace)  workspace.style.display  = 'block';
  if (tryonMode === 'interior') {
    tryonMode = 'body';
    document.querySelectorAll('.tryon-tab').forEach(b =>
      b.classList.toggle('tryon-tab--active', b.dataset.mode === 'body'));
  }
  renderTryonControls();
  setTimeout(() => {
    applyTryonEffect();
    _attachCanvasSeedListeners();
  }, 40);
}

/** Attach tap/click listeners for re-seeding the flood-fill. */
function _attachCanvasSeedListeners() {
  const canvas = document.getElementById('tryonCanvas');
  if (!canvas || canvas._seedBound) return;
  canvas._seedBound = true;

  function reseed(clientX, clientY) {
    if (tryonMode !== 'body') return;
    if (tryonBodyFx !== 'wrap' && tryonBodyFx !== 'ppf') return;
    if (!tryonWrapHex) return;
    const rect = canvas.getBoundingClientRect();
    tryonSeedNX = (clientX - rect.left)  / rect.width;
    tryonSeedNY = (clientY - rect.top)   / rect.height;
    tryonMask   = null; // invalidate → recompute on next applyTryonEffect
    haptic('light');
    applyTryonEffect();
  }

  canvas.addEventListener('click', e => reseed(e.clientX, e.clientY));
  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    reseed(t.clientX, t.clientY);
  }, { passive: false });
}

/* ── Effect setters ───────────────────────────── */
function setBodyFx(fx) {
  tryonBodyFx = fx;
  if (fx !== 'wrap' && fx !== 'ppf') tryonWrapHex = null;
  haptic('selection');
  document.querySelectorAll('[data-t]').forEach(b =>
    b.classList.toggle('treatment-btn--active', b.dataset.t === fx));
  renderTryonControls();
  applyTryonEffect();
}

function setWrapColor(id, hexStr) {
  tryonWrapHex = (!hexStr || hexStr === 'null') ? null : hexStr;
  haptic('selection');
  document.querySelectorAll('.wrap-swatch').forEach(s =>
    s.classList.toggle('wrap-swatch--active', s.dataset.cid === id));
  applyTryonEffect();
}

function setTintLevel(id) {
  tryonTintId = id;
  haptic('selection');
  document.querySelectorAll('.tint-btn').forEach(b =>
    b.classList.toggle('tint-btn--active', b.dataset.tid === id));
  applyTryonEffect();
}

function setWheelColor(id, hexStr) {
  tryonWheelHex = (!hexStr || hexStr === 'null') ? null : hexStr;
  haptic('selection');
  document.querySelectorAll('.wheel-swatch').forEach(s =>
    s.classList.toggle('wheel-swatch--active', s.dataset.wid === id));
  applyTryonEffect();
}

function resetTryon() {
  tryonImg = null; tryonBodyFx = 'original'; tryonWrapHex = null;
  tryonTintId = 't50'; tryonWheelHex = null;
  _resetMask();
  const up = document.getElementById('tryonUploadZone');
  const ws = document.getElementById('tryonWorkspace');
  const fi = document.getElementById('tryonFileMain');
  if (up) up.style.display = 'flex';
  if (ws) ws.style.display = 'none';
  if (fi) fi.value = '';
}

/* ── Before/After slider ──────────────────────── */
function initBASlider() {
  setupBASlider('baWrap', 'baHandle', 'baAfterMask');
}

function setupBASlider(wrapId, handleId, maskId) {
  const wrap   = document.getElementById(wrapId);
  const handle = document.getElementById(handleId);
  const mask   = document.getElementById(maskId);
  if (!wrap || !handle || !mask) return;

  let dragging = false;

  function setPos(clientX) {
    const rect = wrap.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(3, Math.min(97, pct));
    mask.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left   = pct + '%';
  }

  handle.addEventListener('pointerdown', e => {
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  handle.addEventListener('pointermove', e => { if (dragging) setPos(e.clientX); });
  handle.addEventListener('pointerup',   () => { dragging = false; });
  wrap.addEventListener('pointerdown', e => {
    if (e.target === handle || handle.contains(e.target)) return;
    setPos(e.clientX);
  });

  const rect = wrap.getBoundingClientRect();
  if (rect.width > 0) setPos(rect.left + rect.width * 0.5);
}

/* ── Interior photo simulation ────────────────── */
function loadInteriorPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => renderInteriorSim(img);
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function renderInteriorSim(img) {
  const result = document.getElementById('tryonInteriorResult');
  if (!result) return;
  result.style.display = 'block';

  const beforeC = document.getElementById('baUserBefore');
  const afterC  = document.getElementById('baUserAfter');
  if (!beforeC || !afterC) return;

  const ratio = img.naturalHeight / img.naturalWidth;
  const maxW  = result.clientWidth || 300;
  const dpr   = window.devicePixelRatio || 1;
  const W = Math.min(maxW * dpr, 1000), H = W * ratio;

  [beforeC, afterC].forEach(c => {
    c.width = W; c.height = H;
    c.style.width  = '100%';
    c.style.height = (maxW * ratio) + 'px';
  });

  beforeC.getContext('2d').drawImage(img, 0, 0, W, H);

  const actx = afterC.getContext('2d');
  actx.filter = 'brightness(1.28) contrast(1.2) saturate(1.4)';
  actx.drawImage(img, 0, 0, W, H);
  actx.filter = 'none';
  actx.globalCompositeOperation = 'screen';
  actx.fillStyle = 'rgba(255,245,230,0.06)';
  actx.fillRect(0, 0, W, H);
  actx.globalCompositeOperation = 'source-over';

  setTimeout(() => setupBASlider('baUserWrap', 'baUserHandle', 'baUserAfterMask'), 60);
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ══════════════════════════════════════════════
   PAYMENT LOGIC
   ══════════════════════════════════════════════ */

/* Card formatters */
function fmtCard(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();

  const num = document.getElementById('pcpNumber');
  if (num) num.textContent = input.value.padEnd(19, '•').replace(/\d(?=.{5})/g, (d, i) => i < 12 ? '•' : d) || '•••• •••• •••• ••••';

  // Show full number on card preview while typing
  const disp = input.value || '•••• •••• •••• ••••';
  if (num) num.textContent = disp.length < 19 ? disp + ' ••••'.slice(0, 19 - disp.length) : disp;

  // Detect card type
  const logo = document.getElementById('pcpLogo');
  if (logo) {
    const first = v[0];
    if (first === '4') logo.textContent = 'VISA';
    else if (first === '5' || first === '2') logo.textContent = 'MC';
    else if (first === '2') logo.textContent = 'МИР';
    else logo.textContent = '';
  }
}

function fmtExpiry(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
  input.value = v;
  const el = document.getElementById('pcpExpiry');
  if (el) el.textContent = v || 'ММ/ГГ';
}

function fmtCVV(input) {
  input.value = input.value.replace(/\D/g, '').slice(0, 3);
}

function fmtName(input) {
  input.value = input.value.toUpperCase().replace(/[^A-ZА-ЯЁ\s]/gi, '');
  const el = document.getElementById('pcpHolder');
  if (el) el.textContent = input.value || 'ИМЯ ФАМИЛИЯ';
}

/* Validate card fields */
function validateCard() {
  const num    = document.getElementById('payCardNum')?.value.replace(/\s/g,'') || '';
  const expiry = document.getElementById('payExpiry')?.value || '';
  const cvv    = document.getElementById('payCVV')?.value || '';
  if (num.length < 16)   { shakeField('payCardNum'); showToast('Введите номер карты', 'error'); return false; }
  if (expiry.length < 5) { shakeField('payExpiry');  showToast('Введите срок карты', 'error');  return false; }
  if (cvv.length < 3)    { shakeField('payCVV');     showToast('Введите CVV', 'error');          return false; }
  return true;
}

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = 'var(--red)';
  el.style.animation = 'shake .35s ease';
  setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 400);
  haptic('error');
}

/* Start payment flow */
function startPayment() {
  if (!validateCard()) return;
  haptic('light');

  // Grab params from current screen data attrs
  const screen = router.currentScreen;
  const service = screen?.querySelector('.pay-order-service')?.textContent || '';
  const amount  = screen?.querySelector('.pay-order-price')?.textContent || '';
  const img     = screen?.querySelector('.pay-order-img')?.style.backgroundImage.replace(/url\(['"]?|['"]?\)/g,'') || '';

  router.push('payment-processing', { service, amount, img });
  setTimeout(() => runPaymentSteps(service, amount), 120);
}

function runPaymentSteps(service, amount) {
  const steps = [
    { id: 'step1', title: 'Проверяем карту...',        icon: '💳', delay: 1200 },
    { id: 'step2', title: 'Авторизация банка...',       icon: '🏦', delay: 1400 },
    { id: 'step3', title: 'Подтверждение платежа...', icon: '🔐', delay: 1000 },
  ];

  let elapsed = 0;
  steps.forEach((step, i) => {
    setTimeout(() => {
      const dot = document.getElementById(step.id);
      if (dot) { dot.classList.add('pps-done'); dot.querySelector('.pps-dot').textContent = '✓'; }
      const title = document.getElementById('payProcTitle');
      const icon  = document.getElementById('payProcIcon');
      if (title) title.textContent = step.title;
      if (icon)  icon.textContent  = step.icon;
      setCircleProgress((i + 1) / steps.length * 0.9);
      haptic('selection');
    }, elapsed);
    elapsed += step.delay;
  });

  // Final success
  setTimeout(() => {
    setCircleProgress(1);
    const icon  = document.getElementById('payProcIcon');
    const title = document.getElementById('payProcTitle');
    const sub   = document.getElementById('payProcSub');
    const ring  = document.getElementById('payProcRing');
    if (icon)  { icon.textContent = '✓'; icon.style.color = '#000'; }
    if (title) title.textContent = 'Оплата прошла!';
    if (sub)   sub.textContent   = amount + ' · списано с карты';
    if (ring)  ring.classList.add('pay-proc-ring--success');
    haptic('success');

    setTimeout(() => {
      // Pop processing screen, then show booking success
      router.stacks[router.activeTab].pop(); // remove processing
      router.push('booking-success', { service, paid: true, amount });
    }, 1200);
  }, elapsed);
}

function setCircleProgress(pct) {
  const circle = document.getElementById('payProcCircle');
  if (!circle) return;
  const r = 34;
  const circ = 2 * Math.PI * r;
  circle.style.strokeDashoffset = circ * (1 - pct);
}

/* ── Copy promo ───────────────────────────────── */
function copyPromo(e) {
  if (e) e.stopPropagation();
  navigator.clipboard?.writeText('CARBON25').then(() => {
    showToast('Промокод скопирован!', 'success');
    haptic('success');
  }).catch(() => showToast('CARBON25', ''));
}

/* ─── Tab bar ─────────────────────────────────── */
function buildTabBar() {
  const tabs = [
    { id: 'home',     label: 'Главная',  icon: '🏠' },
    { id: 'services', label: 'Услуги',   icon: '💎' },
    { id: 'tryon',    label: 'Примерка', icon: '🎨' },
    { id: 'profile',  label: 'Профиль',  icon: '👤' },
  ];
  const nav = document.getElementById('tab-bar');
  nav.innerHTML = tabs.map(t => `
    <button class="tab-btn ${t.id === 'home' ? 'tab-btn--active' : ''}" data-tab="${t.id}"
      onclick="router.switchTab('${t.id}');haptic('selection')">
      <span class="tab-btn__icon">${t.icon}</span>
      <span class="tab-btn__label">${t.label}</span>
    </button>`).join('');
}

/* ─── Boot ────────────────────────────────────── */
function init() {
  if (tg) {
    tg.ready();
    tg.expand();
    try { tg.setHeaderColor('#0d0d10'); } catch {}
    try { tg.setBackgroundColor('#0d0d10'); } catch {}
  }
  buildTabBar();
  router.init();
  new SwipeBack();
}

document.addEventListener('DOMContentLoaded', init);
