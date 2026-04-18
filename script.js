/* ════════════════════════════════════════════════
   AYUSH RANA · WIZARD — Portfolio JavaScript
   Preloader · Cursor · Theme · Canvas · Reveals
════════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────────
   1. PRELOADER
────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('preloader');
  setTimeout(() => {
    loader.classList.add('gone');
    // Stagger-reveal hero elements
    document.querySelectorAll('.s-home .fade-up, .s-home .fade-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('vis'), 300 + i * 130);
    });
  }, 2400);
});

/* ──────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────── */
const dot    = document.getElementById('curDot');
const ring   = document.getElementById('curCircle');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});
(function trackRing() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(trackRing);
})();
document.addEventListener('mousedown', () => dot.style.transform = 'translate(-50%,-50%) scale(2.2)');
document.addEventListener('mouseup',   () => dot.style.transform = 'translate(-50%,-50%) scale(1)');
document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = '1'; });

/* ──────────────────────────────────────
   3. THEME TOGGLE
────────────────────────────────────── */
const html     = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
html.setAttribute('data-theme', localStorage.getItem('ar-theme') || 'dark');
themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ar-theme', next);
});

/* ──────────────────────────────────────
   4. NAVBAR: scroll + active links
────────────────────────────────────── */
const header  = document.getElementById('header');
const navLnks = document.querySelectorAll('.nl');
const secs    = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  navLnks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ──────────────────────────────────────
   5. MOBILE MENU
────────────────────────────────────── */
const menuBtn = document.getElementById('menuBtn');
const drawer  = document.getElementById('drawer');
menuBtn.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
});
document.querySelectorAll('.dl').forEach(l => l.addEventListener('click', () => {
  drawer.classList.remove('open');
  menuBtn.classList.remove('open');
}));

/* ──────────────────────────────────────
   6. BACKGROUND CANVAS (home hero)
────────────────────────────────────── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H, pts = [];

function initCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  pts = Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.3 + 0.2,
    a: Math.random() * Math.PI * 2,
    o: Math.random() * 0.55 + 0.1,
    s: (Math.random() - 0.5) * 0.25,
  }));
}

function drawBg() {
  ctx.clearRect(0, 0, W, H);
  const isDark = html.getAttribute('data-theme') === 'dark';
  const rgb    = isDark ? '201,169,110' : '124,92,30';
  pts.forEach(p => {
    p.y  -= 0.15;
    p.x  += Math.sin(p.a) * 0.07;
    p.a  += 0.007;
    if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
    const alpha = (Math.sin(Date.now() * 0.001 + p.o * 8) * 0.4 + 0.6) * p.o * 0.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb},${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawBg);
}
window.addEventListener('resize', initCanvas);
initCanvas();
drawBg();

/* ──────────────────────────────────────
   7. SCROLL REVEAL (all non-home sections)
────────────────────────────────────── */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
  if (!el.closest('#home')) revObs.observe(el);
});

/* ──────────────────────────────────────
   8. SKILL BARS — animate on scroll
────────────────────────────────────── */
const skObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skb-fill').forEach(f => {
        setTimeout(() => { f.style.width = (f.dataset.w || 0) + '%'; }, 120);
      });
      skObs.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.sk-group').forEach(g => skObs.observe(g));

/* ──────────────────────────────────────
   9. QUOTE WALLS — scroll-triggered fade + slide
────────────────────────────────────── */
const wallObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const text = e.target.querySelector('.qw-text, .qw-mono');
      const attr = e.target.querySelector('.qw-attr');
      const num  = e.target.querySelector('.qw-num');
      const pre  = e.target.querySelector('.qw-pretext');

      [num, pre, text, attr].forEach((el, i) => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        el.style.transitionDelay = (i * 0.15) + 's';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });
      });
      wallObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.qwall-1 .qw-inner, .qwall-2 .qw-inner, .qws-left, .qws-right, .qwall-4 .qw-inner').forEach(el => {
  // Initial state
  const children = el.querySelectorAll('.qw-text, .qw-mono, .qw-attr, .qw-num, .qw-pretext');
  children.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(30px)'; });
  wallObs.observe(el);
});

/* ──────────────────────────────────────
   10. GALLERY ITEMS — stagger on enter
────────────────────────────────────── */
const galObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.gallery-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 80);
      });
      galObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
const galGrid = document.querySelector('.gallery-grid');
if (galGrid) galObs.observe(galGrid);

/* ──────────────────────────────────────
   11. GALLERY LIGHTBOX (simple overlay on click)
────────────────────────────────────── */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.gi-label')?.textContent || 'Photo';
    const sub   = item.querySelector('.gi-sub')?.textContent   || '';

    // Create lightbox
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      position:fixed; inset:0; z-index:9990;
      background:rgba(0,0,0,0.85); backdrop-filter:blur(12px);
      display:flex; align-items:center; justify-content:center;
      padding:2rem; cursor:pointer;
      animation: lbIn 0.3s ease;
    `;

    const inner = item.querySelector('.gi-inner').cloneNode(true);
    inner.style.cssText = `
      max-width:700px; width:100%; border-radius:2px;
      animation: lbScale 0.3s cubic-bezier(0.34,1.56,0.64,1);
      pointer-events:none;
    `;

    // Info bar
    const info = document.createElement('div');
    info.style.cssText = `
      position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
      text-align:center; pointer-events:none;
    `;
    info.innerHTML = `
      <p style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:#e0e2ec;margin-bottom:4px;">${label}</p>
      <p style="font-family:'DM Mono',monospace;font-size:0.65rem;letter-spacing:0.15em;color:#c9a96e;text-transform:uppercase;opacity:0.7;">${sub}</p>
      <p style="font-family:'DM Mono',monospace;font-size:0.6rem;color:#42475c;margin-top:10px;letter-spacing:0.1em;">Click anywhere to close</p>
    `;

    lb.appendChild(inner);
    lb.appendChild(info);
    document.body.appendChild(lb);

    lb.addEventListener('click', () => lb.remove());

    // Inject keyframes if not present
    if (!document.getElementById('lbStyles')) {
      const s = document.createElement('style');
      s.id = 'lbStyles';
      s.textContent = `
        @keyframes lbIn    { from{opacity:0} to{opacity:1} }
        @keyframes lbScale { from{transform:scale(0.9)} to{transform:scale(1)} }
      `;
      document.head.appendChild(s);
    }
  });
});

/* ──────────────────────────────────────
   12. SMOOTH SCROLL
────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ──────────────────────────────────────
   13. BADGE STAGGER (tools grid)
────────────────────────────────────── */
const bdgObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('span').forEach((b, i) => {
        b.style.opacity = '0'; b.style.transform = 'translateY(10px)';
        setTimeout(() => {
          b.style.transition = 'opacity 0.4s, transform 0.4s';
          b.style.opacity = '1'; b.style.transform = 'translateY(0)';
        }, i * 48);
      });
      bdgObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.sk-badges').forEach(g => bdgObs.observe(g));

/* ──────────────────────────────────────
   14. CONSOLE SIGNATURE
────────────────────────────────────── */
console.log(
  '%cAyush Rana · Wizard\n%cFull Stack Software Developer\nMICM Net Solution Pvt. Ltd. · MSc IT · VNSGU\n%cBuilt with intention. Code is a way of seeing.',
  'font-family:Georgia,serif;font-size:18px;color:#c9a96e;font-style:italic;font-weight:300;',
  'font-family:monospace;font-size:11px;color:#888fa8;',
  'font-family:monospace;font-size:10px;color:#42475c;font-style:italic;'
);
