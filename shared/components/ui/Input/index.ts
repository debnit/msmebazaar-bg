// Shared Input Component
import { Platform } from './platform-detection';

// Base component interface
export interface InputProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as InputMobile } from './mobile';
export { default as InputWeb } from './web';

// Auto-detect platform and export appropriate component
export const Input = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default Input;
