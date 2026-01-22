// Main Application Controller
class App {
    constructor() {
        this.currentPage = 'home';
        this.isInitialized = false;
        this.initialize();
    }

    async initialize() {
        try {
            // Wait for i18n to load
            await this.waitForI18n();
            
            // Initialize components
            this.setupNavigation();
            this.setupEventListeners();
            this.loadInitialContent();
            
            // Update UI
            this.updateStats();
            
            this.isInitialized = true;
            console.log('Dao Yu Learning Platform initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    async waitForI18n() {
        // Wait for i18n system to be ready
        const maxWaitTime = 5000; // 5 seconds
        const startTime = Date.now();
        
        while (!i18n.translations.en && (Date.now() - startTime) < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!i18n.translations.en) {
            console.warn('i18n failed to load, using fallback');
        }
    }

    setupNavigation() {
        // Handle navigation clicks
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToPage(targetId);
            });
        });

        // Handle hero CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.navigateToPage('courses');
            });
        }
    }

    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.showPage(e.state.page, false);
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Connection lost', 'error');
        });

        // Handle visibility change (pause/resume activities)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseActivities();
            } else {
                this.resumeActivities();
            }
        });
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showQuickSearch();
        }

        // Ctrl/Cmd + / for keyboard shortcuts help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            this.showKeyboardShortcuts();
        }

        // Number keys for quick navigation
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const pages = ['home', 'courses', 'shop', 'leaderboard', 'profile'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex]) {
                this.navigateToPage(pages[pageIndex]);
            }
        }
    }

    navigateToPage(pageId) {
        if (pageId === this.currentPage) return;

        // Update history
        history.pushState({ page: pageId }, '', `#${pageId}`);
        
        // Show page
        this.showPage(pageId);
    }

    showPage(pageId, updateHistory = true) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentPage = pageId;
            
            // Load page-specific content
            this.loadPageContent(pageId);
            
            // Update active navigation
            this.updateActiveNavigation(pageId);
            
            // Update page title
            this.updatePageTitle(pageId);
        }
    }

    loadPageContent(pageId) {
        switch (pageId) {
            case 'courses':
                coursesSystem.renderCourses();
                break;
            case 'shop':
                shopSystem.renderShop();
                break;
            case 'leaderboard':
                leaderboardSystem.renderLeaderboard();
                break;
            case 'profile':
                profileSystem.renderProfile();
                break;
            case 'home':
                this.updateStats();
                break;
        }
    }

    loadInitialContent() {
        // Load initial page based on hash or default to home
        const hash = window.location.hash.substring(1) || 'home';
        this.showPage(hash, false);
    }

    updateActiveNavigation(pageId) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
    }

    updatePageTitle(pageId) {
        const titles = {
            home: 'Home',
            courses: 'Courses',
            shop: 'Shop',
            leaderboard: 'Leaderboard',
            profile: 'Profile'
        };
        
        const title = titles[pageId] || 'Dao Yu Learning Platform';
        document.title = `${title} - Dao Yu Learning Platform`;
    }

    updateStats() {
        // Update user stats on home page
        const pointsElement = document.getElementById('user-points');
        const levelElement = document.getElementById('user-level');
        const streakElement = document.getElementById('user-streak');

        if (pointsElement) pointsElement.textContent = gamification.userData.points.toLocaleString();
        if (levelElement) levelElement.textContent = gamification.userData.level;
        if (streakElement) streakElement.textContent = gamification.userData.streak;
    }

    showQuickSearch() {
        // Create quick search modal
        const modal = document.createElement('div');
        modal.className = 'modal quick-search-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="search-header">
                    <input type="text" id="quick-search-input" placeholder="Search courses, topics, lessons..." autofocus>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="search-results" id="search-results">
                    <div class="search-placeholder">Start typing to search...</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus input
        const input = document.getElementById('quick-search-input');
        input.focus();

        // Handle search
        input.addEventListener('input', (e) => {
            this.performQuickSearch(e.target.value);
        });

        // Handle escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });

        // Handle click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    performQuickSearch(query) {
        const resultsContainer = document.getElementById('search-results');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '<div class="search-placeholder">Start typing to search...</div>';
            return;
        }

        // Search courses
        const courses = coursesSystem.courses.filter(course => 
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.description.toLowerCase().includes(query.toLowerCase())
        );

        // Search topics
        const topics = [];
        coursesSystem.courses.forEach(course => {
            course.topics.forEach(topic => {
                if (topic.title.toLowerCase().includes(query.toLowerCase()) ||
                    topic.description.toLowerCase().includes(query.toLowerCase())) {
                    topics.push({ ...topic, courseTitle: course.title, courseId: course.id });
                }
            });
        });

        // Render results
        let resultsHTML = '';

        if (courses.length > 0) {
            resultsHTML += '<div class="search-section"><h4>Courses</h4>';
            courses.forEach(course => {
                resultsHTML += `
                    <div class="search-result" onclick="app.navigateToPage('courses'); coursesSystem.openCourse('${course.id}')">
                        <span class="result-icon">${course.icon}</span>
                        <div class="result-info">
                            <div class="result-title">${course.title}</div>
                            <div class="result-description">${course.description}</div>
                        </div>
                    </div>
                `;
            });
            resultsHTML += '</div>';
        }

        if (topics.length > 0) {
            resultsHTML += '<div class="search-section"><h4>Topics</h4>';
            topics.forEach(topic => {
                resultsHTML += `
                    <div class="search-result" onclick="app.navigateToPage('courses'); coursesSystem.openCourse('${topic.courseId}')">
                        <span class="result-icon">📚</span>
                        <div class="result-info">
                            <div class="result-title">${topic.title}</div>
                            <div class="result-description">${topic.courseTitle} - ${topic.description}</div>
                        </div>
                    </div>
                `;
            });
            resultsHTML += '</div>';
        }

        if (resultsHTML === '') {
            resultsHTML = '<div class="search-placeholder">No results found</div>';
        }

        resultsContainer.innerHTML = resultsHTML;
    }

    showKeyboardShortcuts() {
        const modal = document.createElement('div');
        modal.className = 'modal keyboard-shortcuts-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Keyboard Shortcuts</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="shortcuts-list">
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>K</kbd>
                            <span>Quick Search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Alt</kbd> + <kbd>1-5</kbd>
                            <span>Quick Navigation</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>/</kbd>
                            <span>Show Shortcuts</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd>
                            <span>Close Modal</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        // Use gamification system for notifications
        gamification.showNotification(message, type);
    }

    pauseActivities() {
        // Pause any ongoing activities when tab is hidden
        console.log('Pausing activities...');
    }

    resumeActivities() {
        // Resume activities when tab becomes visible again
        console.log('Resuming activities...');
        this.updateStats();
    }

    // Utility methods
    formatNumber(num) {
        return num.toLocaleString();
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        this.showNotification('Something went wrong. Please try again.', 'error');
    }

    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Handle page refresh
window.addEventListener('beforeunload', () => {
    // Save any unsaved data
    localStorage.setItem('lastVisit', new Date().toISOString());
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
