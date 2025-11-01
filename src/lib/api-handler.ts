/**
 * API route handler wrapper with standardized error handling
 * Provides consistent error responses and logging for all API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import {
  AppError,
  ErrorFactory,
  formatErrorResponse,
  getErrorStatusCode,
  isOperationalError,
} from './errors'
import { handlePrismaError, isPrismaError } from './prisma-errors'
import { logger } from './logger'

// API handler function type
type ApiHandler = (
  req: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>

// API handler options
interface ApiHandlerOptions {
  requireAuth?: boolean
  requiredRole?: 'ADMIN' | 'USER'
  logRequests?: boolean
}

// Standardized success response
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status })
}

// Standardized error response
export function errorResponse(error: unknown, path?: string): NextResponse {
  let appError: AppError

  // Convert different error types to AppError
  if (error instanceof AppError) {
    appError = error
  } else if (isPrismaError(error)) {
    appError = handlePrismaError(error)
  } else if (error instanceof ZodError) {
    appError = ErrorFactory.validation('Data tidak valid', error.errors)
  } else if (error instanceof Error) {
    appError = ErrorFactory.internalError(error.message)
  } else {
    appError = ErrorFactory.internalError()
  }

  const statusCode = getErrorStatusCode(appError)
  const response = formatErrorResponse(appError, path)

  return NextResponse.json(response, { status: statusCode })
}

// Wrap API handler with error handling and authentication
export function withApiHandler(
  handler: ApiHandler,
  options: ApiHandlerOptions = {}
): ApiHandler {
  const {
    requireAuth = false,
    requiredRole,
    logRequests = process.env.NODE_ENV === 'development',
  } = options

  return async (req: NextRequest, context?: { params: Record<string, string> }) => {
    const startTime = Date.now()
    const method = req.method
    const path = req.nextUrl.pathname

    try {
      // Log incoming request
      if (logRequests) {
        logger.debug(`${method} ${path}`, 'API', {
          method,
          path,
          params: context?.params,
        })
      }

      // Check authentication if required
      if (requireAuth) {
        const session = await getServerSession(authOptions)

        if (!session) {
          throw ErrorFactory.unauthorized('Silakan login terlebih dahulu')
        }

        // Check role if specified
        if (requiredRole) {
          const userRole = (session.user as any)?.role

          if (userRole !== requiredRole) {
            throw ErrorFactory.forbidden('Anda tidak memiliki akses ke resource ini')
          }
        }
      }

      // Execute handler
      const response = await handler(req, context)

      // Log successful request
      if (logRequests) {
        const duration = Date.now() - startTime
        logger.debug(`${method} ${path} completed`, 'API', {
          method,
          path,
          status: response.status,
          duration: `${duration}ms`,
        })
      }

      return response
    } catch (error) {
      // Log error
      const duration = Date.now() - startTime
      logger.apiError(
        path,
        method,
        error,
        undefined, // userId could be extracted from session if needed
        {
          duration: `${duration}ms`,
          params: context?.params,
        }
      )

      // Return error response
      return errorResponse(error, path)
    }
  }
}

// Helper to validate request body with Zod schema
export async function validateBody<T>(req: NextRequest, schema: any): Promise<T> {
  try {
    const body = await req.json()
    return schema.parse(body) as T
  } catch (error) {
    if (error instanceof ZodError) {
      throw ErrorFactory.validation('Data tidak valid', error.errors)
    }
    throw ErrorFactory.validation('Format data tidak valid')
  }
}

// Helper to get authenticated user
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw ErrorFactory.unauthorized()
  }

  return session.user as { id: string; email: string; name: string; role: string }
}

// Helper to check if user has admin role
export async function requireAdmin() {
  const user = await getAuthenticatedUser()

  if (user.role !== 'ADMIN') {
    throw ErrorFactory.forbidden('Akses ditolak. Hanya admin yang dapat mengakses resource ini.')
  }

  return user
}

// Wrapper for async operations with error handling
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (context) {
      logger.error(`Error in ${context}`, error, context)
    }

    if (isPrismaError(error)) {
      throw handlePrismaError(error)
    }

    if (error instanceof AppError) {
      throw error
    }

    throw ErrorFactory.internalError()
  }
}
