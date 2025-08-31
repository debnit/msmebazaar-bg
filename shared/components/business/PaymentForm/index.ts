// Shared PaymentForm Component
import { Platform } from './platform-detection';

// Base component interface
export interface PaymentFormProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as PaymentFormMobile } from './mobile';
export { default as PaymentFormWeb } from './web';

// Auto-detect platform and export appropriate component
export const PaymentForm = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default PaymentForm;
