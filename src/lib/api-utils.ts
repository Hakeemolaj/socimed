/**
 * API helper utilities for consistent error handling and response formatting
 */

import { NextResponse } from 'next/server';

type ErrorResponse = {
  error: string;
  status: number;
  details?: unknown;
};

/**
 * Create a standardized error response for API routes
 */
export function createErrorResponse(
  message: string, 
  status = 500, 
  details?: unknown
): NextResponse<ErrorResponse> {
  console.error(`API Error [${status}]: ${message}`, details);
  
  const responseBody: ErrorResponse = {
    error: message,
    status
  };
  
  if (details) {
    responseBody.details = details;
  }
  
  return NextResponse.json(responseBody, { status });
}

/**
 * Create a standardized success response for API routes
 */
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/**
 * Safely handle API requests with consistent error handling
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  errorMessage = 'An unexpected error occurred'
): Promise<NextResponse<T | ErrorResponse>> {
  try {
    const result = await handler();
    return createSuccessResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : errorMessage;
    return createErrorResponse(message, 500, error);
  }
}

/**
 * Format a validation error for API responses
 */
export function createValidationError(
  message: string,
  fields?: Record<string, string>
): NextResponse<ErrorResponse> {
  return createErrorResponse(
    message,
    400,
    { fields }
  );
} 