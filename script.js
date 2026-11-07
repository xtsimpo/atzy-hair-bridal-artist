(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  const goTo = target => { const el = document.querySelector(target); if (!el) return; lenis ? lenis.scrollTo(el, { offset: 0, duration: 1.6 }) : el.scrollIntoView({ behavior: 'smooth' }); };

  /* loader */
  const start = () => {
    document.getElementById('loader').classList.add('done');
    setTimeout(() => document.body.classList.add('ready'), 250);
  };
  if (document.readyState === 'complete') setTimeout(start, 900); else addEventListener('load', () => setTimeout(start, 700));
  setTimeout(start, 3500);

  /* anchors + mobile menu */
  const header = document.getElementById('top');
  const burger = document.getElementById('burger');
  const setMenu = open => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); open ? lenis?.stop() : lenis?.start(); };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    e.preventDefault(); setMenu(false); goTo(id);
  }));

  /* header hide/show + progress */
  const bar = document.getElementById('progress');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('solid', y > 40);
    header.classList.toggle('hide', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  document.querySelectorAll('.rv,.rv-img').forEach(el => io.observe(el));

  /* scroll-lit statement */
  const lit = document.getElementById('lit');
  lit.innerHTML = lit.textContent.trim().split(/\s+/).map(w => {
    const g = w.startsWith('*'); w = w.replace(/\*/g, '');
    return `<span class="w${g ? ' gold' : ''}">${w}</span>`;
  }).join(' ');
  const words = [...lit.querySelectorAll('.w')];
  if (hasGsap && !reduce) {
    ScrollTrigger.create({ trigger: lit, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: s => { const n = s.progress * words.length; words.forEach((w, i) => w.style.opacity = Math.max(.16, Math.min(1, n - i + .2))); } });
  } else words.forEach(w => w.style.opacity = 1);

  /* parallax */
  if (hasGsap && !reduce) {
    document.querySelectorAll('[data-speed]').forEach(el => {
      const s = parseFloat(el.dataset.speed);
      gsap.fromTo(el, { yPercent: s * -60 }, { yPercent: s * 60, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* horizontal collection */
  const track = document.getElementById('track');
  const count = document.getElementById('colCount');
  const styles = [...track.querySelectorAll('.style')];
  const setCount = p => { const i = Math.min(styles.length - 1, Math.round(p * (styles.length - 1))); count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(styles.length).padStart(2, '0')}`; };
  if (hasGsap && !reduce) {
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': () => {
        const dist = () => track.scrollWidth - innerWidth;
        const tw = gsap.to(track, { x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: '#collection', pin: '.col-pin', start: 'top top', end: () => '+=' + dist(), scrub: 1, invalidateOnRefresh: true, onUpdate: s => setCount(s.progress) } });
        styles.forEach(st => gsap.fromTo(st.querySelector('img'), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: st, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
        return () => gsap.set(track, { x: 0 });
      }
    });
  }
  track.addEventListener('scroll', () => setCount(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)), { passive: true });

  /* velocity marquee */
  const mq = document.getElementById('mq');
  let mx = 0, vel = 0, lastS = scrollY;
  const loop = () => {
    const s = scrollY; vel += ((s - lastS) * .12 - vel) * .1; lastS = s;
    if (!reduce) { mx -= .6 + Math.abs(vel) * 1.2; const half = mq.scrollWidth / 2; if (-mx >= half) mx += half; mq.style.transform = `translate3d(${mx}px,0,0) skewX(${Math.max(-8, Math.min(8, -vel * .6))}deg)`; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* card spotlight + tilt */
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      if (fine && !reduce) c.style.transform = `rotateX(${(y / r.height - .5) * -7}deg) rotateY(${(x / r.width - .5) * 7}deg) translateY(-6px)`;
    });
    c.addEventListener('pointerleave', () => c.style.transform = '');
  });

  /* magnetic buttons */
  if (fine && !reduce) document.querySelectorAll('[data-magnetic]').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });

  /* cursor */
  const cur = document.getElementById('cursor');
  if (fine && !reduce) {
    let tx = -100, ty = -100, cx = -100, cy = -100;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    addEventListener('pointerdown', () => cur.classList.add('press')); addEventListener('pointerup', () => cur.classList.remove('press'));
    const tick = () => { cx += (tx - cx) * .18; cy += (ty - cy) * .18; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(tick); };
    tick();
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('pointerenter', () => { cur.querySelector('b').textContent = el.dataset.cursor; cur.classList.add('big'); });
      el.addEventListener('pointerleave', () => cur.classList.remove('big'));
    });
  }

  /* lightbox */
  const shots = [...document.querySelectorAll('.shot img')];
  const lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), lbCount = document.getElementById('lbCount');
  let li = 0;
  const show = i => {
    li = (i + shots.length) % shots.length; lbImg.classList.remove('show');
    setTimeout(() => { lbImg.src = shots[li].src; lbImg.alt = shots[li].alt; lbCount.textContent = `${li + 1} / ${shots.length}`; requestAnimationFrame(() => lbImg.classList.add('show')); }, lb.classList.contains('open') ? 250 : 0);
  };
  const openLb = i => { lb.classList.add('open'); show(i); lenis?.stop(); cur.classList.remove('big'); document.getElementById('lbClose').focus(); };
  const closeLb = () => { lb.classList.remove('open'); lbImg.classList.remove('show'); lenis?.start(); };
  shots.forEach((im, i) => { im.parentElement.tabIndex = 0; im.parentElement.addEventListener('click', () => openLb(i)); im.parentElement.addEventListener('keydown', e => { if (e.key === 'Enter') openLb(i); }); });
  document.getElementById('lbPrev').onclick = e => { e.stopPropagation(); show(li - 1); };
  document.getElementById('lbNext').onclick = e => { e.stopPropagation(); show(li + 1); };
  document.getElementById('lbClose').onclick = closeLb;
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLb(); setMenu(false); }
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') show(li - 1); if (e.key === 'ArrowRight') show(li + 1);
  });

  /* stories */
  const quotes = [...document.querySelectorAll('.quote')];
  quotes.forEach(q => { const bq = q.querySelector('blockquote'); bq.innerHTML = bq.textContent.split(' ').map((w, i) => `<span class="wl"><span style="transition-delay:${i * 18}ms">${w}</span></span>`).join(' '); });
  const bars = document.getElementById('qBars'), qWrap = document.getElementById('quotes').parentElement;
  quotes.forEach((_, i) => { const b = document.createElement('button'); b.setAttribute('aria-label', `Story ${i + 1}`); b.innerHTML = '<i></i>'; b.onclick = () => go(i); bars.appendChild(b); });
  let qi = 0;
  const go = i => {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle('on', k === qi));
    [...bars.children].forEach((b, k) => { b.classList.toggle('done', k < qi); b.classList.remove('on'); void b.offsetWidth; if (k === qi) b.classList.add('on'); });
  };
  bars.addEventListener('animationend', () => go(qi + 1));
  document.getElementById('qPrev').onclick = () => go(qi - 1);
  document.getElementById('qNext').onclick = () => go(qi + 1);
  qWrap.addEventListener('pointerenter', () => qWrap.parentElement.classList.add('q-paused'));
  qWrap.addEventListener('pointerleave', () => qWrap.parentElement.classList.remove('q-paused'));
  go(0);

  /* faq */
  document.querySelectorAll('.qa button').forEach(b => b.addEventListener('click', () => {
    const qa = b.parentElement, open = !qa.classList.contains('open');
    document.querySelectorAll('.qa.open').forEach(o => { o.classList.remove('open'); o.querySelector('button').setAttribute('aria-expanded', 'false'); });
    qa.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    setTimeout(() => hasGsap && ScrollTrigger.refresh(), 750);
  }));

  /* form */
  const form = document.getElementById('form'), sent = document.getElementById('sent');
  const W3F_KEY = '8927f399-8132-4907-845a-a6060a6a1916';
  const sendBtn = form.querySelector('button[type=submit]');
  const say = t => { sent.textContent = t; sent.classList.add('on'); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const missing = [...form.querySelectorAll('[required]')].find(f => !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)));
    if (missing) { say(missing.type === 'email' ? 'Please add a valid email address.' : 'Please fill in your name, email and message.'); missing.focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    if (d.botcheck) return;
    sendBtn.disabled = true; say('Sending…');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `New message from ${d.name}`,
          from_name: 'atzyalafouzou.com',
          name: d.name, email: d.email, replyto: d.email,
          'Wedding date & place': d.date || '-',
          message: d.message
        })
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === false) throw new Error(out.message || res.status);
      form.reset();
      say('Thank you, your message has been sent. Atzy will reply by email soon.');
    } catch (err) {
      say('The message could not be sent. Please try again, or email aggelikialafouzou@gmail.com directly.');
    } finally { sendBtn.disabled = false; }
  });

  addEventListener('load', () => hasGsap && ScrollTrigger.refresh());
})();
