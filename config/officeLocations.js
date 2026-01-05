// Office Location Configuration
// Update these coordinates with your actual office location

export const OFFICE_LOCATIONS = {
  main: {
    latitude: 19.2605095,  // Your office location
    longitude: 76.8209881,
    name: 'Main Office',
    address: 'Nanded, Maharashtra, India',
  },
  // Add more office locations if needed
  branch1: {
    latitude: 28.5355,  // Example: Gurugram
    longitude: 77.3910,
    name: 'Branch Office - Gurugram',
    address: 'Cyber City, Gurugram, Haryana, India',
  },
};

// Maximum allowed distance from office in meters
export const MAX_ATTENDANCE_DISTANCE = 100; // 100 meters

// How to find your office coordinates:
// 1. Open Google Maps
// 2. Right-click on your office location
// 3. Click on the coordinates that appear
// 4. Copy the latitude (first number) and longitude (second number)
// 5. Replace the values above

// Testing tips:
// - During development, you can increase MAX_ATTENDANCE_DISTANCE to 5000 (5km) for easier testing
// - Use a GPS spoofing app to simulate being at the office location
// - Check console logs to see actual distances calculated
