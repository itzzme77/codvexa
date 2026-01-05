import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function FaceCaptureScreen({ navigation, route }) {
  const action = route.params?.action || 'clockIn'; // 'clockIn' or 'clockOut'
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);
  const cameraRef = useRef(null);

  useEffect(() => {
    // Hide guidance after 3 seconds
    const timer = setTimeout(() => {
      setShowGuidance(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color="#999" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to capture your face for attendance verification.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);

      // Capture the photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      console.log('Photo captured:', {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        hasBase64: !!photo.base64,
      });

      // Navigate back with the captured photo data
      navigation.navigate('Home', {
        capturedPhoto: {
          uri: photo.uri,
          base64: photo.base64,
          action: action,
        },
      });
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert(
        'Capture Failed',
        'Failed to capture photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Attendance',
      'Are you sure you want to cancel the attendance process?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        animateShutter={false}
      >
        {/* Guidance Overlay */}
        {showGuidance && (
          <View style={styles.guidanceOverlay}>
            <View style={styles.guidanceBox}>
              <Ionicons name="information-circle" size={24} color="#FFF" />
              <Text style={styles.guidanceText}>
                Position your face in the frame{'\n'}
                Ensure good lighting{'\n'}
                Keep a neutral expression
              </Text>
            </View>
          </View>
        )}

        {/* Face Guide Frame */}
        <View style={styles.faceGuide}>
          <View style={styles.faceGuideCornerTL} />
          <View style={styles.faceGuideCornerTR} />
          <View style={styles.faceGuideCornerBL} />
          <View style={styles.faceGuideCornerBR} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {action === 'clockIn' ? 'Clock In' : 'Clock Out'} - Face Verification
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Look directly at the camera
          </Text>
        </View>

        {/* Capture Button */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
            onPress={handleCapture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#FFF" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
          <Text style={styles.captureHint}>
            {isProcessing ? 'Processing...' : 'Tap to capture'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  guidanceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidanceBox: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 300,
  },
  guidanceText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
  faceGuide: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.15,
    width: width * 0.7,
    height: width * 0.9,
    borderRadius: (width * 0.7) / 2,
  },
  faceGuideCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00FF00',
    borderTopLeftRadius: 30,
  },
  faceGuideCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00FF00',
    borderTopRightRadius: 30,
  },
  faceGuideCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 60,
    height: 60,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00FF00',
    borderBottomLeftRadius: 30,
  },
  faceGuideCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00FF00',
    borderBottomRightRadius: 30,
  },
  instructions: {
    position: 'absolute',
    top: height * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  captureHint: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
});
