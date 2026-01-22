// Internationalization (i18n) System
class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.loadTranslations();
    }

    async loadTranslations() {
        try {
            // Load English translations
            const enResponse = await fetch('../i18n/en.json');
            this.translations.en = await enResponse.json();
            
            // Load German translations
            const deResponse = await fetch('../i18n/de.json');
            this.translations.de = await deResponse.json();
            
            // Set language from localStorage or browser preference
            const savedLanguage = localStorage.getItem('language') || 
                                 navigator.language.split('-')[0] || 
                                 'en';
            this.setLanguage(savedLanguage);
        } catch (error) {
            console.error('Error loading translations:', error);
            this.setLanguage('en');
        }
    }

    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            this.updateUI();
            this.updateLanguageSelector();
        }
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English if key not found
                translation = this.translations.en;
                for (const fallbackKey of keys) {
                    if (translation && translation[fallbackKey]) {
                        translation = translation[fallbackKey];
                    } else {
                        return key; // Return key if not found
                    }
                }
                break;
            }
        }
        
        // Replace parameters in translation
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            for (const [param, value] of Object.entries(params)) {
                translation = translation.replace(`{{${param}}}`, value);
            }
        }
        
        return translation || key;
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Update page title
        const titleKey = document.title.toLowerCase().replace(/\s+/g, '.');
        document.title = this.t(titleKey) || document.title;
    }

    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.currentLanguage;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Initialize i18n system
const i18n = new I18n();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
