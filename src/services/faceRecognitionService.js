/**
 * Face Recognition Service
 * Handles communication with Python face recognition backend
 */

const API_BASE_URL = 'http://10.192.120.73:5000'; // Change to your server IP for mobile testing

/**
 * Check if face recognition server is running
 */
export const checkFaceRecognitionHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('Face recognition server health check failed:', error);
    return { success: false, error: 'Server not reachable' };
  }
};

/**
 * Enroll a new face for a user
 * @param {string} userId - User ID
 * @param {string} imageBase64 - Base64 encoded image
 */
export const enrollFace = async (userId, imageBase64) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        image: imageBase64,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Face enrollment error:', error);
    return {
      success: false,
      error: 'Failed to connect to face recognition server',
    };
  }
};

/**
 * Verify a face against enrolled user
 * @param {string} userId - User ID
 * @param {string} imageBase64 - Base64 encoded image
 */
export const verifyFace = async (userId, imageBase64) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        image: imageBase64,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Face verification error:', error);
    return {
      success: false,
      error: 'Failed to connect to face recognition server',
    };
  }
};

/**
 * Delete face data for a user
 * @param {string} userId - User ID
 */
export const deleteFaceData = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Face deletion error:', error);
    return {
      success: false,
      error: 'Failed to connect to face recognition server',
    };
  }
};

/**
 * Get list of all enrolled users
 */
export const getEnrolledUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/enrolled-users`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting enrolled users:', error);
    return {
      success: false,
      error: 'Failed to connect to face recognition server',
    };
  }
};

/**
 * Convert camera photo to base64
 * @param {string} uri - Photo URI from camera
 */
export const photoUriToBase64 = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting photo to base64:', error);
    throw error;
  }
};
