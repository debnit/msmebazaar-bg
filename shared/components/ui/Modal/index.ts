// Shared Modal Component
import { Platform } from './platform-detection';

// Base component interface
export interface ModalProps {
  // Common props for both mobile and web
}

// Platform-specific implementations
export { default as ModalMobile } from './mobile';
export { default as ModalWeb } from './web';

// Auto-detect platform and export appropriate component
export const Modal = Platform.isMobile 
  ? require('./mobile').default 
  : require('./web').default;

export default Modal;
