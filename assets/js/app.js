document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de Lucide Icons
    lucide.createIcons();

    /* ==========================================
       1. MOTOR 3D THREE.JS (Campo de Partículas)
       ========================================== */
    const init3DBackground = () => {
        const canvas = document.getElementById('canvas-3d');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Generar partículas de polvo estelar / notas abstractas
        const particleCount = 800;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 12;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.025,
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        camera.position.z = 3;

        // Sensibilidad al movimiento del ratón
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
        });

        // Loop de Renderizado
        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            particleSystem.rotation.y = elapsedTime * 0.03;
            particleSystem.rotation.x = elapsedTime * 0.015;

            // Suavizar reacción al cursor
            particleSystem.rotation.y += (mouseX - particleSystem.rotation.y) * 0.05;
            particleSystem.rotation.x += (-mouseY - particleSystem.rotation.x) * 0.05;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    /* ==========================================
       2. CONTROLADOR DE TEMA (MODO OSCURO / CLARO)
       ========================================== */
    const initThemeEngine = () => {
        const themeBtn = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';

        document.documentElement.setAttribute('data-theme', savedTheme);

        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    };

    /* ==========================================
       3. TYPEWRITER EFFECT (FRASES DE CANCIONES)
       ========================================== */
    const initTypewriter = () => {
        const quotes = [
            "Y en la pausa entre los dos versos,\ndescubrí que todavía te esperaba.",
            "No eran notas fuera de tono,\nera nuestra propia desafinación armónica.",
            "Escribo en la noche para que el día\nno borre lo que la sombra confiesa."
        ];

        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        const output = document.getElementById('typewriter-output');
        const counter = document.getElementById('quote-counter');

        const type = () => {
            const currentQuote = quotes[index];
            counter.textContent = `${index + 1} / ${quotes.length}`;

            if (isDeleting) {
                output.textContent = currentQuote.substring(0, charIndex - 1);
                charIndex--;
            } else {
                output.textContent = currentQuote.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 30 : 60;

            if (!isDeleting && charIndex === currentQuote.length) {
                typeSpeed = 3000; // Pausa al completar la frase
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % quotes.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        type();

        // Botones de Navegación Manual
        document.getElementById('next-quote').addEventListener('click', () => {
            index = (index + 1) % quotes.length;
            charIndex = 0;
            isDeleting = false;
        });

        document.getElementById('prev-quote').addEventListener('click', () => {
            index = (index - 1 + quotes.length) % quotes.length;
            charIndex = 0;
            isDeleting = false;
        });
    };

    /* ==========================================
       4. CURSOR PERSONALIZADO & INTERACCIONES
       ========================================== */
    const initCustomCursor = () => {
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');

        window.addEventListener('mousemove', (e) => {
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;

            ring.style.left = `${e.clientX}px`;
            ring.style.top = `${e.clientY}px`;
        });
    };

    /* ==========================================
       5. SCROLL REVEAL OBSERVER
       ========================================== */
    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    };

    /* ==========================================
       6. MENÚ MÓVIL
       ========================================== */
    const initMobileMenu = () => {
        const btn = document.getElementById('hamburger-btn');
        const menu = document.getElementById('nav-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });

        // Cerrar al hacer clic en un enlace
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => menu.classList.remove('active'));
        });
    };

    // Inicializar todos los módulos
    init3DBackground();
    initThemeEngine();
    initTypewriter();
    initCustomCursor();
    initScrollReveal();
    initMobileMenu();
});