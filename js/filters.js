/**
 * Filters JavaScript
 * Handles filtering of project cards based on categories
 */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
});

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || cards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-categorie');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    // Small timeout to allow display:block to apply before opacity transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // Match transition duration
                }
            });
        });
    });
}
