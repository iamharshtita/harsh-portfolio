// ========================================
// HARSH TITA — PORTFOLIO
// ========================================

document.addEventListener('DOMContentLoaded', function () {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // SCROLL REVEAL
  // ========================================
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // Anything already above the fold on load shows immediately.
    requestAnimationFrame(() => {
      revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add('is-in');
        }
      });
    });
  }

  // ========================================
  // HERO WORD ROTATOR
  // ========================================
  const rotator = document.querySelector('.rotator');

  if (rotator && !prefersReducedMotion) {
    const words = (rotator.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);

    if (words.length > 1) {
      let i = 0;

      // Measure on the real element with its width released, so the number
      // comes from the exact inherited font. Measured fresh on every swap
      // rather than cached up front: a cached table can be built before the
      // webfont loads (giving fallback widths that are too narrow) or go stale
      // when the viewport-dependent font size changes.
      function widthOf(word) {
        const shown = rotator.textContent;
        const prevWidth = rotator.style.width;
        const prevTransition = rotator.style.transition;

        rotator.style.transition = 'none';
        rotator.style.width = 'auto';
        rotator.textContent = word;
        const w = Math.ceil(rotator.getBoundingClientRect().width) + 1;

        rotator.textContent = shown;
        rotator.style.width = prevWidth;
        void rotator.offsetWidth; // flush, so restoring width is not animated
        rotator.style.transition = prevTransition;

        return w;
      }

      rotator.style.width = widthOf(words[0]) + 'px';

      setInterval(() => {
        const next = (i + 1) % words.length;

        // Fade the old word out and resize the slot at the same time, so the
        // box has already reached its new size before the next word appears.
        // Resizing after the swap lets a long word spill onto the text
        // following it.
        rotator.classList.add('is-out');
        rotator.style.width = widthOf(words[next]) + 'px';

        setTimeout(() => {
          i = next;
          rotator.textContent = words[i];
          rotator.classList.remove('is-out');
        }, 260);
      }, 2600);
    }
  }

  // ========================================
  // STAT COUNT-UP
  // ========================================
  const statValues = document.querySelectorAll('.stat-value[data-count]');

  function formatStat(el, value) {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    return (el.dataset.prefix || '') + value.toFixed(decimals) + (el.dataset.suffix || '');
  }

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;

    const duration = 1100;
    const start = performance.now();

    // requestAnimationFrame is throttled in background tabs, which would leave
    // a half-counted number on screen. Guarantee the final value on a timer.
    const settle = setTimeout(() => {
      el.textContent = formatStat(el, target);
    }, duration + 400);

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = formatStat(el, target * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        clearTimeout(settle);
        el.textContent = formatStat(el, target);
      }
    }

    requestAnimationFrame(tick);
  }

  if (statValues.length && !prefersReducedMotion) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          delete entry.target.dataset.pending;
          countUp(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    // Blank every stat up front. The strip now sits above the fold on most
    // laptops, so the observer fires on load; leaving the real value in place
    // flashed it before the count-up restarted from zero.
    statValues.forEach(el => {
      el.dataset.pending = '1';
      el.textContent = formatStat(el, 0);
      statObserver.observe(el);
    });

    // Safety net: if the observer never fires, show the real numbers rather
    // than leaving zeros on screen.
    setTimeout(() => {
      statValues.forEach(el => {
        if (el.dataset.pending === '1') {
          delete el.dataset.pending;
          el.textContent = formatStat(el, parseFloat(el.dataset.count));
        }
      });
    }, 1600);
  }

  // ========================================
  // HEADER + MOBILE NAV
  // ========================================
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('site-nav');
  const navToggle = document.querySelector('.nav-toggle');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    }, { passive: true });
  }

  if (navToggle && nav) {
    const toggleLabel = navToggle.querySelector('.nav-toggle-label');

    function setNav(open) {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      if (toggleLabel) toggleLabel.textContent = open ? 'Close' : 'Menu';
      document.body.classList.toggle('nav-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    navToggle.addEventListener('click', () => {
      setNav(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setNav(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setNav(false);
    });
  }

  // ========================================
  // YEAR (FOOTER)
  // ========================================
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ========================================
  // PHOTO RAIL ARROWS
  // ========================================
  const rail = document.querySelector('.rail');
  const railBtns = document.querySelectorAll('[data-rail]');

  if (rail && railBtns.length) {
    // Scroll by whole cards, so a photo never lands half out of view.
    function step() {
      const card = rail.querySelector('.moment');
      if (!card) return rail.clientWidth;
      const gap = parseFloat(getComputedStyle(rail).columnGap || '16') || 16;
      const per = Math.max(1, Math.floor(rail.clientWidth / (card.offsetWidth + gap)));
      return (card.offsetWidth + gap) * per;
    }

    function syncButtons() {
      // 2px of slack: fractional scroll widths mean scrollLeft rarely hits the
      // maximum exactly, which would leave the next arrow enabled forever.
      const max = rail.scrollWidth - rail.clientWidth;
      railBtns.forEach(btn => {
        const isNext = btn.dataset.rail === 'next';
        btn.disabled = isNext ? rail.scrollLeft >= max - 2 : rail.scrollLeft <= 2;
      });
    }

    railBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rail.scrollBy({
          left: btn.dataset.rail === 'next' ? step() : -step(),
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });

    rail.addEventListener('scroll', syncButtons, { passive: true });
    window.addEventListener('resize', syncButtons);
    syncButtons();
  }

  // ========================================
  // BACK TO TOP
  // ========================================
  const toTop = document.querySelector('.to-top');

  if (toTop) {
    function syncToTop() {
      // Appear only once the hero is behind you, so it never overlaps the
      // first screen where there is nothing to scroll back to.
      toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.1);
    }

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', syncToTop, { passive: true });
    window.addEventListener('resize', syncToTop);
    syncToTop();
  }

  // ========================================
  // PHOTO LIGHTBOX
  // ========================================
  const lightbox = document.getElementById('lightbox');

  if (lightbox) {
    const moments = Array.from(document.querySelectorAll('.rail .moment'));
    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbCounter = lightbox.querySelector('.lightbox-counter');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');

    const items = moments.map(fig => {
      const img = fig.querySelector('img');
      const cap = fig.querySelector('figcaption');
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.alt : '',
        caption: cap ? cap.textContent.trim() : ''
      };
    });

    let currentIndex = 0;
    let lastFocused = null;

    function render() {
      const item = items[currentIndex];
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCaption.textContent = item.caption;
      lbCounter.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    function openLightbox(index) {
      currentIndex = index;
      render();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lastFocused = document.activeElement;
      btnNext.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    function navigate(delta) {
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render();
    }

    moments.forEach((fig, i) => {
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-label', 'View photo: ' + items[i].caption);
      fig.addEventListener('click', () => openLightbox(i));
      fig.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', () => navigate(-1));
    btnNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-figure')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') navigate(-1);
      else if (e.key === 'ArrowRight') navigate(1);
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  // ========================================
  // VIDEO MODAL (LinkedIn embed)
  // ========================================
  const videoModal = document.getElementById('video-modal');

  if (videoModal) {
    const frame = videoModal.querySelector('.video-modal-frame');
    const embedSrc = frame.getAttribute('data-src');
    const closeVideoBtn = videoModal.querySelector('.video-modal-close');
    let lastFocusedBeforeVideo = null;

    function openVideo() {
      if (frame.src !== embedSrc) frame.src = embedSrc;
      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lastFocusedBeforeVideo = document.activeElement;
      closeVideoBtn.focus();
    }

    function closeVideo() {
      videoModal.classList.remove('open');
      videoModal.setAttribute('aria-hidden', 'true');
      frame.src = ''; // stop playback
      document.body.style.overflow = '';
      if (lastFocusedBeforeVideo) lastFocusedBeforeVideo.focus();
    }

    document.querySelectorAll('[data-video-open]').forEach(el => {
      el.addEventListener('click', openVideo);
    });

    closeVideoBtn.addEventListener('click', closeVideo);

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideo();
    });

    document.addEventListener('keydown', (e) => {
      if (videoModal.classList.contains('open') && e.key === 'Escape') closeVideo();
    });
  }

});
