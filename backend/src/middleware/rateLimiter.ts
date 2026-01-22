import { RateLimiterMemory } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'

// Create rate limiters
const apiLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes (900 seconds)
  blockDuration: 900, // Block for 15 minutes
})

const authLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
})

const uploadLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 10, // Number of requests
  duration: 3600, // Per hour
  blockDuration: 3600, // Block for 1 hour
})

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Choose appropriate limiter based on route
    let limiter = apiLimiter
    
    if (req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
      limiter = authLimiter
    } else if (req.path.includes('/upload')) {
      limiter = uploadLimiter
    }

    await limiter.consume(req.ip || 'unknown')
    next()
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1
    res.set('Retry-After', String(secs))
    
    res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${secs} seconds.`,
      retryAfter: secs
    })
  }
}

export const createRateLimiter = (options: {
  points?: number
  duration?: number
  blockDuration?: number
}) => {
  return new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip || 'unknown',
    points: options.points || 100,
    duration: options.duration || 900,
    blockDuration: options.blockDuration || 900,
  })
}
