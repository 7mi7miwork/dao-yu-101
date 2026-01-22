// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = 'minecraft-overworld';
        this.isNightMode = false;
        this.themeStylesheets = {};
        this.loadThemeSettings();
    }

    loadThemeSettings() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'minecraft-overworld';
        const savedNightMode = localStorage.getItem('nightMode') === 'true';
        
        this.setTheme(savedTheme);
        this.setNightMode(savedNightMode);
    }

    setTheme(themeName) {
        // Remove all theme stylesheets
        Object.values(this.themeStylesheets).forEach(stylesheet => {
            if (stylesheet && stylesheet.parentNode) {
                stylesheet.disabled = true;
            }
        });

        // Load new theme
        const themePath = `themes/${themeName}.css`;
        let stylesheet = document.querySelector(`link[href="${themePath}"]`);
        
        if (!stylesheet) {
            stylesheet = document.createElement('link');
            stylesheet.rel = 'stylesheet';
            stylesheet.href = themePath;
            document.head.appendChild(stylesheet);
        }
        
        stylesheet.disabled = false;
        this.themeStylesheets[themeName] = stylesheet;
        this.currentTheme = themeName;
        
        // Save to localStorage
        localStorage.setItem('theme', themeName);
        
        // Update theme selector
        const selector = document.getElementById('theme-selector');
        if (selector) {
            selector.value = themeName;
        }
        
        // Apply theme-specific adjustments
        this.applyThemeAdjustments(themeName);
    }

    setNightMode(isNight) {
        this.isNightMode = isNight;
        const body = document.body;
        
        if (isNight) {
            body.classList.add('night-mode');
            document.getElementById('theme-toggle').textContent = '☀️';
        } else {
            body.classList.remove('night-mode');
            document.getElementById('theme-toggle').textContent = '🌙';
        }
        
        localStorage.setItem('nightMode', isNight);
    }

    toggleNightMode() {
        this.setNightMode(!this.isNightMode);
    }

    applyThemeAdjustments(themeName) {
        const body = document.body;
        
        // Remove all theme classes
        body.classList.remove('minecraft-theme', 'programming-theme', 'nether-theme', 'end-theme');
        
        // Apply theme-specific classes and effects
        if (themeName.startsWith('minecraft-')) {
            body.classList.add('minecraft-theme');
            
            if (themeName === 'minecraft-nether') {
                body.classList.add('nether-theme');
                this.addNetherParticles();
            } else if (themeName === 'minecraft-end') {
                body.classList.add('end-theme');
                this.addEndParticles();
            } else {
                this.removeSpecialParticles();
            }
        } else if (themeName.startsWith('programming-')) {
            body.classList.add('programming-theme');
            this.removeSpecialParticles();
        }
    }

    addNetherParticles() {
        this.removeSpecialParticles();
        
        const particles = document.createElement('div');
        particles.className = 'nether-particles';
        document.body.appendChild(particles);
    }

    addEndParticles() {
        this.removeSpecialParticles();
        
        const particles = document.createElement('div');
        particles.className = 'end-particles';
        document.body.appendChild(particles);
    }

    removeSpecialParticles() {
        const existing = document.querySelector('.nether-particles, .end-particles');
        if (existing) {
            existing.remove();
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isCurrentlyNightMode() {
        return this.isNightMode;
    }

    getAvailableThemes() {
        return [
            {
                id: 'minecraft-overworld',
                name: 'Minecraft - Overworld',
                category: 'minecraft',
                description: 'Classic Minecraft overworld theme'
            },
            {
                id: 'minecraft-nether',
                name: 'Minecraft - Nether',
                category: 'minecraft',
                description: 'Fiery Nether dimension theme'
            },
            {
                id: 'minecraft-end',
                name: 'Minecraft - The End',
                category: 'minecraft',
                description: 'Mysterious End dimension theme'
            },
            {
                id: 'programming-python',
                name: 'Python',
                category: 'programming',
                description: 'Python programming language theme'
            },
            {
                id: 'programming-javascript',
                name: 'JavaScript',
                category: 'programming',
                description: 'JavaScript programming language theme'
            },
            {
                id: 'programming-rust',
                name: 'Rust',
                category: 'programming',
                description: 'Rust programming language theme'
            }
        ];
    }

    // Theme transition effects
    transitionToTheme(newTheme) {
        const body = document.body;
        
        // Add transition class
        body.classList.add('theme-transitioning');
        
        setTimeout(() => {
            this.setTheme(newTheme);
            
            // Remove transition class after theme is applied
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, 50);
        }, 100);
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            i18n.setLanguage(e.target.value);
        });
    }
    
    // Theme selector
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            themeManager.transitionToTheme(e.target.value);
        });
    }
    
    // Night mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggleNightMode();
        });
    }
});

// Add CSS for theme transitions
const style = document.createElement('style');
style.textContent = `
    .theme-transitioning {
        transition: all 0.3s ease-in-out;
    }
    
    .theme-transitioning * {
        transition: all 0.3s ease-in-out !important;
    }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
