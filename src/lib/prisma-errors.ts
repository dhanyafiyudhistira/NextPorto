/**
 * Prisma error handling utilities
 * Converts Prisma-specific errors to standardized AppError instances
 */

import { Prisma } from '@prisma/client'
import { AppError, ErrorCode, ErrorFactory } from './errors'

// Prisma error codes mapping
// See: https://www.prisma.io/docs/reference/api-reference/error-reference
const PRISMA_ERROR_MESSAGES: Record<string, string> = {
  P2000: 'Data yang diberikan terlalu panjang untuk field database',
  P2001: 'Record yang dicari tidak ditemukan',
  P2002: 'Constraint unique violation',
  P2003: 'Foreign key constraint violation',
  P2004: 'Constraint database violation',
  P2005: 'Nilai yang disimpan tidak valid untuk field type',
  P2006: 'Nilai yang diberikan tidak valid untuk tipe data',
  P2007: 'Data validation error',
  P2008: 'Gagal melakukan parsing query',
  P2009: 'Gagal melakukan validasi query',
  P2010: 'Raw query gagal dieksekusi',
  P2011: 'Null constraint violation',
  P2012: 'Missing required value',
  P2013: 'Missing required argument',
  P2014: 'Relasi yang dibutuhkan tidak valid',
  P2015: 'Related record tidak ditemukan',
  P2016: 'Query interpretation error',
  P2017: 'Record dengan relasi tidak ditemukan',
  P2018: 'Required connected records tidak ditemukan',
  P2019: 'Input error',
  P2020: 'Value out of range untuk field type',
  P2021: 'Tabel tidak ada di database',
  P2022: 'Kolom tidak ada di database',
  P2023: 'Inconsistent column data',
  P2024: 'Timeout mendapatkan koneksi database',
  P2025: 'Record yang akan diubah tidak ditemukan',
  P2026: 'Database query tidak didukung oleh provider',
  P2027: 'Multiple errors terjadi pada database',
  P2028: 'Transaction API error',
  P2030: 'Tidak dapat menemukan fulltext index',
  P2033: 'Nomor terlalu besar untuk dimuat ke tipe data',
  P2034: 'Transaction gagal karena dependency write conflict',
}

// Extract field name from Prisma error meta
function extractFieldName(meta: any): string | undefined {
  if (meta?.target) {
    if (Array.isArray(meta.target)) {
      return meta.target.join(', ')
    }
    return String(meta.target)
  }
  return undefined
}

// Extract value from Prisma error meta
function extractValue(meta: any): string | undefined {
  if (meta?.value) {
    return String(meta.value)
  }
  return undefined
}

// Handle Prisma Known Request Error (most common)
function handlePrismaClientKnownRequestError(
  error: Prisma.PrismaClientKnownRequestError
): AppError {
  const { code, meta } = error
  const field = extractFieldName(meta)
  const value = extractValue(meta)

  switch (code) {
    case 'P2002':
      // Unique constraint violation
      return ErrorFactory.duplicate(field || 'Field', value)

    case 'P2001':
    case 'P2025':
      // Record not found
      return ErrorFactory.notFound(field || 'Record')

    case 'P2003':
      // Foreign key constraint violation
      return new AppError(
        `Tidak dapat menghapus atau mengubah record karena masih terkait dengan data lain`,
        ErrorCode.FOREIGN_KEY_CONSTRAINT,
        400,
        { field, meta }
      )

    case 'P2011':
    case 'P2012':
    case 'P2013':
      // Null/missing required value
      return new AppError(
        `Field yang wajib diisi: ${field || 'unknown'}`,
        ErrorCode.MISSING_REQUIRED_FIELD,
        400,
        { field, meta }
      )

    case 'P2024':
      // Connection timeout
      return new AppError(
        'Koneksi ke database timeout. Silakan coba lagi.',
        ErrorCode.DATABASE_CONNECTION_ERROR,
        503,
        { code, meta }
      )

    default:
      // Generic Prisma error with message
      const message = PRISMA_ERROR_MESSAGES[code] || error.message
      return new AppError(
        message,
        ErrorCode.DATABASE_ERROR,
        500,
        { code, meta, originalMessage: error.message }
      )
  }
}

// Handle Prisma Validation Error
function handlePrismaClientValidationError(
  error: Prisma.PrismaClientValidationError
): AppError {
  return new AppError(
    'Data yang diberikan tidak valid',
    ErrorCode.VALIDATION_ERROR,
    400,
    { originalMessage: error.message }
  )
}

// Handle Prisma Initialization Error
function handlePrismaClientInitializationError(
  error: Prisma.PrismaClientInitializationError
): AppError {
  return new AppError(
    'Gagal terhubung ke database. Silakan coba lagi nanti.',
    ErrorCode.DATABASE_CONNECTION_ERROR,
    503,
    { errorCode: error.errorCode, originalMessage: error.message }
  )
}

// Handle Prisma Rust Panic Error
function handlePrismaClientRustPanicError(
  error: Prisma.PrismaClientRustPanicError
): AppError {
  return new AppError(
    'Terjadi kesalahan kritis pada database engine',
    ErrorCode.DATABASE_ERROR,
    500,
    { originalMessage: error.message }
  )
}

// Main function to handle all Prisma errors
export function handlePrismaError(error: unknown): AppError {
  // Known request errors (P2xxx codes)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaClientKnownRequestError(error)
  }

  // Validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return handlePrismaClientValidationError(error)
  }

  // Initialization errors (connection issues)
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return handlePrismaClientInitializationError(error)
  }

  // Rust panic errors (critical engine errors)
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return handlePrismaClientRustPanicError(error)
  }

  // Unknown/unhandled Prisma error
  if (error instanceof Error) {
    return new AppError(
      'Terjadi kesalahan pada database',
      ErrorCode.DATABASE_ERROR,
      500,
      { originalMessage: error.message }
    )
  }

  // Fallback for unknown error types
  return ErrorFactory.databaseError()
}

// Check if error is a Prisma error
export function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  )
}

// Get specific Prisma error code if available
export function getPrismaErrorCode(error: unknown): string | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return error.errorCode
  }
  return null
}
