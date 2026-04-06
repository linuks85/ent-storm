// ─── NAVBAR SCROLL ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ─── BURGER MENU ────────────────────────────────────────
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
});

mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
    });
});

// ─── COUNTER ANIMATION ──────────────────────────────────
function animateCounter(el) {
    const target   = +el.dataset.target;
    const duration = 1200;
    const step     = 16;
    const increments = Math.ceil(duration / step);
    let current = 0;

    const timer = setInterval(() => {
        current++;
        const value = Math.round(easeOut(current / increments) * target);
        el.textContent = value;
        if (current >= increments) {
            el.textContent = target;
            clearInterval(timer);
        }
    }, step);
}

function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
}

// ─── INTERSECTION OBSERVER ──────────────────────────────
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // fade-in elements
        if (entry.target.classList.contains('fade-in')) {
            entry.target.classList.add('visible');
        }

        // counters
        entry.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
            if (!el.dataset.animated) {
                el.dataset.animated = '1';
                animateCounter(el);
            }
        });

        io.unobserve(entry.target);
    });
}, { threshold: 0.15 });

// observe hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) io.observe(heroStats);

// add fade-in to sections
document.querySelectorAll('.service-card, .case-card, .why-card, .step, .tech-cat').forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    io.observe(el);
});

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ─── CONTACT FORM ────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    btn.textContent = 'Отправлено ✓';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.disabled = true;
    this.reset();
});
