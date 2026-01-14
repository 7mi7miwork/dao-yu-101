document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.nav-list');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.style.display = isExpanded ? 'none' : 'flex';
        });
    }

    // Load Features from JSON
    function loadFeatures() {
        const featuresGrid = document.getElementById('features-grid');

        if (!featuresGrid) {
            console.error('Features grid element not found');
            return;
        }

        fetch('assets/data/features.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data.features || !Array.isArray(data.features)) {
                    throw new Error('Invalid features data format');
                }

                // Clear loading message
                featuresGrid.innerHTML = '';

                // Create feature cards
                data.features.forEach(feature => {
                    const featureCard = document.createElement('div');
                    featureCard.className = 'feature-card';
                    featureCard.setAttribute('role', 'article');
                    featureCard.setAttribute('aria-labelledby', `feature-${feature.id}-title`);

                    featureCard.innerHTML = `
                        <div class="feature-icon" aria-hidden="true">📚</div>
                        <h3 id="feature-${feature.id}-title">${feature.title}</h3>
                        <p>${feature.description}</p>
                    `;

                    featuresGrid.appendChild(featureCard);
                });
            })
            .catch(error => {
                console.error('Error loading features:', error);
                featuresGrid.innerHTML = '<div class="error">Fehler beim Laden der Features. Bitte versuchen Sie es später erneut.</div>';
            });
    }

    // Initialize the page
    function init() {
        loadFeatures();

        // Add smooth scrolling for anchor links
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

    // Start the application
    init();
});
