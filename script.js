// ==================== CONFIGURATION ====================
const CONFIG = {
    totalScreens: 8,
    particleCount: 20,
    heartInterval: 2000,
    sparkleInterval: 1500,
    musicVolume: 0.5
};

// ==================== STATE ====================
let currentScreen = 1;
let isMusicPlaying = false;
let musicInitialized = false;

// ==================== DOM ELEMENTS ====================
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const progressFill = document.querySelector('.progress-fill');
const cursorGlow = document.getElementById('cursor-glow');
const modalOverlay = document.getElementById('modal-overlay');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initFloatingHearts();
    initSparkles();
    initCursorGlow();
    initStars();
    initTypewriter();
    initScrollAnimations();
    startHeartGenerator();
    startSparkleGenerator();
    updateProgressBar();

    // Try to autoplay music (may be blocked)
    document.addEventListener('click', initMusic, { once: true });
    document.addEventListener('touchstart', initMusic, { once: true });
});

// ==================== MUSIC ====================
function initMusic() {
    if (musicInitialized) return;
    music.volume = CONFIG.musicVolume;
    music.play().then(() => {
        isMusicPlaying = true;
        musicBtn.classList.add('playing');
        musicInitialized = true;
    }).catch(() => {
        // Autoplay blocked, show button for manual play
        musicInitialized = true;
    });
}

musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMusicPlaying) {
        music.pause();
        musicBtn.classList.remove('playing');
    } else {
        music.play();
        musicBtn.classList.add('playing');
    }
    isMusicPlaying = !isMusicPlaying;
});

// ==================== SCREEN TRANSITIONS ====================
function goToScreen(screenNum) {
    if (screenNum < 1 || screenNum > CONFIG.totalScreens) return;

    const currentEl = document.getElementById(`screen-${currentScreen}`);
    const nextEl = document.getElementById(`screen-${screenNum}`);

    // Hide current
    currentEl.classList.remove('active');

    // Show next after brief delay
    setTimeout(() => {
        nextEl.classList.add('active');
        currentScreen = screenNum;
        updateProgressBar();

        // Trigger screen-specific effects
        handleScreenEnter(screenNum);
    }, 300);
}

function handleScreenEnter(screenNum) {
    switch(screenNum) {
        case 4:
            setTimeout(() => createConfettiExplosion(), 500);
            break;
        case 7:
            startStarTwinkle();
            break;
        case 8:
            createFinalConfetti();
            break;
    }
}

// ==================== PROGRESS BAR ====================
function updateProgressBar() {
    const percentage = (currentScreen / CONFIG.totalScreens) * 100;
    progressFill.style.width = `${percentage}%`;
}

// ==================== CURSOR GLOW ====================
function initCursorGlow() {
    // Only on non-touch devices
    if ('ontouchstart' in window) return;

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ==================== PARTICLES ====================
function initParticles() {
    const container = document.getElementById('particles-container');

    for (let i = 0; i < CONFIG.particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 6 + 3) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.background = `radial-gradient(circle, rgba(${200 + Math.random() * 55}, ${150 + Math.random() * 80}, ${180 + Math.random() * 60}, ${Math.random() * 0.4 + 0.3}), transparent)`;
    container.appendChild(particle);
}

// ==================== FLOATING HEARTS ====================
function initFloatingHearts() {
    // Initial hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createFloatingHeart(), i * 800);
    }
}

function startHeartGenerator() {
    setInterval(() => {
        if (document.querySelectorAll('.floating-heart-particle').length < 15) {
            createFloatingHeart();
        }
    }, CONFIG.heartInterval);
}

function createFloatingHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.className = 'floating-heart-particle';
    heart.textContent = ['💗', '💖', '💕', '💓', '💝', '🌸', '✨'][Math.floor(Math.random() * 7)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.3;

    container.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        if (heart.parentNode) heart.remove();
    }, 12000);
}

// ==================== SPARKLES ====================
function initSparkles() {
    // Initial sparkles around center
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createSparkle(), i * 300);
    }
}

function startSparkleGenerator() {
    setInterval(() => {
        if (document.querySelectorAll('.sparkle').length < 20) {
            createSparkle();
        }
    }, CONFIG.sparkleInterval);
}

function createSparkle(x, y) {
    const container = document.getElementById('sparkles-container');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const posX = x !== undefined ? x : Math.random() * window.innerWidth;
    const posY = y !== undefined ? y : Math.random() * window.innerHeight;

    sparkle.style.left = posX + 'px';
    sparkle.style.top = posY + 'px';
    sparkle.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
    sparkle.style.width = (Math.random() * 4 + 2) + 'px';
    sparkle.style.height = sparkle.style.width;

    container.appendChild(sparkle);

    setTimeout(() => {
        if (sparkle.parentNode) sparkle.remove();
    }, 2000);
}

// ==================== CONFETTI ====================
function createConfettiExplosion() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ffb6cf', '#ffdce8', '#f7c8d8', '#ffeef5', '#d86d96', '#fff', '#ff9ec4'];
    const shapes = ['square', 'circle', 'rectangle'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            confetti.style.backgroundColor = color;
            confetti.style.left = Math.random() * 100 + '%';

            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'rectangle') {
                confetti.style.width = '6px';
                confetti.style.height = '12px';
            }

            confetti.style.animationDuration = (Math.random() * 3 + 3) + 's';
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';

            container.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) confetti.remove();
            }, 7000);
        }, i * 20);
    }
}

function createFinalConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ffb6cf', '#ffdce8', '#f7c8d8', '#ffeef5', '#d86d96', '#ff9ec4', '#fff'];

    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';

            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }

            confetti.style.animationDuration = (Math.random() * 4 + 4) + 's';
            container.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) confetti.remove();
            }, 9000);
        }, i * 15);
    }

    // Also add hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFloatingHeart();
        }, i * 100);
    }
}

// ==================== STARS (NIGHT SKY) ====================
function initStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 1.5) + 's';

        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        container.appendChild(star);
    }
}

function startStarTwinkle() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, i) => {
        setTimeout(() => {
            star.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        }, i * 50);
    });
}

// ==================== TYPEWRITER ====================
function initTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter-text');

    typewriterElements.forEach(el => {
        const text = el.getAttribute('data-text');
        if (text) {
            el.textContent = '';
            el.style.width = '0';

            // Observe when element becomes visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typewrite(el, text);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(el);
        }
    });
}

function typewrite(element, text) {
    let i = 0;
    element.style.width = 'auto';
    element.style.borderRight = '3px solid #d86d96';

    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
            // Keep blinking cursor
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 2000);
        }
    }, 70);
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(el => observer.observe(el));
}

// ==================== ENVELOPES ====================
let currentOpenEnvelope = null;

function openEnvelope(envelopeCard) {
    const inside = envelopeCard.querySelector('.envelope-inside');

    // Close any open envelope
    closeEnvelope();

    // Show modal overlay
    modalOverlay.classList.add('active');

    // Show envelope inside
    inside.classList.add('active');
    currentOpenEnvelope = inside;

    // Create sparkles around envelope
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const rect = envelopeCard.getBoundingClientRect();
            createSparkle(
                rect.left + rect.width / 2 + (Math.random() - 0.5) * 200,
                rect.top + rect.height / 2 + (Math.random() - 0.5) * 200
            );
        }, i * 100);
    }
}

function closeEnvelope() {
    modalOverlay.classList.remove('active');

    if (currentOpenEnvelope) {
        currentOpenEnvelope.classList.remove('active');
        currentOpenEnvelope = null;
    }
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEnvelope();
    }
});

// ==================== MOUSE FOLLOW SPARKLES ====================
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        createSparkle(e.clientX, e.clientY);
    }
});

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
    if (Math.random() > 0.9) {
        const touch = e.touches[0];
        createSparkle(touch.clientX, touch.clientY);
    }
}, { passive: true });

// ==================== SWIPE SUPPORT ====================
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 80;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - next screen
            if (currentScreen < CONFIG.totalScreens) {
                // Only on non-scrollable screens
                const currentEl = document.getElementById(`screen-${currentScreen}`);
                if (!currentEl.querySelector('.scrollable') || !isScrollableAtBottom(currentEl)) {
                    goToScreen(currentScreen + 1);
                }
            }
        } else {
            // Swipe down - previous screen
            if (currentScreen > 1) {
                goToScreen(currentScreen - 1);
            }
        }
    }
}

function isScrollableAtBottom(element) {
    const scrollable = element.querySelector('.scrollable');
    if (!scrollable) return false;
    return scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 10;
}

// ==================== PARALLAX EFFECT ====================
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    const characters = document.querySelectorAll('.character-img');
    characters.forEach(char => {
        char.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ==================== PREFERS REDUCED MOTION ====================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable complex animations
    document.querySelectorAll('.particle, .floating-heart-particle, .sparkle').forEach(el => {
        el.style.animation = 'none';
        el.style.display = 'none';
    });
}

// ==================== VISIBILITY API ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isMusicPlaying) {
        music.pause();
    } else if (!document.hidden && isMusicPlaying) {
        music.play();
    }
});
