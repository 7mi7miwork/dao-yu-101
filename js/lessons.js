// Dao-Yu-101 - Lessons JavaScript

// Lesson state
const LessonState = {
    currentLesson: null,
    submissionData: null,
    attemptCount: 0,
    validationResult: null
};

// Initialize Lessons page
function renderLessons() {
    console.log('Rendering lessons page');
    
    const archipelagosGrid = document.getElementById('archipelagosGrid');
    if (!archipelagosGrid) return;
    
    let html = '';
    
    AppState.data.archipelagos.forEach(archipelago => {
        const islands = getIslandsByArchipelago(archipelago.id);
        const totalLessons = islands.reduce((sum, island) => sum + island.lesson_count, 0);
        const completedLessons = islands.reduce((sum, island) => sum + island.completed_lessons, 0);
        
        html += `
            <div class="archipelago-card">
                <div class="archipelago-header ${archipelago.name.toLowerCase().replace(' ', '')}">
                    <div class="archipelago-icon">${archipelago.icon}</div>
                    <div class="archipelago-name">${archipelago.name}</div>
                    <div class="archipelago-description">${archipelago.description}</div>
                </div>
                <div class="archipelago-body">
                    <div class="archipelago-stats">
                        <div class="archipelago-stat">
                            <div class="archipelago-stat-value">${archipelago.islands}</div>
                            <div class="archipelago-stat-label">Islands</div>
                        </div>
                        <div class="archipelago-stat">
                            <div class="archipelago-stat-value">${totalLessons}</div>
                            <div class="archipelago-stat-label">Lessons</div>
                        </div>
                        <div class="archipelago-stat">
                            <div class="archipelago-stat-value">${completedLessons}</div>
                            <div class="archipelago-stat-label">Completed</div>
                        </div>
                    </div>
                    <div class="archipelago-islands">
                        <h4>Islands</h4>
                        <div class="island-list">
        `;
        
        islands.slice(0, 3).forEach(island => {
            const progress = (island.completed_lessons / island.lesson_count) * 100;
            html += `
                <div class="island-item">
                    <span class="island-name">${island.name}</span>
                    <div class="island-progress">
                        <span>${island.completed_lessons}/${island.lesson_count}</span>
                        <div class="island-progress-bar">
                            <div class="island-progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="viewArchipelago('${archipelago.id}')">
                        View ${archipelago.name}
                    </button>
                </div>
            </div>
        `;
    });
    
    archipelagosGrid.innerHTML = html;
}

// View specific archipelago
function viewArchipelago(archipelagoId) {
    const archipelago = getArchipelagoById(archipelagoId);
    if (!archipelago) return;
    
    // Store selected archipelago
    localStorage.setItem('selected_archipelago', JSON.stringify(archipelago));
    
    // Navigate to islands view
    window.location.href = `islands.html?id=${archipelagoId}`;
}

// Render lesson detail
function renderLessonDetail(lessonId) {
    const lesson = getLessonById(lessonId);
    if (!lesson) {
        showNotification('Lesson not found', 'error');
        return;
    }
    
    LessonState.currentLesson = lesson;
    
    const island = getIslandById(lesson.island_id);
    const archipelago = getArchipelagoById(island.archipelago_id);
    
    // Update breadcrumbs
    updateBreadcrumbs([
        { label: 'Archipelagos', url: 'archipelagos.html' },
        { label: archipelago.name, url: `islands.html?id=${archipelago.id}` },
        { label: island.name, url: `lessons.html?island=${island.id}` },
        { label: lesson.name, url: null }
    ]);
    
    // Update lesson header
    const lessonTitle = document.getElementById('lessonTitle');
    const lessonDescription = document.getElementById('lessonDescription');
    const lessonStatus = document.getElementById('lessonStatus');
    
    if (lessonTitle) lessonTitle.textContent = lesson.name;
    if (lessonDescription) lessonDescription.textContent = lesson.description;
    
    if (lessonStatus) {
        lessonStatus.textContent = lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1);
        lessonStatus.className = `lesson-status-badge ${lesson.status}`;
    }
    
    // Check if lesson is locked
    if (lesson.status === 'locked') {
        showLockedLessonOverlay(lesson);
        disableSubmission();
    } else {
        enableSubmission();
    }
    
    // Render lesson content based on type
    renderLessonContent(lesson);
}

// Render lesson content based on lesson type
function renderLessonContent(lesson) {
    const contentArea = document.getElementById('lessonContent');
    if (!contentArea) return;
    
    let html = '';
    
    // Sample lesson content based on lesson name
    if (lesson.name.includes('Addition') || lesson.name.includes('Subtraction')) {
        html = renderMathLesson(lesson);
    } else if (lesson.name.includes('Multiplication') || lesson.name.includes('Division')) {
        html = renderMathLesson(lesson);
    } else if (lesson.name.includes('Word Problems')) {
        html = renderWordProblemLesson(lesson);
    } else {
        html = renderGenericLesson(lesson);
    }
    
    contentArea.innerHTML = html;
}

function renderMathLesson(lesson) {
    const operation = lesson.name.includes('Addition') ? 'addition' : 
                      lesson.name.includes('Subtraction') ? 'subtraction' :
                      lesson.name.includes('Multiplication') ? 'multiplication' : 'division';
    
    return `
        <div class="lesson-content-body">
            <h3>Understanding ${lesson.name}</h3>
            
            <p>In this lesson, you will learn the fundamentals of ${operation.toLowerCase()}. This is a foundational skill that will be used throughout your mathematical journey.</p>
            
            <h4>Key Concepts</h4>
            <ul>
                <li>Understanding the operation</li>
                <li>Working with single and multi-digit numbers</li>
                <li>Solving practical problems</li>
                <li>Building mental math skills</li>
            </ul>
            
            <div class="interactive-block">
                <div class="interactive-block-title">🎯 Practice Exercise</div>
                <p>Complete the following exercises to practice what you've learned.</p>
                
                <div class="quiz-container" id="quizContainer">
                    <!-- Quiz will be generated here -->
                </div>
            </div>
            
            <h4>Tips for Success</h4>
            <ul>
                <li>Take your time and work through each problem carefully</li>
                <li>Use scratch paper if needed</li>
                <li>Double-check your answers before submitting</li>
                <li>Remember: Learning is about progress, not perfection</li>
            </ul>
        </div>
    `;
}

function renderWordProblemLesson(lesson) {
    return `
        <div class="lesson-content-body">
            <h3>Solving Word Problems</h3>
            
            <p>Word problems help you apply mathematical concepts to real-world situations. This lesson will teach you strategies for understanding and solving word problems.</p>
            
            <h4>Problem-Solving Strategy</h4>
            <ol>
                <li><strong>Read the problem carefully</strong> - Understand what's being asked</li>
                <li><strong>Identify the important information</strong> - What numbers do you need?</li>
                <li><strong>Choose the right operation</strong> - Addition or subtraction?</li>
                <li><strong>Solve the problem</strong> - Do the calculation</li>
                <li><strong>Check your answer</strong> - Does it make sense?</li>
            </ol>
            
            <div class="interactive-block">
                <div class="interactive-block-title">📝 Practice Problems</div>
                
                <div class="quiz-container" id="quizContainer">
                    <!-- Quiz will be generated here -->
                </div>
            </div>
            
            <h4>Common Mistakes to Avoid</h4>
            <ul>
                <li>Rushing through the problem statement</li>
                <li>Using the wrong operation</li>
                <li>Not checking if the answer makes sense</li>
                <li>Forgetting to include units in your answer</li>
            </ul>
        </div>
    `;
}

function renderGenericLesson(lesson) {
    return `
        <div class="lesson-content-body">
            <h3>${lesson.name}</h3>
            
            <p>${lesson.description}</p>
            
            <div class="interactive-block">
                <div class="interactive-block-title">📚 Lesson Content</div>
                <p>This lesson covers important concepts related to ${lesson.name.toLowerCase()}.</p>
                <p>Work through the material carefully and complete the exercises to demonstrate your understanding.</p>
            </div>
        </div>
    `;
}

// Generate quiz for lesson
function generateQuiz(lesson) {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    let html = '';
    
    // Generate sample quiz based on lesson type
    if (lesson.name.includes('Addition')) {
        html = generateAdditionQuiz();
    } else if (lesson.name.includes('Subtraction')) {
        html = generateSubtractionQuiz();
    } else if (lesson.name.includes('Multiplication')) {
        html = generateMultiplicationQuiz();
    } else if (lesson.name.includes('Division')) {
        html = generateDivisionQuiz();
    } else if (lesson.name.includes('Word Problems')) {
        html = generateWordProblemQuiz();
    } else {
        html = generateGenericQuiz();
    }
    
    quizContainer.innerHTML = html;
}

function generateAdditionQuiz() {
    const questions = [];
    for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        questions.push({
            question: `${a} + ${b} = ?`,
            answer: a + b,
            options: generateOptions(a + b)
        });
    }
    
    return renderQuiz(questions);
}

function generateSubtractionQuiz() {
    const questions = [];
    for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 5) + 1;
        questions.push({
            question: `${a} - ${b} = ?`,
            answer: a - b,
            options: generateOptions(a - b)
        });
    }
    
    return renderQuiz(questions);
}

function generateMultiplicationQuiz() {
    const questions = [];
    for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        questions.push({
            question: `${a} × ${b} = ?`,
            answer: a * b,
            options: generateOptions(a * b)
        });
    }
    
    return renderQuiz(questions);
}

function generateDivisionQuiz() {
    const questions = [];
    for (let i = 0; i < 5; i++) {
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = Math.floor(Math.random() * 10) + 1;
        const a = b * answer;
        questions.push({
            question: `${a} ÷ ${b} = ?`,
            answer: answer,
            options: generateOptions(answer)
        });
    }
    
    return renderQuiz(questions);
}

function generateWordProblemQuiz() {
    const questions = [
        {
            question: 'Sarah has 5 apples. She buys 3 more apples. How many apples does Sarah have now?',
            answer: 8,
            options: generateOptions(8)
        },
        {
            question: 'There are 12 birds on a tree. 4 birds fly away. How many birds are left on the tree?',
            answer: 8,
            options: generateOptions(8)
        },
        {
            question: 'Tom has 7 toy cars. His friend gives him 6 more cars. How many toy cars does Tom have?',
            answer: 13,
            options: generateOptions(13)
        }
    ];
    
    return renderQuiz(questions);
}

function generateGenericQuiz() {
    const questions = [
        {
            question: 'What is the main concept covered in this lesson?',
            answer: 'Core understanding',
            options: ['Core understanding', 'Basic knowledge', 'Advanced concepts', 'Introduction']
        },
        {
            question: 'True or False: Practice is essential for learning?',
            answer: 'True',
            options: ['True', 'False']
        }
    ];
    
    return renderQuiz(questions);
}

function generateOptions(correctAnswer) {
    const options = [correctAnswer];
    
    while (options.length < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const option = correctAnswer + offset;
        if (option !== correctAnswer && option > 0 && !options.includes(option)) {
            options.push(option);
        }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
}

function renderQuiz(questions) {
    let html = '';
    
    questions.forEach((q, index) => {
        html += `
            <div class="quiz-question" data-question="${index}">
                <strong>Question ${index + 1}:</strong> ${q.question}
            </div>
            <div class="quiz-options">
        `;
        
        q.options.forEach((option, optIndex) => {
            html += `
                <div class="quiz-option" data-question="${index}" data-option="${optIndex}" data-answer="${q.answer}">
                    ${option}
                </div>
            `;
        });
        
        html += `
            </div>
        `;
    });
    
    return html;
}

// Handle quiz option selection
function initializeQuizListeners() {
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            const questionIndex = this.dataset.question;
            
            // Remove selected from siblings
            document.querySelectorAll(`.quiz-option[data-question="${questionIndex}"]`)
                .forEach(opt => opt.classList.remove('selected'));
            
            // Add selected to clicked option
            this.classList.add('selected');
        });
    });
}

// Submit lesson
function submitLesson() {
    if (LessonState.currentLesson.status === 'locked') {
        showNotification('This lesson is locked. Complete previous lessons first.', 'error');
        return;
    }
    
    // Check if quiz is completed
    const selectedOptions = document.querySelectorAll('.quiz-option.selected');
    if (selectedOptions.length === 0) {
        showNotification('Please answer all questions before submitting.', 'warning');
        return;
    }
    
    // Calculate score
    let correct = 0;
    let total = 0;
    
    selectedOptions.forEach(option => {
        total++;
        const selectedAnswer = parseInt(option.textContent.trim());
        const correctAnswer = parseInt(option.dataset.answer);
        
        if (selectedAnswer === correctAnswer) {
            correct++;
            option.classList.add('correct');
        } else {
            option.classList.add('incorrect');
        }
    });
    
    const score = (correct / total) * 100;
    
    // Determine pass/fail
    const passed = score >= 70;
    
    LessonState.attemptCount++;
    
    // Show results
    showValidationResults(passed, score, correct, total);
    
    if (passed) {
        // Update lesson status
        LessonState.currentLesson.status = 'completed';
        showNotification('Congratulations! Lesson completed successfully!', 'success');
        
        // Award XP
        const xpEarned = 50;
        showNotification(`+${xpEarned} XP earned!`, 'success');
        
        // Save progress (in real app, this would go to server)
        saveLessonProgress(LessonState.currentLesson.id, 'completed');
    } else {
        showNotification('Not quite there. Review the material and try again.', 'warning');
    }
}

function showValidationResults(passed, score, correct, total) {
    const resultsArea = document.getElementById('validationResults');
    if (!resultsArea) return;
    
    const html = `
        <div class="validation-results ${passed ? 'success' : 'failure'}">
            <div class="validation-results-header">
                <span class="validation-results-icon">${passed ? '✅' : '❌'}</span>
                <div class="validation-results-title">${passed ? 'Lesson Passed!' : 'Lesson Not Passed'}</div>
            </div>
            <div class="validation-results-content">
                <p><strong>Score:</strong> ${score.toFixed(0)}%</p>
                <p><strong>Correct Answers:</strong> ${correct}/${total}</p>
            </div>
            <div class="validation-feedback">
                <h4>${passed ? 'Great work!' : 'Keep practicing!'}</h4>
                <p>${passed ? 
                    'You have successfully demonstrated understanding of this lesson. You can now proceed to the next lesson.' : 
                    'Review the lesson material and try again. Remember, learning takes time and effort. You\'ve got this!'}</p>
                ${!passed ? '<p><strong>Note:</strong> After 3 failed attempts, additional resources will be provided to help you master this concept.</p>' : ''}
            </div>
        </div>
    `;
    
    resultsArea.innerHTML = html;
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveLessonProgress(lessonId, status) {
    // In a real application, this would send data to the server
    console.log(`Saving progress for lesson ${lessonId}: ${status}`);
    
    // Store in localStorage for demo
    const progress = JSON.parse(localStorage.getItem('lesson_progress') || '{}');
    progress[lessonId] = {
        status: status,
        completedAt: new Date().toISOString(),
        attempts: LessonState.attemptCount
    };
    localStorage.setItem('lesson_progress', JSON.stringify(progress));
}

function showLockedLessonOverlay(lesson) {
    const existing = document.getElementById('lockedOverlay');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'lockedOverlay';
    overlay.className = 'locked-lesson-overlay';
    overlay.innerHTML = `
        <div class="locked-lesson-content">
            <div style="font-size: 64px; margin-bottom: 16px;">🔒</div>
            <h2>Lesson Locked</h2>
            <p>This lesson is locked until you complete the previous lessons in this island.</p>
            <p><strong>Requirement:</strong> Complete Lesson ${lesson.sort_order - 1} to unlock this lesson.</p>
            <button class="btn btn-primary btn-large" onclick="closeLockedOverlay()">Return to Previous Lesson</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function closeLockedOverlay() {
    const overlay = document.getElementById('lockedOverlay');
    if (overlay) overlay.remove();
    
    // Navigate to previous lesson or islands list
    if (LessonState.currentLesson.sort_order > 1) {
        const previousLesson = AppState.data.lessons.find(l => 
            l.island_id === LessonState.currentLesson.island_id && 
            l.sort_order === LessonState.currentLesson.sort_order - 1
        );
        if (previousLesson) {
            window.location.href = `lesson-detail.html?id=${previousLesson.id}`;
        }
    } else {
        window.history.back();
    }
}

function disableSubmission() {
    const submitBtn = document.getElementById('submitLessonBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Lesson Locked';
    }
}

function enableSubmission() {
    const submitBtn = document.getElementById('submitLessonBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Lesson';
        submitBtn.onclick = submitLesson;
    }
}

// Export functions
window.LessonState = LessonState;
window.renderLessonDetail = renderLessonDetail;
window.generateQuiz = generateQuiz;
window.initializeQuizListeners = initializeQuizListeners;
window.submitLesson = submitLesson;
window.showLockedLessonOverlay = showLockedLessonOverlay;
window.closeLockedOverlay = closeLockedOverlay;