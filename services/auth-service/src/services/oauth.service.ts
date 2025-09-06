// services/auth-service/src/services/oauth.service.ts
import { Config } from '../config/env';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';
import { AuthService, LoginContext } from './auth.service';
import { TokenManager } from '../utils/tokenManager';
import { SessionService } from './session.service';
import { AppError } from '../middlewares/errorHandler';
import { UserRole } from '@msmebazaar/types/feature';

const prisma = new PrismaClient();

export type OAuthProvider = 'google' | 'facebook' | 'github';

export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  provider: OAuthProvider;
  picture?: string;
}

export interface OAuthState {
  redirectUrl?: string;
  [key: string]: any;
}

export class OAuthService {
  /**
   * Generate OAuth URL for the specified provider
   */
  static generateOAuthUrl(provider: OAuthProvider, state?: OAuthState): string {
    // Validate provider is enabled
    this.validateProviderEnabled(provider);
    
    // Encode state as JSON string and then base64
    const encodedState = state ? Buffer.from(JSON.stringify(state)).toString('base64') : '';
    
    switch (provider) {
      case 'google':
        return this.generateGoogleOAuthUrl(encodedState);
      case 'facebook':
        return this.generateFacebookOAuthUrl(encodedState);
      case 'github':
        return this.generateGithubOAuthUrl(encodedState);
      default:
        throw new AppError(`Unsupported OAuth provider: ${provider}`, 400);
    }
  }

  /**
   * Handle OAuth callback and user authentication
   */
  static async handleOAuthCallback(
    provider: OAuthProvider,
    code: string,
    state: string,
    context?: LoginContext
  ) {
    // Validate provider is enabled
    this.validateProviderEnabled(provider);
    
    try {
      // Decode state if present
      let decodedState: OAuthState = {};
      if (state) {
        try {
          decodedState = JSON.parse(Buffer.from(state, 'base64').toString()) as OAuthState;
        } catch (error) {
          logger.warn('Failed to decode OAuth state', { error, state });
        }
      }
      
      // Exchange code for tokens and get user profile
      let profile: OAuthProfile;
      
      switch (provider) {
        case 'google':
          profile = await this.handleGoogleCallback(code);
          break;
        case 'facebook':
          profile = await this.handleFacebookCallback(code);
          break;
        case 'github':
          profile = await this.handleGithubCallback(code);
          break;
        default:
          throw new AppError(`Unsupported OAuth provider: ${provider}`, 400);
      }
      
      // Find or create user
      const user = await this.findOrCreateOAuthUser(profile);
      
      // Generate tokens
      const userRoles = await prisma.userRole.findMany({
        where: { userId: user.id },
        include: { role: true }
      });
      
      const roles = userRoles.map(ur => ur.role.name as UserRole);
      
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        roles
      };
      
      const { accessToken, refreshToken } = TokenManager.generateTokens(tokenPayload);
      
      // Store refresh token
      const refreshExpiry = new Date();
      refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days
      
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: refreshExpiry
        }
      });
      
      // Create session
      await SessionService.createSession({
        userId: user.id,
        sessionToken: refreshToken,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        expiresAt: refreshExpiry
      });
      
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
      
      logger.info('OAuth login successful', { 
        userId: user.id, 
        provider,
        ipAddress: context?.ipAddress
      });
      
      return {
        success: true,
        message: 'OAuth authentication successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isPro: user.isPro,
            roles
          },
          tokens: {
            accessToken,
            refreshToken
          },
          redirectUrl: decodedState.redirectUrl || '/dashboard'
        }
      };
    } catch (error) {
      logger.error('OAuth callback failed', { error, provider });
      throw error;
    }
  }

  /**
   * Find or create a user from OAuth profile
   */
  private static async findOrCreateOAuthUser(profile: OAuthProfile) {
    // Check if user exists
    let user = await prisma.user.findUnique({ 
      where: { email: profile.email }
    });
    
    if (user) {
      return user;
    }
    
    // Create new user
    user = await prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        password: '', // OAuth users don't have passwords
        emailVerified: true, // OAuth emails are verified
      }
    });
    
    // Assign default role
    const defaultRole = await prisma.role.findFirst({
      where: { name: UserRole.MSME_OWNER }
    });
    
    if (defaultRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id
        }
      });
    }
    
    // Create profile with picture if available
    if (profile.picture) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          avatarUrl: profile.picture
        }
      });
    }
    
    logger.info('Created new user from OAuth', { 
      userId: user.id, 
      provider: profile.provider 
    });
    
    return user;
  }

  /**
   * Validate that the OAuth provider is enabled
   */
  private static validateProviderEnabled(provider: OAuthProvider) {
    switch (provider) {
      case 'google':
        if (!Config.GOOGLE_OAUTH_ENABLED) {
          throw new AppError('Google OAuth is not enabled', 400);
        }
        break;
      case 'facebook':
        if (!Config.FACEBOOK_OAUTH_ENABLED) {
          throw new AppError('Facebook OAuth is not enabled', 400);
        }
        break;
      case 'github':
        if (!Config.GITHUB_OAUTH_ENABLED) {
          throw new AppError('GitHub OAuth is not enabled', 400);
        }
        break;
      default:
        throw new AppError(`Unsupported OAuth provider: ${provider}`, 400);
    }
  }

  /**
   * Generate Google OAuth URL
   */
  private static generateGoogleOAuthUrl(state: string): string {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: Config.GOOGLE_CLIENT_ID,
      redirect_uri: Config.OAUTH_CALLBACK_URL,
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    
    if (state) {
      params.append('state', `google:${state}`);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate Facebook OAuth URL
   */
  private static generateFacebookOAuthUrl(state: string): string {
    const baseUrl = 'https://www.facebook.com/v12.0/dialog/oauth';
    const params = new URLSearchParams({
      client_id: Config.FACEBOOK_APP_ID,
      redirect_uri: Config.OAUTH_CALLBACK_URL,
      response_type: 'code',
      scope: 'email public_profile',
    });
    
    if (state) {
      params.append('state', `facebook:${state}`);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate GitHub OAuth URL
   */
  private static generateGithubOAuthUrl(state: string): string {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const params = new URLSearchParams({
      client_id: Config.GITHUB_CLIENT_ID,
      redirect_uri: Config.OAUTH_CALLBACK_URL,
      scope: 'user:email',
    });
    
    if (state) {
      params.append('state', `github:${state}`);
    }
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Handle Google OAuth callback
   */
  private static async handleGoogleCallback(code: string): Promise<OAuthProfile> {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: Config.GOOGLE_CLIENT_ID,
        client_secret: Config.GOOGLE_CLIENT_SECRET,
        redirect_uri: Config.OAUTH_CALLBACK_URL,
        grant_type: 'authorization_code',
      }).toString(),
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      logger.error('Google token exchange failed', { error });
      throw new AppError('Failed to authenticate with Google', 500);
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    
    if (!profileResponse.ok) {
      const error = await profileResponse.text();
      logger.error('Google profile fetch failed', { error });
      throw new AppError('Failed to get Google user profile', 500);
    }
    
    const googleProfile = await profileResponse.json();
    
    return {
      id: googleProfile.id,
      email: googleProfile.email,
      name: googleProfile.name,
      provider: 'google',
      picture: googleProfile.picture,
    };
  }

  /**
   * Handle Facebook OAuth callback
   */
  private static async handleFacebookCallback(code: string): Promise<OAuthProfile> {
    // Exchange code for tokens
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v12.0/oauth/access_token?` +
      `client_id=${Config.FACEBOOK_APP_ID}&` +
      `client_secret=${Config.FACEBOOK_APP_SECRET}&` +
      `redirect_uri=${encodeURIComponent(Config.OAUTH_CALLBACK_URL)}&` +
      `code=${code}`
    );
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      logger.error('Facebook token exchange failed', { error });
      throw new AppError('Failed to authenticate with Facebook', 500);
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`
    );
    
    if (!profileResponse.ok) {
      const error = await profileResponse.text();
      logger.error('Facebook profile fetch failed', { error });
      throw new AppError('Failed to get Facebook user profile', 500);
    }
    
    const fbProfile = await profileResponse.json();
    
    return {
      id: fbProfile.id,
      email: fbProfile.email,
      name: fbProfile.name,
      provider: 'facebook',
      picture: fbProfile.picture?.data?.url,
    };
  }

  /**
   * Handle GitHub OAuth callback
   */
  private static async handleGithubCallback(code: string): Promise<OAuthProfile> {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: Config.GITHUB_CLIENT_ID,
        client_secret: Config.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: Config.OAUTH_CALLBACK_URL,
      }),
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      logger.error('GitHub token exchange failed', { error });
      throw new AppError('Failed to authenticate with GitHub', 500);
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user profile
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${tokens.access_token}`,
      },
    });
    
    if (!profileResponse.ok) {
      const error = await profileResponse.text();
      logger.error('GitHub profile fetch failed', { error });
      throw new AppError('Failed to get GitHub user profile', 500);
    }
    
    const githubProfile = await profileResponse.json();
    
    // GitHub doesn't always return email, so we need to fetch it separately
    let email = githubProfile.email;
    
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${tokens.access_token}`,
        },
      });
      
      if (emailsResponse.ok) {
        const emails = await emailsResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary);
        email = primaryEmail ? primaryEmail.email : emails[0]?.email;
      }
    }
    
    if (!email) {
      throw new AppError('Could not retrieve email from GitHub', 400);
    }
    
    return {
      id: githubProfile.id.toString(),
      email,
      name: githubProfile.name || githubProfile.login,
      provider: 'github',
      picture: githubProfile.avatar_url,
    };
  }
}