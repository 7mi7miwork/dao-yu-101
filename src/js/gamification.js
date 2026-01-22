// Gamification System
class GamificationSystem {
    constructor() {
        this.userData = this.loadUserData();
        this.achievements = this.loadAchievements();
        this.badges = this.loadBadges();
        this.initializeEventListeners();
    }

    loadUserData() {
        const defaultData = {
            points: 0,
            level: 1,
            experience: 0,
            streak: 0,
            lastLogin: null,
            completedLessons: [],
            ownedCourses: [],
            unlockedBadges: [],
            achievements: []
        };

        const savedData = localStorage.getItem('gamificationData');
        return savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData;
    }

    saveUserData() {
        localStorage.setItem('gamificationData', JSON.stringify(this.userData));
        this.updateUI();
    }

    loadAchievements() {
        return [
            {
                id: 'first_lesson',
                name: 'First Steps',
                description: 'Complete your first lesson',
                points: 10,
                icon: '🎯',
                condition: (data) => data.completedLessons.length >= 1
            },
            {
                id: 'week_streak',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                points: 50,
                icon: '🔥',
                condition: (data) => data.streak >= 7
            },
            {
                id: 'level_5',
                name: 'Rising Star',
                description: 'Reach level 5',
                points: 100,
                icon: '⭐',
                condition: (data) => data.level >= 5
            },
            {
                id: 'course_collector',
                name: 'Course Collector',
                description: 'Own 5 courses',
                points: 75,
                icon: '📚',
                condition: (data) => data.ownedCourses.length >= 5
            },
            {
                id: 'point_master',
                name: 'Point Master',
                description: 'Earn 1000 points',
                points: 200,
                icon: '👑',
                condition: (data) => data.points >= 1000
            }
        ];
    }

    loadBadges() {
        return [
            {
                id: 'beginner',
                name: 'Beginner',
                description: 'Just getting started',
                icon: '🌱',
                requiredLevel: 1
            },
            {
                id: 'learner',
                name: 'Learner',
                description: 'Making progress',
                icon: '📖',
                requiredLevel: 3
            },
            {
                id: 'expert',
                name: 'Expert',
                description: 'Knowledgeable learner',
                icon: '🎓',
                requiredLevel: 5
            },
            {
                id: 'master',
                name: 'Master',
                description: 'Mastery achieved',
                icon: '🏆',
                requiredLevel: 10
            },
            {
                id: 'legend',
                name: 'Legend',
                description: 'Legendary status',
                icon: '👑',
                requiredLevel: 20
            }
        ];
    }

    initializeEventListeners() {
        // Check daily streak
        this.checkDailyStreak();
    }

    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastLogin = this.userData.lastLogin;

        if (lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastLogin === yesterday.toDateString()) {
                // Continue streak
                this.userData.streak++;
            } else {
                // Reset streak
                this.userData.streak = 1;
            }
            
            this.userData.lastLogin = today;
            this.addPoints(5); // Daily login bonus
            this.saveUserData();
        }
    }

    addPoints(points) {
        this.userData.points += points;
        this.userData.experience += points;
        this.checkLevelUp();
        this.checkAchievements();
        this.saveUserData();
    }

    checkLevelUp() {
        const experienceNeeded = this.getExperienceNeededForLevel(this.userData.level + 1);
        
        if (this.userData.experience >= experienceNeeded) {
            this.userData.level++;
            this.userData.experience -= experienceNeeded;
            this.showLevelUpNotification();
            this.checkBadges();
            
            // Recursive check for multiple level ups
            this.checkLevelUp();
        }
    }

    getExperienceNeededForLevel(level) {
        return level * 100; // Simple formula: 100 XP per level
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.userData.achievements.includes(achievement.id) && 
                achievement.condition(this.userData)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        this.userData.achievements.push(achievement.id);
        this.addPoints(achievement.points);
        this.showAchievementNotification(achievement);
    }

    checkBadges() {
        this.badges.forEach(badge => {
            if (!this.userData.unlockedBadges.includes(badge.id) && 
                this.userData.level >= badge.requiredLevel) {
                this.unlockBadge(badge);
            }
        });
    }

    unlockBadge(badge) {
        this.userData.unlockedBadges.push(badge.id);
        this.showBadgeNotification(badge);
    }

    completeLesson(lessonId) {
        if (!this.userData.completedLessons.includes(lessonId)) {
            this.userData.completedLessons.push(lessonId);
            this.addPoints(20); // Lesson completion bonus
            this.saveUserData();
        }
    }

    purchaseCourse(courseId) {
        if (!this.userData.ownedCourses.includes(courseId)) {
            this.userData.ownedCourses.push(courseId);
            this.addPoints(30); // Course purchase bonus
            this.saveUserData();
        }
    }

    showLevelUpNotification() {
        this.showNotification(`🎉 Level Up! You are now level ${this.userData.level}!`, 'success');
    }

    showAchievementNotification(achievement) {
        this.showNotification(`🏆 Achievement Unlocked: ${achievement.name}! +${achievement.points} points`, 'achievement');
    }

    showBadgeNotification(badge) {
        this.showNotification(`🎖️ Badge Earned: ${badge.name}!`, 'badge');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4CAF50' : 
                       type === 'achievement' ? '#FF9800' : 
                       type === 'badge' ? '#9C27B0' : '#2196F3',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '10000',
            fontSize: '16px',
            fontWeight: 'bold',
            maxWidth: '300px',
            wordWrap: 'break-word',
            animation: 'slideInRight 0.3s ease-out'
        });

        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    updateUI() {
        // Update stats on home page
        const pointsElement = document.getElementById('user-points');
        const levelElement = document.getElementById('user-level');
        const streakElement = document.getElementById('user-streak');

        if (pointsElement) pointsElement.textContent = this.userData.points;
        if (levelElement) levelElement.textContent = this.userData.level;
        if (streakElement) streakElement.textContent = this.userData.streak;
    }

    getLeaderboardData() {
        // Generate mock leaderboard data (in real app, this would come from server)
        const mockUsers = [
            { name: 'You', points: this.userData.points, level: this.userData.level, isCurrentUser: true },
            { name: 'Alice', points: 2500, level: 15 },
            { name: 'Bob', points: 2200, level: 14 },
            { name: 'Charlie', points: 1800, level: 12 },
            { name: 'Diana', points: 1500, level: 10 },
            { name: 'Eve', points: 1200, level: 8 },
            { name: 'Frank', points: 900, level: 6 },
            { name: 'Grace', points: 600, level: 4 },
            { name: 'Henry', points: 300, level: 2 }
        ];

        // Sort by points
        return mockUsers.sort((a, b) => b.points - a.points);
    }

    getProfileData() {
        return {
            ...this.userData,
            unlockedBadges: this.badges.filter(badge => 
                this.userData.unlockedBadges.includes(badge.id)
            ),
            unlockedAchievements: this.achievements.filter(achievement => 
                this.userData.achievements.includes(achievement.id)
            )
        };
    }

    // Reset user data (for testing)
    resetData() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            localStorage.removeItem('gamificationData');
            this.userData = this.loadUserData();
            this.updateUI();
            this.showNotification('Progress reset successfully', 'info');
        }
    }
}

// Initialize gamification system
const gamification = new GamificationSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}
