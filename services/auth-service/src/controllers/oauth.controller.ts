// services/auth-service/src/controllers/oauth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { OAuthService, OAuthProvider } from '../services/oauth.service';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { getClientIP } from '../middlewares/ipExtractor';

/**
 * Generate OAuth URL for the specified provider
 */
export const generateOAuthUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { provider } = req.params;
    const { redirectUrl } = req.query;
    
    if (!provider) {
      throw new AppError('OAuth provider is required', 400);
    }
    
    // Validate provider
    if (!['google', 'facebook', 'github'].includes(provider)) {
      throw new AppError(`Unsupported OAuth provider: ${provider}`, 400);
    }
    
    const state = redirectUrl ? { redirectUrl: redirectUrl as string } : undefined;
    
    const url = OAuthService.generateOAuthUrl(provider as OAuthProvider, state);
    
    res.json({
      success: true,
      data: { url }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle OAuth callback
 */
export const handleOAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { provider } = req.params;
    const { code, state, error, error_description } = req.query;
    
    // Check for OAuth errors
    if (error) {
      logger.warn('OAuth provider returned error', { 
        provider, 
        error, 
        error_description 
      });
      throw new AppError(`OAuth error: ${error_description || error}`, 400);
    }
    
    if (!provider) {
      throw new AppError('OAuth provider is required', 400);
    }
    
    if (!code) {
      throw new AppError('Authorization code is required', 400);
    }
    
    // Validate provider
    if (!['google', 'facebook', 'github'].includes(provider)) {
      throw new AppError(`Unsupported OAuth provider: ${provider}`, 400);
    }
    
    // Get client IP and user agent
    const clientIP = getClientIP(req);
    const userAgent = req.get('User-Agent');
    
    const result = await OAuthService.handleOAuthCallback(
      provider as OAuthProvider,
      code as string,
      state as string,
      { ipAddress: clientIP, userAgent }
    );
    
    // For API requests, return JSON
    if (req.get('Accept')?.includes('application/json')) {
      return res.json(result);
    }
    
    // For browser requests, redirect to frontend with tokens
    const redirectUrl = result.data.redirectUrl || '/dashboard';
    const frontendUrl = new URL(redirectUrl, process.env.FRONTEND_URL || 'http://localhost:3000');
    
    // Add tokens as query parameters (in production, consider using a more secure method)
    frontendUrl.searchParams.append('accessToken', result.data.tokens.accessToken);
    frontendUrl.searchParams.append('refreshToken', result.data.tokens.refreshToken);
    
    res.redirect(frontendUrl.toString());
  } catch (error) {
    next(error);
  }
};