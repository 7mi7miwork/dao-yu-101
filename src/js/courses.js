// Courses Management System
class CoursesSystem {
    constructor() {
        this.courses = this.loadCourses();
        this.currentCourse = null;
        this.currentTopic = null;
        this.currentLesson = null;
    }

    loadCourses() {
        // Archipel structure: Archipel (Subject) → Island (Topic) → 15 Lessons
        return [
            {
                id: 'programming-basics',
                title: 'Programming Basics',
                description: 'Learn the fundamentals of programming',
                icon: '💻',
                price: 0, // Free course
                topics: [
                    {
                        id: 'variables',
                        title: 'Variables and Data Types',
                        description: 'Understanding variables and data types',
                        lessons: this.generateLessons('variables', 'Variables and Data Types')
                    },
                    {
                        id: 'control-flow',
                        title: 'Control Flow',
                        description: 'If statements, loops, and conditionals',
                        lessons: this.generateLessons('control-flow', 'Control Flow')
                    },
                    {
                        id: 'functions',
                        title: 'Functions',
                        description: 'Creating and using functions',
                        lessons: this.generateLessons('functions', 'Functions')
                    }
                ]
            },
            {
                id: 'web-development',
                title: 'Web Development',
                description: 'Build modern web applications',
                icon: '🌐',
                price: 29.99,
                topics: [
                    {
                        id: 'html-css',
                        title: 'HTML & CSS',
                        description: 'Structure and style web pages',
                        lessons: this.generateLessons('html-css', 'HTML & CSS')
                    },
                    {
                        id: 'javascript',
                        title: 'JavaScript',
                        description: 'Add interactivity to websites',
                        lessons: this.generateLessons('javascript', 'JavaScript')
                    },
                    {
                        id: 'frameworks',
                        title: 'Modern Frameworks',
                        description: 'React, Vue, and Angular',
                        lessons: this.generateLessons('frameworks', 'Modern Frameworks')
                    }
                ]
            },
            {
                id: 'data-science',
                title: 'Data Science',
                description: 'Analyze and visualize data',
                icon: '📊',
                price: 49.99,
                topics: [
                    {
                        id: 'statistics',
                        title: 'Statistics',
                        description: 'Statistical analysis and probability',
                        lessons: this.generateLessons('statistics', 'Statistics')
                    },
                    {
                        id: 'machine-learning',
                        title: 'Machine Learning',
                        description: 'Introduction to ML algorithms',
                        lessons: this.generateLessons('machine-learning', 'Machine Learning')
                    },
                    {
                        id: 'data-visualization',
                        title: 'Data Visualization',
                        description: 'Creating charts and graphs',
                        lessons: this.generateLessons('data-visualization', 'Data Visualization')
                    }
                ]
            },
            {
                id: 'game-development',
                title: 'Game Development',
                description: 'Create your own games',
                icon: '🎮',
                price: 39.99,
                topics: [
                    {
                        id: 'game-design',
                        title: 'Game Design Principles',
                        description: 'Fundamentals of game design',
                        lessons: this.generateLessons('game-design', 'Game Design Principles')
                    },
                    {
                        id: 'unity-basics',
                        title: 'Unity Basics',
                        description: 'Getting started with Unity',
                        lessons: this.generateLessons('unity-basics', 'Unity Basics')
                    },
                    {
                        id: 'game-mechanics',
                        title: 'Game Mechanics',
                        description: 'Implementing game mechanics',
                        lessons: this.generateLessons('game-mechanics', 'Game Mechanics')
                    }
                ]
            },
            {
                id: 'cybersecurity',
                title: 'Cybersecurity',
                description: 'Protect systems and networks',
                icon: '🔒',
                price: 59.99,
                topics: [
                    {
                        id: 'security-basics',
                        title: 'Security Fundamentals',
                        description: 'Basic security concepts',
                        lessons: this.generateLessons('security-basics', 'Security Fundamentals')
                    },
                    {
                        id: 'network-security',
                        title: 'Network Security',
                        description: 'Protecting network infrastructure',
                        lessons: this.generateLessons('network-security', 'Network Security')
                    },
                    {
                        id: 'ethical-hacking',
                        title: 'Ethical Hacking',
                        description: 'Penetration testing basics',
                        lessons: this.generateLessons('ethical-hacking', 'Ethical Hacking')
                    }
                ]
            }
        ];
    }

    generateLessons(topicId, topicTitle) {
        const lessons = [];
        for (let i = 1; i <= 15; i++) {
            lessons.push({
                id: `${topicId}-lesson-${i}`,
                title: `Lesson ${i}: ${this.getLessonTitle(i, topicTitle)}`,
                description: this.getLessonDescription(i, topicTitle),
                duration: 15 + (i * 2), // 15-45 minutes
                difficulty: this.getLessonDifficulty(i),
                content: this.getLessonContent(i, topicTitle),
                exercises: this.getLessonExercises(i, topicTitle)
            });
        }
        return lessons;
    }

    getLessonTitle(lessonNumber, topicTitle) {
        const titles = {
            'Variables and Data Types': [
                'Introduction to Variables', 'Data Types Overview', 'String Manipulation', 'Number Operations',
                'Boolean Logic', 'Type Conversion', 'Arrays and Lists', 'Objects and Dictionaries',
                'Variable Scope', 'Constants', 'Type Checking', 'Memory Management', 'Best Practices',
                'Debugging Variables', 'Advanced Topics'
            ],
            'Control Flow': [
                'If Statements', 'Else If Chains', 'Switch Statements', 'While Loops',
                'For Loops', 'Nested Loops', 'Loop Control', 'Error Handling',
                'Try-Catch Blocks', 'Exception Types', 'Custom Exceptions', 'Debugging Control Flow',
                'Performance Tips', 'Real-world Examples', 'Advanced Patterns'
            ],
            'Functions': [
                'Function Basics', 'Parameters and Arguments', 'Return Values', 'Function Scope',
                'Arrow Functions', 'Higher-order Functions', 'Callbacks', 'Closures',
                'Recursion', 'Function Composition', 'Pure Functions', 'Side Effects',
                'Function Testing', 'Optimization', 'Advanced Concepts'
            ]
        };

        const defaultTitles = [
            'Getting Started', 'Core Concepts', 'Practical Examples', 'Hands-on Practice',
            'Intermediate Topics', 'Advanced Techniques', 'Real Applications', 'Problem Solving',
            'Best Practices', 'Common Pitfalls', 'Optimization', 'Testing Strategies',
            'Integration', 'Case Studies', 'Mastery Level'
        ];

        const topicTitles = titles[topicTitle] || defaultTitles;
        return topicTitles[lessonNumber - 1] || `Lesson ${lessonNumber}`;
    }

    getLessonDescription(lessonNumber, topicTitle) {
        return `Learn ${this.getLessonTitle(lessonNumber, topicTitle).toLowerCase()} in this comprehensive lesson designed for ${topicTitle} students.`;
    }

    getLessonDifficulty(lessonNumber) {
        if (lessonNumber <= 5) return 'beginner';
        if (lessonNumber <= 10) return 'intermediate';
        return 'advanced';
    }

    getLessonContent(lessonNumber, topicTitle) {
        return `
            <h2>${this.getLessonTitle(lessonNumber, topicTitle)}</h2>
            <p>Welcome to lesson ${lessonNumber} of ${topicTitle}. This lesson will help you master important concepts through practical examples and exercises.</p>
            
            <h3>Learning Objectives</h3>
            <ul>
                <li>Understand the core concepts of this topic</li>
                <li>Apply knowledge through practical examples</li>
                <li>Develop problem-solving skills</li>
                <li>Build confidence in your abilities</li>
            </ul>
            
            <h3>Key Concepts</h3>
            <p>In this lesson, we'll explore fundamental concepts that form the foundation of ${topicTitle.toLowerCase()}. You'll learn how to apply these concepts in real-world scenarios.</p>
            
            <h3>Practical Examples</h3>
            <p>Through hands-on examples, you'll see how these concepts work in practice. Each example is designed to reinforce your understanding and build your skills progressively.</p>
            
            <h3>Exercises</h3>
            <p>Practice exercises will help you solidify your knowledge and prepare you for more advanced topics.</p>
        `;
    }

    getLessonExercises(lessonNumber, topicTitle) {
        return [
            {
                id: `exercise-${lessonNumber}-1`,
                title: 'Concept Check',
                description: 'Test your understanding of the basic concepts',
                type: 'quiz'
            },
            {
                id: `exercise-${lessonNumber}-2`,
                title: 'Practical Application',
                description: 'Apply what you\'ve learned in a practical scenario',
                type: 'coding'
            },
            {
                id: `exercise-${lessonNumber}-3`,
                title: 'Challenge Problem',
                description: 'Solve a more complex problem to test your mastery',
                type: 'challenge'
            }
        ];
    }

    renderCourses() {
        const container = document.getElementById('courses-container');
        if (!container) return;

        const userData = gamification.userData;
        const ownedCourses = userData.ownedCourses;

        container.innerHTML = this.courses.map(course => {
            const isOwned = ownedCourses.includes(course.id) || course.price === 0;
            const progress = this.calculateCourseProgress(course.id);

            return `
                <div class="course-card" data-course-id="${course.id}">
                    <div class="course-header">
                        <span class="course-icon">${course.icon}</span>
                        <h3>${course.title}</h3>
                        <span class="course-price ${isOwned ? 'owned' : ''}">
                            ${isOwned ? '✓ Owned' : `$${course.price}`}
                        </span>
                    </div>
                    <p class="course-description">${course.description}</p>
                    <div class="course-progress">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                        <span class="progress-text">${progress}% Complete</span>
                    </div>
                    <div class="course-topics">
                        <h4>Topics (${course.topics.length}):</h4>
                        <ul>
                            ${course.topics.map(topic => `
                                <li>
                                    <span class="topic-title">${topic.title}</span>
                                    <span class="topic-lessons">${topic.lessons.length} lessons</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="course-actions">
                        ${isOwned ? `
                            <button class="btn btn-primary" onclick="coursesSystem.openCourse('${course.id}')">
                                Continue Learning
                            </button>
                        ` : `
                            <button class="btn btn-secondary" onclick="coursesSystem.purchaseCourse('${course.id}')">
                                Purchase Course
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    calculateCourseProgress(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return 0;

        const totalLessons = course.topics.reduce((sum, topic) => sum + topic.lessons.length, 0);
        const completedLessons = gamification.userData.completedLessons.filter(lessonId => 
            course.topics.some(topic => topic.lessons.some(lesson => lesson.id === lessonId))
        ).length;

        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    openCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        this.currentCourse = course;
        this.showCourseView(course);
    }

    showCourseView(course) {
        const container = document.getElementById('courses-container');
        if (!container) return;

        container.innerHTML = `
            <div class="course-view">
                <button class="btn btn-back" onclick="coursesSystem.renderCourses()">
                    ← Back to Courses
                </button>
                <div class="course-detail">
                    <div class="course-header">
                        <span class="course-icon large">${course.icon}</span>
                        <div>
                            <h2>${course.title}</h2>
                            <p>${course.description}</p>
                        </div>
                    </div>
                    <div class="course-topics-grid">
                        ${course.topics.map(topic => this.renderTopic(topic)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderTopic(topic) {
        const completedLessons = topic.lessons.filter(lesson => 
            gamification.userData.completedLessons.includes(lesson.id)
        ).length;
        const progress = Math.round((completedLessons / topic.lessons.length) * 100);

        return `
            <div class="topic-card" data-topic-id="${topic.id}">
                <h3>${topic.title}</h3>
                <p>${topic.description}</p>
                <div class="topic-progress">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                    <span class="progress-text">${completedLessons}/${topic.lessons.length} lessons</span>
                </div>
                <button class="btn btn-primary" onclick="coursesSystem.openTopic('${topic.id}')">
                    ${progress > 0 ? 'Continue' : 'Start'} Topic
                </button>
            </div>
        `;
    }

    openTopic(topicId) {
        if (!this.currentCourse) return;

        const topic = this.currentCourse.topics.find(t => t.id === topicId);
        if (!topic) return;

        this.currentTopic = topic;
        this.showTopicView(topic);
    }

    showTopicView(topic) {
        const container = document.getElementById('courses-container');
        if (!container) return;

        container.innerHTML = `
            <div class="topic-view">
                <button class="btn btn-back" onclick="coursesSystem.showCourseView(coursesSystem.currentCourse)">
                    ← Back to Course
                </button>
                <div class="topic-detail">
                    <h2>${topic.title}</h2>
                    <p>${topic.description}</p>
                    <div class="lessons-grid">
                        ${topic.lessons.map((lesson, index) => this.renderLesson(lesson, index)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderLesson(lesson, index) {
        const isCompleted = gamification.userData.completedLessons.includes(lesson.id);
        const isLocked = index > 0 && !gamification.userData.completedLessons.includes(lesson.id - 1);

        return `
            <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}" data-lesson-id="${lesson.id}">
                <div class="lesson-header">
                    <span class="lesson-number">${index + 1}</span>
                    <h4>${lesson.title}</h4>
                    <span class="lesson-duration">${lesson.duration} min</span>
                </div>
                <p class="lesson-description">${lesson.description}</p>
                <div class="lesson-meta">
                    <span class="lesson-difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
                    ${isCompleted ? '<span class="lesson-status completed">✓ Completed</span>' : ''}
                    ${isLocked ? '<span class="lesson-status locked">🔒 Locked</span>' : ''}
                </div>
                <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}" 
                        onclick="coursesSystem.openLesson('${lesson.id}')"
                        ${isLocked ? 'disabled' : ''}>
                    ${isCompleted ? 'Review' : isLocked ? 'Locked' : 'Start Lesson'}
                </button>
            </div>
        `;
    }

    openLesson(lessonId) {
        if (!this.currentTopic) return;

        const lesson = this.currentTopic.lessons.find(l => l.id === lessonId);
        if (!lesson) return;

        this.currentLesson = lesson;
        this.showLessonView(lesson);
    }

    showLessonView(lesson) {
        const container = document.getElementById('courses-container');
        if (!container) return;

        container.innerHTML = `
            <div class="lesson-view">
                <button class="btn btn-back" onclick="coursesSystem.showTopicView(coursesSystem.currentTopic)">
                    ← Back to Topic
                </button>
                <div class="lesson-content">
                    <div class="lesson-header">
                        <h2>${lesson.title}</h2>
                        <div class="lesson-meta">
                            <span class="lesson-duration">⏱️ ${lesson.duration} minutes</span>
                            <span class="lesson-difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
                        </div>
                    </div>
                    <div class="lesson-body">
                        ${lesson.content}
                    </div>
                    <div class="lesson-exercises">
                        <h3>Exercises</h3>
                        ${lesson.exercises.map(exercise => `
                            <div class="exercise-card">
                                <h4>${exercise.title}</h4>
                                <p>${exercise.description}</p>
                                <button class="btn btn-secondary" onclick="coursesSystem.startExercise('${exercise.id}')">
                                    Start ${exercise.type === 'quiz' ? 'Quiz' : exercise.type === 'coding' ? 'Coding' : 'Challenge'}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="lesson-actions">
                        <button class="btn btn-primary" onclick="coursesSystem.completeLesson('${lesson.id}')">
                            Complete Lesson
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    completeLesson(lessonId) {
        gamification.completeLesson(lessonId);
        
        // Show completion message
        const container = document.getElementById('courses-container');
        if (container) {
            const completionMessage = document.createElement('div');
            completionMessage.className = 'completion-message';
            completionMessage.innerHTML = `
                <h3>🎉 Lesson Completed!</h3>
                <p>You've earned 20 points for completing this lesson.</p>
                <button class="btn btn-primary" onclick="coursesSystem.showTopicView(coursesSystem.currentTopic)">
                    Continue to Next Lesson
                </button>
            `;
            container.appendChild(completionMessage);
        }
    }

    startExercise(exerciseId) {
        // Placeholder for exercise functionality
        alert(`Exercise ${exerciseId} would start here. This is a placeholder for the actual exercise system.`);
    }

    purchaseCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        if (course.price === 0) {
            // Free course
            gamification.purchaseCourse(courseId);
            this.renderCourses();
            return;
        }

        // Paid course - in a real app, this would integrate with payment processing
        if (confirm(`Purchase ${course.title} for $${course.price}?`)) {
            gamification.purchaseCourse(courseId);
            this.renderCourses();
        }
    }

    getCourseById(courseId) {
        return this.courses.find(c => c.id === courseId);
    }

    getTopicById(courseId, topicId) {
        const course = this.getCourseById(courseId);
        return course ? course.topics.find(t => t.id === topicId) : null;
    }

    getLessonById(courseId, topicId, lessonId) {
        const topic = this.getTopicById(courseId, topicId);
        return topic ? topic.lessons.find(l => l.id === lessonId) : null;
    }
}

// Initialize courses system
const coursesSystem = new CoursesSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoursesSystem;
}
