// Shared MSMEListing Component
import { Platform } from './platform-detection';

// Base component interface
export interface MSMEListingProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as MSMEListingMobile } from './mobile';
export { default as MSMEListingWeb } from './web';

// Auto-detect platform and export appropriate component
export const MSMEListing = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default MSMEListing;
