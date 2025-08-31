// Shared AuthLayout Component
import { Platform } from './platform-detection';

// Base component interface
export interface AuthLayoutProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as AuthLayoutMobile } from './mobile';
export { default as AuthLayoutWeb } from './web';

// Auto-detect platform and export appropriate component
export const AuthLayout = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default AuthLayout;
