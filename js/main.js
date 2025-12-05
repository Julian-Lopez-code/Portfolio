/**
 * Main JavaScript File
 * Handles global functionality: Theme toggle, Scroll Reveal, Parallax, Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    initBackgroundShapes();
    initTheme();
    initScrollReveal();
    initParallax();
    initSmoothScroll();
    initEasterEgg();
});

/**
 * Background Shapes
 * Creates animated floating shapes in the background
 */
function initBackgroundShapes() {
    // Create container for background shapes
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'bg-shapes';

    // Create 5 floating shapes
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'bg-shape';
        shapesContainer.appendChild(shape);
    }

    // Insert at the beginning of body
    document.body.insertBefore(shapesContainer, document.body.firstChild);
}

/**
 * Theme Toggle
 * Manages light/dark mode using localStorage and CSS variables
 */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    // Set initial theme
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

/**
 * Scroll Reveal
 * Uses IntersectionObserver to reveal elements as they scroll into view
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/**
 * Parallax Effect
 * Subtle parallax for Hero section, respects prefers-reduced-motion
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hero || prefersReducedMotion) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled > hero.offsetHeight) return; // Stop if hero is out of view

        // Apply subtle translation to background or content
        // Assuming hero has a background or we move the content slightly
        const content = hero.querySelector('.hero-content');
        if (content) {
            content.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
}

/**
 * Smooth Scroll
 * For anchor links, with fallback for older browsers (though CSS scroll-behavior usually handles this)
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Easter Egg
 * Hidden surprise for curious visitors
 */
function initEasterEgg() {
    const easterEggBtn = document.getElementById('easter-egg-btn');
    if (!easterEggBtn) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'easter-egg-modal';
    modal.innerHTML = `
        <div class="easter-egg-content">
            <h2>🎉 Bien joué !</h2>
            <p>Vous avez trouvé l'easter egg.<br>Merci aux clients fidèles !</p>
            <button class="easter-egg-close">Fermer</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Show modal on click
    easterEggBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Close modal
    const closeBtn = modal.querySelector('.easter-egg-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}
