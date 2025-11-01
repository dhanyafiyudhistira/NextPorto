/**
 * Centralized error handling utilities
 * Provides standardized error types, error codes, and error handling functions
 */

// Error codes for consistent error identification
export enum ErrorCode {
  // Authentication errors (1xxx)
  UNAUTHORIZED = 'ERR_1001',
  INVALID_CREDENTIALS = 'ERR_1002',
  SESSION_EXPIRED = 'ERR_1003',
  INSUFFICIENT_PERMISSIONS = 'ERR_1004',

  // Validation errors (2xxx)
  VALIDATION_ERROR = 'ERR_2001',
  INVALID_INPUT = 'ERR_2002',
  MISSING_REQUIRED_FIELD = 'ERR_2003',

  // Database errors (3xxx)
  DATABASE_ERROR = 'ERR_3001',
  RECORD_NOT_FOUND = 'ERR_3002',
  DUPLICATE_RECORD = 'ERR_3003',
  FOREIGN_KEY_CONSTRAINT = 'ERR_3004',
  DATABASE_CONNECTION_ERROR = 'ERR_3005',

  // Business logic errors (4xxx)
  BUSINESS_RULE_VIOLATION = 'ERR_4001',
  INSUFFICIENT_STOCK = 'ERR_4002',
  INVALID_OPERATION = 'ERR_4003',

  // Server errors (5xxx)
  INTERNAL_SERVER_ERROR = 'ERR_5001',
  SERVICE_UNAVAILABLE = 'ERR_5002',
  TIMEOUT = 'ERR_5003',

  // Network errors (6xxx)
  NETWORK_ERROR = 'ERR_6001',
  REQUEST_FAILED = 'ERR_6002',
}

// Standardized error response structure
export interface ApiErrorResponse {
  error: string
  code: ErrorCode
  message: string
  details?: unknown
  timestamp: string
  path?: string
}

// Custom application error class
export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details?: unknown
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: unknown,
    isOperational: boolean = true
  ) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.isOperational = isOperational

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}

// Predefined error factories for common scenarios
export const ErrorFactory = {
  unauthorized: (message = 'Unauthorized access') =>
    new AppError(message, ErrorCode.UNAUTHORIZED, 401),

  invalidCredentials: (message = 'Email atau password salah') =>
    new AppError(message, ErrorCode.INVALID_CREDENTIALS, 401),

  forbidden: (message = 'Insufficient permissions') =>
    new AppError(message, ErrorCode.INSUFFICIENT_PERMISSIONS, 403),

  notFound: (resource: string, id?: string | number) =>
    new AppError(
      `${resource}${id ? ` dengan ID ${id}` : ''} tidak ditemukan`,
      ErrorCode.RECORD_NOT_FOUND,
      404
    ),

  validation: (message: string, details?: unknown) =>
    new AppError(message, ErrorCode.VALIDATION_ERROR, 400, details),

  duplicate: (field: string, value?: string) =>
    new AppError(
      `${field}${value ? ` '${value}'` : ''} sudah digunakan`,
      ErrorCode.DUPLICATE_RECORD,
      409
    ),

  databaseError: (message = 'Terjadi kesalahan database') =>
    new AppError(message, ErrorCode.DATABASE_ERROR, 500),

  internalError: (message = 'Terjadi kesalahan server') =>
    new AppError(message, ErrorCode.INTERNAL_SERVER_ERROR, 500),

  networkError: (message = 'Terjadi kesalahan jaringan') =>
    new AppError(message, ErrorCode.NETWORK_ERROR, 503),
}

// Track recent errors to prevent duplicates
class ErrorTracker {
  private recentErrors: Map<string, { count: number; lastSeen: number }> = new Map()
  private readonly DUPLICATE_WINDOW_MS = 5000 // 5 seconds
  private readonly MAX_DUPLICATE_COUNT = 3

  getErrorKey(error: Error, context?: string): string {
    return `${error.name}:${error.message}:${context || 'default'}`
  }

  isDuplicate(error: Error, context?: string): boolean {
    const key = this.getErrorKey(error, context)
    const now = Date.now()
    const existing = this.recentErrors.get(key)

    if (existing) {
      const timeDiff = now - existing.lastSeen

      if (timeDiff < this.DUPLICATE_WINDOW_MS) {
        existing.count++
        existing.lastSeen = now
        return existing.count > this.MAX_DUPLICATE_COUNT
      } else {
        // Reset if outside window
        this.recentErrors.set(key, { count: 1, lastSeen: now })
        return false
      }
    }

    this.recentErrors.set(key, { count: 1, lastSeen: now })
    return false
  }

  clearOldEntries(): void {
    const now = Date.now()
    for (const [key, value] of this.recentErrors.entries()) {
      if (now - value.lastSeen > this.DUPLICATE_WINDOW_MS) {
        this.recentErrors.delete(key)
      }
    }
  }
}

export const errorTracker = new ErrorTracker()

// Cleanup old error entries periodically
if (typeof window === 'undefined') {
  // Server-side only
  setInterval(() => errorTracker.clearOldEntries(), 10000)
}

// Format error for API response
export function formatErrorResponse(
  error: unknown,
  path?: string
): ApiErrorResponse {
  const timestamp = new Date().toISOString()

  // Handle AppError instances
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp,
      path,
    }
  }

  // Handle standard errors
  if (error instanceof Error) {
    return {
      error: error.message,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Terjadi kesalahan server',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp,
      path,
    }
  }

  // Handle unknown errors
  return {
    error: 'Unknown error',
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Terjadi kesalahan yang tidak diketahui',
    details: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp,
    path,
  }
}

// Check if error is operational (expected) or programming error
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

// Get HTTP status code from error
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode
  }
  return 500
}

// Get error code
export function getErrorCode(error: unknown): ErrorCode {
  if (error instanceof AppError) {
    return error.code
  }
  return ErrorCode.INTERNAL_SERVER_ERROR
}
