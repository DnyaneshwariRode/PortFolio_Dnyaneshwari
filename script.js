document.addEventListener('DOMContentLoaded', () => {
  // set year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // loader animation -> hide after small delay
  const loader = document.getElementById('loader');
  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
  }, 1400);

  // cinematic hero subtle zoom
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    let scale = 1;
    function zoom(){
      scale += 0.0009; // very slow zoom
      heroBg.style.transform = `scale(${scale})`;
      requestAnimationFrame(zoom);
    }
    requestAnimationFrame(zoom);
  }

  /* ---------- Auto-play rows (basic) ---------- */
  const autoPlayRows = document.querySelectorAll('.row-track');
  autoPlayRows.forEach(row => {
    let direction = 1;
    setInterval(() => {
      row.scrollBy({left: direction * 220, behavior: 'smooth'});
      // flip direction if reach ends (simple detection)
      if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 5) direction = -1;
      if (row.scrollLeft <= 0) direction = 1;
    }, 3000);
  });

  /* ---------- Row nav ---------- */
  document.querySelectorAll('.row-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.target;
      const track = document.getElementById(id);
      if (!track) return;
      const cardWidth = track.querySelector('.thumb')?.getBoundingClientRect().width || 260;
      const offset = (btn.classList.contains('left') ? -1 : 1) * (cardWidth + 14) * 2;
      track.scrollBy({ left: offset, behavior: 'smooth' });
    });
  });

  /* ---------- Thumb click -> modal ---------- */
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLink = document.getElementById('modalLink');
  const modalClose = document.getElementById('modalClose');

  function openModal(data) {
    modalImg.src = data.img || '/mnt/data/selfimage.jpg';
    modalTitle.textContent = data.title || '';
    modalDesc.textContent = data.desc || '';
    modalLink.href = data.link || '#';
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  document.querySelectorAll('.thumb').forEach(t => {
    t.addEventListener('click', () => {
      openModal({
        img: t.querySelector('img')?.src || '/mnt/data/selfimage.jpg',
        title: t.dataset.title,
        desc: t.dataset.desc,
        link: t.dataset.link || '#'
      });
    });
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter') t.click(); });
  });

  modalClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Avatar parallax tilt ---------- */
  const avatar = document.getElementById('avatarHero');
  if (avatar) {
    avatar.addEventListener('mousemove', (e) => {
      const r = avatar.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      avatar.style.transform = `rotateX(${ -y * 6 }deg) rotateY(${ x * 8 }deg) translateZ(6px)`;
    });
    avatar.addEventListener('mouseleave', () => avatar.style.transform = '');
  }

  /* ---------- Small typed effect in hero tagline (optional) ---------- */
  const tagline = document.querySelector('.tagline');
  if (tagline) {
    const phrases = ['I build cinematic UI.', 'Animations & microinteractions.', 'Front-end — React & JS.'];
    let pi = 0, pp = 0, pf = true;
    function tick(){
      const p = phrases[pi];
      if (pf) {
        pp++;
        tagline.textContent = p.slice(0, pp);
        if (pp === p.length) { pf = false; setTimeout(tick, 900); return; }
      } else {
        pp--;
        tagline.textContent = p.slice(0, pp);
        if (pp === 0) { pf = true; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, 80);
    }
    setTimeout(tick, 600);
  }

  /* ---------- Custom cursor & spotlight ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const spotlight = document.getElementById('spotlight');

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX, y = e.clientY;
    if (cursorDot) { cursorDot.style.left = x + 'px'; cursorDot.style.top = y + 'px'; }
    if (cursorRing) { cursorRing.style.left = x + 'px'; cursorRing.style.top = y + 'px'; }
    if (spotlight) { spotlight.style.left = x + 'px'; spotlight.style.top = y + 'px'; }
  });

  // interactions
  const hoverables = document.querySelectorAll('a, button, .thumb');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.style.transform = 'scale(1.9)'; });
    el.addEventListener('mouseleave', () => { if (cursorRing) cursorRing.style.transform = 'scale(1)'; });
  });

  // hide cursor when leaving window
  document.addEventListener('mouseleave', () => { if (cursorDot) cursorDot.style.opacity = 0.0; if (cursorRing) cursorRing.style.opacity = 0.0; });
  document.addEventListener('mouseenter', () => { if (cursorDot) cursorDot.style.opacity = 1; if (cursorRing) cursorRing.style.opacity = 1; });

  /* ---------- optional sound toggle (small) ---------- */
  let audio; let soundOn = false;
  const soundBtn = document.getElementById('toggleSound');
  if (soundBtn) {
    audio = new Audio();
    audio.loop = true;
    soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      soundBtn.textContent = soundOn ? '🔊' : '🎵';
      if (soundOn) {
        // if you add an audio file later, set src and play
        // audio.src = '/mnt/data/ambient.mp3'; audio.play();
      } else { if (audio) audio.pause(); }
    });
  }

  /* ---------- contact form simple handler ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) { alert('Please fill all fields'); return; }
      alert(`Thanks ${name}! I will reply at ${email}`);
      form.reset();
    });
  }

  /* ---------- keyboard shortcut to open first project ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p') {
      const first = document.querySelector('#projects .thumb');
      if (first) first.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });

});




/* === Certificates modal handling (append) === */
(function certificatesModal() {
  const certThumbs = document.querySelectorAll('.thumb.cert');
  if (!certThumbs || certThumbs.length === 0) return;

  const certModal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLink = document.getElementById('modalLink');

  function openCertModal({ title, issuer, desc, file }) {
    modalTitle.textContent = title + (issuer ? ` — ${issuer}` : '');
    modalDesc.textContent = desc || '';

    // remove any previously inserted embed
    const oldEmbed = certModal.querySelector('.cert-embed');
    if (oldEmbed) oldEmbed.remove();

    // If there is a PDF file path, embed it. Otherwise show a placeholder image.
    if (file && file.toLowerCase().endsWith('.pdf')) {
      const iframe = document.createElement('iframe');
      iframe.className = 'cert-embed';
      iframe.src = file; // local path, e.g. /mnt/data/Python for Data Science.pdf
      iframe.setAttribute('aria-label', title + ' certificate preview');
      // put iframe above modal-info (insert before modal-info)
      const modalInner = certModal.querySelector('.modal-body');
      modalInner.insertBefore(iframe, modalInner.firstChild);
      modalLink.href = file; // open/download link
      modalLink.textContent = 'Open / Download certificate';
      modalLink.classList.remove('hidden');
    } else if (file && /\.(jpe?g|png|webp)$/i.test(file)) {
      // show image
      modalImg.src = file;
      modalLink.href = file;
      modalLink.textContent = 'Open certificate image';
      modalLink.classList.remove('hidden');
    } else {
      // No file available
      modalImg.src = '/mnt/data/cert_placeholder.jpg';
      modalLink.href = '#';
      modalLink.textContent = 'No file uploaded';
      modalLink.classList.add('hidden');
    }

    certModal.setAttribute('aria-hidden', 'false');
  }

  certThumbs.forEach(t => {
    t.addEventListener('click', () => {
      openCertModal({
        title: t.dataset.title,
        issuer: t.dataset.issuer,
        desc: t.dataset.desc,
        file: t.dataset.file
      });
    });
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter') t.click(); });
  });

  // reuse existing modal close logic (ensure close button exists)
})();
