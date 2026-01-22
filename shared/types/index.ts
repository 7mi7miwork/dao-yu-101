// User Types
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatar?: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  emailVerified: boolean
  profile: UserProfile
}

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  GUEST = 'guest'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface UserProfile {
  bio?: string
  interests?: string[]
  skills?: string[]
  level: number
  experience: number
  achievements: Achievement[]
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'minecraft'
  language: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  courseUpdates: boolean
  achievements: boolean
  messages: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showProgress: boolean
  showAchievements: boolean
  allowMessages: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// Course Types
export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  category: string
  difficulty: Difficulty
  duration: number // in minutes
  price: number
  currency: string
  instructor: User
  status: CourseStatus
  tags: string[]
  prerequisites: string[]
  learningObjectives: string[]
  modules: CourseModule[]
  enrolledStudents: number
  rating: number
  reviews: CourseReview[]
  createdAt: Date
  updatedAt: Date
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  PENDING_REVIEW = 'pending_review'
}

export interface CourseModule {
  id: string
  title: string
  description: string
  order: number
  content: CourseContent[]
  quiz?: Quiz
  duration: number
  isRequired: boolean
}

export interface CourseContent {
  id: string
  type: ContentType
  title: string
  content: string | VideoContent | TextContent
  order: number
  duration: number
  isRequired: boolean
}

export enum ContentType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  DOWNLOAD = 'download'
}

export interface VideoContent {
  url: string
  duration: number
  thumbnail?: string
  captions?: string[]
  quality: '360p' | '720p' | '1080p' | '4k'
}

export interface TextContent {
  html: string
  markdown?: string
  readingTime: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  timeLimit?: number // in minutes
  passingScore: number
  maxAttempts: number
  shuffleQuestions: boolean
}

export interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points: number
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay'
}

export interface CourseReview {
  id: string
  user: User
  rating: number
  comment: string
  createdAt: Date
  helpful: number
}

// Progress Types
export interface CourseProgress {
  id: string
  userId: string
  courseId: string
  enrolledAt: Date
  completedAt?: Date
  progress: number // 0-100
  completedModules: string[]
  currentModule?: string
  timeSpent: number // in minutes
  lastAccessedAt: Date
  certificate?: Certificate
}

export interface Certificate {
  id: string
  courseTitle: string
  studentName: string
  instructorName: string
  completionDate: Date
  score: number
  certificateUrl: string
  verificationCode: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  username: string
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  completionRate: number
  revenue: number
  activeUsers: number
}

export interface UserDashboard {
  user: User
  enrolledCourses: Course[]
  progress: CourseProgress[]
  achievements: Achievement[]
  recentActivity: Activity[]
  recommendations: Course[]
}

export interface Activity {
  id: string
  type: ActivityType
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

export enum ActivityType {
  COURSE_ENROLLED = 'course_enrolled',
  LESSON_COMPLETED = 'lesson_completed',
  QUIZ_PASSED = 'quiz_passed',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  COURSE_COMPLETED = 'course_completed'
}
