document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initTyping();
    initCursor();
    initSpotify();
});

/* THEME */
function initThemeToggle(){
    const btn = document.getElementById("theme-toggle");
    const icon = btn?.querySelector(".theme-icon");
    if(!btn) return;

    const saved = localStorage.getItem("theme");
    const apply = theme => {
        document.body.classList.toggle("light-theme", theme === "light");
        document.body.classList.toggle("dark-theme", theme !== "light");
        if(icon) icon.textContent = theme === "light" ? "☾" : "☀";
    };

    apply(saved || "dark");

    btn.addEventListener("click", () => {
        const next = document.body.classList.contains("light-theme") ? "dark" : "light";
        apply(next);
        localStorage.setItem("theme", next);
    });
}

/* MOBILE NAV */
function initMobileNav(){
    const hamburger = document.getElementById("hamburger");
    const links = document.getElementById("nav-links");
    if(!hamburger || !links) return;

    hamburger.addEventListener("click", () => {
        const open = links.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", open);
    });

    links.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => links.classList.remove("active"));
    });
}

/* ACTIVE SECTION */
function initScrollSpy(){
    const sections = [...document.querySelectorAll("section[id]")];
    const links = [...document.querySelectorAll(".nav-link")];

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                links.forEach(link => link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                ));
            }
        });
    }, {rootMargin:"-45% 0px -45% 0px", threshold:0});

    sections.forEach(section => observer.observe(section));
}

/* REVEAL */
function initReveal(){
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {threshold:.12});

    items.forEach(item => observer.observe(item));
}

/* TYPEWRITER */
function initTyping(){
    const target = document.getElementById("typing-text");
    if(!target) return;

    const phrases = [
        "Escribo lo que la noche me dicta.",
        "La melodía ya existía, solo tuve que escuchar.",
        "Cada verso es un eco de lo vivido.",
        "Silencio, caos, armonía."
    ];

    let p = 0, i = 0, deleting = false;

    function type(){
        const phrase = phrases[p];

        if(!deleting){
            target.textContent = phrase.slice(0, i + 1);
            i++;
        }else{
            target.textContent = phrase.slice(0, i - 1);
            i--;
        }

        let speed = deleting ? 35 : 70;

        if(!deleting && i === phrase.length){
            speed = 2200;
            deleting = true;
        }else if(deleting && i === 0){
            deleting = false;
            p = (p + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }
    type();
}

/* CURSOR */
function initCursor(){
    const cursor = document.getElementById("cursor");
    const follower = document.getElementById("cursor-follower");
    if(!cursor || !follower || window.matchMedia("(hover:none)").matches) return;

    document.addEventListener("mousemove", e => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        follower.animate(
            {left:e.clientX + "px", top:e.clientY + "px"},
            {duration:420, fill:"forwards"}
        );
    });

    document.querySelectorAll("a,button").forEach(el => {
        el.addEventListener("mouseenter", () => {
            follower.style.width = "48px";
            follower.style.height = "48px";
        });
        el.addEventListener("mouseleave", () => {
            follower.style.width = "34px";
            follower.style.height = "34px";
        });
    });
}

/* SPOTIFY DRAG + OPEN */
function initSpotify(){
    const widget = document.getElementById("spotify-widget");
    const toggle = document.getElementById("spotify-toggle");
    const close = document.getElementById("spotify-close");
    if(!widget || !toggle || !close) return;

    let dragging = false, dragged = false;
    let sx = 0, sy = 0, il = 0, it = 0;

    toggle.addEventListener("click", () => {
        if(!dragged) widget.classList.add("is-open");
        dragged = false;
    });

    close.addEventListener("click", () => widget.classList.remove("is-open"));

    const point = e => e.touches ? e.touches[0] : e;

    function start(e){
        if(widget.classList.contains("is-open")) return;
        const p = point(e);
        const r = widget.getBoundingClientRect();
        dragging = true; dragged = false;
        sx = p.clientX; sy = p.clientY;
        il = r.left; it = r.top;

        document.addEventListener("mousemove", move);
        document.addEventListener("touchmove", move, {passive:false});
        document.addEventListener("mouseup", stop);
        document.addEventListener("touchend", stop);
    }

    function move(e){
        if(!dragging) return;
        const p = point(e);
        const dx = p.clientX - sx, dy = p.clientY - sy;

        if(Math.abs(dx)>5 || Math.abs(dy)>5) dragged = true;

        let left = Math.max(12, Math.min(il + dx, innerWidth - widget.offsetWidth - 12));
        let top = Math.max(12, Math.min(it + dy, innerHeight - widget.offsetHeight - 12));

        widget.style.left = left + "px";
        widget.style.top = top + "px";
        widget.style.right = "auto";
        widget.style.bottom = "auto";
        widget.style.transform = "none";

        if(e.cancelable) e.preventDefault();
    }

    function stop(){
        dragging = false;
        document.removeEventListener("mousemove", move);
        document.removeEventListener("touchmove", move);
        document.removeEventListener("mouseup", stop);
        document.removeEventListener("touchend", stop);
    }

    toggle.addEventListener("mousedown", start);
    toggle.addEventListener("touchstart", start, {passive:false});
}