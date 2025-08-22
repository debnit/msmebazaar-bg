import * as LocalAuthentication from 'expo-local-authentication';
import * as Keychain from 'react-native-keychain';
import { Platform, Alert } from 'react-native';

export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

interface BiometricAuthOptions {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
}

class BiometricAuth {
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  async getSupportedBiometrics(): Promise<BiometricType[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometricTypes: BiometricType[] = [];
      
      types.forEach(type => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            biometricTypes.push('fingerprint');
            break;
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            biometricTypes.push('facial');
            break;
          case LocalAuthentication.AuthenticationType.IRIS:
            biometricTypes.push('iris');
            break;
        }
      });
      
      return biometricTypes.length > 0 ? biometricTypes : ['none'];
    } catch (error) {
      console.error('Error getting supported biometrics:', error);
      return ['none'];
    }
  }

  async authenticate(options: BiometricAuthOptions = {}): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw new Error('Biometric authentication is not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.promptMessage || 'Authenticate to access MSMEBazaar',
        cancelLabel: options.cancelLabel || 'Cancel',
        fallbackLabel: options.fallbackLabel || 'Use Passcode',
        disableDeviceFallback: options.disableDeviceFallback || false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async storeCredentials(username: string, password: string): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        // Fallback to regular keychain storage
        await Keychain.setInternetCredentials('msmebazaar', username, password);
        return true;
      }

      // Store with biometric protection
      await Keychain.setInternetCredentials(
        'msmebazaar',
        username,
        password,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          authenticatePrompt: 'Authenticate to save credentials',
        }
      );
      return true;
    } catch (error) {
      console.error('Error storing credentials:', error);
      return false;
    }
  }

  async getStoredCredentials(): Promise<{ username: string; password: string } | null> {
    try {
      const credentials = await Keychain.getInternetCredentials('msmebazaar');
      if (credentials && credentials.username && credentials.password) {
        return {
          username: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting stored credentials:', error);
      return null;
    }
  }

  async removeStoredCredentials(): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials('msmebazaar');
      return true;
    } catch (error) {
      console.error('Error removing stored credentials:', error);
      return false;
    }
  }

  async showEnableBiometricPrompt(): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        'Enable Biometric Login',
        'Would you like to use biometric authentication for faster and more secure login?',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Enable',
            onPress: () => resolve(true),
          },
        ]
      );
    });
  }

  async enableBiometricLogin(username: string, password: string): Promise<boolean> {
    const shouldEnable = await this.showEnableBiometricPrompt();
    if (!shouldEnable) return false;

    const success = await this.storeCredentials(username, password);
    if (success) {
      Alert.alert(
        'Biometric Login Enabled',
        'You can now use biometric authentication to login quickly and securely.'
      );
    } else {
      Alert.alert(
        'Setup Failed',
        'Failed to enable biometric login. Please try again.'
      );
    }
    
    return success;
  }
}

export const biometricAuth = new BiometricAuth();