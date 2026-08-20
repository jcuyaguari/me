document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initSmoothNavigation();
    initScrollAnimations();
    initTypingEffect();
    initCustomCursor();
    initDraggableSpotify();
    init3DTiltEffect();
});

/* 1. CAMBIO DE TEMA LIGHT / NIGHT */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const themeIcon = themeBtn.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
    }

    themeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* 2. MENÚ RESPONSIVE HAMBURGUESA */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/* 3. NAVEGACIÓN Y RESALTADO DE SECCIÓN ACTIVA */
function initSmoothNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* 4. ANIMACIONES AL HACER SCROLL */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => observer.observe(el));
}

/* 5. EFECTO TYPING */
function initTypingEffect() {
    const phrases = [
        "“Escribo lo que la noche me dicta.”",
        "“La melodía ya existía, solo tuve que escuchar.”",
        "“Cada verso es un eco de lo vivido.”",
        "“Silencio, caos, armonía.”"
    ];

    const targetElement = document.getElementById('typing-text');
    if (!targetElement) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            targetElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            targetElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* 6. CURSOR PERSONALIZADO */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower || window.innerWidth < 992) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        follower.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 400, fill: "forwards" });
    });
}

/* 7. LÓGICA DE ARRASTRE PARA SPOTIFY (RATÓN Y PANTALLA TÁCTIL) */
function initDraggableSpotify() {
    const widget = document.getElementById('spotify-widget');
    const toggleBtn = document.getElementById('spotify-toggle');
    const closeBtn = document.getElementById('spotify-close');

    if (!widget || !toggleBtn || !closeBtn) return;

    let isDragging = false;
    let hasDragged = false;
    let startX, startY, initialLeft, initialTop;

    toggleBtn.addEventListener('click', () => {
        if (!hasDragged) {
            widget.classList.add('is-open');
        }
        hasDragged = false;
    });

    closeBtn.addEventListener('click', () => {
        widget.classList.remove('is-open');
    });

    const startDrag = (e) => {
        if (widget.classList.contains('is-open')) return;

        isDragging = true;
        hasDragged = false;

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        const rect = widget.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    };

    const onDrag = (e) => {
        if (!isDragging) return;

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasDragged = true;
        }

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        const maxLeft = window.innerWidth - widget.offsetWidth - 15;
        const maxTop = window.innerHeight - widget.offsetHeight - 15;

        newLeft = Math.max(15, Math.min(newLeft, maxLeft));
        newTop = Math.max(15, Math.min(newTop, maxTop));

        /* Restablecer alineación central CSS cuando el usuario comienza el arrastre */
        widget.style.left = `${newLeft}px`;
        widget.style.top = `${newTop}px`;
        widget.style.transform = 'none';
        widget.style.bottom = 'auto';

        if (e.cancelable) e.preventDefault();
    };

    const stopDrag = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    };

    toggleBtn.addEventListener('mousedown', startDrag);
    toggleBtn.addEventListener('touchstart', startDrag, { passive: false });
}

/* 8. EFECTO DINÁMICO 3D */
function init3DTiltEffect() {
    const cards = document.querySelectorAll('.card-3d-inner');
    if (window.innerWidth < 992) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        });
    });
}