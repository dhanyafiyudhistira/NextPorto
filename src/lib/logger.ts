/**
 * Centralized logging utility
 * Provides structured logging with duplicate prevention
 */

import { AppError, errorTracker, getErrorCode } from './errors'

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// Log entry structure
interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  error?: {
    name: string
    message: string
    code?: string
    stack?: string
  }
  metadata?: Record<string, unknown>
}

// Logger configuration
interface LoggerConfig {
  minLevel: LogLevel
  enableConsole: boolean
  enableStructuredLogging: boolean
  preventDuplicates: boolean
}

const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableStructuredLogging: process.env.NODE_ENV === 'production',
  preventDuplicates: true,
}

class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL]
    const currentLevelIndex = levels.indexOf(this.config.minLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private formatLogEntry(entry: LogEntry): string {
    if (this.config.enableStructuredLogging) {
      return JSON.stringify(entry)
    }

    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      entry.context ? `[${entry.context}]` : '',
      entry.message,
    ].filter(Boolean)

    if (entry.error) {
      parts.push(`\nError: ${entry.error.message}`)
      if (entry.error.code) {
        parts.push(`Code: ${entry.error.code}`)
      }
      if (entry.error.stack && process.env.NODE_ENV === 'development') {
        parts.push(`\nStack: ${entry.error.stack}`)
      }
    }

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      parts.push(`\nMetadata: ${JSON.stringify(entry.metadata, null, 2)}`)
    }

    return parts.join(' ')
  }

  private log(level: LogLevel, message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    }

    const formatted = this.formatLogEntry(entry)

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted)
          break
        case LogLevel.INFO:
          console.info(formatted)
          break
        case LogLevel.WARN:
          console.warn(formatted)
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formatted)
          break
      }
    }

    // Here you can add integration with external logging services
    // For example: Sentry, DataDog, CloudWatch, etc.
    // this.sendToExternalService(entry)
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context, metadata)
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context, metadata)
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context, metadata)
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: string,
    metadata?: Record<string, unknown>
  ): void {
    // Check for duplicate errors
    if (this.config.preventDuplicates && error instanceof Error) {
      if (errorTracker.isDuplicate(error, context)) {
        this.debug(`Duplicate error suppressed: ${error.message}`, context, { errorName: error.name })
        return
      }
    }

    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    }

    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: error.message,
        code: getErrorCode(error),
        stack: error.stack,
      }
    } else if (error) {
      entry.error = {
        name: 'UnknownError',
        message: String(error),
      }
    }

    const formatted = this.formatLogEntry(entry)

    if (this.config.enableConsole) {
      console.error(formatted)
    }

    // Send to external error tracking service if configured
    // this.sendToErrorTracking(entry, error)
  }

  fatal(
    message: string,
    error?: Error | unknown,
    context?: string,
    metadata?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      level: LogLevel.FATAL,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    }

    if (error instanceof Error) {
      entry.error = {
        name: error.name,
        message: error.message,
        code: getErrorCode(error),
        stack: error.stack,
      }
    } else if (error) {
      entry.error = {
        name: 'UnknownError',
        message: String(error),
      }
    }

    const formatted = this.formatLogEntry(entry)

    if (this.config.enableConsole) {
      console.error(formatted)
    }

    // Send to external error tracking service
    // this.sendToErrorTracking(entry, error)
  }

  // Helper method for API route errors
  apiError(
    route: string,
    method: string,
    error: Error | unknown,
    userId?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.error(
      `API Error: ${method} ${route}`,
      error,
      'API',
      {
        route,
        method,
        userId,
        ...metadata,
      }
    )
  }

  // Helper method for database errors
  dbError(
    operation: string,
    error: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    this.error(
      `Database Error: ${operation}`,
      error,
      'Database',
      metadata
    )
  }

  // Helper method for authentication errors
  authError(
    message: string,
    email?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.warn(
      message,
      'Authentication',
      {
        email: email ? this.maskEmail(email) : undefined,
        ...metadata,
      }
    )
  }

  // Mask sensitive data for logging
  private maskEmail(email: string): string {
    const [local, domain] = email.split('@')
    if (!local || !domain) return '***'

    const maskedLocal = local.length > 2
      ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
      : '**'

    return `${maskedLocal}@${domain}`
  }
}

// Export singleton instance
export const logger = new Logger()

// Export factory for custom loggers
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config)
}
