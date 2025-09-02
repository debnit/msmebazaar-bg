// services/auth-service/src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '@msmebazaar/shared/middleware/errorHandler';
import { logger } from '../utils/logger';
import { LoginRequest, RegisterRequest } from '@msmebazaar/types/user';
import { getClientIP } from '../middlewares/ipExtractor';


export const register = async (req: Request, res: Response, next: NextFunction) => {
  console.log(`[Auth Service] Register called: IP=${req.ip}, Email=${req.body.email}`);

  try {
    const { email, password, name, phone }: RegisterRequest & { phone?: string } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      throw new AppError('Email, password, and name are required', 400);
    }

    // Get client IP and user agent
    const clientIP = getClientIP(req);
    const userAgent = req.get('User-Agent');

    const result = await AuthService.registerUser(
      { email, password, name, phone },
      { ipAddress: clientIP, userAgent }
    );
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Get client IP and user agent
    const clientIP = getClientIP(req);
    const userAgent = req.get('User-Agent');

    const result = await AuthService.loginUser(
      { email, password },
      { ipAddress: clientIP, userAgent }
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const upgradeToPro = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const result = await AuthService.upgradeToPro(userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      throw new AppError('User ID and role are required', 400);
    }

   const result = await AuthService.addUserRole(userId, role);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const removeUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      throw new AppError('User ID and role are required', 400);
    }

    const result = await AuthService.removeUserRole(userId, role);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const result = await AuthService.getUserProfile(userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Get client IP and user agent
    const clientIP = getClientIP(req);
    const userAgent = req.get('User-Agent');

    const result = await AuthService.refreshToken(
      refreshToken,
      { ipAddress: clientIP, userAgent }
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const result = await AuthService.logout(refreshToken);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const result = await AuthService.getUserSessions(userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const revokeAllSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const result = await AuthService.revokeAllSessions(userId);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }

    const result = await AuthService.changePassword(userId, currentPassword, newPassword);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError('Verification token is required', 400);
    }

    const result = await AuthService.verifyEmail(token);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};
