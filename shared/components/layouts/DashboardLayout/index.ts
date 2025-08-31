// Shared DashboardLayout Component
import { Platform } from './platform-detection';

// Base component interface
export interface DashboardLayoutProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as DashboardLayoutMobile } from './mobile';
export { default as DashboardLayoutWeb } from './web';

// Auto-detect platform and export appropriate component
export const DashboardLayout = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default DashboardLayout;
