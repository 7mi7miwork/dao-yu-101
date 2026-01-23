// Dao-Yu-101 - Navigation JavaScript

// Navigation state
const NavigationState = {
    currentPage: 'home',
    breadcrumbs: []
};

// Initialize Navigation
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    updateActiveNav();
});

function initializeNavigation() {
    // Handle navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                updateActiveNav();
            }
        });
    });
    
    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        updateActiveNav();
    });
}

function updateActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        
        if (href && currentPath.includes(href)) {
            link.classList.add('active');
        } else if (currentPath === '/' && href === 'index.html') {
            link.classList.add('active');
        } else if (currentPath.endsWith('index.html') && href === 'index.html') {
            link.classList.add('active');
        }
    });
    
    // Update page title
    updatePageTitle();
}

function updatePageTitle() {
    const path = window.location.pathname;
    let title = 'Dao-Yu-101 | Structured Learning Platform';
    
    if (path.includes('dashboard.html')) {
        const role = AppState.currentRole || 'Student';
        title = `Dao-Yu-101 | ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`;
    } else if (path.includes('archipelagos.html')) {
        title = 'Dao-Yu-101 | Archipelagos';
    } else if (path.includes('lessons.html')) {
        title = 'Dao-Yu-101 | Lessons';
    } else if (path.includes('lesson-detail.html')) {
        title = 'Dao-Yu-101 | Lesson';
    }
    
    document.title = title;
}

// Breadcrumb navigation
function updateBreadcrumbs(items) {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    if (!breadcrumbContainer) return;
    
    let html = '<div class="lesson-breadcrumb">';
    
    items.forEach((item, index) => {
        html += '<div class="breadcrumb-item">';
        
        if (item.url && index < items.length - 1) {
            html += `<a href="${item.url}" class="breadcrumb-link">${item.label}</a>`;
        } else {
            html += `<span>${item.label}</span>`;
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    breadcrumbContainer.innerHTML = html;
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Export functions
window.NavigationState = NavigationState;
window.updateBreadcrumbs = updateBreadcrumbs;
window.scrollToElement = scrollToElement;
window.toggleMobileMenu = toggleMobileMenu;