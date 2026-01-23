// Dao-Yu-101 - Main Application JavaScript

// App State Management
const AppState = {
    currentUser: null,
    currentRole: null,
    isAuthenticated: false,
    data: {
        archipelagos: [],
        islands: [],
        lessons: [],
        validationRecords: [],
        xpRecords: [],
        badges: []
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Dao-Yu-101 Application Initialized');
    loadMockData();
    checkAuthentication();
    initializeEventListeners();
    renderCurrentPage();
}

// Load Mock Data for Demo
function loadMockData() {
    AppState.data.archipelagos = [
        {
            id: 'arch-1',
            name: 'Mathematics',
            description: 'Master mathematical concepts from arithmetic to calculus',
            icon: '📐',
            islands: 4
        },
        {
            id: 'arch-2',
            name: 'Science',
            description: 'Explore the natural world through physics, chemistry, and biology',
            icon: '🔬',
            islands: 3
        },
        {
            id: 'arch-3',
            name: 'Programming',
            description: 'Learn to code from basics to advanced algorithms',
            icon: '💻',
            islands: 5
        },
        {
            id: 'arch-4',
            name: 'Language Arts',
            description: 'Develop reading, writing, and communication skills',
            icon: '📚',
            islands: 3
        }
    ];

    AppState.data.islands = [
        {
            id: 'island-1',
            archipelago_id: 'arch-1',
            name: 'Arithmetic Fundamentals',
            description: 'Learn the basics of numbers, addition, subtraction, multiplication, and division',
            lesson_count: 15,
            completed_lessons: 3
        },
        {
            id: 'island-2',
            archipelago_id: 'arch-1',
            name: 'Fractions & Decimals',
            description: 'Master working with fractions, decimals, and percentages',
            lesson_count: 15,
            completed_lessons: 0
        },
        {
            id: 'island-3',
            archipelago_id: 'arch-2',
            name: 'Introduction to Physics',
            description: 'Understand basic physics concepts like force, motion, and energy',
            lesson_count: 15,
            completed_lessons: 0
        },
        {
            id: 'island-4',
            archipelago_id: 'arch-3',
            name: 'Python Basics',
            description: 'Learn fundamental programming concepts using Python',
            lesson_count: 15,
            completed_lessons: 0
        }
    ];

    AppState.data.lessons = [
        {
            id: 'lesson-1',
            island_id: 'island-1',
            sort_order: 1,
            name: 'Numbers and Counting',
            description: 'Learn to count, identify numbers, and understand basic number concepts',
            validation_type: 'automated',
            status: 'completed'
        },
        {
            id: 'lesson-2',
            island_id: 'island-1',
            sort_order: 2,
            name: 'Basic Addition',
            description: 'Master addition with single-digit numbers',
            validation_type: 'automated',
            status: 'completed'
        },
        {
            id: 'lesson-3',
            island_id: 'island-1',
            sort_order: 3,
            name: 'Basic Subtraction',
            description: 'Learn to subtract single-digit numbers',
            validation_type: 'automated',
            status: 'completed'
        },
        {
            id: 'lesson-4',
            island_id: 'island-1',
            sort_order: 4,
            name: 'Addition with Larger Numbers',
            description: 'Practice addition with two-digit numbers',
            validation_type: 'automated',
            status: 'unlocked'
        },
        {
            id: 'lesson-5',
            island_id: 'island-1',
            sort_order: 5,
            name: 'Subtraction with Larger Numbers',
            description: 'Practice subtraction with two-digit numbers',
            validation_type: 'automated',
            status: 'locked'
        },
        {
            id: 'lesson-6',
            island_id: 'island-1',
            sort_order: 6,
            name: 'Introduction to Multiplication',
            description: 'Learn the concept of multiplication as repeated addition',
            validation_type: 'automated',
            status: 'locked'
        },
        {
            id: 'lesson-7',
            island_id: 'island-1',
            sort_order: 7,
            name: 'Multiplication Facts',
            description: 'Memorize multiplication tables up to 10',
            validation_type: 'automated',
            status: 'locked'
        },
        {
            id: 'lesson-8',
            island_id: 'island-1',
            sort_order: 8,
            name: 'Introduction to Division',
            description: 'Understand division as the inverse of multiplication',
            validation_type: 'automated',
            status: 'locked'
        },
        {
            id: 'lesson-9',
            island_id: 'island-1',
            sort_order: 9,
            name: 'Division Facts',
            description: 'Practice division problems related to multiplication',
            validation_type: 'automated',
            status: 'locked'
        },
        {
            id: 'lesson-10',
            island_id: 'island-1',
            sort_order: 10,
            name: 'Word Problems: Addition & Subtraction',
            description: 'Solve real-world problems using addition and subtraction',
            validation_type: 'both',
            status: 'locked'
        }
    ];

    AppState.data.badges = [
        {
            id: 'badge-1',
            name: 'First Steps',
            description: 'Complete your first lesson',
            icon: '🎯',
            earned: true
        },
        {
            id: 'badge-2',
            name: '3-Day Streak',
            description: 'Maintain a learning streak for 3 consecutive days',
            icon: '🔥',
            earned: false
        },
        {
            id: 'badge-3',
            name: 'Arithmetic Beginner',
            description: 'Complete first 5 arithmetic lessons',
            icon: '📊',
            earned: false
        }
    ];

    console.log('Mock data loaded');
}

// Authentication Functions
function checkAuthentication() {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user_data');
    
    if (token && user) {
        AppState.isAuthenticated = true;
        AppState.currentUser = JSON.parse(user);
        AppState.currentRole = AppState.currentUser.role;
        updateAuthUI();
    }
}

function login(role) {
    // Simulate login
    const user = {
        id: 'user-' + Date.now(),
        name: 'Demo User',
        email: 'demo@daoyu101.com',
        role: role,
        xp: 1250
    };
    
    const token = 'demo-token-' + Date.now();
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    
    AppState.isAuthenticated = true;
    AppState.currentUser = user;
    AppState.currentRole = role;
    
    updateAuthUI();
    showNotification('Welcome back, ' + user.name + '!', 'success');
    
    // Redirect based on role
    setTimeout(() => {
        window.location.href = 'pages/dashboard.html';
    }, 500);
}

function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    AppState.isAuthenticated = false;
    AppState.currentUser = null;
    AppState.currentRole = null;
    
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 500);
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (AppState.isAuthenticated) {
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.onclick = () => window.location.href = 'pages/dashboard.html';
        }
        if (signupBtn) {
            signupBtn.textContent = 'Logout';
            signupBtn.style.display = 'inline-flex';
            signupBtn.onclick = logout;
        }
    } else {
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.onclick = () => showLoginModal();
        }
        if (signupBtn) {
            signupBtn.textContent = 'Sign Up';
            signupBtn.style.display = 'none';
        }
    }
}

function showLoginModal() {
    // Create login modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Welcome to Dao-Yu-101</h2>
            <p>Select your role to continue:</p>
            <div class="login-options">
                <button class="btn btn-primary btn-large login-option" data-role="student">
                    <span class="login-icon">🎓</span>
                    <span>Student</span>
                </button>
                <button class="btn btn-outline btn-large login-option" data-role="teacher">
                    <span class="login-icon">👨‍🏫</span>
                    <span>Teacher</span>
                </button>
                <button class="btn btn-outline btn-large login-option" data-role="parent">
                    <span class="login-icon">👨‍👩‍👧</span>
                    <span>Parent</span>
                </button>
                <button class="btn btn-outline btn-large login-option" data-role="admin">
                    <span class="login-icon">⚙️</span>
                    <span>Admin</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    modal.querySelectorAll('.login-option').forEach(btn => {
        btn.onclick = () => {
            const role = btn.dataset.role;
            modal.remove();
            login(role);
        };
    });
}

// Event Listeners
function initializeEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && !AppState.isAuthenticated) {
        loginBtn.onclick = showLoginModal;
    }
    
    // Signup button
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn && AppState.isAuthenticated) {
        signupBtn.onclick = logout;
    }
}

// Render Current Page
function renderCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        renderDashboard();
    } else if (path.includes('archipelagos.html')) {
        renderArchipelagos();
    } else if (path.includes('lessons.html')) {
        renderLessons();
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getArchipelagoById(id) {
    return AppState.data.archipelagos.find(a => a.id === id);
}

function getIslandById(id) {
    return AppState.data.islands.find(i => i.id === id);
}

function getLessonById(id) {
    return AppState.data.lessons.find(l => l.id === id);
}

function getLessonsByIsland(islandId) {
    return AppState.data.lessons.filter(l => l.island_id === islandId);
}

function getIslandsByArchipelago(archipelagoId) {
    return AppState.data.islands.filter(i => i.archipelago_id === archipelagoId);
}

// Export functions for other modules
window.AppState = AppState;
window.showNotification = showNotification;
window.getArchipelagoById = getArchipelagoById;
window.getIslandById = getIslandById;
window.getLessonById = getLessonById;
window.getLessonsByIsland = getLessonsByIsland;
window.getIslandsByArchipelago = getIslandsByArchipelago;
window.formatDate = formatDate;