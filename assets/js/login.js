/**
 * Dao-Yu-101 Login Page - Client-side Authentication
 *
 * This script handles:
 * - Form validation
 * - Mock authentication against users.json
 * - Session management using localStorage
 * - Role-based redirection
 * - Password visibility toggle
 * - Error handling and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const loginButton = document.getElementById('login-button');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const loginError = document.getElementById('login-error');

    // Mock user data - in production this would come from an API
    // For static phase, we'll load from users.json
    let usersData = [];

    /**
     * Load user data from JSON file
     */
    async function loadUserData() {
        try {
            const response = await fetch('assets/data/users.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            usersData = data.users || [];
            console.log('User data loaded successfully');
        } catch (error) {
            console.error('Error loading user data:', error);
            // Fallback: Use hardcoded mock data if JSON loading fails
            usersData = [
                {
                    id: 1,
                    username: "admin",
                    password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // sha256 of "admin123"
                    role: "admin",
                    status: "active",
                    created_at: "2026-01-01T00:00:00Z"
                },
                {
                    id: 2,
                    username: "student",
                    password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // sha256 of "student123"
                    role: "student",
                    status: "active",
                    created_at: "2026-01-01T00:00:00Z"
                }
            ];
        }
    }

    /**
     * Validate username input
     * @param {string} username - Username to validate
     * @returns {boolean} - True if valid
     */
    function validateUsername(username) {
        if (!username || username.trim().length === 0) {
            showError(usernameError, 'Benutzername ist erforderlich');
            return false;
        }

        if (username.trim().length < 4) {
            showError(usernameError, 'Benutzername muss mindestens 4 Zeichen enthalten');
            return false;
        }

        clearError(usernameError);
        return true;
    }

    /**
     * Validate password input
     * @param {string} password - Password to validate
     * @returns {boolean} - True if valid
     */
    function validatePassword(password) {
        if (!password || password.length === 0) {
            showError(passwordError, 'Passwort ist erforderlich');
            return false;
        }

        if (password.length < 8) {
            showError(passwordError, 'Passwort muss mindestens 8 Zeichen enthalten');
            return false;
        }

        clearError(passwordError);
        return true;
    }

    /**
     * Hash password using SHA-256 (simplified for demo)
     * In production, use proper cryptographic libraries
     * @param {string} password - Password to hash
     * @returns {Promise<string>} - Hashed password
     */
    async function hashPassword(password) {
        // Simple SHA-256 implementation for demo purposes
        // In production, use crypto.subtle.digest or a proper library
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Authenticate user against mock data
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise<object|null>} - User object if authenticated, null otherwise
     */
    async function authenticateUser(username, password) {
        try {
            const hashedPassword = await hashPassword(password);
            const user = usersData.find(u =>
                u.username === username &&
                u.password === hashedPassword &&
                u.status === 'active'
            );
            return user || null;
        } catch (error) {
            console.error('Authentication error:', error);
            return null;
        }
    }

    /**
     * Show error message
     * @param {HTMLElement} element - Error element
     * @param {string} message - Error message
     */
    function showError(element, message) {
        element.textContent = message;
        element.classList.add('visible');
        element.setAttribute('aria-live', 'assertive');
    }

    /**
     * Clear error message
     * @param {HTMLElement} element - Error element
     */
    function clearError(element) {
        element.textContent = '';
        element.classList.remove('visible');
        element.removeAttribute('aria-live');
    }

    /**
     * Clear all error messages
     */
    function clearAllErrors() {
        clearError(usernameError);
        clearError(passwordError);
        clearError(loginError);
    }

    /**
     * Save authentication session to localStorage
     * @param {object} user - User object
     */
    function saveAuthSession(user) {
        const authData = {
            isAuthenticated: true,
            userId: user.id,
            username: user.username,
            role: user.role,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('daoYuAuth', JSON.stringify(authData));
        console.log('Authentication session saved');
    }

    /**
     * Redirect based on user role
     * @param {string} role - User role
     */
    function redirectByRole(role) {
        let redirectUrl;

        switch (role) {
            case 'admin':
                redirectUrl = 'admin-dashboard.html';
                break;
            case 'student':
                redirectUrl = 'student-dashboard.html';
                break;
            case 'teacher':
                redirectUrl = 'teacher-dashboard.html';
                break;
            default:
                redirectUrl = 'index.html';
        }

        // For static phase, we'll simulate the redirect
        // In production, this would be a real redirect
        console.log(`Redirecting to ${redirectUrl} for role: ${role}`);

        // Show success message and simulate redirect
        loginError.textContent = `Erfolgreich angemeldet! Weiterleitung als ${role}...`;
        loginError.style.color = 'var(--success-color)';
        loginError.classList.add('visible');

        // Simulate redirect after 2 seconds
        setTimeout(() => {
            // In a real implementation, we would use:
            // window.location.href = redirectUrl;
            alert(`Weiterleitung zu ${redirectUrl} (simuliert für statische Phase)`);
            loginForm.reset();
            clearAllErrors();
        }, 2000);
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     */
    async function handleSubmit(e) {
        e.preventDefault();
        clearAllErrors();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        const isUsernameValid = validateUsername(username);
        const isPasswordValid = validatePassword(password);

        if (!isUsernameValid || !isPasswordValid) {
            return;
        }

        // Disable button during authentication
        loginButton.disabled = true;
        loginButton.textContent = 'Anmeldung läuft...';

        try {
            // Authenticate user
            const user = await authenticateUser(username, password);

            if (user) {
                // Save session and redirect
                saveAuthSession(user);
                redirectByRole(user.role);
            } else {
                showError(loginError, 'Ungültiger Benutzername oder Passwort');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(loginError, 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        } finally {
            // Re-enable button
            loginButton.disabled = false;
            loginButton.textContent = 'Anmelden';
        }
    }

    /**
     * Toggle password visibility
     */
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Update button aria-label
        const label = type === 'password' ? 'Passwort anzeigen' : 'Passwort ausblenden';
        togglePasswordBtn.setAttribute('aria-label', label);
    }

    /**
     * Initialize the login page
     */
    async function init() {
        // Load user data
        await loadUserData();

        // Set up event listeners
        if (loginForm) {
            loginForm.addEventListener('submit', handleSubmit);
        }

        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        }

        // Auto-focus username field
        if (usernameInput) {
            usernameInput.focus();
        }

        // Real-time validation
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => validateUsername(usernameInput.value.trim()));
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => validatePassword(passwordInput.value));
        }

        console.log('Login page initialized');
    }

    // Start the application
    init();
});
