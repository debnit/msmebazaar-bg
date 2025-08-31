// Shared Button Component
import { Platform } from './platform-detection';

// Base component interface
export interface ButtonProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as ButtonMobile } from './mobile';
export { default as ButtonWeb } from './web';

// Auto-detect platform and export appropriate component
export const Button = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default Button;
