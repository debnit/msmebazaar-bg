// Base API client for both mobile and web
import { z } from 'zod';

export interface APIConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export class BaseAPIClient {
  protected config: APIConfig;
  
  constructor(config: APIConfig) {
    this.config = config;
  }
  
  // Platform-agnostic HTTP methods
  async get<T>(endpoint: string, schema?: z.ZodSchema<T>): Promise<T> {
    // Implementation varies by platform (fetch for web, axios for mobile)
    throw new Error('Must be implemented by platform-specific client');
  }
  
  async post<T>(endpoint: string, data: any, schema?: z.ZodSchema<T>): Promise<T> {
    throw new Error('Must be implemented by platform-specific client');
  }
  
  async put<T>(endpoint: string, data: any, schema?: z.ZodSchema<T>): Promise<T> {
    throw new Error('Must be implemented by platform-specific client');
  }
  
  async delete<T>(endpoint: string, schema?: z.ZodSchema<T>): Promise<T> {
    throw new Error('Must be implemented by platform-specific client');
  }
}
