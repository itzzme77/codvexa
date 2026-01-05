# GPS-Based Attendance System

## Overview
The app now includes GPS-based location verification for attendance marking. Employees can only clock in/out when they are within 100 meters of the office location.

## Features

### ✅ Location Verification
- **Real-time GPS tracking** using expo-location
- **Distance calculation** using Haversine formula
- **100-meter radius** enforcement (configurable)
- **Permission handling** with user-friendly prompts
- **High accuracy** location requests

### ✅ Security & Privacy
- Location permissions requested only when marking attendance
- GPS coordinates logged with timestamp for audit trail
- Distance from office displayed after successful verification
- Failed attempts are rejected with clear error messages

## How It Works

### 1. Clock In/Out Process
```
User taps Clock In/Out button
    ↓
App requests location permission
    ↓
GPS fetches current coordinates
    ↓
Distance calculated from office
    ↓
If ≤ 100m → Allow attendance ✓
If > 100m → Reject with message ✗
```

### 2. Location Calculation
The app uses the **Haversine formula** to calculate the great-circle distance between two points on Earth:

```javascript
distance = 2 × R × arcsin(√(a))
where:
  a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
  φ = latitude in radians
  λ = longitude in radians
  R = Earth's radius (6,371 km)
```

## Configuration

### Setting Office Location

Edit `config/officeLocations.js`:

```javascript
export const OFFICE_LOCATIONS = {
  main: {
    latitude: 28.7041,    // Your office latitude
    longitude: 77.1025,   // Your office longitude
    name: 'Main Office',
    address: 'Your office address',
  },
};

export const MAX_ATTENDANCE_DISTANCE = 100; // meters
```

### Finding Your Office Coordinates

1. Open **Google Maps**
2. Right-click on your office location
3. Click on the **coordinates** that appear
4. Copy **latitude** (first number) and **longitude** (second number)
5. Update `config/officeLocations.js`

Example:
- Latitude: `28.7041`
- Longitude: `77.1025`

## User Experience

### Success Flow
1. User taps "Clock In"
2. "Verifying Location..." loading indicator shows
3. Location verified within 2-3 seconds
4. Success message shows:
   - Time stamped
   - Distance from office (e.g., "45m from office")
   - GPS coordinates (for audit)

### Rejection Flow
1. User taps "Clock In"
2. Location fetched
3. Distance exceeds 100m
4. Alert shows:
   - "Location Verification Failed"
   - Current distance (e.g., "245 meters")
   - Office name
   - Instructions to move closer

### Permission Denied
1. User denies location permission
2. Alert shows:
   - "Permission Denied"
   - Explanation of requirement
   - Instructions to enable in settings

## Data Logged

Each attendance action logs:
```javascript
{
  type: 'clock-in' | 'clock-out',
  time: '10:23:45 AM',
  location: {
    latitude: 28.7041,
    longitude: 77.1025,
    distance: 45,
    timestamp: '2026-01-05T10:23:45.123Z'
  }
}
```

## Testing

### During Development

Increase the allowed distance for easier testing:

```javascript
export const MAX_ATTENDANCE_DISTANCE = 5000; // 5km for testing
```

### Testing Methods

1. **Use GPS Spoofing App** (Android)
   - Install "Fake GPS Location" from Play Store
   - Enable Developer Options
   - Set mock location to office coordinates

2. **Test on Emulator**
   - Android Studio: Use Extended Controls → Location
   - iOS Simulator: Debug → Location → Custom Location

3. **Field Testing**
   - Visit actual office location
   - Test at different distances (50m, 100m, 150m)
   - Verify rejection beyond 100m

## Error Handling

### Location Service Disabled
```
"Unable to fetch location: Location services are disabled.
Please ensure GPS is enabled."
```

### Network/GPS Issues
```
"Unable to fetch location: Timeout.
Please try again."
```

### Permission Required
```
"Location permission is required for attendance marking.
Please enable location access in your device settings."
```

## Backend Integration

Send attendance data to your backend API:

```javascript
const response = await fetch('https://api.yourcompany.com/attendance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employeeId: 'EMP001',
    type: 'clock-in',
    timestamp: new Date().toISOString(),
    location: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      distance: calculatedDistance
    }
  })
});
```

## Permissions Required

### Android (app.json)
```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location for attendance verification."
        }
      ]
    ]
  }
}
```

### iOS (app.json)
Automatically configured by expo-location plugin.

## Troubleshooting

### "Location permission denied"
- Go to device Settings → Apps → Your App → Permissions
- Enable Location permission

### "Distance always shows 0 or very large"
- Check office coordinates are correct
- Ensure GPS has clear sky view
- Wait for GPS accuracy to improve (accuracy < 20m is best)

### "Stuck on Verifying Location..."
- Check internet connection
- Ensure GPS is enabled
- Try moving to open area for better signal

## Production Considerations

1. **Increase timeout** for slow GPS fixes (currently 10s)
2. **Add retry logic** for failed location requests
3. **Store failed attempts** for security monitoring
4. **Implement geofencing** for instant alerts
5. **Add offline mode** - queue attendance, sync later
6. **Battery optimization** - cache location for 5 minutes
7. **Fraud detection** - flag suspicious patterns (VPN, GPS spoofing)

## Privacy Compliance

- ✅ Location used ONLY for attendance
- ✅ Permissions requested with clear explanation
- ✅ Location not tracked continuously
- ✅ GPS data stored securely with timestamps
- ✅ Compliant with GDPR/local privacy laws

## Support

For issues or questions:
1. Check console logs for distance calculations
2. Verify office coordinates in config file
3. Test with increased distance limit
4. Ensure device has GPS enabled
