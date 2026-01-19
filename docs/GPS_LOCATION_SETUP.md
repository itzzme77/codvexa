# Office Location Setup - Complete Guide

## ✅ Your Office Location Configuration

Your Pune office has been successfully configured:

### 📍 Main Office Details
- **Location:** HW6P+49H, Pune, Maharashtra, India
- **Plus Code:** HW6P+49H
- **Coordinates:**
  - Latitude: `18.510625`
  - Longitude: `73.835625`
- **Geofence Radius:** 100 meters

### 🏢 Additional Branch Offices
- **Nanded Branch:** 19.2605095, 76.8209881
- **Gurugram Branch:** 28.5355, 77.3910

---

## 🎯 How GPS-Based Attendance Works

### 1. **Clock In/Out Process**
When an employee tries to mark attendance:

1. **Location Permission Check**
   - App requests GPS permissions
   - User must grant "Allow while using the app"

2. **GPS Verification**
   - App fetches current location with high accuracy
   - Calculates distance from nearest office location
   - Must be within 100 meters to proceed

3. **Face Recognition** (if location valid)
   - Opens camera for face capture
   - Verifies employee identity
   - Stores photo with attendance record

4. **Attendance Recorded**
   - Timestamp, GPS coordinates, and photo saved
   - Distance from office recorded
   - Synced to Firebase/database

### 2. **Location Validation Rules**
```javascript
✓ Within 100m → Allowed
✗ Beyond 100m → Blocked with distance message
⚠ No GPS signal → Error message shown
🔒 Permission denied → Instructions to enable
```

---

## ⚙️ Configuration Files

### 1. **Office Locations** ([config/officeLocations.js](config/officeLocations.js))
```javascript
export const OFFICE_LOCATIONS = {
  main: {
    latitude: 18.510625,
    longitude: 73.835625,
    name: 'Main Office - Pune',
    address: 'HW6P+49H, Pune, Maharashtra, India',
    plusCode: 'HW6P+49H',
  },
  // Add more branches as needed
};

export const MAX_ATTENDANCE_DISTANCE = 100; // meters
```

### 2. **Location Utilities** ([src/utils/locationUtils.js](src/utils/locationUtils.js))
Helper functions for GPS operations:
- `verifyAttendanceLocation()` - Main verification function
- `calculateDistance()` - Haversine formula for distance
- `getCurrentLocation()` - Get user's GPS coordinates
- `checkLocationValidity()` - Validate against all offices

### 3. **Home Screen** ([src/screens/HomeScreen.js](src/screens/HomeScreen.js))
Implements attendance marking with GPS:
- Clock In/Out buttons
- Real-time location verification
- Distance calculation and display
- Face capture integration

---

## 🧪 Testing Your Setup

### Option 1: Test at Actual Location
1. Go to your Pune office (HW6P+49H)
2. Open the app
3. Try to mark attendance
4. Should work if within 100m

### Option 2: Increase Testing Radius (Development)
Temporarily increase the geofence for testing:

```javascript
// In config/officeLocations.js
export const MAX_ATTENDANCE_DISTANCE = 5000; // 5km for testing
```

**⚠️ Remember to set it back to 100m for production!**

### Option 3: GPS Spoofing (Android)
1. Enable Developer Options on Android
2. Install "Fake GPS Location" app
3. Set location to: `18.510625, 73.835625`
4. Test the app

---

## 📱 User Experience

### Success Flow:
```
1. User taps "Clock In"
2. "Checking location..." spinner appears
3. ✓ Location verified (45m from office)
4. Camera opens for face capture
5. Photo captured and validated
6. ✓ Attendance marked successfully!
```

### Failure Flow - Too Far:
```
1. User taps "Clock In"
2. "Checking location..." spinner appears
3. ✗ Alert: "You are 350m from office"
4. "Please move closer and try again"
```

### Failure Flow - No Permission:
```
1. User taps "Clock In"
2. Permission prompt appears
3. User denies permission
4. ✗ Alert: "Location permission required"
5. Instructions to enable in settings
```

---

## 🔧 Advanced Configuration

### Adding New Office Locations

To add a new office, edit [config/officeLocations.js](config/officeLocations.js):

```javascript
export const OFFICE_LOCATIONS = {
  main: { /* Pune office */ },
  branch1: { /* Nanded */ },
  branch2: { /* Gurugram */ },
  
  // Add new office
  branch3: {
    latitude: 19.0760,
    longitude: 72.8777,
    name: 'Mumbai Office',
    address: 'Mumbai, Maharashtra, India',
  },
};
```

### Adjusting Geofence Radius

For different office locations:

```javascript
export const OFFICE_LOCATIONS = {
  main: {
    latitude: 18.510625,
    longitude: 73.835625,
    name: 'Main Office - Pune',
    maxDistance: 100, // 100m for this office
  },
  campus: {
    latitude: 18.520000,
    longitude: 73.840000,
    name: 'Tech Campus',
    maxDistance: 500, // 500m for large campus
  },
};
```

### Getting Coordinates from Plus Code

**Method 1: Google Maps**
1. Open https://www.google.com/maps
2. Search for: `HW6P+49H`
3. Right-click on the pin
4. Click coordinates to copy

**Method 2: Plus Codes Website**
1. Go to https://plus.codes/
2. Enter: `HW6P+49H Pune`
3. Coordinates shown on map

**Method 3: Your Current Location**
1. Open Google Maps on phone
2. Tap blue dot (your location)
3. Tap coordinates to copy
4. Use in configuration

---

## 📊 Features Included

- ✅ GPS-based location verification
- ✅ Multi-office support
- ✅ Distance calculation (Haversine formula)
- ✅ High-accuracy GPS mode
- ✅ Permission handling
- ✅ Error messages and user guidance
- ✅ Real-time distance display
- ✅ Works offline (GPS doesn't need internet)
- ✅ Face recognition integration
- ✅ Photo capture with metadata
- ✅ Timestamp and coordinates logging

---

## 🔒 Security Considerations

1. **GPS Spoofing Prevention**
   - Consider implementing mock location detection
   - Add server-side validation
   - Log suspicious patterns

2. **Data Privacy**
   - GPS coordinates stored securely
   - Only accessible to authorized personnel
   - Complies with privacy regulations

3. **Accuracy**
   - Uses high-accuracy GPS mode
   - Haversine formula for precise distance
   - Accounts for GPS margin of error

---

## 📞 Common Issues & Solutions

### Issue: "Location permission denied"
**Solution:** Guide user to Settings → Apps → YourApp → Permissions → Location → Allow

### Issue: "Unable to fetch location"
**Solution:** 
- Check if GPS is enabled
- Move to area with better GPS signal
- Restart the app

### Issue: "Always showing too far"
**Solution:**
- Verify office coordinates are correct
- Check if MAX_ATTENDANCE_DISTANCE is too small
- Test with increased radius (5000m) temporarily

### Issue: Location not accurate
**Solution:**
- Ensure GPS is enabled (not just WiFi location)
- Wait a few seconds for GPS to lock
- Move outdoors for better signal

---

## 🚀 Next Steps

1. **Test the Configuration**
   - Run the app: `npm start`
   - Try marking attendance
   - Verify GPS coordinates are captured

2. **Setup Firebase** (if not done)
   - Store attendance records with GPS data
   - Create collection: `attendance`
   - Include fields: `timestamp`, `location`, `distance`, `photo`

3. **Add Admin Features**
   - View all attendance with map locations
   - Generate reports with location data
   - Set up geofence alerts

4. **Enhance Security**
   - Implement mock location detection
   - Add server-side validation
   - Log location anomalies

---

## 📝 Files Modified

1. ✅ `config/officeLocations.js` - Updated with Pune coordinates
2. ✅ `src/utils/locationUtils.js` - Created GPS utility functions
3. ✅ `src/screens/HomeScreen.js` - Already has GPS integration
4. ✅ `docs/GPS_ATTENDANCE_GUIDE.md` - This documentation

---

Your GPS-based attendance system is now configured and ready to use! 🎉
