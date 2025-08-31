// Shared Loading Component
import { Platform } from './platform-detection';

// Base component interface
export interface LoadingProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as LoadingMobile } from './mobile';
export { default as LoadingWeb } from './web';

// Auto-detect platform and export appropriate component
export const Loading = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default Loading;
