/* ═══════════════════════════════════════════════════
   AYUSH RANA · WIZARD — Portfolio JS
   Cosmos · Nebula · Poetry · Constellations
═══════════════════════════════════════════════════ */
'use strict';

const html = document.documentElement;

/* ─────────────────────────────────────
   1. PRELOADER + preloader mini cosmos
───────────────────────────────────── */
(function preloaderCosmos() {
  const c  = document.getElementById('preCanvas');
  const cx = c.getContext('2d');
  const pts = Array.from({length:20}, () => ({
    x: Math.random()*120, y: Math.random()*120,
    r: Math.random()*1.2+0.3, o: Math.random()
  }));
  function draw() {
    cx.clearRect(0,0,120,120);
    pts.forEach(p => {
      p.o = (Math.sin(Date.now()*0.001 + p.x) * 0.4 + 0.6) * 0.7;
      cx.beginPath();
      cx.arc(p.x,p.y,p.r,0,Math.PI*2);
      cx.fillStyle = `rgba(201,169,110,${p.o})`;
      cx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('gone');
    document.querySelectorAll('.s-home .fade-up, .s-home .fade-right').forEach((el,i) => {
      setTimeout(() => el.classList.add('vis'), 300 + i*130);
    });
    startPoemCarousel();
  }, 2400);
});

/* ─────────────────────────────────────
   2. CURSOR
───────────────────────────────────── */
const dot  = document.getElementById('curDot');
const ring = document.getElementById('curCircle');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});
(function trackRing(){
  rx += (mx-rx)*0.11; ry += (my-ry)*0.11;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(trackRing);
})();
document.addEventListener('mousedown', ()=> dot.style.transform='translate(-50%,-50%) scale(2.2)');
document.addEventListener('mouseup',   ()=> dot.style.transform='translate(-50%,-50%) scale(1)');
document.addEventListener('mouseleave',()=>{ dot.style.opacity=ring.style.opacity='0'; });
document.addEventListener('mouseenter',()=>{ dot.style.opacity=ring.style.opacity='1'; });

/* ─────────────────────────────────────
   3. THEME
───────────────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
html.setAttribute('data-theme', localStorage.getItem('ar-theme') || 'dark');
themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ar-theme', next);
});

/* ─────────────────────────────────────
   4. NAVBAR
───────────────────────────────────── */
const header  = document.getElementById('header');
const navLnks = document.querySelectorAll('.nl');
const secs    = document.querySelectorAll('section[id]');
window.addEventListener('scroll', ()=>{
  header.classList.toggle('scrolled', window.scrollY>40);
  let cur='';
  secs.forEach(s=>{ if(window.scrollY>=s.offsetTop-140) cur=s.id; });
  navLnks.forEach(l=>l.classList.toggle('active', l.getAttribute('href')==='#'+cur));
},{passive:true});

/* ─────────────────────────────────────
   5. MOBILE MENU
───────────────────────────────────── */
const menuBtn = document.getElementById('menuBtn');
const drawer  = document.getElementById('drawer');
menuBtn.addEventListener('click', ()=>{
  drawer.classList.toggle('open');
  menuBtn.classList.toggle('open');
});
document.querySelectorAll('.dl').forEach(l=>l.addEventListener('click',()=>{
  drawer.classList.remove('open');
  menuBtn.classList.remove('open');
}));

/* ─────────────────────────────────────
   6. COSMOS CANVAS — Hero Nebula + Stars
───────────────────────────────────── */
function buildCosmosCanvas(canvasEl, starCount, nebulaCount) {
  if(!canvasEl) return;
  const ctx = canvasEl.getContext('2d');
  let W, H, stars=[], nebulae=[];

  function init() {
    W = canvasEl.width  = canvasEl.offsetWidth;
    H = canvasEl.height = canvasEl.offsetHeight;

    // Stars — varying sizes, some coloured
    stars = Array.from({length: starCount}, (_, i) => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random() < 0.1 ? Math.random()*2+1 : Math.random()*1+0.2,
      phs: Math.random()*Math.PI*2,
      spd: Math.random()*0.008+0.002,
      // Every ~15th star gets a warm gold tint
      col: i%15===0 ? 'accent' : i%22===0 ? 'blue' : 'white',
    }));

    // Soft nebula blobs
    nebulae = Array.from({length: nebulaCount}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      rx: Math.random()*200+80, ry: Math.random()*120+60,
      rot: Math.random()*Math.PI,
      col: Math.random()<0.5 ? 'purple' : 'blue',
      o: Math.random()*0.05+0.02,
    }));
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    const isDark = html.getAttribute('data-theme')==='dark';
    const t = Date.now();

    // Draw nebulae first
    if(isDark) {
      nebulae.forEach(n => {
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rot);
        const g = ctx.createRadialGradient(0,0,0,0,0,n.rx);
        const col = n.col==='purple' ? '123,94,167' : '61,158,255';
        g.addColorStop(0, `rgba(${col},${n.o})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.scale(1, n.ry/n.rx);
        ctx.beginPath();
        ctx.arc(0,0,n.rx,0,Math.PI*2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      });
    }

    // Draw stars
    stars.forEach(s => {
      s.phs += s.spd;
      const pulse = Math.sin(s.phs)*0.4+0.6;
      let fillCol;
      if(s.col==='accent') {
        const a = isDark ? pulse*0.85 : pulse*0.5;
        fillCol = `rgba(201,169,110,${a})`;
      } else if(s.col==='blue') {
        const a = isDark ? pulse*0.6 : 0;
        fillCol = `rgba(100,180,255,${a})`;
      } else {
        const a = isDark ? pulse*0.7 : pulse*0.3;
        fillCol = `rgba(255,255,255,${a})`;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = fillCol;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init(); draw();
}

buildCosmosCanvas(document.getElementById('cosmosCanvas'), 180, 6);
buildCosmosCanvas(document.getElementById('philCosmos'),  120, 4);
buildCosmosCanvas(document.getElementById('footerCosmos'), 60, 2);

/* ─────────────────────────────────────
   7. CONSTELLATION DIVIDERS
───────────────────────────────────── */
document.querySelectorAll('.const-canvas').forEach(canvas => {
  const ctx = canvas.getContext('2d');
  const sc  = parseInt(canvas.dataset.stars) || 30;
  let W, H, pts=[], lines=[];

  function init() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = Array.from({length:sc}, ()=>({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.2+0.2,
      phs: Math.random()*Math.PI*2,
    }));
    // Connect nearby stars as constellation lines
    lines = [];
    for(let i=0;i<pts.length;i++) {
      for(let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        if(Math.sqrt(dx*dx+dy*dy)<W/6) lines.push([i,j]);
      }
    }
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    const isDark = html.getAttribute('data-theme')==='dark';
    const t = Date.now();

    // Lines
    if(isDark) {
      lines.forEach(([a,b]) => {
        ctx.beginPath();
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[b].x, pts[b].y);
        ctx.strokeStyle = 'rgba(201,169,110,0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    }

    // Stars
    pts.forEach(p => {
      p.phs += 0.005;
      const a = isDark
        ? (Math.sin(p.phs)*0.4+0.6)*0.8
        : (Math.sin(p.phs)*0.3+0.4)*0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(201,169,110,${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init(); draw();
});

/* ─────────────────────────────────────
   8. POEM COSMOS MINI-CANVAS
───────────────────────────────────── */
(function poemCosmosCanvas() {
  const c  = document.getElementById('poemCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let W, H, stars=[], orbs=[];

  function init() {
    W = c.width  = c.offsetWidth;
    H = c.height = c.offsetHeight;
    stars = Array.from({length:60}, ()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.5+0.2,
      phs:Math.random()*Math.PI*2,
    }));
    orbs = [
      {x:W*0.3, y:H*0.4, rx:80, ry:50, col:'123,94,167', o:0.12},
      {x:W*0.7, y:H*0.6, rx:60, ry:40, col:'61,158,255',  o:0.08},
    ];
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    // Nebula orbs
    orbs.forEach(n=>{
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.rx);
      g.addColorStop(0,`rgba(${n.col},${n.o})`);
      g.addColorStop(1,`rgba(${n.col},0)`);
      ctx.save();
      ctx.scale(1,n.ry/n.rx);
      ctx.beginPath();
      ctx.arc(n.x,n.y*(n.rx/n.ry),n.rx,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      ctx.restore();
    });
    // Stars
    stars.forEach(s=>{
      s.phs+=0.006;
      const a=(Math.sin(s.phs)*0.4+0.6)*0.85;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(201,169,110,${a})`;
      ctx.fill();
    });
    // Draw a simple constellation shape
    ctx.strokeStyle='rgba(201,169,110,0.15)';
    ctx.lineWidth=0.6;
    const pts2=[[W*.2,H*.3],[W*.45,H*.2],[W*.7,H*.35],[W*.55,H*.55],[W*.3,H*.6],[W*.2,H*.3]];
    ctx.beginPath();
    pts2.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
    ctx.stroke();
    pts2.forEach(([x,y])=>{
      ctx.beginPath(); ctx.arc(x,y,2.5,0,Math.PI*2);
      ctx.fillStyle='rgba(201,169,110,0.7)'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', ()=>{init();});
  init(); draw();
})();

/* ─────────────────────────────────────
   9. SHOOTING STARS
───────────────────────────────────── */
(function createShootingStars() {
  const container = document.getElementById('shootingStars');
  if(!container) return;
  const configs = [
    {top:'8%',  left:'20%', len:120, dur:'3.2s', del:'0s',   ang:'-35deg', tx:'-350px', ty:'180px'},
    {top:'15%', left:'70%', len:80,  dur:'2.8s', del:'1.4s', ang:'-42deg', tx:'-280px', ty:'160px'},
    {top:'5%',  left:'45%', len:100, dur:'4.1s', del:'2.8s', ang:'-30deg', tx:'-320px', ty:'140px'},
    {top:'25%', left:'85%', len:60,  dur:'2.5s', del:'0.8s', ang:'-48deg', tx:'-220px', ty:'140px'},
    {top:'3%',  left:'10%', len:'90', dur:'3.6s',del:'3.5s', ang:'-28deg', tx:'-300px', ty:'120px'},
  ];
  configs.forEach(c=>{
    const el = document.createElement('div');
    el.className = 'shoot';
    el.style.cssText = `
      top:${c.top}; left:${c.left}; width:${c.len}px;
      --dur:${c.dur}; --del:${c.del};
      --ang:${c.ang}; --tx:${c.tx}; --ty:${c.ty};
    `;
    container.appendChild(el);
  });
})();

/* ─────────────────────────────────────
   10. POEM CAROUSEL
───────────────────────────────────── */
const poems = [
  {
    verse: `The universe<br/>didn't send us instructions.<br/>We wrote them ourselves —<br/>in <em>light</em>, in logic, in code.`,
    cite: 'On Creation — Ayush Rana',
  },
  {
    verse: `We are not separate<br/>from the stars.<br/>We are what happens<br/>when <em>stardust learns to wonder.</em>`,
    cite: 'On Origin — Wizard',
  },
  {
    verse: `Space isn't empty.<br/>It's full of questions<br/>we haven't thought to ask <em>yet.</em><br/>Neither is a blank file.`,
    cite: 'On Curiosity — Ayush Rana',
  },
  {
    verse: `Light travels 300,000 km<br/>every second —<br/>and still takes <em>eight minutes</em><br/>to reach us from the sun.<br/>Good work takes time.`,
    cite: 'On Patience — Wizard',
  },
  {
    verse: `Every constellation<br/>is a story we told<br/>to make sense<br/>of <em>beautiful disorder.</em>`,
    cite: 'On Art — Ayush Rana',
  },
  {
    verse: `I code the way<br/>a poet writes —<br/>choosing each word<br/>as if the universe<br/>is <em>listening.</em>`,
    cite: 'On Craft — Wizard',
  },
];

let pIdx = 0;
let pTimer;
const verseEl = document.getElementById('poemVerse');
const numEl   = document.getElementById('poemNum');
const citeEl  = document.getElementById('poemCite');
const fillEl  = document.getElementById('poemFill');
const dotsEl  = null; // no dots in this design — progress bar instead

function renderPoem(idx, direction=1) {
  if(!verseEl) return;
  verseEl.style.opacity='0';
  verseEl.style.transform=`translateY(${direction*12}px)`;
  citeEl.style.opacity='0';
  setTimeout(()=>{
    verseEl.innerHTML = poems[idx].verse;
    citeEl.textContent = poems[idx].cite;
    numEl.textContent  = `0${idx+1} / 0${poems.length}`;
    verseEl.style.transition='opacity 0.5s ease, transform 0.5s ease';
    citeEl.style.transition='opacity 0.5s ease';
    verseEl.style.opacity='1';
    verseEl.style.transform='translateY(0)';
    citeEl.style.opacity='1';
    // Reset fill bar
    if(fillEl){ fillEl.style.transition='none'; fillEl.style.width='0'; }
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        if(fillEl){ fillEl.style.transition='width 6s linear'; fillEl.style.width='100%'; }
      });
    });
  }, 300);
}

function pGo(idx, dir=1) {
  pIdx = (idx + poems.length) % poems.length;
  renderPoem(pIdx, dir);
  clearInterval(pTimer);
  pTimer = setInterval(()=>pGo(pIdx+1, 1), 6500);
}

function startPoemCarousel() {
  renderPoem(0);
  pTimer = setInterval(()=>pGo(pIdx+1, 1), 6500);
}

document.getElementById('poPrev')?.addEventListener('click', ()=>pGo(pIdx-1, -1));
document.getElementById('poNext')?.addEventListener('click', ()=>pGo(pIdx+1,  1));

/* ─────────────────────────────────────
   11. SCROLL REVEAL
───────────────────────────────────── */
const revObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('vis'); revObs.unobserve(e.target); }
  });
},{threshold:0.1, rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach(el=>{
  if(!el.closest('#home')) revObs.observe(el);
});

/* ─────────────────────────────────────
   12. SKILL BARS
───────────────────────────────────── */
const skObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skb-fill').forEach(f=>{
        setTimeout(()=>{ f.style.width=(f.dataset.w||0)+'%'; },120);
      });
      skObs.unobserve(e.target);
    }
  });
},{threshold:0.25});
document.querySelectorAll('.sk-group').forEach(g=>skObs.observe(g));

/* ─────────────────────────────────────
   13. GALLERY STAGGER + LIGHTBOX
───────────────────────────────────── */
const galObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.gallery-item').forEach((item,i)=>{
        item.style.opacity='0'; item.style.transform='translateY(16px)';
        setTimeout(()=>{
          item.style.transition='opacity 0.5s ease, transform 0.5s ease';
          item.style.opacity='1'; item.style.transform='translateY(0)';
        }, i*70);
      });
      galObs.unobserve(e.target);
    }
  });
},{threshold:0.1});
const galGrid = document.querySelector('.gallery-grid');
if(galGrid) galObs.observe(galGrid);

document.querySelectorAll('.gallery-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const label = item.querySelector('.gi-label')?.textContent||'Photo';
    const sub   = item.querySelector('.gi-sub')?.textContent||'';
    const lb = document.createElement('div');
    lb.style.cssText=`position:fixed;inset:0;z-index:9990;background:rgba(0,0,0,0.88);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:2rem;cursor:pointer;animation:lbIn 0.3s ease;`;
    const inner = item.querySelector('.gi-inner').cloneNode(true);
    inner.style.cssText='max-width:680px;width:100%;border-radius:2px;pointer-events:none;animation:lbScale 0.3s cubic-bezier(0.34,1.56,0.64,1);';
    const info = document.createElement('div');
    info.style.cssText='position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);text-align:center;pointer-events:none;';
    info.innerHTML=`<p style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:#dde0f0;margin-bottom:4px;">${label}</p><p style="font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.15em;color:#c9a96e;text-transform:uppercase;opacity:0.7;">${sub}</p><p style="font-family:'DM Mono',monospace;font-size:0.58rem;color:#3c4158;margin-top:10px;">Click anywhere to close</p>`;
    lb.appendChild(inner); lb.appendChild(info);
    document.body.appendChild(lb);
    lb.addEventListener('click', ()=>lb.remove());
    if(!document.getElementById('lbSt')){
      const s=document.createElement('style'); s.id='lbSt';
      s.textContent='@keyframes lbIn{from{opacity:0}to{opacity:1}}@keyframes lbScale{from{transform:scale(0.9)}to{transform:scale(1)}}';
      document.head.appendChild(s);
    }
  });
});

/* ─────────────────────────────────────
   14. SMOOTH SCROLL
───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

/* ─────────────────────────────────────
   15. BADGE STAGGER
───────────────────────────────────── */
const bdgObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('span').forEach((b,i)=>{
        b.style.opacity='0'; b.style.transform='translateY(8px)';
        setTimeout(()=>{
          b.style.transition='opacity 0.38s,transform 0.38s';
          b.style.opacity='1'; b.style.transform='translateY(0)';
        },i*44);
      });
      bdgObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
document.querySelectorAll('.sk-badges').forEach(g=>bdgObs.observe(g));

/* ─────────────────────────────────────
   16. PARALLAX — stars on mouse move (hero only)
───────────────────────────────────── */
const heroSec = document.querySelector('.s-home');
heroSec?.addEventListener('mousemove', e=>{
  const cx=window.innerWidth/2, cy=window.innerHeight/2;
  const dx=(e.clientX-cx)/cx, dy=(e.clientY-cy)/cy;
  document.querySelectorAll('.orbit-ring').forEach((el,i)=>{
    el.style.transform=`translate(calc(-50% + ${dx*(i+1)*5}px), calc(-50% + ${dy*(i+1)*5}px))`;
  });
});

/* ─────────────────────────────────────
   17. CONSOLE
───────────────────────────────────── */
console.log('%c✦ Ayush Rana · Wizard\n%cFull Stack Developer · MICM Net Solution · MSc IT VNSGU\n%c"We are made of star stuff — and so is every line of code."','font-family:Georgia,serif;font-size:17px;color:#c9a96e;font-style:italic;','font-family:monospace;font-size:11px;color:#7e8499;','font-family:monospace;font-size:10px;color:#3c4158;font-style:italic;');
