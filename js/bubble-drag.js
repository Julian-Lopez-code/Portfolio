document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('photo-bubble');
    const hoop = document.getElementById('basketball-hoop');
    const fireworksContainer = document.getElementById('fireworks-container');
    if (!bubble || !hoop) return;

    let isDragging = false;
    let startX, startY;
    let currentX, currentY;

    const resetPosition = () => {
        bubble.classList.remove('falling', 'dragging');
        bubble.classList.add('returning');
        bubble.style.top = '20px';
        bubble.style.left = 'auto';
        bubble.style.right = '20px';
        bubble.style.bottom = 'auto';
        bubble.style.transform = '';

        setTimeout(() => {
            bubble.classList.remove('returning');
        }, 500);
    };

    const respawn = () => {
        bubble.classList.add('respawning');
        setTimeout(() => {
            bubble.classList.add('hidden');
            bubble.classList.remove('falling', 'respawning');

            // Reappear after 3 seconds
            setTimeout(() => {
                bubble.classList.remove('hidden');
                resetPosition();
            }, 3000);
        }, 300);
    };

    const triggerFireworks = () => {
        for (let i = 0; i < 50; i++) {
            createParticle();
        }
    };

    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.backgroundColor = color;
        particle.style.left = '50%';
        particle.style.top = '50%';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 5 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        fireworksContainer.appendChild(particle);

        let posX = window.innerWidth / 2;
        let posY = window.innerHeight / 2;
        let opacity = 1;

        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;

            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        requestAnimationFrame(animate);
    };

    const checkCollision = () => {
        const bRect = bubble.getBoundingClientRect();
        const hRect = hoop.getBoundingClientRect();

        // Horizontal check: bubble is roughly within the hoop's width
        const withinX = bRect.left + bRect.width / 2 > hRect.left &&
            bRect.left + bRect.width / 2 < hRect.right;

        // Vertical check: bubble is passing through the hoop's center
        const passingY = bRect.top + bRect.height / 2 > hRect.top &&
            bRect.top + bRect.height / 2 < hRect.bottom;

        return withinX && passingY;
    };

    const onStart = (e) => {
        if (bubble.classList.contains('falling')) return;

        isDragging = true;
        bubble.classList.add('dragging');
        hoop.classList.add('visible');

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const rect = bubble.getBoundingClientRect();
        startX = clientX - rect.left;
        startY = clientY - rect.top;

        bubble.style.right = 'auto';
        bubble.style.bottom = 'auto';
        bubble.style.left = rect.left + 'px';
        bubble.style.top = rect.top + 'px';
    };

    const onMove = (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        currentX = clientX - startX;
        currentY = clientY - startY;

        bubble.style.left = `${currentX}px`;
        bubble.style.top = `${currentY}px`;
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        bubble.classList.remove('dragging');
        hoop.classList.remove('visible');

        // Start falling physics
        bubble.classList.add('falling');
        const finalTop = window.innerHeight + 200;
        bubble.style.top = finalTop + 'px';

        // Collision detection loop during fall
        let scored = false;
        const checkInterval = setInterval(() => {
            if (checkCollision() && !scored) {
                scored = true;
                triggerFireworks();
            }

            const bRect = bubble.getBoundingClientRect();
            if (bRect.top > window.innerHeight) {
                clearInterval(checkInterval);
                respawn();
            }
        }, 50);
    };

    bubble.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    bubble.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
});
