import express from 'express'
import { asyncHandler } from '../middleware/errorHandler'
import { AuthController } from '../controllers/authController'
import { authLimiter } from '../middleware/rateLimiter'

const router = express.Router()
const authController = new AuthController()

// Public routes
router.post('/register', authLimiter, asyncHandler(authController.register))
router.post('/login', authLimiter, asyncHandler(authController.login))
router.post('/refresh', asyncHandler(authController.refreshToken))
router.post('/forgot-password', authLimiter, asyncHandler(authController.forgotPassword))
router.post('/reset-password', authLimiter, asyncHandler(authController.resetPassword))
router.get('/verify-email/:token', asyncHandler(authController.verifyEmail))

// Protected routes (require authentication)
router.post('/logout', asyncHandler(authController.logout))
router.get('/me', asyncHandler(authController.getCurrentUser))
router.put('/change-password', asyncHandler(authController.changePassword))

export default router
