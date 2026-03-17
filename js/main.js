// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1800);
    }

    // Auto-update copyright year
    const yearEl = document.getElementById('copyrightYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (backToTop) {
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// Back to top click
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) {
            item.classList.add('active');
        }
    });
});

// ===== STAT COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;

    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        statsAnimated = true;
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2200;
            const start = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                // Smooth ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(target * eased).toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    num.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(update);
        });
    }
}

window.addEventListener('scroll', animateStats);
window.addEventListener('load', animateStats);

// ===== SCROLL REVEAL =====
function setupReveal() {
    const selectors = [
        '.about-image',
        '.about-content',
        '.service-card',
        '.fleet-card',
        '.advantage-card',
        '.partner-card',
        '.contact-card',
        '.contact-form-container',
        '.contact-hours',
        '.section-header',
        '.cta-content'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(el => observer.observe(el));
}

setupReveal();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const successPopup = document.getElementById('successPopup');
const popupRefId = document.getElementById('popupRefId');
const popupClose = document.getElementById('popupClose');

function generateRefId() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return `SV-${yy}${mm}${dd}-${rand}`;
}

function showSuccessPopup(refId) {
    popupRefId.textContent = refId;
    successPopup.classList.add('active');
}

function closePopup() {
    successPopup.classList.remove('active');
}

if (popupClose) {
    popupClose.addEventListener('click', closePopup);
}

if (successPopup) {
    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) closePopup();
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const company = document.getElementById('company').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        const refId = generateRefId();

        // Send email in background via FormSubmit.co
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('company', company);
        formData.append('service', service);
        formData.append('message', message);
        formData.append('_subject', `[${refId}] New Booking Request from ${name}`);
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');

        fetch('https://formsubmit.co/ajax/info@sarvavahanalogistics.com', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            contactForm.reset();
            showSuccessPopup(refId);
        })
        .catch(error => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            contactForm.reset();
            showSuccessPopup(refId);
        });
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== FLEET CAROUSEL TOUCH/DRAG SCROLL =====
(function () {
    const carousel = document.querySelector('.fleet-carousel');
    const track = document.querySelector('.fleet-track');
    if (!carousel || !track) return;

    let isDragging = false;
    let startX = 0;
    let scrollOffset = 0;
    let animationPaused = false;

    function getCurrentTranslateX() {
        const style = window.getComputedStyle(track);
        const matrix = new DOMMatrix(style.transform);
        return matrix.m41;
    }

    function pauseAnimation() {
        if (!animationPaused) {
            scrollOffset = getCurrentTranslateX();
            track.style.animation = 'none';
            track.style.transform = `translateX(${scrollOffset}px)`;
            animationPaused = true;
        }
    }

    function resumeAnimation() {
        const totalWidth = track.scrollWidth / 2;
        // Normalize scrollOffset to stay within bounds
        let normalizedOffset = scrollOffset % totalWidth;
        if (normalizedOffset > 0) normalizedOffset -= totalWidth;

        // Calculate the percentage progressed
        const progress = Math.abs(normalizedOffset) / totalWidth;

        track.style.transform = '';
        track.style.animation = 'none';
        // Force reflow
        void track.offsetWidth;
        track.style.animation = `fleetScroll 35s linear infinite`;
        track.style.animationDelay = `-${progress * 35}s`;
        animationPaused = false;
    }

    // Touch events (mobile finger scroll)
    carousel.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        pauseAnimation();
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        startX = currentX;
        scrollOffset += diff;
        track.style.transform = `translateX(${scrollOffset}px)`;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        isDragging = false;
        resumeAnimation();
    });

    // Mouse events (desktop drag)
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        pauseAnimation();
        carousel.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.clientX - startX;
        startX = e.clientX;
        scrollOffset += diff;
        track.style.transform = `translateX(${scrollOffset}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.cursor = 'grab';
        resumeAnimation();
    });
})();
