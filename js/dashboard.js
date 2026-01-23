// Dao-Yu-101 - Dashboard JavaScript

// Initialize dashboard based on user role
function renderDashboard() {
    console.log('Rendering dashboard for role:', AppState.currentRole);
    
    // Redirect if not authenticated
    if (!AppState.isAuthenticated) {
        window.location.href = '../index.html';
        return;
    }
    
    // Render based on role
    switch (AppState.currentRole) {
        case 'student':
            renderStudentDashboard();
            break;
        case 'teacher':
            renderTeacherDashboard();
            break;
        case 'parent':
            renderParentDashboard();
            break;
        case 'admin':
            renderAdminDashboard();
            break;
        default:
            renderStudentDashboard();
    }
}

// Student Dashboard
function renderStudentDashboard() {
    console.log('Rendering student dashboard');
    
    // Update dashboard title
    const dashboardTitle = document.getElementById('dashboardTitle');
    if (dashboardTitle) dashboardTitle.textContent = 'Student Dashboard';
    
    // Render stats
    renderStudentStats();
    
    // Render progress overview
    renderStudentProgress();
    
    // Render recent activity
    renderRecentActivity();
    
    // Render XP and badges
    renderXPAndBadges();
    
    // Render upcoming lessons
    renderUpcomingLessons();
}

function renderStudentStats() {
    const statsContainer = document.getElementById('dashboardStats');
    if (!statsContainer) return;
    
    const totalLessons = AppState.data.lessons.length;
    const completedLessons = AppState.data.lessons.filter(l => l.status === 'completed').length;
    const currentStreak = 3; // Mock data
    const totalXP = AppState.currentUser ? AppState.currentUser.xp : 1250;
    
    const html = `
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Total Lessons</span>
                <span class="stat-card-icon">📚</span>
            </div>
            <div class="stat-card-value">${totalLessons}</div>
            <div class="stat-card-change">Available across all islands</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Completed</span>
                <span class="stat-card-icon">✅</span>
            </div>
            <div class="stat-card-value">${completedLessons}</div>
            <div class="stat-card-change">${((completedLessons / totalLessons) * 100).toFixed(0)}% completion rate</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Current Streak</span>
                <span class="stat-card-icon">🔥</span>
            </div>
            <div class="stat-card-value">${currentStreak}</div>
            <div class="stat-card-change">Consecutive days</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Total XP</span>
                <span class="stat-card-icon">⭐</span>
            </div>
            <div class="stat-card-value">${totalXP}</div>
            <div class="stat-card-change">Keep learning to earn more!</div>
        </div>
    `;
    
    statsContainer.innerHTML = html;
}

function renderStudentProgress() {
    const progressContainer = document.getElementById('progressOverview');
    if (!progressContainer) return;
    
    let html = '<div class="progress-overview">';
    
    const archipelagos = ['Mathematics', 'Science', 'Programming'];
    const icons = ['📐', '🔬', '💻'];
    
    archipelagos.forEach((arch, index) => {
        const archipelago = AppState.data.archipelagos.find(a => a.name === arch);
        const islands = getIslandsByArchipelago(archipelago.id);
        
        let totalLessons = 0;
        let completedLessons = 0;
        
        islands.forEach(island => {
            const islandLessons = getLessonsByIsland(island.id);
            totalLessons += islandLessons.length;
            completedLessons += islandLessons.filter(l => l.status === 'completed').length;
        });
        
        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        const className = arch.toLowerCase().replace(' ', '');
        
        html += `
            <div class="progress-card">
                <div class="progress-card-header">
                    <div class="progress-card-icon ${className}">${icons[index]}</div>
                    <div class="progress-card-title">${arch}</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar ${className}" style="width: ${progress}%"></div>
                </div>
                <div class="progress-card-stats">
                    <span>${completedLessons}/${totalLessons} lessons</span>
                    <span>${progress.toFixed(0)}%</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    progressContainer.innerHTML = html;
}

function renderRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    // Mock activity data
    const activities = [
        {
            type: 'success',
            title: 'Completed Lesson: Basic Addition',
            time: '2 hours ago',
            status: 'pass'
        },
        {
            type: 'success',
            title: 'Completed Lesson: Numbers and Counting',
            time: 'Yesterday',
            status: 'pass'
        },
        {
            type: 'failure',
            title: 'Failed Lesson: Basic Subtraction',
            time: '2 days ago',
            status: 'fail'
        },
        {
            type: 'pending',
            title: 'Peer Review Assigned',
            time: '3 days ago',
            status: 'pending'
        }
    ];
    
    let html = '<div class="activity-list">';
    
    activities.forEach(activity => {
        const icon = activity.type === 'success' ? '✅' : 
                     activity.type === 'failure' ? '❌' : '⏳';
        
        html += `
            <div class="activity-item ${activity.type}">
                <div class="activity-icon ${activity.type}">${icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
                <div class="activity-status ${activity.status}">${activity.status}</div>
            </div>
        `;
    });
    
    html += '</div>';
    activityContainer.innerHTML = html;
}

function renderXPAndBadges() {
    const xpContainer = document.getElementById('xpDisplay');
    const badgesContainer = document.getElementById('badgesDisplay');
    
    if (xpContainer) {
        const totalXP = AppState.currentUser ? AppState.currentUser.xp : 1250;
        xpContainer.innerHTML = `
            <div class="xp-display">
                <div>
                    <div class="xp-amount">${totalXP}</div>
                    <div class="xp-label">Total XP Earned</div>
                </div>
                <div>
                    <div class="xp-amount">${AppState.data.badges.filter(b => b.earned).length}</div>
                    <div class="xp-label">Badges Earned</div>
                </div>
            </div>
        `;
    }
    
    if (badgesContainer) {
        let html = '<div class="badges-grid">';
        
        AppState.data.badges.forEach(badge => {
            html += `
                <div class="badge-item ${badge.earned ? 'earned' : ''}">
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-name">${badge.name}</div>
                </div>
            `;
        });
        
        html += '</div>';
        badgesContainer.innerHTML = html;
    }
}

function renderUpcomingLessons() {
    const upcomingContainer = document.getElementById('upcomingLessons');
    if (!upcomingContainer) return;
    
    // Get next unlocked lessons
    const unlockedLessons = AppState.data.lessons.filter(l => l.status === 'unlocked').slice(0, 3);
    
    if (unlockedLessons.length === 0) {
        upcomingContainer.innerHTML = '<p class="text-muted">No lessons available. Complete more lessons to unlock new ones!</p>';
        return;
    }
    
    let html = '<div class="lesson-list">';
    
    unlockedLessons.forEach(lesson => {
        const island = getIslandById(lesson.island_id);
        html += `
            <div class="lesson-card">
                <div class="lesson-card-header">
                    <h4>${lesson.name}</h4>
                    <span class="lesson-status-badge unlocked">Unlocked</span>
                </div>
                <p class="lesson-card-description">${lesson.description}</p>
                <p class="text-muted">Island: ${island ? island.name : 'Unknown'}</p>
                <button class="btn btn-primary btn-small" onclick="window.location.href='lesson-detail.html?id=${lesson.id}'">
                    Start Lesson
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    upcomingContainer.innerHTML = html;
}

// Teacher Dashboard
function renderTeacherDashboard() {
    console.log('Rendering teacher dashboard');
    
    const dashboardTitle = document.getElementById('dashboardTitle');
    if (dashboardTitle) dashboardTitle.textContent = 'Teacher Dashboard';
    
    renderTeacherStats();
    renderStudentList();
    renderPendingReviews();
}

function renderTeacherStats() {
    const statsContainer = document.getElementById('dashboardStats');
    if (!statsContainer) return;
    
    const html = `
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Assigned Students</span>
                <span class="stat-card-icon">👨‍🎓</span>
            </div>
            <div class="stat-card-value">12</div>
            <div class="stat-card-change">+2 this week</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Pending Reviews</span>
                <span class="stat-card-icon">📝</span>
            </div>
            <div class="stat-card-value">5</div>
            <div class="stat-card-change">Awaiting your review</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Total Reviews</span>
                <span class="stat-card-icon">✓</span>
            </div>
            <div class="stat-card-value">48</div>
            <div class="stat-card-change">This month</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Avg. Student Progress</span>
                <span class="stat-card-icon">📊</span>
            </div>
            <div class="stat-card-value">67%</div>
            <div class="stat-card-change">Across all students</div>
        </div>
    `;
    
    statsContainer.innerHTML = html;
}

function renderStudentList() {
    const studentListContainer = document.getElementById('studentList');
    if (!studentListContainer) return;
    
    // Mock student data
    const students = [
        { name: 'Alice Johnson', avatar: 'AJ', progress: '8/15 lessons', status: 'active' },
        { name: 'Bob Smith', avatar: 'BS', progress: '12/15 lessons', status: 'active' },
        { name: 'Carol Williams', avatar: 'CW', progress: '5/15 lessons', status: 'needs-attention' },
        { name: 'David Brown', avatar: 'DB', progress: '3/15 lessons', status: 'needs-attention' }
    ];
    
    let html = '<div class="student-list">';
    
    students.forEach(student => {
        const statusColor = student.status === 'active' ? 'success' : 'warning';
        html += `
            <div class="student-card">
                <div class="student-info">
                    <div class="student-avatar">${student.avatar}</div>
                    <div>
                        <div class="student-name">${student.name}</div>
                        <div class="student-progress">${student.progress}</div>
                    </div>
                </div>
                <div class="student-actions">
                    <span class="activity-status ${statusColor}">${student.status === 'active' ? 'On Track' : 'Needs Help'}</span>
                    <button class="btn btn-outline btn-small">View Progress</button>
                    <button class="btn btn-primary btn-small">Message</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    studentListContainer.innerHTML = html;
}

function renderPendingReviews() {
    const reviewQueueContainer = document.getElementById('reviewQueue');
    if (!reviewQueueContainer) return;
    
    // Mock review data
    const reviews = [
        {
            id: 'review-1',
            lesson: 'Word Problems: Addition & Subtraction',
            student: 'Alice Johnson',
            submitted: '2 hours ago'
        },
        {
            id: 'review-2',
            lesson: 'Basic Addition',
            student: 'Bob Smith',
            submitted: '5 hours ago'
        }
    ];
    
    let html = '<div class="review-queue">';
    
    reviews.forEach(review => {
        html += `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-lesson">${review.lesson}</div>
                    <div class="review-student">${review.student} - ${review.submitted}</div>
                </div>
                <div class="review-actions">
                    <button class="btn btn-primary btn-small">Review Now</button>
                    <button class="btn btn-outline btn-small">View Details</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    reviewQueueContainer.innerHTML = html;
}

// Parent Dashboard
function renderParentDashboard() {
    console.log('Rendering parent dashboard');
    
    const dashboardTitle = document.getElementById('dashboardTitle');
    if (dashboardTitle) dashboardTitle.textContent = 'Parent Dashboard';
    
    renderParentStats();
    renderChildProgress();
}

function renderParentStats() {
    const statsContainer = document.getElementById('dashboardStats');
    if (!statsContainer) return;
    
    const html = `
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Children Enrolled</span>
                <span class="stat-card-icon">👨‍👩‍👧</span>
            </div>
            <div class="stat-card-value">2</div>
            <div class="stat-card-change">Active learners</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Combined Progress</span>
                <span class="stat-card-icon">📈</span>
            </div>
            <div class="stat-card-value">52%</div>
            <div class="stat-card-change">Average completion</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Lessons This Week</span>
                <span class="stat-card-icon">📚</span>
            </div>
            <div class="stat-card-value">8</div>
            <div class="stat-card-change">Across all children</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Current Streak</span>
                <span class="stat-card-icon">🔥</span>
            </div>
            <div class="stat-card-value">5</div>
            <div class="stat-card-change">Consecutive days</div>
        </div>
    `;
    
    statsContainer.innerHTML = html;
}

function renderChildProgress() {
    const childProgressContainer = document.getElementById('childProgress');
    if (!childProgressContainer) return;
    
    // Mock child data
    const children = [
        {
            name: 'Emma',
            age: 10,
            avatar: 'E',
            progress: {
                mathematics: { completed: 8, total: 15, percentage: 53 },
                science: { completed: 3, total: 15, percentage: 20 },
                programming: { completed: 0, total: 15, percentage: 0 }
            },
            recentActivity: 'Completed "Basic Addition" yesterday',
            streak: 5
        },
        {
            name: 'Liam',
            age: 8,
            avatar: 'L',
            progress: {
                mathematics: { completed: 5, total: 15, percentage: 33 },
                science: { completed: 0, total: 15, percentage: 0 },
                programming: { completed: 0, total: 15, percentage: 0 }
            },
            recentActivity: 'Completed "Numbers and Counting" today',
            streak: 3
        }
    ];
    
    let html = '<div class="child-progress-list">';
    
    children.forEach(child => {
        html += `
            <div class="child-progress-card">
                <div class="child-progress-header">
                    <div class="student-avatar">${child.avatar}</div>
                    <div class="child-progress-info">
                        <h3>${child.name}, ${child.age}</h3>
                        <p class="text-muted">🔥 ${child.streak} day streak</p>
                    </div>
                </div>
                <div class="child-progress-subjects">
                    <div class="progress-subject">
                        <span>Mathematics</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar mathematics" style="width: ${child.progress.mathematics.percentage}%"></div>
                        </div>
                        <span>${child.progress.mathematics.completed}/${child.progress.mathematics.total}</span>
                    </div>
                    <div class="progress-subject">
                        <span>Science</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar science" style="width: ${child.progress.science.percentage}%"></div>
                        </div>
                        <span>${child.progress.science.completed}/${child.progress.science.total}</span>
                    </div>
                    <div class="progress-subject">
                        <span>Programming</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar programming" style="width: ${child.progress.programming.percentage}%"></div>
                        </div>
                        <span>${child.progress.programming.completed}/${child.progress.programming.total}</span>
                    </div>
                </div>
                <div class="child-progress-activity">
                    <p class="text-muted"><strong>Recent Activity:</strong> ${child.recentActivity}</p>
                </div>
                <button class="btn btn-primary btn-small" style="width: 100%; margin-top: 16px;">View Detailed Progress</button>
            </div>
        `;
    });
    
    html += '</div>';
    childProgressContainer.innerHTML = html;
}

// Admin Dashboard
function renderAdminDashboard() {
    console.log('Rendering admin dashboard');
    
    const dashboardTitle = document.getElementById('dashboardTitle');
    if (dashboardTitle) dashboardTitle.textContent = 'Admin Dashboard';
    
    renderAdminStats();
    renderSystemOverview();
    renderAuditLog();
}

function renderAdminStats() {
    const statsContainer = document.getElementById('dashboardStats');
    if (!statsContainer) return;
    
    const html = `
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Total Users</span>
                <span class="stat-card-icon">👥</span>
            </div>
            <div class="stat-card-value">247</div>
            <div class="stat-card-change">+15 this week</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Active Lessons</span>
                <span class="stat-card-icon">📚</span>
            </div>
            <div class="stat-card-value">1,234</div>
            <div class="stat-card-change">Currently in progress</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">Validation Rate</span>
                <span class="stat-card-icon">✅</span>
            </div>
            <div class="stat-card-value">87%</div>
            <div class="stat-card-change">Pass rate</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span class="stat-card-title">System Health</span>
                <span class="stat-card-icon">🟢</span>
            </div>
            <div class="stat-card-value">99.9%</div>
            <div class="stat-card-change">Uptime</div>
        </div>
    `;
    
    statsContainer.innerHTML = html;
}

function renderSystemOverview() {
    const systemContainer = document.getElementById('systemOverview');
    if (!systemContainer) return;
    
    const html = `
        <div class="system-stats">
            <div class="system-stat">
                <div class="system-stat-value">4</div>
                <div class="system-stat-label">Archipelagos</div>
            </div>
            <div class="system-stat">
                <div class="system-stat-value">15</div>
                <div class="system-stat-label">Islands</div>
            </div>
            <div class="system-stat">
                <div class="system-stat-value">225</div>
                <div class="system-stat-label">Total Lessons</div>
            </div>
            <div class="system-stat">
                <div class="system-stat-value">247</div>
                <div class="system-stat-label">Students</div>
            </div>
            <div class="system-stat">
                <div class="system-stat-value">32</div>
                <div class="system-stat-label">Teachers</div>
            </div>
            <div class="system-stat">
                <div class="system-stat-value">18</div>
                <div class="system-stat-label">Parents</div>
            </div>
        </div>
    `;
    
    systemContainer.innerHTML = html;
}

function renderAuditLog() {
    const auditLogContainer = document.getElementById('auditLog');
    if (!auditLogContainer) return;
    
    // Mock audit log entries
    const auditEntries = [
        { time: '2024-01-15 14:32:15', action: 'validation_override', detail: 'Teacher john_doe overrode validation for student alice_johnson on lesson-4' },
        { time: '2024-01-15 14:30:22', action: 'lesson_completed', detail: 'Student bob_smith completed lesson-2 with score 85%' },
        { time: '2024-01-15 14:28:45', action: 'user_login', detail: 'User carol_williams logged in from 192.168.1.100' },
        { time: '2024-01-15 14:25:33', action: 'peer_review_assigned', detail: 'Peer review assigned to david_brown for submission submission-1234' },
        { time: '2024-01-15 14:22:18', action: 'badge_earned', detail: 'Student alice_johnson earned badge "First Steps"' }
    ];
    
    let html = '<div class="audit-log">';
    
    auditEntries.forEach(entry => {
        html += `
            <div class="audit-log-entry">
                <span class="audit-log-time">[${entry.time}]</span>
                <span class="audit-log-action">${entry.action}:</span>
                <span class="audit-log-detail">${entry.detail}</span>
            </div>
        `;
    });
    
    html += '</div>';
    auditLogContainer.innerHTML = html;
}

// Export functions
window.renderDashboard = renderDashboard;