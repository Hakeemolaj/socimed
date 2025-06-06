import {
  createErrorResponse,
  createSuccessResponse,
  createValidationError,
  withErrorHandling,
} from './api-utils';
import { NextResponse } from 'next/server';

describe('api-utils', () => {
  describe('createErrorResponse', () => {
    it('should create an error response with default status code 500', () => {
      const response = createErrorResponse('Test error');
      expect(response.status).toBe(500);
      expect(response.json()).resolves.toEqual({
        error: 'Test error',
        status: 500,
      });
    });

    it('should create an error response with custom status code', () => {
      const response = createErrorResponse('Test error', 404);
      expect(response.status).toBe(404);
      expect(response.json()).resolves.toEqual({
        error: 'Test error',
        status: 404,
      });
    });

    it('should include error message in the response body', () => {
      const response = createErrorResponse('Test error');
      expect(response.json()).resolves.toMatchObject({ error: 'Test error' });
    });

    it('should include optional details in the response body', () => {
      const details = { info: 'Additional details' };
      const response = createErrorResponse('Test error', 500, details);
      expect(response.json()).resolves.toMatchObject({ details });
    });
  });

  describe('createSuccessResponse', () => {
    it('should create a success response with default status code 200', () => {
      const data = { message: 'Success' };
      const response = createSuccessResponse(data);
      expect(response.status).toBe(200);
      expect(response.json()).resolves.toEqual(data);
    });

    it('should create a success response with custom status code', () => {
      const data = { message: 'Success' };
      const response = createSuccessResponse(data, 201);
      expect(response.status).toBe(201);
      expect(response.json()).resolves.toEqual(data);
    });

    it('should include correct data in the response body', () => {
      const data = { id: 1, name: 'Test item' };
      const response = createSuccessResponse(data);
      expect(response.json()).resolves.toEqual(data);
    });
  });

  describe('createValidationError', () => {
    it('should create a validation error response with status code 400', () => {
      const response = createValidationError('Validation failed');
      expect(response.status).toBe(400);
      expect(response.json()).resolves.toMatchObject({
        error: 'Validation failed',
        status: 400,
      });
    });

    it('should include error message in the response body', () => {
      const response = createValidationError('Validation failed');
      expect(response.json()).resolves.toMatchObject({ error: 'Validation failed' });
    });

    it('should include optional fields in the response body', () => {
      const fields = { email: 'Invalid email format' };
      const response = createValidationError('Validation failed', fields);
      expect(response.json()).resolves.toMatchObject({
        details: { fields },
      });
    });
  });

  describe('withErrorHandling', () => {
    it('should return success response when handler executes successfully', async () => {
      const data = { message: 'Success' };
      const handler = jest.fn().mockResolvedValue(data);
      const response = await withErrorHandling(handler);
      expect(response.status).toBe(200);
      expect(response.json()).resolves.toEqual(data);
    });

    it('should return error response when handler throws an error', async () => {
      const errorMessage = 'Handler error';
      const handler = jest.fn().mockRejectedValue(new Error(errorMessage));
      const response = await withErrorHandling(handler);
      expect(response.status).toBe(500);
      expect(response.json()).resolves.toMatchObject({
        error: errorMessage,
        status: 500,
      });
    });

    it('should use custom error message for unhandled errors', async () => {
      const customMessage = 'Custom error message';
      const handler = jest.fn().mockRejectedValue('Unknown error');
      const response = await withErrorHandling(handler, customMessage);
      expect(response.status).toBe(500);
      expect(response.json()).resolves.toMatchObject({
        error: customMessage,
        status: 500,
      });
    });
  });
});
