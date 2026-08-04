document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCustomCursor();
    initAudioToggle();
});

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        follower.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

function initAudioToggle() {
    const audioBtn = document.getElementById('audio-toggle');
    const audio = document.getElementById('ambient-audio');
    
    if (!audioBtn || !audio) return;
    const icon = audioBtn.querySelector('.audio-icon');

    audioBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                if (icon) icon.textContent = '🔊';
            }).catch(err => console.log('Autoplay:', err));
        } else {
            audio.pause();
            if (icon) icon.textContent = '🔇';
        }
    });
}