import * as Location from 'expo-location';
import { OFFICE_LOCATIONS, MAX_ATTENDANCE_DISTANCE } from '../../config/officeLocations';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

/**
 * Request location permissions from user
 * @returns {Promise<boolean>} True if permission granted
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get current user location
 * @returns {Promise<object>} Location coordinates {latitude, longitude, accuracy}
 */
export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
};

/**
 * Check if user is within allowed distance of any office location
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {object} {isWithinRange: boolean, nearestOffice: object, distance: number}
 */
export const checkLocationValidity = (userLat, userLon) => {
  let nearestOffice = null;
  let minDistance = Infinity;

  // Check distance to each office location
  Object.entries(OFFICE_LOCATIONS).forEach(([key, office]) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      office.latitude,
      office.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestOffice = { ...office, key };
    }
  });

  return {
    isWithinRange: minDistance <= MAX_ATTENDANCE_DISTANCE,
    nearestOffice,
    distance: Math.round(minDistance),
  };
};

/**
 * Verify user location for attendance marking
 * @returns {Promise<object>} Verification result
 */
export const verifyAttendanceLocation = async () => {
  try {
    // Check location permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return {
        success: false,
        error: 'Location permission denied. Please enable location access to mark attendance.',
      };
    }

    // Get current location
    const userLocation = await getCurrentLocation();
    
    // Check if within valid range
    const validation = checkLocationValidity(
      userLocation.latitude,
      userLocation.longitude
    );

    if (validation.isWithinRange) {
      return {
        success: true,
        location: userLocation,
        office: validation.nearestOffice,
        distance: validation.distance,
        message: `You are ${validation.distance}m from ${validation.nearestOffice.name}`,
      };
    } else {
      return {
        success: false,
        location: userLocation,
        office: validation.nearestOffice,
        distance: validation.distance,
        error: `You are too far from office (${validation.distance}m away from ${validation.nearestOffice.name}). You must be within ${MAX_ATTENDANCE_DISTANCE}m.`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Location error: ${error.message}`,
    };
  }
};

/**
 * Get all office locations
 * @returns {Array} Array of office locations with details
 */
export const getAllOfficeLocations = () => {
  return Object.entries(OFFICE_LOCATIONS).map(([key, office]) => ({
    id: key,
    ...office,
  }));
};

/**
 * Format distance for display
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance string
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
};
