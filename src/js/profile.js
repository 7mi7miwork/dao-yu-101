// Profile System
class ProfileSystem {
    constructor() {
        this.profileData = gamification.getProfileData();
        this.initializeProfile();
    }

    initializeProfile() {
        this.renderProfile();
        this.attachEventListeners();
    }

    renderProfile() {
        const container = document.getElementById('profile-container');
        if (!container) return;

        container.innerHTML = `
            <div class="profile-content">
                <div class="profile-header">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar">
                            <span class="avatar-text">${this.getAvatarText()}</span>
                        </div>
                        <div class="avatar-actions">
                            <button class="btn btn-secondary" onclick="profileSystem.changeAvatar()">
                                Change Avatar
                            </button>
                        </div>
                    </div>
                    <div class="profile-info-section">
                        <h2>${this.getUsername()}</h2>
                        <p class="profile-title">${this.getUserTitle()}</p>
                        <div class="profile-badges">
                            ${this.profileData.unlockedBadges.map(badge => `
                                <div class="badge-item" title="${badge.description}">
                                    <span class="badge-icon">${badge.icon}</span>
                                    <span class="badge-name">${badge.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="profileSystem.editProfile()">
                            Edit Profile
                        </button>
                        <button class="btn btn-secondary" onclick="profileSystem.exportData()">
                            Export Data
                        </button>
                        <button class="btn btn-danger" onclick="gamification.resetData()">
                            Reset Progress
                        </button>
                    </div>
                </div>

                <div class="profile-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-content">
                            <span class="stat-value">${this.profileData.level}</span>
                            <span class="stat-label">Level</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <span class="stat-value">${this.profileData.points.toLocaleString()}</span>
                            <span class="stat-label">Points</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-content">
                            <span class="stat-value">${this.profileData.streak}</span>
                            <span class="stat-label">Day Streak</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📚</div>
                        <div class="stat-content">
                            <span class="stat-value">${this.profileData.ownedCourses.length}</span>
                            <span class="stat-label">Courses</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-content">
                            <span class="stat-value">${this.profileData.completedLessons.length}</span>
                            <span class="stat-label">Lessons</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-content">
                            <span class="stat-value">${this.profileData.unlockedBadges.length}</span>
                            <span class="stat-label">Badges</span>
                        </div>
                    </div>
                </div>

                <div class="profile-sections">
                    <div class="profile-section">
                        <h3>Progress Overview</h3>
                        <div class="progress-overview">
                            <div class="progress-item">
                                <label>Experience Progress</label>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${this.getExperienceProgress()}%"></div>
                                    <span class="progress-text">${this.profileData.experience} / ${this.getExperienceNeeded()} XP</span>
                                </div>
                            </div>
                            <div class="progress-item">
                                <label>Daily Goal</label>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${this.getDailyProgress()}%"></div>
                                    <span class="progress-text">${this.getDailyCompleted()} / 3 lessons</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>Recent Achievements</h3>
                        <div class="achievements-grid">
                            ${this.profileData.unlockedAchievements.map(achievement => `
                                <div class="achievement-card">
                                    <div class="achievement-icon">${achievement.icon}</div>
                                    <div class="achievement-info">
                                        <h4>${achievement.name}</h4>
                                        <p>${achievement.description}</p>
                                        <span class="achievement-points">+${achievement.points} points</span>
                                    </div>
                                </div>
                            `).join('')}
                            ${this.profileData.unlockedAchievements.length === 0 ? `
                                <div class="no-achievements">
                                    <p>No achievements yet. Start learning to unlock your first achievement!</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>Learning Activity</h3>
                        <div class="activity-calendar">
                            ${this.renderActivityCalendar()}
                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>Course Progress</h3>
                        <div class="course-progress-list">
                            ${this.renderCourseProgress()}
                        </div>
                    </div>

                    <div class="profile-section">
                        <h3>Settings</h3>
                        <div class="settings-form">
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" id="username" value="${this.getUsername()}" onchange="profileSystem.updateUsername(this.value)">
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" value="${this.getEmail()}" onchange="profileSystem.updateEmail(this.value)">
                            </div>
                            <div class="form-group">
                                <label for="notifications">
                                    <input type="checkbox" id="notifications" ${this.getNotificationSetting() ? 'checked' : ''} onchange="profileSystem.updateNotifications(this.checked)">
                                    Email Notifications
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="public-profile">
                                    <input type="checkbox" id="public-profile" ${this.getPublicProfileSetting() ? 'checked' : ''} onchange="profileSystem.updatePublicProfile(this.checked)">
                                    Public Profile
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAvatarText() {
        const username = this.getUsername();
        return username.charAt(0).toUpperCase();
    }

    getUsername() {
        return localStorage.getItem('username') || 'Learner';
    }

    getUserTitle() {
        const level = this.profileData.level;
        if (level >= 20) return 'Legendary Master';
        if (level >= 15) return 'Expert Learner';
        if (level >= 10) return 'Advanced Student';
        if (level >= 5) return 'Intermediate Learner';
        if (level >= 3) return 'Rising Star';
        return 'Beginner';
    }

    getExperienceProgress() {
        const currentLevel = this.profileData.level;
        const experienceNeeded = gamification.getExperienceNeededForLevel(currentLevel + 1);
        return (this.profileData.experience / experienceNeeded) * 100;
    }

    getExperienceNeeded() {
        return gamification.getExperienceNeededForLevel(this.profileData.level + 1);
    }

    getDailyProgress() {
        const completed = this.getDailyCompleted();
        return Math.min((completed / 3) * 100, 100);
    }

    getDailyCompleted() {
        // Mock daily completed lessons (in real app, this would track actual daily progress)
        return Math.min(this.profileData.completedLessons.length % 4, 3);
    }

    renderActivityCalendar() {
        const today = new Date();
        const calendar = [];
        
        // Generate last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const hasActivity = Math.random() > 0.3; // Mock activity
            const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
            
            calendar.push(`
                <div class="calendar-day intensity-${intensity}" title="${date.toLocaleDateString()}">
                    ${date.getDate()}
                </div>
            `);
        }
        
        return `
            <div class="calendar-grid">
                ${calendar.join('')}
            </div>
            <div class="calendar-legend">
                <span class="legend-item">Less active</span>
                <div class="legend-scale">
                    <div class="legend-color intensity-0"></div>
                    <div class="legend-color intensity-1"></div>
                    <div class="legend-color intensity-2"></div>
                    <div class="legend-color intensity-3"></div>
                    <div class="legend-color intensity-4"></div>
                </div>
                <span class="legend-item">More active</span>
            </div>
        `;
    }

    renderCourseProgress() {
        const courses = coursesSystem.courses.filter(course => 
            this.profileData.ownedCourses.includes(course.id)
        );

        if (courses.length === 0) {
            return '<p>No courses enrolled yet. Visit the shop to get started!</p>';
        }

        return courses.map(course => {
            const progress = coursesSystem.calculateCourseProgress(course.id);
            return `
                <div class="course-progress-item">
                    <div class="course-info">
                        <span class="course-icon">${course.icon}</span>
                        <div class="course-details">
                            <h4>${course.title}</h4>
                            <p>${course.topics.length} topics • ${course.topics.reduce((sum, topic) => sum + topic.lessons.length, 0)} lessons</p>
                        </div>
                    </div>
                    <div class="course-progress-bar">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                        <span class="progress-text">${progress}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    attachEventListeners() {
        // Event listeners are attached via onclick attributes in the HTML
    }

    changeAvatar() {
        const avatars = ['👤', '👨‍💻', '👩‍💻', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🎯', '🚀', '⭐', '💎', '🏆', '🎮'];
        const currentAvatar = localStorage.getItem('avatar') || '👤';
        const currentIndex = avatars.indexOf(currentAvatar);
        const nextIndex = (currentIndex + 1) % avatars.length;
        const nextAvatar = avatars[nextIndex];
        
        localStorage.setItem('avatar', nextAvatar);
        this.renderProfile();
    }

    editProfile() {
        // Show edit profile modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Profile</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="edit-username">Username</label>
                        <input type="text" id="edit-username" value="${this.getUsername()}">
                    </div>
                    <div class="form-group">
                        <label for="edit-bio">Bio</label>
                        <textarea id="edit-bio" rows="4" placeholder="Tell us about yourself...">${this.getBio()}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit-goals">Learning Goals</label>
                        <input type="text" id="edit-goals" placeholder="e.g., Learn web development" value="${this.getGoals()}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="profileSystem.saveProfile()">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveProfile() {
        const username = document.getElementById('edit-username').value;
        const bio = document.getElementById('edit-bio').value;
        const goals = document.getElementById('edit-goals').value;

        localStorage.setItem('username', username);
        localStorage.setItem('bio', bio);
        localStorage.setItem('goals', goals);

        document.querySelector('.modal').remove();
        this.renderProfile();
        gamification.showNotification('Profile updated successfully!', 'success');
    }

    updateUsername(value) {
        localStorage.setItem('username', value);
        this.renderProfile();
    }

    updateEmail(value) {
        localStorage.setItem('email', value);
    }

    updateNotifications(checked) {
        localStorage.setItem('notifications', checked);
    }

    updatePublicProfile(checked) {
        localStorage.setItem('publicProfile', checked);
    }

    getEmail() {
        return localStorage.getItem('email') || 'user@example.com';
    }

    getBio() {
        return localStorage.getItem('bio') || '';
    }

    getGoals() {
        return localStorage.getItem('goals') || '';
    }

    getNotificationSetting() {
        return localStorage.getItem('notifications') === 'true';
    }

    getPublicProfileSetting() {
        return localStorage.getItem('publicProfile') !== 'false';
    }

    exportData() {
        const data = {
            profile: {
                username: this.getUsername(),
                email: this.getEmail(),
                bio: this.getBio(),
                goals: this.getGoals(),
                avatar: localStorage.getItem('avatar') || '👤'
            },
            gamification: this.profileData,
            settings: {
                notifications: this.getNotificationSetting(),
                publicProfile: this.getPublicProfileSetting(),
                language: i18n.getCurrentLanguage(),
                theme: themeManager.getCurrentTheme(),
                nightMode: themeManager.isCurrentlyNightMode()
            },
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dao-yu-profile-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        gamification.showNotification('Profile data exported successfully!', 'success');
    }

    shareProfile() {
        const username = this.getUsername();
        const level = this.profileData.level;
        const points = this.profileData.points;
        const shareText = `Check out my progress on Dao Yu Learning Platform! I'm ${username}, level ${level} with ${points} points! 🎯`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Dao Yu Learning Profile',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                gamification.showNotification('Profile link copied to clipboard!', 'success');
            });
        }
    }

    refreshProfile() {
        this.profileData = gamification.getProfileData();
        this.renderProfile();
    }
}

// Initialize profile system
const profileSystem = new ProfileSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileSystem;
}
