# dao-yu-101

**dao-yu-101** is an island-based learning platform designed to combine structured education, human supervision, anti-cheat mechanisms, gamification, and AI-assisted learning.

The platform uses an **archipelago metaphor**:
- **Archipelagos** represent subjects
- **Islands** represent topic areas
- **Lessons** are completed sequentially on islands

Progression is controlled through tests, validation logic, and a dual-password system to ensure real learning and prevent cheating.

---

## Table of Contents

1. Project Overview  
2. Core Learning Concept  
3. Lesson Structure  
4. Anti-Cheat Progression System  
5. User Roles & Permissions  
6. Dashboard System  
7. Gamification System  
8. AI Tutor System  
9. Content Management  
10. Progress Tracking & Analytics  
11. Security & Compliance  
12. Technology Stack (Conceptual)  
13. Repository Structure  
14. Roadmap  
15. Contribution Guidelines  
16. License  
17. Project Vision  

---

## 1. Project Overview

dao-yu-101 is a modular learning platform built for:
- Schools
- Teachers
- Students
- Parents
- Educational organizations

Key principles:
- Sequential learning
- Visual exploration
- Human verification
- AI-assisted practice
- Anti-cheat enforcement

The platform is designed to work both **online** and in **supervised classroom environments**.

---

## 2. Core Learning Concept

### 2.1 Archipelagos
- Represent subjects (e.g. Programming, Math, Science)
- Independently configurable
- Enabled or disabled per school or license
- Can have custom progression rules

### 2.2 Islands
- Topic-focused learning areas
- Contain multiple lessons
- Locked until prerequisites are met
- Visual progression on a map interface

### 2.3 Sequential Progression
- Lessons must be completed in order
- Skipping is not possible
- Progress is validated at multiple checkpoints

---

## 3. Lesson Structure

Each lesson contains:

1. Explainer video  
2. Written explanation  
3. Interactive quizzes  
4. Mandatory lesson test  
5. Dual-password validation  

Supported quiz types:
- Multiple choice
- Input-based validation
- Logic questions
- AI-generated practice tasks

---

## 4. Anti-Cheat Progression System

After passing a lesson test, students must enter **two passwords** to continue.

### 4.1 Password A – Internal
- Generated after successful test completion
- Deterministic or randomized
- Can be time-limited or single-use
- Linked to lesson and student

### 4.2 Password B – External
- Provided by a human authority:
  - Teacher
  - School
  - Parent
  - Physical classroom
- Prevents:
  - Unsupervised automation
  - Brute-force guessing
  - Self-bypassing progression

The AI system **cannot generate or bypass passwords**.

---

## 5. User Roles & Permissions

### 5.1 Platform Roles

#### Admin
- Full system access
- User and role management
- Global configuration
- Archipelago creation
- Licensing and pricing control

#### Tech Support
- User issue resolution
- Limited account recovery
- System diagnostics
- Log access
- No content modification

#### Sales
- School onboarding
- License management
- Subscription overview
- Aggregated usage statistics
- No access to student-level data

---

### 5.2 Education Roles

#### Schools (Organization Accounts)
- Manage teachers and students
- Assign archipelagos
- View aggregated progress reports
- Manage external password policies

#### School Teachers
- Assign lessons and islands
- Generate external passwords
- Monitor student progress
- Review flagged AI evaluations

#### Platform Teachers (Internal)
- Create and edit lessons
- Upload videos
- Design quizzes and tests
- Define progression rules
- Maintain content versions

---

### 5.3 Learning Roles

#### Students
- Access assigned content
- Complete lessons sequentially
- Take quizzes and tests
- Enter passwords to progress
- View personal dashboard and achievements

#### Parents
- Read-only access
- View progress, test results, and time spent
- No interaction with passwords or content

---

## 6. Dashboard System

### 6.1 Shared Dashboard Features
- Role-based UI rendering
- Secure authentication
- Notifications
- Activity logs
- Progress visualization

### 6.2 Dashboard Overview by Role

| Role | Dashboard Capabilities |
|----|----|
| Admin | System health, users, revenue |
| Tech Support | Tickets, diagnostics |
| Sales | Licenses, schools |
| School | Teachers, students, reports |
| Teacher | Lessons, passwords, progress |
| Student | Lessons, XP, achievements |
| Parent | Progress summaries |
| Platform Teacher | Content editor, analytics |

---

## 7. Gamification System

### 7.1 Goals
- Increase motivation
- Encourage consistency
- Reward mastery over repetition
- Visualize learning progress

### 7.2 Gamification Elements

#### Experience Points (XP)
- Earned by:
  - Lesson completion
  - Passing tests
  - Solving AI-generated tasks
- Difficulty-based scaling

#### Badges & Achievements
- Island completion
- Learning streaks
- Mastery milestones
- Anti-cheat compliant only

#### Island Map Progression
- Visual unlocking
- Fog-of-war mechanics
- Progress animations

### 7.3 Abuse Protection
- No XP for failed attempts
- Diminishing returns on retries
- Password-gated progression
- AI-assisted anomaly detection

---

## 8. AI Tutor System

### 8.1 Overview

The AI Tutor is a **support system**, not a replacement for teachers.

It:
- Assists learning
- Generates practice tasks
- Evaluates student answers
- Provides hints, not solutions

It **cannot**:
- Unlock lessons
- Generate passwords
- Override progression rules

---

### 8.2 AI Tutor Capabilities

#### For Students
- Context-aware hints
- Explanation rephrasing
- Step-by-step guidance
- Adaptive practice tasks
- Feedback on answers

#### For Teachers
- Suggested exercises
- Difficulty calibration
- Common mistake insights
- Review flags for unclear answers

---

### 8.3 AI Task Generation
Supported task types:
- Multiple choice
- Open-ended questions
- Logic challenges
- Future: coding exercises

Each task includes:
- Expected answer schema
- Evaluation rules
- Difficulty rating
- XP mapping

---

### 8.4 AI Answer Evaluation
Evaluation methods:
- Rule-based validation
- Pattern matching
- Semantic similarity
- Partial credit scoring

Outputs:
- Correct / Incorrect
- Confidence score
- Feedback explanation
- Retry suggestion (if allowed)

---

## 9. Content Management

- Markdown-based lesson content
- Video embedding (external or self-hosted)
- Quiz and test schemas
- Versioning and rollback
- Content review workflows

---

## 10. Progress Tracking & Analytics

Tracked metrics include:
- Lesson completion
- Time spent
- Test attempts
- Password usage
- XP progression
- AI task success rate
- Hint usage frequency

Reports:
- Per student
- Per class
- Per school
- Exportable formats

---

## 11. Security & Compliance

- Role-based access control (RBAC)
- Password hashing
- Audit logs
- Anti-cheat enforcement
- Optional GDPR / COPPA compliance layers

---

## 12. Technology Stack (Conceptual)

```text
Frontend:
- Island-based UI
- Role-specific dashboards

Backend:
- API-driven architecture
- Rule-based progression engine

AI Layer:
- Prompt templates
- Evaluation logic
- Safety constraints

Gamification Engine:
- XP rules
- Achievement triggers

---

## 13. Repository Structure

The repository is structured to reflect the island-based learning concept and role-based dashboards.

```text
/archipelagos        # Subject groupings
/islands             # Topic-based islands
/lessons             # Lesson definitions (markdown, metadata)
/quizzes             # Quiz schemas and logic
/tests               # Lesson tests and validation rules
/ai                  # AI Tutor logic, prompts, evaluation
/gamification        # XP, badges, progression rules
/dashboards          # Role-based dashboards
/auth                # Authentication and authorization
/docs                # Documentation and specifications

 Each directory is designed to be modular and independently extendable without
breaking the progression or anti-cheat systems.

14. Roadmap

Phase 1 – MVP
	•	Island-based navigation
	•	Lesson flow (video, text, quiz, test)
	•	Dual-password progression system
	•	Student and teacher dashboards
	•	Core role-based access control

Phase 2 – Gamification
	•	Experience points (XP)
	•	Badges and achievements
	•	Island map progression visuals
	•	Anti-abuse and retry limits

Phase 3 – AI Tutor v1
	•	Context-aware hints
	•	AI-generated practice tasks
	•	Answer evaluation with feedback
	•	Teacher review flags for low-confidence answers

Phase 4 – Advanced Features
	•	Adaptive difficulty
	•	Offline classroom mode
	•	Parent-friendly summaries
	•	Extended analytics and insights

⸻

15. Contribution Guidelines

Contributions must follow these principles:
	•	No bypassing of progression logic
	•	No weakening of anti-cheat mechanisms
	•	Clear separation of concerns
	•	Security-first mindset

Development Rules
	•	Feature branches only
	•	Descriptive commit messages
	•	Mandatory code reviews
	•	No direct pushes to main

⸻

16. License

The license will define:
	•	Commercial usage terms
	•	Educational usage permissions
	•	Redistribution rules
	•	Third-party dependency constraints

Final license details will be added before public or commercial release.

⸻

17. Project Vision

dao-yu-101 is built on the belief that learning should be:
	•	Structured, not chaotic
	•	Visually explorable
	•	Human-verified
	•	AI-supported, not AI-controlled
	•	Resistant to cheating and automation

The platform prioritizes:
	•	Understanding over speed
	•	Guidance over shortcuts
	•	Progress over mere completion

Learning is treated as a journey through islands, not a checklist.
