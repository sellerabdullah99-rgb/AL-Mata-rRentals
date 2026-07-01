// ============================================
// AL-MATAR RENTALS — GLOBAL JS (White/Pro Theme)
// ============================================
const WA = '923001234567'; // ← UPDATE YOUR NUMBER

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollTop')?.classList.toggle('show', window.scrollY > 400);
});

// ── MOBILE MENU ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ── SCROLL TOP ──
document.getElementById('scrollTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── AOS SCROLL ANIMATIONS ──
// Fail-safe design: elements are visible by default (see CSS).
// JS only ADDS the fade-in animation as a progressive enhancement.
// If this script fails or runs before layout settles, content stays visible.
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-in'); e.target.classList.remove('aos-pending'); aosObserver.unobserve(e.target); } });
}, { threshold: 0.05 });

function initAOS() {
  document.querySelectorAll('[data-aos]').forEach(el => {
    if (el.classList.contains('aos-in')) return; // already animated
    el.classList.add('aos-pending');
    aosObserver.observe(el);
  });
}
// Run after a short delay so dynamically-inserted content (async car data, etc.)
// has time to render and report correct size/position to the observer.
if (document.readyState === 'complete') {
  setTimeout(initAOS, 50);
} else {
  window.addEventListener('load', () => setTimeout(initAOS, 50));
}

// ── COUNTER ANIMATION ──
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.dataset.count, duration = 1600;
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      };
      requestAnimationFrame(step);
    });
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats, .stats-row').forEach(el => countObserver.observe(el));

// ── TOAST ──
function toast(msg, type = 'info') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ── MODAL ──
function openModal(id) { document.getElementById(id)?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) {
  const m = id ? document.getElementById(id) : document.querySelector('.modal.open');
  m?.classList.remove('open'); document.body.style.overflow = '';
}
document.querySelectorAll('.modal__bg').forEach(bg => bg.addEventListener('click', () => closeModal()));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── DATE INPUTS MIN ──
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(el => el.setAttribute('min', today));

// ── NAVBAR SEARCH (loads from cars.json) ──
let SEARCH_CARS = [];
(async function initNavSearch() {
  try {
    const data = await loadCars();
    SEARCH_CARS = data.map(c => ({ name: c.name, type: c.type, price: c.price, image: c.image, page: 'fleet.html' }));
  } catch (e) {
    console.error('Nav search: could not load car data', e);
  }
})();
const searchInput = document.getElementById('searchInput');
const searchDrop  = document.getElementById('searchDrop');
searchInput?.addEventListener('input', function() {
  const q = this.value.toLowerCase().trim();
  if (q.length < 2) { searchDrop.classList.remove('open'); return; }
  const res = SEARCH_CARS.filter(c => c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q));
  if (!res.length) { searchDrop.classList.remove('open'); return; }
  searchDrop.innerHTML = res.slice(0,5).map(c =>
    `<div class="search-item" onclick="window.location='${c.page}'"><img src="${c.image}" alt="${c.name}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0;"/> <span>${c.name}</span> <small style="color:var(--muted);margin-left:auto">PKR ${c.price.toLocaleString()}/day</small></div>`
  ).join('');
  searchDrop.classList.add('open');
});
document.addEventListener('click', e => { if (!e.target.closest('.navbar__search')) searchDrop?.classList.remove('open'); });

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar__links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', function() {
    const isOpen = this.classList.contains('open');
    document.querySelectorAll('.faq-q.open').forEach(b => { b.classList.remove('open'); b.nextElementSibling.style.maxHeight = '0'; });
    if (!isOpen) { this.classList.add('open'); this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + 'px'; }
  });
});

// ── PROMO CODES ──
const PROMOS = { 'MATAR20':20, 'GULSHAN15':15, 'EID25':25, 'NEWCLIENT':10, 'KARACHI10':10, 'SUMMER30':30 };
function applyPromo(inputId, msgId) {
  const code = document.getElementById(inputId)?.value.trim().toUpperCase();
  const msg  = document.getElementById(msgId);
  if (!msg) return 0;
  if (PROMOS[code]) {
    msg.textContent = `Code applied — ${PROMOS[code]}% discount!`;
    msg.style.color = '#15803d';
    return PROMOS[code];
  }
  msg.textContent = 'Invalid promo code';
  msg.style.color = '#b91c1c';
  return 0;
}

// ── WA BOOKING HELPER ──
function waBook(carName, hourlyRate) {
  const msg = `Assalamualaikum!\n\nI want to book *${carName}* (PKR ${Number(hourlyRate).toLocaleString()}/hour, driver included) from *AL-Matar Rentals*, Gulshan Iqbal Karachi.\n\nPlease confirm availability.`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
}
function waGeneral(msg) {
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── NEWSLETTER ──
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    toast('Subscribed — you\'ll get exclusive deals.', 'success');
    form.reset();
  });
});
