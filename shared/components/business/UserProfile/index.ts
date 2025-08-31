// Shared UserProfile Component
import { Platform } from './platform-detection';

// Base component interface
export interface UserProfileProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as UserProfileMobile } from './mobile';
export { default as UserProfileWeb } from './web';

// Auto-detect platform and export appropriate component
export const UserProfile = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default UserProfile;
