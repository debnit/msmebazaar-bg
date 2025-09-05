import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/pricing',
  '/features',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email'
]

// Role-based route mappings
const ROLE_ROUTES = {
  buyer: ['/buyer'],
  seller: ['/seller'],
  agent: ['/agent'],
  investor: ['/investor'],
  admin: ['/admin'],
  superadmin: ['/superadmin'],
  msme_owner: ['/msmeowner']
}

// Pro-only features
const PRO_FEATURES = [
  '/buyer/pro',
  '/seller/pro',
  '/agent/pro',
  '/investor/pro',
  '/msmeowner/pro',
  '/business-valuation',
  '/exit-strategy',
  '/market-linkage',
  '/leadership-training'
]

// Feature routes that require specific permissions
const FEATURE_ROUTES = {
  'business-loans': ['buyer', 'seller', 'msme_owner'],
  'business-valuation': ['buyer', 'seller', 'msme_owner'],
  'exit-strategy': ['seller', 'msme_owner'],
  'market-linkage': ['buyer', 'seller', 'msme_owner'],
  'networking': ['buyer', 'seller', 'agent', 'investor', 'msme_owner']
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

function isRoleRoute(pathname: string): boolean {
  return Object.values(ROLE_ROUTES).some(routes => 
    routes.some(route => pathname.startsWith(route))
  )
}

function isProFeature(pathname: string): boolean {
  return PRO_FEATURES.some(feature => pathname.startsWith(feature))
}

function isFeatureRoute(pathname: string): boolean {
  return Object.keys(FEATURE_ROUTES).some(feature => pathname.startsWith(`/${feature}`))
}

function getRequiredRole(pathname: string): string | null {
  for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
    if (routes.some(route => pathname.startsWith(route))) {
      return role
    }
  }
  return null
}

function getFeatureFromPath(pathname: string): string | null {
  for (const feature of Object.keys(FEATURE_ROUTES)) {
    if (pathname.startsWith(`/${feature}`)) {
      return feature
    }
  }
  return null
}

function hasRoleAccess(userRoles: string[], pathname: string): boolean {
  const requiredRole = getRequiredRole(pathname)
  if (!requiredRole) return true
  
  return userRoles.includes(requiredRole) || 
         userRoles.includes('admin') || 
         userRoles.includes('superadmin')
}

function hasFeatureAccess(userRoles: string[], pathname: string): boolean {
  const feature = getFeatureFromPath(pathname)
  if (!feature) return true
  
  const allowedRoles = FEATURE_ROUTES[feature as keyof typeof FEATURE_ROUTES]
  return allowedRoles.some(role => userRoles.includes(role)) ||
         userRoles.includes('admin') ||
         userRoles.includes('superadmin')
}

async function verifyToken(token: string): Promise<any> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret')
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token
  const payload = await verifyToken(token)
  if (!payload) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const userRoles = payload.roles || []
  const isPro = payload.isPro || false

  // Check role-based access
  if (isRoleRoute(pathname)) {
    if (!hasRoleAccess(userRoles, pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Check feature access
  if (isFeatureRoute(pathname)) {
    if (!hasFeatureAccess(userRoles, pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Check pro feature access
  if (isProFeature(pathname) && !isPro) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Add user info to headers for downstream components
  const response = NextResponse.next()
  response.headers.set('x-user-roles', JSON.stringify(userRoles))
  response.headers.set('x-user-pro', isPro.toString())
  response.headers.set('x-user-id', payload.userId || '')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
