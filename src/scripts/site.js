// Interactie en beweging voor bramlammers.nl.
// Uitgangspunt: zonder dit script staat de pagina er al compleet. Alles hieronder is extra.

const root = document.documentElement;
const motion = root.classList.contains('motion');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const canAnimate = motion && typeof Element.prototype.animate === 'function';
const anim = (el, kf, o) => (canAnimate && el ? el.animate(kf, o) : null);
const E = 'cubic-bezier(.2,.75,.25,1)';

/* ---------- menu op kleine schermen ---------- */
const menuBtn = $('#menu-btn');
const nav = $('#nav');
if (menuBtn && nav) {
  const close = () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu'; };
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Sluit' : 'Menu';
    if (open) anim(nav, [{ transform: 'translateY(-8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 240, easing: E });
  });
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A' && nav.classList.contains('open')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); menuBtn.focus(); } });
}

/* ---------- het raster kijkt altijd vier weken vooruit vanaf vandaag ---------- */
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 86400000 + 1) / 7);
}
const now = new Date();
const weeks = [1, 2, 3, 4].map((i) => isoWeek(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 * i)));
$$('.wk').forEach((el) => { el.textContent = 'wk ' + weeks[+el.dataset.w - 1]; });
if ($('#cal-range')) $('#cal-range').textContent = `week ${weeks[0]} – ${weeks[3]}`;
const pad = (n) => String(n).padStart(2, '0');
if ($('#stamp-date')) $('#stamp-date').textContent = `${pad(now.getDate())} · ${pad(now.getMonth() + 1)} · ${now.getFullYear()}`;

/* ---------- de stempel ---------- */
const cal = $('#cal');
const stamp = $('#stamp');
const ring = $('#ring');
const REST = 'rotate(-14deg)';
function impact() {
  anim(cal, [{ translate: '0 0' }, { translate: '1px 3px' }, { translate: '-1px -1px' }, { translate: '0 1px' }, { translate: '0 0' }], { duration: 260, easing: 'ease-out' });
  anim(ring, [{ transform: 'scale(.92)', opacity: 0.55 }, { transform: 'scale(1.32)', opacity: 0 }], { duration: 650, easing: E });
}
function stampDown(delay = 0) {
  const a = anim(stamp, [
    { transform: 'rotate(-30deg) scale(1.7) translate(18px,-40px)', opacity: 0 },
    { transform: 'rotate(-18deg) scale(1.12) translate(4px,-10px)', opacity: 0.7, offset: 0.62 },
    { transform: REST, opacity: 0.94 },
  ], { duration: 460, delay, easing: 'cubic-bezier(.55,0,.8,.3)', fill: 'backwards' });
  if (a) a.onfinish = impact;
}
function restamp() {
  const a = anim(stamp, [
    { transform: REST, opacity: 0.94 },
    { transform: 'rotate(-9deg) scale(1.14) translate(-6px,-22px)', opacity: 0.9, offset: 0.45 },
    { transform: REST, opacity: 0.94 },
  ], { duration: 520, easing: 'cubic-bezier(.5,0,.7,.4)' });
  if (a) a.onfinish = impact;
}
if (cal && stamp) {
  cal.addEventListener('click', restamp);
  // het planbord kantelt een heel klein beetje mee met de muis
  const stage = $('.cal-stage');
  if (canAnimate && stage && window.matchMedia('(pointer: fine)').matches) {
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cal.style.transform = `rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg)`;
    });
    stage.addEventListener('pointerleave', () => { cal.style.transform = ''; });
  }
}

/* ---------- openingsreeks ---------- */
if (canAnimate) {
  $$('.site-head [data-h]').forEach((el, k) => {
    anim(el, [{ transform: 'translateY(-10px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: 60 * k, easing: E, fill: 'backwards' });
  });
  const kicker = $('#kicker');
  if (kicker) {
    const n = kicker.textContent.length;
    anim(kicker, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: n * 32, delay: 180, easing: `steps(${n}, end)`, fill: 'backwards' });
  }
  anim($('#h1'), [{ transform: 'translateY(22px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 900, delay: 300, easing: E, fill: 'backwards' });
  anim($('#lead'), [{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 900, delay: 440, easing: E, fill: 'backwards' });
  $$('.actions [data-h]').forEach((el, k) => {
    anim(el, [{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 560 + 80 * k, easing: E, fill: 'backwards' });
  });
  if (cal) {
    anim(cal, [{ transform: 'translateY(26px) rotate(1.5deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1000, delay: 320, easing: E, fill: 'backwards' });
    const chips = $$('.chip');
    const t0 = 900;
    chips.forEach((el, k) => {
      anim(el, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 420, delay: t0 + 150 * k, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' });
    });
    if (stamp) stampDown(t0 + 150 * chips.length + 120);
  }
  setTimeout(() => { const a = $('#accent'); if (a) a.classList.add('on'); }, 1500);
}
root.classList.remove('loading');

/* ---------- onthullen tijdens het scrollen ---------- */
if (motion && 'IntersectionObserver' in window) {
  $$('#steps .step').forEach((step, k) => {
    const base = k * 0.2;
    $$('[data-r]', step).forEach((el) => {
      const r = el.dataset.r;
      el.style.setProperty('--d', `${r === 'dot' ? base : r === 'line' ? base + 0.12 : base + 0.18}s`);
    });
  });
  $$('#offers .offer').forEach((card, k) => {
    card.style.setProperty('--d', `${k * 0.12}s`);
    const tag = $('[data-r="tag"]', card);
    if (tag) tag.style.setProperty('--d', `${k * 0.12 + 0.35}s`);
  });
  $$('.faq > div').forEach((d, k) => {
    $$('[data-r]', d).forEach((el, j) => el.style.setProperty('--d', `${k * 0.14 + j * 0.08}s`));
  });
  $$('#grid-art i').forEach((el, k) => el.style.setProperty('--d', `${0.25 + (k % 5) * 0.05 + Math.floor(k / 5) * 0.07}s`));
  $$('[data-r="type"]').forEach((el) => {
    const n = el.textContent.trim().length;
    el.style.setProperty('--n', n);
    el.style.setProperty('--t', `${(n * 0.035).toFixed(2)}s`);
  });

  // als een onderdeel klaar is, krijgt het z'n eigen hover-beweging terug
  const settle = (g) => {
    const parts = $$('[data-r]', g);
    if (g.hasAttribute('data-r')) parts.push(g);
    parts.forEach((el) => el.removeAttribute('data-r'));
  };
  const fold = window.innerHeight * 0.92;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const g = en.target;
      requestAnimationFrame(() => {
        $$('.pre', g).forEach((el) => el.classList.remove('pre'));
        g.classList.remove('pre');
      });
      setTimeout(() => settle(g), 2200);
      io.unobserve(g);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('[data-group]').forEach((g) => {
    if (g.getBoundingClientRect().top < fold) { settle(g); return; }
    const parts = $$('[data-r], mark.hl', g);
    if (g.hasAttribute('data-r')) parts.push(g);
    parts.forEach((el) => el.classList.add('pre'));
    io.observe(g);
  });
}

/* ---------- radar: een rustige zwaai over de maand ---------- */
const gridArt = $('#grid-art');
if (canAnimate && gridArt) {
  const squares = $$('i', gridArt);
  let visible = false;
  let timer = null;
  const sweep = () => {
    if (!visible || document.hidden) return;
    squares.forEach((sq, k) => {
      if (sq.className) return;
      anim(sq, [
        { backgroundColor: 'rgba(251,247,240,0)' },
        { backgroundColor: 'rgba(251,247,240,.42)', offset: 0.35 },
        { backgroundColor: 'rgba(251,247,240,0)' },
      ], { duration: 900, delay: (k % 5) * 120 + Math.floor(k / 5) * 30, easing: 'ease-in-out' });
    });
    const empty = squares.filter((s) => !s.className);
    const pick = empty[Math.floor(Math.random() * empty.length)];
    anim(pick, [{ transform: 'scale(1)' }, { transform: 'scale(.82) rotate(-6deg)', offset: 0.4 }, { transform: 'scale(1)' }], { duration: 700, delay: 750, easing: 'cubic-bezier(.3,1.7,.5,1)' });
  };
  new IntersectionObserver((en) => {
    visible = en[0].isIntersecting;
    if (visible && !timer) { setTimeout(sweep, 900); timer = setInterval(sweep, 3800); }
    if (!visible && timer) { clearInterval(timer); timer = null; }
  }).observe(gridArt);
}

/* ---------- formulieren ---------- */
function say(note, text, ok = false) {
  if (!note) return;
  note.textContent = text;
  note.classList.toggle('is-ok', ok);
  note.hidden = false;
  anim(note, [{ transform: 'translateY(-6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: E });
}
function shake(el) {
  anim(el, [{ translate: '0' }, { translate: '-7px' }, { translate: '6px' }, { translate: '-4px' }, { translate: '3px' }, { translate: '0' }], { duration: 380, easing: 'ease-out' });
  el.focus();
}
const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const oops = (form) => `Dat ging niet goed. Probeer ’t zo nog eens${form.dataset.mail ? `, of mail me op ${form.dataset.mail}` : ''}.`;
function busy(btn, on) { if (btn) btn.setAttribute('aria-busy', on ? 'true' : 'false'); }

// voorproefje: Web3Forms
const taste = $('#taste-form');
if (taste) {
  taste.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mail = $('#vp-mail', taste);
    const note = $('.form-note', taste);
    if (!mailOk(mail.value)) { shake(mail); say(note, 'Vul eerst een e-mailadres in, dan weet ik waar het voorproefje heen moet.'); return; }
    if (!taste.dataset.key) { say(note, 'Dit formulier werkt zodra de site online staat.'); return; }
    const btn = $('button[type="submit"]', taste);
    busy(btn, true);
    try {
      const data = Object.fromEntries(new FormData(taste));
      delete data.redirect;
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) { taste.reset(); say(note, taste.dataset.thanks, true); }
      else say(note, oops(taste));
    } catch { say(note, oops(taste)); }
    busy(btn, false);
  });
}

// maandradar: eigen functie die Laposta aanroept
const radar = $('#radar-form');
if (radar) {
  radar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mail = $('#rd-mail', radar);
    const note = $('#rd-note');
    if (!mailOk(mail.value)) { shake(mail); say(note, 'Vul eerst een e-mailadres in.'); return; }
    const btn = $('button[type="submit"]', radar);
    busy(btn, true);
    try {
      const res = await fetch(radar.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: mail.value.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.ok && json.status === 'bestaat') { radar.reset(); say(note, radar.dataset.exists, true); }
      else if (json.ok) { radar.reset(); say(note, radar.dataset.thanks, true); }
      else if (json.reason === 'niet-ingesteld' || res.status === 404 || res.status === 405) say(note, 'Aanmelden kan zodra de site online staat.');
      else if (json.reason === 'email') { shake(mail); say(note, 'Dat e-mailadres lijkt niet te kloppen.'); }
      else say(note, oops(radar));
    } catch { say(note, oops(radar)); }
    busy(btn, false);
  });
}

// kennismaken zonder agendalink
const kmBtn = $('#km-btn');
if (kmBtn) kmBtn.addEventListener('click', () => say($('#km-note'), 'Hier komt straks de link naar mijn agenda.'));
