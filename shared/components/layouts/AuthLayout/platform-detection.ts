// Platform detection utility
export const Platform = {
  isMobile: typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isWeb: typeof window !== 'undefined' && !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isReactNative: typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
};
