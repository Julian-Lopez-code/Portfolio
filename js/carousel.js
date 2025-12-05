/**
 * Carousel JavaScript
 * Handles infinite centered carousel navigation with filtering
 */

let originalSlides = []; // Store original slides for filtering
let carouselInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
    // Store original slides before any manipulation
    originalSlides = Array.from(document.querySelectorAll('.carousel-slide'));

    initCarousel(originalSlides);
    initFilters();
});

/**
 * Initialize Carousel
 * @param {Array} slidesToRender - Array of DOM elements to render in the carousel
 */
function initCarousel(slidesToRender) {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    // Indicators container needs to be cleared and rebuilt
    const indicatorsContainer = document.querySelector('.carousel-indicators');

    if (!track || !slidesToRender || slidesToRender.length === 0) return;

    // Clear track and indicators
    track.innerHTML = '';
    if (indicatorsContainer) indicatorsContainer.innerHTML = '';

    // Rebuild indicators
    let indicators = [];
    if (indicatorsContainer) {
        slidesToRender.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Aller au projet ${index + 1}`);
            indicatorsContainer.appendChild(indicator);
            indicators.push(indicator);
        });
    }

    // Clone logic for infinite loop
    // We need enough clones. If we have few items, we might need more clones.
    // Standard: 1 set at start, 1 set at end.

    // Append original slides first to track (as copies to avoid reference issues if we reuse originalSlides)
    // Actually, we should clone them to put in track, keeping originalSlides intact in memory.

    // Create clones for end
    slidesToRender.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('clone');
        clone.classList.remove('active');
        track.appendChild(clone);
    });

    // Create clones for start
    slidesToRender.slice().reverse().forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('clone');
        clone.classList.remove('active');
        track.insertBefore(clone, track.firstChild);
    });

    // Insert the "real" slides in the middle? 
    // Wait, the previous logic was: Append End Clones, Prepend Start Clones.
    // The "original" slides were the ones initially in DOM.
    // If I clear DOM, I need to put "Real" slides + Clones.
    // Actually, the standard infinite loop usually has: [Clones End] [Real Slides] [Clones Start] ?
    // No, usually: [Clones of End] [Real Slides] [Clones of Start]
    // Let's stick to the previous working logic:
    // 1. We have the slides.
    // 2. We append clones of all slides to end.
    // 3. We prepend clones of all slides to start.
    // So track contains: [Clones Start (reversed order or normal?)] [Originals] [Clones End]

    // Let's rebuild the track structure:
    // We want: [Clone 3, Clone 4, Clone 1, Clone 2] [Slide 1, Slide 2, Slide 3, Slide 4] [Clone 1, Clone 2, Clone 3, Clone 4]
    // Actually simpler: [Clone of Last...Clone of First] [Real Slides] [Clone of First...Clone of Last]

    // My previous code did:
    // 1. Get slides from DOM.
    // 2. Append clones of ALL slides.
    // 3. Prepend clones of ALL slides (reversed).
    // Result: [Clone 4, Clone 3, Clone 2, Clone 1] [Slide 1, Slide 2, Slide 3, Slide 4] [Clone 1, Clone 2, Clone 3, Clone 4]
    // This worked. Let's reproduce it.

    // Clear track again to be sure
    track.innerHTML = '';

    // Add "Real" slides
    slidesToRender.forEach(slide => {
        // We clone here too because originalSlides are just stored in memory, 
        // and we want fresh DOM elements in the track.
        const el = slide.cloneNode(true);
        // Ensure no leftover classes
        el.classList.remove('clone', 'active');
        track.appendChild(el);
    });

    // Now select these "real" slides from DOM to clone them
    let realSlides = Array.from(track.children);

    // Clone for end (append)
    realSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
    });

    // Clone for start (prepend)
    realSlides.slice().reverse().forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.classList.add('clone');
        track.insertBefore(clone, track.firstChild);
    });

    // Re-select all slides
    let allSlides = Array.from(track.children);
    const totalOriginalSlides = realSlides.length;
    let currentIndex = totalOriginalSlides; // Start at first real slide

    // Update carousel position
    const updateCarousel = (transition = true) => {
        if (!transition) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease-in-out';
        }

        if (allSlides.length === 0) return;

        const slideWidth = allSlides[0].offsetWidth;
        const containerWidth = document.querySelector('.carousel-container').getBoundingClientRect().width;

        const centerOffset = (containerWidth / 2) - (slideWidth / 2);
        const position = -(currentIndex * slideWidth) + centerOffset;

        track.style.transform = `translateX(${position}px)`;

        // Update active class
        allSlides.forEach(slide => slide.classList.remove('active'));
        if (allSlides[currentIndex]) {
            allSlides[currentIndex].classList.add('active');
        }

        // Update indicators
        const realIndex = (currentIndex - totalOriginalSlides) % totalOriginalSlides;
        const normalizedIndex = realIndex < 0 ? realIndex + totalOriginalSlides : realIndex;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === normalizedIndex);
        });
    };

    // Handle Infinite Loop
    const handleTransitionEnd = () => {
        if (currentIndex >= totalOriginalSlides * 2) {
            currentIndex = totalOriginalSlides;
            updateCarousel(false);
        }
        if (currentIndex < totalOriginalSlides) {
            currentIndex = totalOriginalSlides * 2 - 1;
            updateCarousel(false);
        }
    };

    // Remove old listener if any (not possible with anonymous function, but track is new so it's fine)
    track.addEventListener('transitionend', handleTransitionEnd);

    // Navigation functions
    const nextSlide = () => {
        if (currentIndex >= allSlides.length - 1) return;
        currentIndex++;
        updateCarousel();
    };

    const prevSlide = () => {
        if (currentIndex <= 0) return;
        currentIndex--;
        updateCarousel();
    };

    const goToSlide = (index) => {
        currentIndex = totalOriginalSlides + index;
        updateCarousel();
    };

    // Event listeners
    // We need to handle removing old listeners if we re-init.
    // Since we can't easily remove anonymous listeners, we'll clone the buttons to strip listeners
    // OR we just assume initCarousel is called once per filter change and we manage listeners globally?
    // Better: Clone buttons to clear listeners.

    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    newNextBtn.addEventListener('click', nextSlide);

    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    newPrevBtn.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard (Global listener - be careful not to add multiple)
    // We can't easily remove anonymous global listeners. 
    // Let's assign a named function to window and remove it?
    // Or just check a global flag?
    // For simplicity in this context, let's assume one global listener is fine, 
    // but it needs to call the *current* nextSlide/prevSlide.
    // We can attach the current handlers to the track element or a global object?
    // Let's use a module-level variable for the current handlers if we were in a module.
    // Here, let's just add the listener once on DOMContentLoaded and have it call a global 'currentCarousel' object.

    window.currentCarousel = { next: nextSlide, prev: prevSlide };

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.ontouchstart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
    };

    track.ontouchend = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    };

    // Initial update
    setTimeout(() => {
        updateCarousel(false);
    }, 50);

    // Resize
    window.onresize = () => updateCarousel(false);
}

// Global keyboard listener (added only once)
if (!window.carouselKeyboardInitialized) {
    document.addEventListener('keydown', (e) => {
        if (window.currentCarousel) {
            if (e.key === 'ArrowLeft') window.currentCarousel.prev();
            if (e.key === 'ArrowRight') window.currentCarousel.next();
        }
    });
    window.carouselKeyboardInitialized = true;
}

/**
 * Initialize Filters
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter slides
            let filteredSlides = [];
            if (filterValue === 'all') {
                filteredSlides = originalSlides;
            } else {
                filteredSlides = originalSlides.filter(slide =>
                    slide.getAttribute('data-categorie') === filterValue
                );
            }

            const track = document.querySelector('.carousel-track');
            const prevBtn = document.querySelector('.carousel-btn-prev');
            const nextBtn = document.querySelector('.carousel-btn-next');
            const indicatorsContainer = document.querySelector('.carousel-indicators');

            // Handle empty case
            if (filteredSlides.length === 0) {
                // Show message
                track.innerHTML = '<div class="no-projects-message" style="text-align:center; width:100%; padding: 3rem; color: var(--color-text-light); font-size: 1.1rem;">Aucune réalisation pour ce filtre.</div>';
                track.style.transform = 'none';
                track.style.transition = 'none';
                track.style.display = 'flex';
                track.style.justifyContent = 'center';

                // Hide controls
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (indicatorsContainer) indicatorsContainer.style.display = 'none';
            } else {
                // Reset styles
                track.style.display = 'flex';
                track.style.justifyContent = 'flex-start';

                // Show controls
                if (prevBtn) prevBtn.style.display = 'flex';
                if (nextBtn) nextBtn.style.display = 'flex';
                if (indicatorsContainer) indicatorsContainer.style.display = 'flex';

                // Re-init carousel
                initCarousel(filteredSlides);
            }
        });
    });
}
