document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initTyping();
    initCursor();
    initSpotify();
});


/* =========================================================
   THEME
   ========================================================= */

function initThemeToggle(){
    const button = document.getElementById("theme-toggle");
    const icon = button?.querySelector(".theme-icon");

    if(!button) return;

    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    function applyTheme(theme){
        const isLight = theme === "light";

        document.body.classList.toggle("light-theme", isLight);
        document.body.classList.toggle("dark-theme", !isLight);

        if(icon){
            icon.textContent = isLight ? "☾" : "☀";
        }

        button.setAttribute(
            "aria-label",
            isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"
        );

        button.setAttribute("aria-pressed", String(isLight));

        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if(metaTheme){
            metaTheme.setAttribute("content", isLight ? "#f2f2ef" : "#050505");
        }
    }

    applyTheme(initialTheme);

    button.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("light-theme")
            ? "dark"
            : "light";

        applyTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
    });
}


/* =========================================================
   MOBILE NAV
   ========================================================= */

function initMobileNav(){
    const hamburger = document.getElementById("hamburger");
    const links = document.getElementById("nav-links");

    if(!hamburger || !links) return;

    function setMenu(open){
        links.classList.toggle("active", open);
        hamburger.setAttribute("aria-expanded", String(open));
        hamburger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
        document.body.classList.toggle("menu-open", open);
    }

    hamburger.addEventListener("click", () => {
        const isOpen = hamburger.getAttribute("aria-expanded") === "true";
        setMenu(!isOpen);
    });

    links.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", event => {
        if(event.key === "Escape"){
            setMenu(false);
        }
    });

    window.addEventListener("resize", () => {
        if(window.innerWidth > 992){
            setMenu(false);
        }
    });
}


/* =========================================================
   ACTIVE SECTION
   ========================================================= */

function initScrollSpy(){
    const sections = [...document.querySelectorAll("section[id]")];
    const links = [...document.querySelectorAll(".nav-link")];

    if(!sections.length || !links.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(!entry.isIntersecting) return;

            links.forEach(link => {
                const isActive =
                    link.getAttribute("href") === `#${entry.target.id}`;

                link.classList.toggle("active", isActive);
            });
        });
    }, {
        rootMargin:"-45% 0px -45% 0px",
        threshold:0
    });

    sections.forEach(section => observer.observe(section));
}


/* =========================================================
   REVEAL
   ========================================================= */

function initReveal(){
    const items = document.querySelectorAll(".reveal");

    if(!items.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold:.12
    });

    items.forEach(item => observer.observe(item));
}


/* =========================================================
   TYPEWRITER
   ========================================================= */

function initTyping(){
    const target = document.getElementById("typing-text");

    if(!target) return;

    const phrases = [
        "Escribo lo que la noche me dicta.",
        "La melodía ya existía, solo tuve que escuchar.",
        "Cada verso es un eco de lo vivido.",
        "Silencio, caos, armonía."
    ];

    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timer = null;

    function type(){
        const phrase = phrases[phraseIndex];

        characterIndex += deleting ? -1 : 1;
        target.textContent = phrase.slice(0, characterIndex);

        let speed = deleting ? 35 : 70;

        if(!deleting && characterIndex >= phrase.length){
            deleting = true;
            speed = 2200;
        }else if(deleting && characterIndex <= 0){
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        timer = window.setTimeout(type, speed);
    }

    type();

    window.addEventListener("beforeunload", () => {
        if(timer) window.clearTimeout(timer);
    });
}


/* =========================================================
   CUSTOM CURSOR
   ========================================================= */

function initCursor(){
    const cursor = document.getElementById("cursor");
    const follower = document.getElementById("cursor-follower");

    if(
        !cursor ||
        !follower ||
        window.matchMedia("(hover:none)").matches
    ){
        return;
    }

    let followerAnimation = null;

    document.addEventListener("mousemove", event => {
        const {clientX, clientY} = event;

        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;

        if(followerAnimation){
            followerAnimation.cancel();
        }

        followerAnimation = follower.animate(
            {
                left:`${clientX}px`,
                top:`${clientY}px`
            },
            {
                duration:420,
                fill:"forwards"
            }
        );
    });

    document.querySelectorAll("a,button").forEach(element => {
        element.addEventListener("mouseenter", () => {
            follower.style.width = "48px";
            follower.style.height = "48px";
        });

        element.addEventListener("mouseleave", () => {
            follower.style.width = "34px";
            follower.style.height = "34px";
        });
    });
}


/* =========================================================
   SPOTIFY — OPEN / CLOSE / DRAG
   ========================================================= */

function initSpotify(){
    const widget = document.getElementById("spotify-widget");
    const toggle = document.getElementById("spotify-toggle");
    const close = document.getElementById("spotify-close");

    if(!widget || !toggle || !close) return;

    let dragging = false;
    let dragged = false;

    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const getPoint = event => {
        if(event.touches?.length){
            return event.touches[0];
        }

        return event;
    };

    function openSpotify(){
        widget.classList.add("is-open");
        toggle.setAttribute("aria-expanded","true");
    }

    function closeSpotify(){
        widget.classList.remove("is-open");
        toggle.setAttribute("aria-expanded","false");
    }

    toggle.addEventListener("click", () => {
        if(dragged){
            dragged = false;
            return;
        }

        openSpotify();
    });

    close.addEventListener("click", closeSpotify);

    function startDrag(event){
        if(widget.classList.contains("is-open")) return;

        const point = getPoint(event);
        const rect = widget.getBoundingClientRect();

        dragging = true;
        dragged = false;

        startX = point.clientX;
        startY = point.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        document.addEventListener("mousemove", moveDrag);
        document.addEventListener("touchmove", moveDrag, {passive:false});
        document.addEventListener("mouseup", stopDrag);
        document.addEventListener("touchend", stopDrag);
    }

    function moveDrag(event){
        if(!dragging) return;

        const point = getPoint(event);
        if(!point) return;

        const deltaX = point.clientX - startX;
        const deltaY = point.clientY - startY;

        if(Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5){
            dragged = true;
        }

        const maxLeft = Math.max(12, window.innerWidth - widget.offsetWidth - 12);
        const maxTop = Math.max(12, window.innerHeight - widget.offsetHeight - 12);

        const left = Math.max(12, Math.min(initialLeft + deltaX, maxLeft));
        const top = Math.max(12, Math.min(initialTop + deltaY, maxTop));

        widget.style.left = `${left}px`;
        widget.style.top = `${top}px`;
        widget.style.right = "auto";
        widget.style.bottom = "auto";
        widget.style.transform = "none";

        if(event.cancelable){
            event.preventDefault();
        }
    }

    function stopDrag(){
        dragging = false;

        document.removeEventListener("mousemove", moveDrag);
        document.removeEventListener("touchmove", moveDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.removeEventListener("touchend", stopDrag);
    }

    toggle.addEventListener("mousedown", startDrag);
    toggle.addEventListener("touchstart", startDrag, {passive:false});
}