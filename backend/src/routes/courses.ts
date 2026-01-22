import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { CourseController } from '../controllers/courseController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()
const courseController = new CourseController()

// Public routes
router.get('/', asyncHandler(courseController.getAllCourses))
router.get('/featured', asyncHandler(courseController.getFeaturedCourses))
router.get('/category/:category', asyncHandler(courseController.getCoursesByCategory))
router.get('/:id', asyncHandler(courseController.getCourseById))
router.get('/:id/reviews', asyncHandler(courseController.getCourseReviews))

// Protected routes (require authentication)
router.use(authMiddleware)

// Enrollment routes
router.post('/:id/enroll', asyncHandler(courseController.enrollCourse))
router.delete('/:id/enroll', asyncHandler(courseController.unenrollCourse))
router.get('/:id/progress', asyncHandler(courseController.getCourseProgress))

// Course content access
router.get('/:id/modules', asyncHandler(courseController.getCourseModules))
router.get('/:id/modules/:moduleId', asyncHandler(courseController.getModuleContent))

// Review and rating
router.post('/:id/reviews', asyncHandler(courseController.createReview))
router.put('/:id/reviews/:reviewId', asyncHandler(courseController.updateReview))
router.delete('/:id/reviews/:reviewId', asyncHandler(courseController.deleteReview))

// Instructor routes (require teacher role)
router.post('/', asyncHandler(courseController.createCourse))
router.put('/:id', asyncHandler(courseController.updateCourse))
router.delete('/:id', asyncHandler(courseController.deleteCourse))
router.post('/:id/publish', asyncHandler(courseController.publishCourse))
router.post('/:id/archive', asyncHandler(courseController.archiveCourse))

// Module management
router.post('/:id/modules', asyncHandler(courseController.createModule))
router.put('/:id/modules/:moduleId', asyncHandler(courseController.updateModule))
router.delete('/:id/modules/:moduleId', asyncHandler(courseController.deleteModule))

export default router
