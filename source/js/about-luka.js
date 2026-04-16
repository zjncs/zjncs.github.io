(function () {
  const initLukaAbout = () => {
    const page = document.querySelector('.luka-about-page');
    if (!page || page.dataset.aboutLukaInitialized === 'true') {
      return;
    }

    page.dataset.aboutLukaInitialized = 'true';

    const toggle = document.getElementById('lukaThemeToggle');
    if (!toggle) {
      return;
    }

    const icon = toggle.querySelector('i');
    const syncToggleState = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const label = isDark ? '切换到浅色模式' : '切换到深色模式';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
      if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    };

    syncToggleState();

    toggle.addEventListener('click', () => {
      const themeSwitch = document.getElementById('darkmode');
      if (themeSwitch) {
        themeSwitch.click();
      } else {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        try {
          localStorage.setItem('theme', nextTheme);
        } catch (error) {
          // Ignore storage failures in privacy mode.
        }
      }

      window.requestAnimationFrame(syncToggleState);
    });

    const observer = new MutationObserver(syncToggleState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLukaAbout, { once: true });
  } else {
    initLukaAbout();
  }
})();
