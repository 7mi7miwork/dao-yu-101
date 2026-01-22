import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { UserController } from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()
const userController = new UserController()

// Apply authentication middleware to all routes
router.use(authMiddleware)

// User profile routes
router.get('/profile', asyncHandler(userController.getProfile))
router.put('/profile', asyncHandler(userController.updateProfile))
router.post('/avatar', asyncHandler(userController.uploadAvatar))

// User settings
router.get('/preferences', asyncHandler(userController.getPreferences))
router.put('/preferences', asyncHandler(userController.updatePreferences))

// User achievements
router.get('/achievements', asyncHandler(userController.getAchievements))
router.get('/certificates', asyncHandler(userController.getCertificates))

// User activity
router.get('/activity', asyncHandler(userController.getActivity))
router.get('/stats', asyncHandler(userController.getStats))

// Admin routes (require admin role)
router.get('/', asyncHandler(userController.getAllUsers))
router.get('/:id', asyncHandler(userController.getUserById))
router.put('/:id', asyncHandler(userController.updateUser))
router.delete('/:id', asyncHandler(userController.deleteUser))
router.put('/:id/status', asyncHandler(userController.updateUserStatus))

export default router
