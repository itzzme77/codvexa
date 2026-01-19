import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { OFFICE_LOCATIONS, MAX_ATTENDANCE_DISTANCE } from '../../config/officeLocations';
import { verifyFace, enrollFace, checkFaceRecognitionHealth } from '../services/faceRecognitionService';
import { getCurrentUser } from '../services/authService';

export default function HomeScreen({ navigation, route }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockIn, setIsClockIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [todayStatus, setTodayStatus] = useState({
    clockInTime: null,
    clockOutTime: null,
    totalHours: '0h 0m',
    location: null,
    distance: null,
    facePhoto: null,
  });

  // Use main office location from config
  const OFFICE_LOCATION = OFFICE_LOCATIONS.main;
  const MAX_DISTANCE_METERS = MAX_ATTENDANCE_DISTANCE;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle photo returned from FaceCapture screen
  useEffect(() => {
    if (route.params?.capturedPhoto) {
      const { capturedPhoto } = route.params;
      handleCapturedPhoto(capturedPhoto);
      // Clear the route params
      navigation.setParams({ capturedPhoto: undefined });
    }
  }, [route.params?.capturedPhoto]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const verifyLocation = async () => {
    try {
      console.log('Requesting location permissions...');
      setCheckingLocation(true);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required for attendance marking. Please enable location access in your device settings.',
          [{ text: 'OK' }]
        );
        setCheckingLocation(false);
        return null;
      }

      // Get current location with high accuracy
      console.log('Getting current position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      console.log('Current position:', { latitude, longitude });
      console.log('Office location:', OFFICE_LOCATION);

      // Calculate distance from office
      const distance = calculateDistance(
        latitude,
        longitude,
        OFFICE_LOCATION.latitude,
        OFFICE_LOCATION.longitude
      );

      console.log('Calculated distance:', distance, 'meters');
      setCheckingLocation(false);

      return {
        latitude,
        longitude,
        distance: Math.round(distance),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Location verification error:', error);
      setCheckingLocation(false);
      Alert.alert(
        'Location Error',
        `Unable to fetch location: ${error.message}. Please ensure GPS is enabled.`,
        [{ text: 'OK' }]
      );
      return null;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate total hours between clock in and clock out times
  const calculateTotalHours = (clockInTime, clockOutTime) => {
    if (!clockInTime || !clockOutTime) {
      return '0h 0m';
    }

    // Parse time string format "HH:MM:SS AM/PM"
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes, seconds = 0] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      const date = new Date();
      date.setHours(hours, minutes, seconds || 0, 0);
      return date;
    };

    const clockInDate = parseTime(clockInTime);
    const clockOutDate = parseTime(clockOutTime);
    
    const diff = clockOutDate - clockInDate;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    return `${hours}h ${minutes}m`;
  };

  const handleClockAction = async () => {
    console.log('=== CLOCK ACTION STARTED ===');
    console.log('Current action:', isClockIn ? 'Clock Out' : 'Clock In');
    
    // Verify location before proceeding to face capture
    console.log('Starting location verification...');
    const locationData = await verifyLocation();
    console.log('Location verification result:', locationData);
    
    if (!locationData) {
      // Location verification failed (error already shown)
      console.log('Location verification failed - stopping');
      return;
    }

    const { distance } = locationData;
    console.log(`Distance from office: ${distance}m (max allowed: ${MAX_DISTANCE_METERS}m)`);

    if (distance > MAX_DISTANCE_METERS) {
      console.log('Distance check FAILED');
      Alert.alert(
        'Location Verification Failed',
        `You must be within ${MAX_DISTANCE_METERS} meters of the office to mark attendance.\n\n` +
        `Your current distance: ${distance} meters\n` +
        `Office location: ${OFFICE_LOCATION.name}\n\n` +
        `Please move closer to the office and try again.`,
        [{ text: 'OK', style: 'cancel' }]
      );
      return;
    }

    console.log('Distance check PASSED');
    // Location verified - store location and navigate to face capture
    setTodayStatus({
      ...todayStatus,
      location: locationData,
      distance: distance,
    });

    console.log('Navigating to FaceCapture screen...');
    // Navigate to FaceCapture screen
    navigation.navigate('FaceCapture', {
      action: isClockIn ? 'clockOut' : 'clockIn',
    });
  };

  const handleCapturedPhoto = async (photoData) => {
    // Process the captured photo with face recognition
    console.log('=== FACE PHOTO CAPTURED ===');
    console.log('Photo data:', {
      hasUri: !!photoData.uri,
      hasBase64: !!photoData.base64,
      base64Length: photoData.base64?.length,
      action: photoData.action,
    });

    // Get current user ID
    const currentUser = getCurrentUser();
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    const userId = currentUser.uid;
    console.log('User ID:', userId);

    try {
      // Check if server is available first
      console.log('Checking face recognition server health...');
      const healthCheck = await checkFaceRecognitionHealth();
      console.log('Health check result:', healthCheck);
      if (!healthCheck.success) {
        Alert.alert(
          'Server Unavailable',
          'Face recognition server is not available. Attendance will be marked without face verification.',
          [
            {
              text: 'Continue Anyway',
              onPress: () => {
                setTodayStatus(prevStatus => ({
                  ...prevStatus,
                  facePhoto: photoData,
                  faceVerified: false,
                }));
                setModalVisible(true);
              }
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }

      // Try to verify the face (this will tell us if user is enrolled or not)
      console.log('Attempting to verify face for user:', userId);
      const verifyResult = await verifyFace(userId, photoData.base64);
      console.log('Verify result:', verifyResult);
      
      if (verifyResult.success && verifyResult.verified) {
        // Face verified successfully
        Alert.alert(
          '✓ Face Verified',
          `Identity confirmed!\nConfidence: ${verifyResult.confidence.toFixed(1)}%\n\nYou can now mark attendance.`,
          [{ text: 'OK' }]
        );
        
        setTodayStatus(prevStatus => ({
          ...prevStatus,
          facePhoto: photoData,
          faceVerified: true,
          faceConfidence: verifyResult.confidence,
        }));
        
        setModalVisible(true);
      } else if (verifyResult.error && verifyResult.error.includes('not enrolled')) {
        // User not enrolled - this is their first time
        Alert.alert(
          'First Time Setup',
          'This is your first time using face recognition. Let\'s enroll your face now!',
          [
            {
              text: 'Enroll My Face',
              onPress: async () => {
                // Show enrolling message
                Alert.alert(
                  'Enrolling Face',
                  'Please wait...',
                  [],
                  { cancelable: false }
                );
                
                const enrollResult = await enrollFace(userId, photoData.base64);
                
                if (enrollResult.success) {
                  Alert.alert(
                    '✓ Enrollment Successful!',
                    'Your face has been enrolled successfully! From now on, you can use face recognition for attendance.',
                    [
                      {
                        text: 'Continue',
                        onPress: () => {
                          setTodayStatus(prevStatus => ({
                            ...prevStatus,
                            facePhoto: photoData,
                            faceVerified: true,
                            faceConfidence: 100,
                          }));
                          setModalVisible(true);
                        }
                      }
                    ]
                  );
                } else {
                  Alert.alert(
                    'Enrollment Failed',
                    enrollResult.error || 'Could not detect your face properly. Please try again with better lighting.',
                    [
                      {
                        text: 'Try Again',
                        onPress: () => navigation.navigate('FaceCapture', { action: photoData.action })
                      },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  );
                }
              }
            },
            { 
              text: 'Cancel', 
              style: 'cancel',
              onPress: () => {
                Alert.alert(
                  'Skip Face Recognition?',
                  'You can mark attendance without face recognition, but it is recommended for security.',
                  [
                    {
                      text: 'Mark Without Face',
                      onPress: () => {
                        setTodayStatus(prevStatus => ({
                          ...prevStatus,
                          facePhoto: photoData,
                          faceVerified: false,
                        }));
                        setModalVisible(true);
                      }
                    },
                    { text: 'Go Back', style: 'cancel' }
                  ]
                );
              }
            }
          ]
        );
      } else {
        // Face verification failed - face doesn't match
        Alert.alert(
          '❌ Face Verification Failed',
          verifyResult.error || 'The face does not match your enrolled face. Please try again.',
          [
            {
              text: 'Retry Photo',
              onPress: () => navigation.navigate('FaceCapture', { action: photoData.action })
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      Alert.alert(
        'Connection Error',
        'Could not connect to face recognition server. Continue without verification?',
        [
          {
            text: 'Continue Anyway',
            onPress: () => {
              setTodayStatus(prevStatus => ({
                ...prevStatus,
                facePhoto: photoData,
                faceVerified: false,
              }));
              setModalVisible(true);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const confirmClockAction = () => {
    const now = new Date();
    const timeNow = formatTime(now);
    
    if (!isClockIn) {
      // Clock In
      setTodayStatus({
        ...todayStatus,
        clockInTime: timeNow,
      });
      setIsClockIn(true);
      
      Alert.alert(
        'Clock In Successful',
        `Time: ${timeNow}\n` +
        `Location verified: ${todayStatus.distance}m from office\n` +
        `GPS: ${todayStatus.location?.latitude.toFixed(6)}, ${todayStatus.location?.longitude.toFixed(6)}\n` +
        `Face photo captured: Yes`,
        [{ text: 'OK' }]
      );
    } else {
      // Clock Out - Calculate actual total hours
      const totalHours = calculateTotalHours(todayStatus.clockInTime, timeNow);
      
      setTodayStatus({
        ...todayStatus,
        clockOutTime: timeNow,
        totalHours: totalHours,
      });
      setIsClockIn(false);
      
      Alert.alert(
        'Clock Out Successful',
        `Time: ${timeNow}\n` +
        `Total hours: ${totalHours}\n` +
        `Location verified: ${todayStatus.distance}m from office\n` +
        `Face photo captured: Yes`,
        [{ text: 'OK' }]
      );
    }
    setModalVisible(false);
    
    // Log for backend integration (photo temporarily stored, would be sent to backend)
    console.log('Attendance marked with verification:', {
      type: isClockIn ? 'clock-out' : 'clock-in',
      time: timeNow,
      location: todayStatus.location,
      distance: todayStatus.distance,
      facePhotoUri: todayStatus.facePhoto?.uri,
      // Note: base64 data is large, only log presence
      hasFacePhotoBase64: !!todayStatus.facePhoto?.base64,
    });

    // Clear the face photo after processing (it's only stored temporarily)
    // In production, this would be sent to backend before clearing
    setTimeout(() => {
      setTodayStatus(prevStatus => ({
        ...prevStatus,
        facePhoto: null,
      }));
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Date and Time Display */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
      </View>

      {/* Clock In/Out Button */}
      <View style={styles.clockButtonContainer}>
        <TouchableOpacity
          style={[
            styles.clockButton,
            isClockIn ? styles.clockOutButton : styles.clockInButton,
            checkingLocation && styles.clockButtonDisabled,
          ]}
          onPress={handleClockAction}
          disabled={checkingLocation}
        >
          {checkingLocation ? (
            <>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.clockButtonText}>Verifying Location...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name={isClockIn ? 'log-out-outline' : 'log-in-outline'}
                size={60}
                color="#fff"
              />
              <Text style={styles.clockButtonText}>
                {isClockIn ? 'Clock Out' : 'Clock In'}
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        {/* Location requirement info */}
        <View style={styles.locationInfo}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationInfoText}>
            You must be within {MAX_DISTANCE_METERS}m of office
          </Text>
        </View>
      </View>

      {/* Today's Attendance Status */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="today-outline" size={24} color="#4CAF50" />
          <Text style={styles.cardTitle}>Today's Attendance</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Clock In</Text>
            <Text style={styles.statusValue}>
              {todayStatus.clockInTime || '--:--'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Clock Out</Text>
            <Text style={styles.statusValue}>
              {todayStatus.clockOutTime || '--:--'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Total Hours</Text>
            <Text style={styles.statusValue}>{todayStatus.totalHours}</Text>
          </View>
        </View>
        
        {todayStatus.location && (
          <View style={styles.locationVerified}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.locationVerifiedText}>
              Location verified: {todayStatus.distance}m from office
            </Text>
          </View>
        )}
      </View>

      {/* Shift Timing Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time-outline" size={24} color="#2196F3" />
          <Text style={styles.cardTitle}>Shift Timing</Text>
        </View>
        <View style={styles.shiftInfo}>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>Shift:</Text>
            <Text style={styles.shiftValue}>Day Shift</Text>
          </View>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>Start Time:</Text>
            <Text style={styles.shiftValue}>09:00 AM</Text>
          </View>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>End Time:</Text>
            <Text style={styles.shiftValue}>06:00 PM</Text>
          </View>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>Break Time:</Text>
            <Text style={styles.shiftValue}>1 Hour</Text>
          </View>
        </View>
      </View>

      {/* Leave Balance Cards */}
      <Text style={styles.sectionTitle}>Leave Balance</Text>
      <View style={styles.leaveContainer}>
        <View style={[styles.leaveCard, styles.sickLeave]}>
          <Ionicons name="medical-outline" size={32} color="#fff" />
          <Text style={styles.leaveTitle}>Sick Leave</Text>
          <Text style={styles.leaveBalance}>12 Days</Text>
          <Text style={styles.leaveSubtext}>Available</Text>
        </View>

        <View style={[styles.leaveCard, styles.casualLeave]}>
          <Ionicons name="umbrella-outline" size={32} color="#fff" />
          <Text style={styles.leaveTitle}>Casual Leave</Text>
          <Text style={styles.leaveBalance}>8 Days</Text>
          <Text style={styles.leaveSubtext}>Available</Text>
        </View>

        <View style={[styles.leaveCard, styles.earnedLeave]}>
          <Ionicons name="trophy-outline" size={32} color="#fff" />
          <Text style={styles.leaveTitle}>Earned Leave</Text>
          <Text style={styles.leaveBalance}>15 Days</Text>
          <Text style={styles.leaveSubtext}>Available</Text>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name={isClockIn ? 'log-out-outline' : 'log-in-outline'}
              size={64}
              color={isClockIn ? '#f44336' : '#4CAF50'}
            />
            <Text style={styles.modalTitle}>
              {isClockIn ? 'Clock Out' : 'Clock In'}
            </Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to {isClockIn ? 'clock out' : 'clock in'}?
            </Text>
            <Text style={styles.modalTime}>{formatTime(currentTime)}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  isClockIn && styles.confirmButtonOut,
                ]}
                onPress={confirmClockAction}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  dateTimeContainer: {
    backgroundColor: '#4CAF50',
    padding: 24,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.92,
    letterSpacing: 0.3,
  },
  timeText: {
    fontSize: 52,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    letterSpacing: 1,
  },
  clockButtonContainer: {
    alignItems: 'center',
    marginVertical: 35,
  },
  clockButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  clockInButton: {
    backgroundColor: '#4CAF50',
  },
  clockOutButton: {
    backgroundColor: '#F44336',
  },
  clockButtonText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shiftInfo: {
    marginTop: 10,
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  shiftLabel: {
    fontSize: 14,
    color: '#666',
  },
  shiftValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
  },
  leaveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  leaveCard: {
    width: '48%',
    padding: 22,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sickLeave: {
    backgroundColor: '#EF5350',
  },
  casualLeave: {
    backgroundColor: '#42A5F5',
  },
  earnedLeave: {
    backgroundColor: '#66BB6A',
    width: '100%',
  },
  leaveTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
  },
  leaveBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  leaveSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  modalTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 15,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 110,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonOut: {
    backgroundColor: '#F44336',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clockButtonDisabled: {
    opacity: 0.7,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  locationInfoText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  locationVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    gap: 6,
  },
  locationVerifiedText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
});

