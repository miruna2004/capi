import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Haptics utility functions
export const hapticImpact = async (style = ImpactStyle.Light) => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }
};

export const hapticNotification = async (type = 'success') => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type });
    } catch (error) {
      console.warn('Haptic notification not available:', error);
    }
  }
};

export const hapticSelection = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    } catch (error) {
      console.warn('Haptic selection not available:', error);
    }
  }
};

// Platform detection utilities
export const isNative = () => Capacitor.isNativePlatform();
export const isIOS = () => Capacitor.getPlatform() === 'ios';
export const isAndroid = () => Capacitor.getPlatform() === 'android';
export const isWeb = () => Capacitor.getPlatform() === 'web';

// Safe area utilities
export const getSafeAreaStyle = () => {
  if (isNative()) {
    return {
      paddingTop: 'var(--safe-area-inset-top, 0)',
      paddingBottom: 'var(--safe-area-inset-bottom, 0)',
      paddingLeft: 'var(--safe-area-inset-left, 0)',
      paddingRight: 'var(--safe-area-inset-right, 0)',
    };
  }
  return {};
};
