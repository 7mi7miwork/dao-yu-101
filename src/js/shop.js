// Shop System
class ShopSystem {
    constructor() {
        this.courses = this.loadShopCourses();
        this.bundles = this.loadBundles();
        this.promotions = this.loadPromotions();
    }

    loadShopCourses() {
        return [
            {
                id: 'programming-basics',
                title: 'Programming Basics',
                description: 'Learn the fundamentals of programming with hands-on exercises',
                price: 0,
                originalPrice: 29.99,
                category: 'beginner',
                rating: 4.8,
                students: 15420,
                duration: '8 hours',
                level: 'Beginner',
                features: [
                    '15 lessons per topic',
                    '3 comprehensive topics',
                    'Hands-on exercises',
                    'Certificate of completion',
                    'Lifetime access'
                ],
                badge: '🔥 Popular',
                discount: 100
            },
            {
                id: 'web-development',
                title: 'Web Development Mastery',
                description: 'Build modern, responsive web applications from scratch',
                price: 29.99,
                originalPrice: 49.99,
                category: 'intermediate',
                rating: 4.9,
                students: 12350,
                duration: '12 hours',
                level: 'Intermediate',
                features: [
                    'HTML5 & CSS3',
                    'JavaScript ES6+',
                    'React framework',
                    'Real projects',
                    'Portfolio building'
                ],
                badge: '⭐ Bestseller',
                discount: 40
            },
            {
                id: 'data-science',
                title: 'Data Science Fundamentals',
                description: 'Master data analysis, visualization, and machine learning basics',
                price: 49.99,
                originalPrice: 79.99,
                category: 'advanced',
                rating: 4.7,
                students: 8920,
                duration: '16 hours',
                level: 'Advanced',
                features: [
                    'Statistics & probability',
                    'Python for data science',
                    'Machine learning basics',
                    'Data visualization',
                    'Real-world projects'
                ],
                badge: '🚀 Trending',
                discount: 38
            },
            {
                id: 'game-development',
                title: 'Game Development with Unity',
                description: 'Create your own games using Unity game engine',
                price: 39.99,
                originalPrice: 59.99,
                category: 'intermediate',
                rating: 4.6,
                students: 6780,
                duration: '14 hours',
                level: 'Intermediate',
                features: [
                    'Unity interface',
                    'C# programming',
                    '2D & 3D game development',
                    'Physics and animations',
                    'Publishing games'
                ],
                badge: '🎮 Gaming',
                discount: 33
            },
            {
                id: 'cybersecurity',
                title: 'Cybersecurity Essentials',
                description: 'Learn to protect systems and networks from cyber threats',
                price: 59.99,
                originalPrice: 89.99,
                category: 'advanced',
                rating: 4.8,
                students: 4560,
                duration: '18 hours',
                level: 'Advanced',
                features: [
                    'Security fundamentals',
                    'Network security',
                    'Ethical hacking',
                    'Risk assessment',
                    'Compliance standards'
                ],
                badge: '🔒 Security',
                discount: 33
            },
            {
                id: 'mobile-development',
                title: 'Mobile App Development',
                description: 'Build native mobile apps for iOS and Android',
                price: 44.99,
                originalPrice: 69.99,
                category: 'intermediate',
                rating: 4.5,
                students: 7890,
                duration: '15 hours',
                level: 'Intermediate',
                features: [
                    'React Native',
                    'Flutter basics',
                    'App deployment',
                    'UI/UX design',
                    'App store optimization'
                ],
                badge: '📱 Mobile',
                discount: 36
            }
        ];
    }

    loadBundles() {
        return [
            {
                id: 'starter-bundle',
                title: 'Starter Bundle',
                description: 'Perfect for beginners',
                courses: ['programming-basics', 'web-development'],
                price: 24.99,
                originalPrice: 49.99,
                savings: 25.00,
                badge: '💰 Best Value'
            },
            {
                id: 'professional-bundle',
                title: 'Professional Bundle',
                description: 'Complete skill set for professionals',
                courses: ['web-development', 'data-science', 'mobile-development'],
                price: 99.99,
                originalPrice: 164.97,
                savings: 64.98,
                badge: '🎯 Professional'
            },
            {
                id: 'ultimate-bundle',
                title: 'Ultimate Bundle',
                description: 'All courses - maximum learning',
                courses: ['programming-basics', 'web-development', 'data-science', 'game-development', 'cybersecurity', 'mobile-development'],
                price: 149.99,
                originalPrice: 274.95,
                savings: 124.96,
                badge: '👑 Ultimate'
            }
        ];
    }

    loadPromotions() {
        return [
            {
                id: 'flash-sale',
                title: 'Flash Sale!',
                description: 'Get 50% off on selected courses',
                discount: 50,
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                applicableCourses: ['web-development', 'mobile-development']
            },
            {
                id: 'student-discount',
                title: 'Student Discount',
                description: 'Extra 20% off for students',
                discount: 20,
                code: 'STUDENT20',
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        ];
    }

    renderShop() {
        const container = document.getElementById('shop-container');
        if (!container) return;

        const userData = gamification.userData;
        const ownedCourses = userData.ownedCourses;

        container.innerHTML = `
            <div class="shop-content">
                <div class="shop-filters">
                    <h3>Filter Courses</h3>
                    <div class="filter-options">
                        <button class="filter-btn active" data-filter="all">All Courses</button>
                        <button class="filter-btn" data-filter="beginner">Beginner</button>
                        <button class="filter-btn" data-filter="intermediate">Intermediate</button>
                        <button class="filter-btn" data-filter="advanced">Advanced</button>
                        <button class="filter-btn" data-filter="free">Free</button>
                    </div>
                </div>

                <div class="shop-promotions">
                    ${this.renderPromotions()}
                </div>

                <div class="shop-bundles">
                    <h3>Course Bundles</h3>
                    <div class="bundles-grid">
                        ${this.bundles.map(bundle => this.renderBundle(bundle, ownedCourses)).join('')}
                    </div>
                </div>

                <div class="shop-courses">
                    <h3>Individual Courses</h3>
                    <div class="courses-grid">
                        ${this.courses.map(course => this.renderCourse(course, ownedCourses)).join('')}
                    </div>
                </div>
            </div>
        `;

        this.attachFilterListeners();
    }

    renderPromotions() {
        const activePromotions = this.promotions.filter(promo => 
            new Date() < promo.validUntil
        );

        if (activePromotions.length === 0) return '';

        return `
            <div class="promotions-banner">
                ${activePromotions.map(promo => `
                    <div class="promotion-card">
                        <h4>${promo.title}</h4>
                        <p>${promo.description}</p>
                        ${promo.code ? `<span class="promo-code">Code: ${promo.code}</span>` : ''}
                        <small>Valid until: ${promo.validUntil.toLocaleDateString()}</small>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderBundle(bundle, ownedCourses) {
        const isOwned = bundle.courses.every(courseId => ownedCourses.includes(courseId));
        const bundleCourses = bundle.courses.map(courseId => 
            this.courses.find(c => c.id === courseId)
        ).filter(Boolean);

        return `
            <div class="bundle-card ${isOwned ? 'owned' : ''}">
                <div class="bundle-header">
                    <h3>${bundle.title}</h3>
                    <span class="bundle-badge">${bundle.badge}</span>
                </div>
                <p class="bundle-description">${bundle.description}</p>
                <div class="bundle-courses">
                    <h4>Includes:</h4>
                    <ul>
                        ${bundleCourses.map(course => `
                            <li>
                                <span class="course-title">${course.title}</span>
                                <span class="course-price">$${course.price}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="bundle-pricing">
                    <div class="price-info">
                        <span class="original-price">$${bundle.originalPrice}</span>
                        <span class="current-price">$${bundle.price}</span>
                        <span class="savings">Save $${bundle.savings}</span>
                    </div>
                </div>
                <div class="bundle-actions">
                    ${isOwned ? `
                        <span class="owned-indicator">✓ Owned</span>
                    ` : `
                        <button class="btn btn-primary" onclick="shopSystem.purchaseBundle('${bundle.id}')">
                            Buy Bundle
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    renderCourse(course, ownedCourses) {
        const isOwned = ownedCourses.includes(course.id);
        const isFree = course.price === 0;

        return `
            <div class="shop-item ${isOwned ? 'owned' : ''} ${isFree ? 'free' : ''}">
                <div class="item-header">
                    <h3>${course.title}</h3>
                    ${course.badge ? `<span class="item-badge">${course.badge}</span>` : ''}
                </div>
                <p class="item-description">${course.description}</p>
                
                <div class="item-stats">
                    <div class="stat">
                        <span class="stat-label">Rating:</span>
                        <span class="stat-value">⭐ ${course.rating}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Students:</span>
                        <span class="stat-value">${course.students.toLocaleString()}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Duration:</span>
                        <span class="stat-value">${course.duration}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Level:</span>
                        <span class="stat-value">${course.level}</span>
                    </div>
                </div>

                <div class="item-features">
                    <h4>What you'll get:</h4>
                    <ul>
                        ${course.features.map(feature => `
                            <li>✓ ${feature}</li>
                        `).join('')}
                    </ul>
                </div>

                <div class="item-pricing">
                    ${isFree ? `
                        <span class="free-price">FREE</span>
                    ` : `
                        <div class="price-info">
                            ${course.discount ? `
                                <span class="original-price">$${course.originalPrice}</span>
                                <span class="discount-badge">-${course.discount}%</span>
                            ` : ''}
                            <span class="current-price">$${course.price}</span>
                        </div>
                    `}
                </div>

                <div class="item-actions">
                    ${isOwned ? `
                        <span class="owned-indicator">✓ Owned</span>
                        <button class="btn btn-secondary" onclick="coursesSystem.openCourse('${course.id}')">
                            View Course
                        </button>
                    ` : isFree ? `
                        <button class="btn btn-primary" onclick="shopSystem.enrollFree('${course.id}')">
                            Enroll Free
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="shopSystem.purchaseCourse('${course.id}')">
                            Buy Now
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    attachFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const shopItems = document.querySelectorAll('.shop-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items
                const filter = button.dataset.filter;
                shopItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                    } else if (filter === 'free') {
                        item.style.display = item.classList.contains('free') ? 'block' : 'none';
                    } else {
                        // This would need course data to filter by level
                        item.style.display = 'block'; // Simplified for now
                    }
                });
            });
        });
    }

    purchaseCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        if (course.price === 0) {
            this.enrollFree(courseId);
            return;
        }

        // In a real app, this would integrate with payment processing
        const confirmMessage = `Purchase ${course.title} for $${course.price}?`;
        
        if (confirm(confirmMessage)) {
            // Simulate payment processing
            this.processPayment(course.price, () => {
                gamification.purchaseCourse(courseId);
                this.renderShop();
                this.showPurchaseSuccess(course.title, course.price);
            });
        }
    }

    enrollFree(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        gamification.purchaseCourse(courseId);
        this.renderShop();
        this.showEnrollSuccess(course.title);
    }

    purchaseBundle(bundleId) {
        const bundle = this.bundles.find(b => b.id === bundleId);
        if (!bundle) return;

        const confirmMessage = `Purchase ${bundle.title} for $${bundle.price}? This includes ${bundle.courses.length} courses with a savings of $${bundle.savings}!`;
        
        if (confirm(confirmMessage)) {
            this.processPayment(bundle.price, () => {
                // Purchase all courses in bundle
                bundle.courses.forEach(courseId => {
                    gamification.purchaseCourse(courseId);
                });
                this.renderShop();
                this.showPurchaseSuccess(bundle.title, bundle.price);
            });
        }
    }

    processPayment(amount, onSuccess) {
        // Simulate payment processing
        setTimeout(() => {
            onSuccess();
        }, 1000);
    }

    showPurchaseSuccess(itemTitle, price) {
        gamification.showNotification(`🎉 Successfully purchased ${itemTitle} for $${price}!`, 'success');
    }

    showEnrollSuccess(courseTitle) {
        gamification.showNotification(`✅ Successfully enrolled in ${courseTitle}!`, 'success');
    }

    getCourseById(courseId) {
        return this.courses.find(c => c.id === courseId);
    }

    getBundleById(bundleId) {
        return this.bundles.find(b => b.id === bundleId);
    }

    calculateCartTotal(items) {
        return items.reduce((total, item) => {
            if (item.type === 'course') {
                const course = this.getCourseById(item.id);
                return total + (course ? course.price : 0);
            } else if (item.type === 'bundle') {
                const bundle = this.getBundleById(item.id);
                return total + (bundle ? bundle.price : 0);
            }
            return total;
        }, 0);
    }
}

// Initialize shop system
const shopSystem = new ShopSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopSystem;
}
