# Dao-Yu-101
**A Modular Island-Based Self-Learning Platform for Joyful, Independent Education**

---

## 📘 Project Overview

**Dao-Yu-101** is a **hybrid online learning platform** designed for **schools and individual learners**, blending:
- Structured, sequential learning
- Human supervision
- Strong anti-cheat mechanisms
- Gamification
- AI-assisted practice

The platform uses an **archipelago metaphor**, transforming learning into a guided journey rather than a checklist.

> **Vision**
> A modular self-learning platform focused on **joyful, independent learning**—structured, human-verified, and resistant to shortcuts.

---

## 🗺️ Core Learning Concept: Archipelago Model

### Archipelagos
- Represent **subjects** (e.g., Coding, Logic, Design, STEM)
- Independently configurable
- Custom progression rules per archipelago

### Islands
- Topic-focused learning areas
- Contain multiple lessons
- Locked until prerequisites are met
- Visually represented on a map

### Lessons
- Completed **sequentially**
- Cannot be skipped without validation
- Progress verified at multiple checkpoints

**Learning is a journey through islands, not a list of tasks.**

---

## 🎯 Target Audience

- **Primary:** Kids (6–10), Teens (11–16)
- **Secondary:** Young adults

**Usage Contexts:**
- Schools (class-based, supervised)
- Individuals (self-learning at home)

---

## 🧠 Learning Philosophy

Dao-Yu-101 is built around **self-guided learning with human oversight**.

### Core Principles
- Mostly self-guided
- Teachers as mentors & facilitators
- Learning by doing
- Gamification & project-based learning
- No pressure, no grades
- Progress-based, not time-based

### Progression Rules
- Linear learning paths
- Beginner → Advanced scaling
- Skipping **not allowed** (except via level tests)
- Skill trees & levels define mastery
- Certificates awarded on completion

---

## 📚 Learning Domains (Initial)

### Coding (Primary Focus)
- **Minecraft Education**
  - MakeCode Block Coding
  - MakeCode Python
  - MakeCode JavaScript
- Transition to **Visual Studio Code** for advanced development

### Additional Domains
- Logic & problem-solving
- Design
- Mixed STEM projects

---

## 🧩 Lesson Structure

Each lesson includes:
1. Explainer video
2. Written explanation
3. Interactive quizzes
4. Mandatory lesson test
5. Dual-password validation

**Supported Quiz & Task Types:**
- Multiple choice
- Input-based validation
- Logic questions
- AI-generated practice tasks

---

## 🔐 Anti-Cheat Progression System

Progression requires **two independent validations**:

### Password A (Internal)
- Generated after passing a lesson test
- Deterministic or randomized
- Time-limited or single-use
- Bound to lesson + student

### Password B (External)
- Provided by a **human authority** (teacher, school, parent, or classroom environment)

**Prevents:**
- Automation
- Brute-force bypassing
- Self-validation

> ⚠️ **AI systems cannot generate or bypass passwords.**

---

## 👥 Roles & Permissions

### Platform Roles
| Role            | Responsibility                     |
|-----------------|-------------------------------------|
| Admin           | Full system control, licensing      |
| Tech Support    | Diagnostics, user issues            |
| Sales           | School onboarding, licenses        |

### Education Roles
| Role            | Responsibility                     |
|-----------------|-------------------------------------|
| School Admin    | Teachers, students, policies        |
| Teacher (Internal) | Mentoring, special classes       |
| Teacher (External) | Optional, on-demand mentoring   |

### Learning Roles
| Role            | Responsibility                     |
|-----------------|-------------------------------------|
| Student         | Learn, complete lessons             |
| Parent          | Read-only progress access           |

---

## 📊 Dashboard System

### Shared Features
- Role-based UI
- Secure authentication
- Notifications & activity logs
- Progress visualization

### Dashboard Capabilities
| Role            | Dashboard Features                  |
|-----------------|-------------------------------------|
| Admin           | System health, users, revenue       |
| Tech Support    | Tickets, diagnostics                 |
| Sales           | Licenses, schools                   |
| School          | Teachers, students, reports         |
| Teacher         | Lessons, passwords, progress        |
| Student         | Lessons, XP, achievements            |
| Parent          | Progress summaries                  |
| Platform Teacher| Content editor, analytics           |

---

## 🎮 Gamification System

### Goals
- Increase motivation
- Encourage consistency
- Reward mastery (not repetition)
- Visualize learning progress

### Elements
- XP (difficulty-scaled)
- Badges & achievements
- Island map progression
- Fog-of-war unlocking

### Abuse Protection
- No XP for failed attempts
- Diminishing returns on retries
- Password-gated progression
- AI-assisted anomaly detection

---

## 🤖 AI Tutor System

The AI Tutor is a **support tool**, not a replacement for teachers.

### Capabilities
- Context-aware hints
- Explanation rephrasing
- Step-by-step guidance
- Adaptive practice tasks
- Answer evaluation & feedback

### Restrictions
- Cannot unlock lessons
- Cannot generate passwords
- Cannot override progression rules

---

## 🗂️ Content Management
- Markdown-based lessons
- Video embedding
- Quiz & test schemas
- Versioning & rollback
- Content review workflows

---

## 📈 Progress Tracking & Analytics

**Tracked Metrics:**
- Lesson completion
- Time spent
- Test attempts
- Password usage
- XP progression
- AI task success rate
- Hint usage frequency

**Reports:**
- Per student, class, school
- Exportable formats

---

## 🔒 Security & Compliance
- Role-based access control (RBAC)
- Password hashing
- Audit logs
- Anti-cheat enforcement
- Optional GDPR/COPPA compliance

---

## 🧱 Architecture (Conceptual)

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