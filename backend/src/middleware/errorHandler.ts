import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../types'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  let statusCode = 500
  let message = 'Internal Server Error'
  let details: any = undefined

  // Handle known errors
  if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
  } else if (error.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation Error'
    details = error.message
  } else if (error.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  } else if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any
    if (prismaError.code === 'P2002') {
      statusCode = 409
      message = 'Resource already exists'
    } else if (prismaError.code === 'P2025') {
      statusCode = 404
      message = 'Resource not found'
    }
  }

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  // Send error response
  const response: ApiResponse = {
    success: false,
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      originalError: error.message 
    })
  }

  res.status(statusCode).json(response)
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export const notFound = (req: Request, res: Response<ApiResponse>): void => {
  const response: ApiResponse = {
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  }
  
  res.status(404).json(response)
}
