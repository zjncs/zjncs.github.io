/* ==========================================================================
   Custom JS Interactions
   ========================================================================== */

console.log(
    '%c Hacker OS %c System Online ',
    'background: #05060a; padding: 1px; border-radius: 3px 0 0 3px;  color: #00eaff',
    'background: linear-gradient(90deg, #00eaff, #ff3cac); padding: 1px; border-radius: 0 3px 3px 0;  color: #05060a'
);

const hackerUI = (() => {
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const setupNavScroll = () => {
        const nav = document.getElementById('nav');
        if (!nav) return;
        const toggle = () => {
            if (window.scrollY > 50) nav.classList.add('nav-scrolled');
            else nav.classList.remove('nav-scrolled');
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

        const update = () => {
            const scrollTop = window.scrollY || 0;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.setProperty('--scroll-progress', `${progress}%`);
            const gradientShift = progress / 100;
            bar.querySelector('.scroll-indicator__bar').style.backgroundPosition = `${gradientShift * 100}% 0`;
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    };

    const setupCardTilt = () => {
        const cards = document.querySelectorAll('#recent-posts>.recent-post-item');
        if (!cards.length) return;

        const maxTilt = 8;
        const ensureLayers = card => {
            if (!card.querySelector('.card-grid-overlay')) {
                const grid = document.createElement('div');
                grid.className = 'card-grid-overlay';
                card.appendChild(grid);
            }
            if (!card.querySelector('.card-neon')) {
                const neon = document.createElement('div');
                neon.className = 'card-neon';
                card.appendChild(neon);
            }
        };

        const handleMove = (evt, card) => {
            const rect = card.getBoundingClientRect();
            const x = evt.clientX - rect.left;
            const y = evt.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const percentX = clamp((x - midX) / midX, -1, 1);
            const percentY = clamp((y - midY) / midY, -1, 1);
            const tiltX = percentY * maxTilt * -1;
            const tiltY = percentX * maxTilt;
            card.style.setProperty('--tilt-x', `${tiltX}deg`);
            card.style.setProperty('--tilt-y', `${tiltY}deg`);
            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        };

        const reset = card => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        };

        cards.forEach(card => {
            ensureLayers(card);
            card.addEventListener('pointermove', evt => handleMove(evt, card));
            card.addEventListener('pointerleave', () => reset(card));
        });
    };

    const setupCursorPulse = () => {
        let skip = false;
        const renderPulse = evt => {
            if (skip) return;
            skip = true;
            const pulse = document.createElement('span');
            pulse.className = 'cursor-pulse';
            pulse.style.left = `${evt.clientX}px`;
            pulse.style.top = `${evt.clientY}px`;
            document.body.appendChild(pulse);
            setTimeout(() => pulse.remove(), 700);
            requestAnimationFrame(() => { skip = false; });
        };
        window.addEventListener('pointermove', renderPulse, { passive: true });
    };

    const setupParallaxHeader = () => {
        const layers = document.querySelectorAll('.parallax-layer');
        if (!layers.length) return;
        const handle = evt => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const dx = (evt.clientX - centerX) / centerX;
            const dy = (evt.clientY - centerY) / centerY;
            layers.forEach(layer => {
                const depth = parseFloat(layer.dataset.depth || '0.2');
                const tx = -dx * depth * 20;
                const ty = -dy * depth * 20;
                layer.style.setProperty('--parallax-x', `${tx}px`);
                layer.style.setProperty('--parallax-y', `${ty}px`);
            });
        };
        window.addEventListener('pointermove', handle, { passive: true });
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
        setInterval(update, 60 * 1000);
    };

    const setupFloatingChips = () => {
        const chips = document.querySelectorAll('.chip-ghost');
        if (!chips.length) return;
        chips.forEach((chip, idx) => {
            chip.style.animationDelay = `${idx * 0.12}s`;
        });
    };

    const setupRipples = () => {
        const rippleTargets = document.querySelectorAll('.btn-ripple, .button, button');
        if (!rippleTargets.length) return;

        const spawn = (evt, target) => {
            const wave = document.createElement('span');
            wave.className = 'ripple-wave';
            const rect = target.getBoundingClientRect();
            wave.style.left = `${evt.clientX - rect.left}px`;
            wave.style.top = `${evt.clientY - rect.top}px`;
            target.appendChild(wave);
            setTimeout(() => wave.remove(), 750);
        };

        rippleTargets.forEach(el => {
            el.classList.add('btn-ripple');
            el.addEventListener('pointerdown', evt => spawn(evt, el));
        });
    };

    const setupAutoGlow = () => {
        const cards = document.querySelectorAll('#recent-posts>.recent-post-item');
        if (!cards.length) return;
        let tick = 0;
        const loop = () => {
            tick += 1;
            cards.forEach((card, idx) => {
                const delay = (tick + idx * 20) % 240;
                if (delay === 0) {
                    const glow = card.querySelector('.card-glow');
                    if (glow) {
                        glow.classList.add('is-active');
                        setTimeout(() => glow.classList.remove('is-active'), 800);
                    }
                }
            });
            requestAnimationFrame(loop);
        };
        cards.forEach(card => {
            if (!card.querySelector('.card-glow')) {
                const glow = document.createElement('div');
                glow.className = 'card-glow';
                card.appendChild(glow);
            }
        });
        loop();
    };

    const setupNoiseOverlay = () => {
        if (document.querySelector('.noise-overlay')) return;
        const noise = document.createElement('div');
        noise.className = 'noise-overlay';
        document.body.appendChild(noise);
    };

    const init = () => {
        setupNavScroll();
        setupScrollIndicator();
        setupCardTilt();
        setupCursorPulse();
        setupParallaxHeader();
        setupLiveTime();
        setupFloatingChips();
        setupRipples();
        setupAutoGlow();
        setupNoiseOverlay();
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    hackerUI.init();
});
