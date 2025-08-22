import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export class CameraModule {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      
      return cameraStatus === 'granted' && mediaLibraryStatus === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  static async checkPermissions(): Promise<boolean> {
    try {
      const cameraPermissions = await Camera.getCameraPermissionsAsync();
      const mediaLibraryPermissions = await MediaLibrary.getPermissionsAsync();
      
      return cameraPermissions.status === 'granted' && 
             mediaLibraryPermissions.status === 'granted';
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return false;
    }
  }

  static async takePicture(cameraRef: any): Promise<string | null> {
    try {
      if (!cameraRef.current) {
        Alert.alert('Error', 'Camera not ready');
        return null;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      
      return photo.uri;
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
      return null;
    }
  }

  // Document scanning for business verification
  static async scanDocument(cameraRef: any): Promise<string | null> {
    try {
      const photo = await this.takePicture(cameraRef);
      if (!photo) return null;

      // In a real app, you might want to integrate with a document scanning service
      // like AWS Textract, Google Vision API, or Microsoft Cognitive Services
      
      return photo;
    } catch (error) {
      console.error('Error scanning document:', error);
      return null;
    }
  }
}