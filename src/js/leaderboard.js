// Leaderboard System
class LeaderboardSystem {
    constructor() {
        this.leaderboardData = [];
        this.timeFilter = 'all-time';
        this.categoryFilter = 'all';
        this.initializeLeaderboard();
    }

    initializeLeaderboard() {
        this.loadLeaderboardData();
        this.renderLeaderboard();
    }

    loadLeaderboardData() {
        // Generate mock leaderboard data (in real app, this would come from server)
        const mockUsers = [
            { 
                id: 'current-user',
                name: 'You', 
                points: gamification.userData.points, 
                level: gamification.userData.level,
                streak: gamification.userData.streak,
                coursesCompleted: gamification.userData.completedLessons.length,
                badges: gamification.userData.unlockedBadges.length,
                avatar: '👤',
                isCurrentUser: true,
                joinDate: new Date(2024, 0, 1),
                lastActive: new Date()
            },
            { 
                id: 'alice',
                name: 'Alice Chen', 
                points: 2850, 
                level: 17,
                streak: 45,
                coursesCompleted: 23,
                badges: 8,
                avatar: '👩‍💻',
                joinDate: new Date(2023, 6, 15),
                lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            { 
                id: 'bob',
                name: 'Bob Johnson', 
                points: 2650, 
                level: 16,
                streak: 32,
                coursesCompleted: 20,
                badges: 7,
                avatar: '👨‍💻',
                joinDate: new Date(2023, 8, 20),
                lastActive: new Date(Date.now() - 30 * 60 * 1000)
            },
            { 
                id: 'charlie',
                name: 'Charlie Davis', 
                points: 2400, 
                level: 14,
                streak: 28,
                coursesCompleted: 18,
                badges: 6,
                avatar: '🧑‍🎓',
                joinDate: new Date(2023, 9, 10),
                lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000)
            },
            { 
                id: 'diana',
                name: 'Diana Martinez', 
                points: 2200, 
                level: 13,
                streak: 25,
                coursesCompleted: 16,
                badges: 5,
                avatar: '👩‍🎓',
                joinDate: new Date(2023, 10, 5),
                lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000)
            },
            { 
                id: 'eve',
                name: 'Eve Wilson', 
                points: 1950, 
                level: 11,
                streak: 21,
                coursesCompleted: 14,
                badges: 4,
                avatar: '🎯',
                joinDate: new Date(2023, 11, 1),
                lastActive: new Date(Date.now() - 15 * 60 * 1000)
            },
            { 
                id: 'frank',
                name: 'Frank Brown', 
                points: 1700, 
                level: 10,
                streak: 18,
                coursesCompleted: 12,
                badges: 4,
                avatar: '🏆',
                joinDate: new Date(2024, 0, 15),
                lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000)
            },
            { 
                id: 'grace',
                name: 'Grace Lee', 
                points: 1450, 
                level: 8,
                streak: 15,
                coursesCompleted: 10,
                badges: 3,
                avatar: '⭐',
                joinDate: new Date(2024, 1, 10),
                lastActive: new Date(Date.now() - 45 * 60 * 1000)
            },
            { 
                id: 'henry',
                name: 'Henry Taylor', 
                points: 1200, 
                level: 7,
                streak: 12,
                coursesCompleted: 8,
                badges: 3,
                avatar: '🚀',
                joinDate: new Date(2024, 2, 5),
                lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000)
            },
            { 
                id: 'iris',
                name: 'Iris Anderson', 
                points: 950, 
                level: 5,
                streak: 10,
                coursesCompleted: 6,
                badges: 2,
                avatar: '💎',
                joinDate: new Date(2024, 3, 1),
                lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            { 
                id: 'jack',
                name: 'Jack Miller', 
                points: 750, 
                level: 4,
                streak: 8,
                coursesCompleted: 5,
                badges: 2,
                avatar: '🎮',
                joinDate: new Date(2024, 3, 20),
                lastActive: new Date(Date.now() - 30 * 60 * 1000)
            },
            { 
                id: 'kate',
                name: 'Kate White', 
                points: 500, 
                level: 3,
                streak: 5,
                coursesCompleted: 3,
                badges: 1,
                avatar: '🌟',
                joinDate: new Date(2024, 4, 10),
                lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
        ];

        // Sort by points
        this.leaderboardData = mockUsers.sort((a, b) => b.points - a.points);
        
        // Add ranks
        this.leaderboardData.forEach((user, index) => {
            user.rank = index + 1;
            user.rankChange = this.calculateRankChange(user.id);
        });
    }

    calculateRankChange(userId) {
        // Mock rank change calculation (in real app, this would compare with previous period)
        const changes = {
            'current-user': 2,
            'alice': -1,
            'bob': 0,
            'charlie': 3,
            'diana': -2,
            'eve': 1,
            'frank': 0,
            'grace': 4,
            'henry': -1,
            'iris': 2,
            'jack': -3,
            'kate': 5
        };
        
        return changes[userId] || 0;
    }

    renderLeaderboard() {
        const container = document.getElementById('leaderboard-container');
        if (!container) return;

        const filteredData = this.getFilteredData();
        const currentUserRank = this.getCurrentUserRank();

        container.innerHTML = `
            <div class="leaderboard-content">
                <div class="leaderboard-filters">
                    <div class="filter-group">
                        <label>Time Period:</label>
                        <select id="time-filter" onchange="leaderboardSystem.setTimeFilter(this.value)">
                            <option value="all-time">All Time</option>
                            <option value="monthly">This Month</option>
                            <option value="weekly">This Week</option>
                            <option value="daily">Today</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Category:</label>
                        <select id="category-filter" onchange="leaderboardSystem.setCategoryFilter(this.value)">
                            <option value="all">All Categories</option>
                            <option value="points">Most Points</option>
                            <option value="streak">Longest Streak</option>
                            <option value="courses">Most Courses</option>
                            <option value="badges">Most Badges</option>
                        </select>
                    </div>
                </div>

                <div class="leaderboard-stats">
                    <div class="stat-card">
                        <h3>Your Rank</h3>
                        <div class="rank-display">#${currentUserRank}</div>
                        <div class="rank-change ${this.getRankChangeClass('current-user')}">
                            ${this.getRankChangeDisplay('current-user')}
                        </div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Learners</h3>
                        <div class="total-display">${this.leaderboardData.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Top Score</h3>
                        <div class="top-score">${this.leaderboardData[0]?.points || 0} pts</div>
                    </div>
                </div>

                <div class="leaderboard-table">
                    <div class="table-header">
                        <div class="header-rank">Rank</div>
                        <div class="header-user">Learner</div>
                        <div class="header-points">Points</div>
                        <div class="header-level">Level</div>
                        <div class="header-streak">Streak</div>
                        <div class="header-badges">Badges</div>
                    </div>
                    <div class="table-body">
                        ${filteredData.map(user => this.renderLeaderboardRow(user)).join('')}
                    </div>
                </div>

                ${currentUserRank > 10 ? `
                    <div class="current-user-position">
                        <h3>Your Position</h3>
                        ${this.renderLeaderboardRow(this.leaderboardData.find(u => u.isCurrentUser))}
                    </div>
                ` : ''}
            </div>
        `;
    }

    getFilteredData() {
        let filtered = [...this.leaderboardData];

        // Apply time filter (mock implementation)
        if (this.timeFilter !== 'all-time') {
            // In real app, this would filter based on actual time periods
            filtered = filtered.map(user => ({
                ...user,
                points: Math.floor(user.points * this.getTimeFilterMultiplier())
            }));
        }

        // Apply category filter
        switch (this.categoryFilter) {
            case 'points':
                filtered.sort((a, b) => b.points - a.points);
                break;
            case 'streak':
                filtered.sort((a, b) => b.streak - a.streak);
                break;
            case 'courses':
                filtered.sort((a, b) => b.coursesCompleted - a.coursesCompleted);
                break;
            case 'badges':
                filtered.sort((a, b) => b.badges - a.badges);
                break;
            default:
                filtered.sort((a, b) => b.points - a.points);
        }

        // Re-rank after sorting
        filtered.forEach((user, index) => {
            user.rank = index + 1;
        });

        return filtered.slice(0, 10); // Show top 10
    }

    getTimeFilterMultiplier() {
        const multipliers = {
            'daily': 0.1,
            'weekly': 0.3,
            'monthly': 0.6
        };
        return multipliers[this.timeFilter] || 1;
    }

    getCurrentUserRank() {
        const currentUser = this.leaderboardData.find(u => u.isCurrentUser);
        return currentUser ? currentUser.rank : 0;
    }

    renderLeaderboardRow(user) {
        const rankClass = this.getRankClass(user.rank);
        const rankChangeClass = this.getRankChangeClass(user.id);
        const isCurrentUser = user.isCurrentUser;

        return `
            <div class="leaderboard-row ${isCurrentUser ? 'current-user' : ''} ${rankClass}">
                <div class="rank-cell">
                    <span class="rank-number">${user.rank}</span>
                    ${this.getRankIcon(user.rank)}
                    <div class="rank-change ${rankChangeClass}">
                        ${this.getRankChangeDisplay(user.id)}
                    </div>
                </div>
                <div class="user-cell">
                    <span class="user-avatar">${user.avatar}</span>
                    <div class="user-info">
                        <span class="user-name">${user.name}</span>
                        ${isCurrentUser ? '<span class="current-user-badge">YOU</span>' : ''}
                    </div>
                </div>
                <div class="points-cell">
                    <span class="points-value">${user.points.toLocaleString()}</span>
                    <span class="points-label">pts</span>
                </div>
                <div class="level-cell">
                    <span class="level-value">${user.level}</span>
                    <span class="level-label">lvl</span>
                </div>
                <div class="streak-cell">
                    <span class="streak-value">${user.streak}</span>
                    <span class="streak-icon">🔥</span>
                </div>
                <div class="badges-cell">
                    <span class="badges-value">${user.badges}</span>
                    <span class="badges-icon">🏆</span>
                </div>
            </div>
        `;
    }

    getRankClass(rank) {
        if (rank === 1) return 'rank-first';
        if (rank === 2) return 'rank-second';
        if (rank === 3) return 'rank-third';
        return '';
    }

    getRankIcon(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '';
    }

    getRankChangeClass(userId) {
        const change = this.calculateRankChange(userId);
        if (change > 0) return 'rank-up';
        if (change < 0) return 'rank-down';
        return 'rank-same';
    }

    getRankChangeDisplay(userId) {
        const change = this.calculateRankChange(userId);
        if (change > 0) return `↑${change}`;
        if (change < 0) return `↓${Math.abs(change)}`;
        return '—';
    }

    setTimeFilter(filter) {
        this.timeFilter = filter;
        this.renderLeaderboard();
    }

    setCategoryFilter(filter) {
        this.categoryFilter = filter;
        this.renderLeaderboard();
    }

    refreshLeaderboard() {
        this.loadLeaderboardData();
        this.renderLeaderboard();
    }

    exportLeaderboard() {
        const data = this.getFilteredData();
        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'leaderboard.csv');
    }

    convertToCSV(data) {
        const headers = ['Rank', 'Name', 'Points', 'Level', 'Streak', 'Badges'];
        const rows = data.map(user => [
            user.rank,
            user.name,
            user.points,
            user.level,
            user.streak,
            user.badges
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    shareResults() {
        const currentUser = this.leaderboardData.find(u => u.isCurrentUser);
        const shareText = `I'm ranked #${currentUser.rank} on the Dao Yu Learning Platform with ${currentUser.points} points! 🎯`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Dao Yu Learning Leaderboard',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                gamification.showNotification('Results copied to clipboard!', 'success');
            });
        }
    }
}

// Initialize leaderboard system
const leaderboardSystem = new LeaderboardSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeaderboardSystem;
}
