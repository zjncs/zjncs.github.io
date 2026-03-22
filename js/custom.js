/* ==========================================================================
   Custom JS Interactions
   Focused on lightweight, desktop-first enhancements.
   ========================================================================== */

console.log(
  '%c Hacker OS %c Optimized ',
  'background: #05060a; padding: 1px; border-radius: 3px 0 0 3px; color: #00eaff',
  'background: linear-gradient(90deg, #00eaff, #ff3cac); padding: 1px; border-radius: 0 3px 3px 0; color: #05060a'
);

const hackerUI = (() => {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const allowEnhancedMotion = () => !reducedMotion.matches && finePointer.matches && window.innerWidth >= 1100;

  const setupNavScroll = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const toggle = () => {
      nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    };

    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  };

  const setupScrollIndicator = () => {
    let bar = document.querySelector('#scroll-indicator');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scroll-indicator';
      bar.innerHTML = '<div class="scroll-indicator__bar"></div>';
      document.body.appendChild(bar);
    }

    const innerBar = bar.querySelector('.scroll-indicator__bar');
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.setProperty('--scroll-progress', `${progress}%`);
      innerBar.style.backgroundPosition = `${progress}% 0`;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  };

  const setupCardTilt = () => {
    if (!allowEnhancedMotion()) return;

    const cards = document.querySelectorAll('#recent-posts > .recent-post-items > .recent-post-item, #recent-posts > .recent-post-item');
    if (!cards.length) return;

    const maxTilt = 5;

    cards.forEach(card => {
      let rafId = 0;
      let lastEvent = null;

      const update = () => {
        if (!lastEvent) return;

        const rect = card.getBoundingClientRect();
        const x = lastEvent.clientX - rect.left;
        const y = lastEvent.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const percentX = clamp((x - midX) / midX, -1, 1);
        const percentY = clamp((y - midY) / midY, -1, 1);

        card.style.setProperty('--tilt-x', `${percentY * maxTilt * -1}deg`);
        card.style.setProperty('--tilt-y', `${percentX * maxTilt}deg`);
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        rafId = 0;
      };

      const onMove = event => {
        lastEvent = event;
        if (rafId) return;
        rafId = requestAnimationFrame(update);
      };

      const reset = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        lastEvent = null;
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      };

      card.addEventListener('pointermove', onMove, { passive: true });
      card.addEventListener('pointerleave', reset, { passive: true });
    });
  };

  const setupLiveTime = () => {
    const target = document.querySelector('[data-live-time]');
    if (!target) return;

    const start = new Date(target.dataset.liveTime);
    if (!start.getTime()) return;

    const update = () => {
      const diff = Date.now() - start.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      target.textContent = `${days}d ${hours}h ${mins}m online`;
    };

    update();
    window.setInterval(update, 60 * 1000);
  };

  const setupFloatingChips = () => {
    const chips = document.querySelectorAll('.chip-ghost');
    if (!chips.length) return;

    chips.forEach((chip, index) => {
      chip.style.animationDelay = `${index * 0.08}s`;
    });
  };

  const init = () => {
    setupNavScroll();
    setupScrollIndicator();
    setupCardTilt();
    setupLiveTime();
    setupFloatingChips();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  hackerUI.init();
});
