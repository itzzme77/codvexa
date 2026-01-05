# Face Capture Feature - Implementation Guide

## Overview
The face capture feature adds biometric verification to the attendance system using the device's front camera. This enhances security by ensuring the person marking attendance is physically present and authorized.

## How It Works

### Flow Sequence
1. **Location Verification** (First Layer)
   - User initiates clock in/out from HomeScreen
   - App verifies GPS location (must be within 100m of office)
   - If location check fails, process stops

2. **Face Capture** (Second Layer)
   - If location verified, user is navigated to FaceCaptureScreen
   - Front camera opens automatically
   - User sees face guide frame and instructions
   - User captures their live selfie
   - Photo is temporarily stored (URI + base64)

3. **Attendance Confirmation** (Final Step)
   - User returns to HomeScreen with captured photo
   - Confirmation modal appears
   - On confirmation, attendance is logged with:
     - GPS coordinates
     - Distance from office
     - Face photo (URI + base64)
     - Timestamp

## Technical Implementation

### Components

#### FaceCaptureScreen.js
**Purpose**: Dedicated screen for capturing user's face photo

**Key Features**:
- Front camera only (facing: 'front')
- Permission handling with explanatory UI
- Visual face guide with corner markers
- Initial guidance overlay (auto-dismisses after 3 seconds)
- Loading states during capture
- Cancel confirmation dialog

**Camera Settings**:
```javascript
quality: 0.8,        // Good balance of quality and file size
base64: true,        // Get base64 encoding for API upload
exif: false,         // Don't include metadata
```

**Data Returned**:
```javascript
{
  uri: 'file:///...',           // Local file path
  base64: 'iVBORw0KG...',       // Base64 encoded image
  action: 'clockIn' | 'clockOut' // Context of capture
}
```

#### HomeScreen.js Updates

**Navigation Integration**:
- Receives `navigation` and `route` props (Stack Navigator)
- Navigates to FaceCapture after location verification
- Receives captured photo via route params

**Photo Handling**:
```javascript
useEffect(() => {
  if (route.params?.capturedPhoto) {
    handleCapturedPhoto(route.params.capturedPhoto);
    navigation.setParams({ capturedPhoto: undefined });
  }
}, [route.params?.capturedPhoto]);
```

**Temporary Storage**:
- Photo stored in component state during confirmation
- Cleared after 1 second post-confirmation
- In production: should be uploaded to backend before clearing

**Logged Data**:
```javascript
{
  type: 'clock-in' | 'clock-out',
  time: '2:45:30 PM',
  location: { latitude, longitude, distance, timestamp },
  distance: 42,
  facePhotoUri: 'file:///...',
  hasFacePhotoBase64: true
}
```

#### EmployeeNavigator.js Structure
Changed from Tab Navigator to Stack + Tab Navigator:

```
EmployeeNavigator (Stack)
├── EmployeeTabs (Tab Navigator)
│   ├── Home
│   ├── Attendance
│   ├── Leave
│   └── Profile
└── FaceCapture (Modal Screen)
```

This allows FaceCapture to be a full-screen modal that sits on top of the tab navigation.

## User Experience

### Face Capture Screen UI Elements

1. **Header Bar** (Top)
   - Close button (left)
   - Title: "Clock In/Out - Face Verification"
   - Semi-transparent black background

2. **Face Guide Frame** (Center)
   - Oval frame with green corner markers
   - Positioned at ~20% from top
   - Size: 70% of screen width, 90% height

3. **Instructions** (Above Frame)
   - "Look directly at the camera"
   - White text with shadow for visibility

4. **Guidance Overlay** (Initial)
   - Full screen blue overlay
   - Shows tips for 3 seconds:
     - Position your face in the frame
     - Ensure good lighting
     - Keep a neutral expression

5. **Capture Button** (Bottom)
   - Large circular button (80x80)
   - White inner circle when ready
   - Loading spinner when processing
   - Hint text: "Tap to capture"

### User Journey

**Clock In Example**:
```
1. User taps "Clock In" button
   ↓
2. GPS verification (location check)
   ↓
3. Camera opens with face guide
   ↓
4. User positions face and taps capture
   ↓
5. Processing (capture + return)
   ↓
6. Confirmation modal appears
   ↓
7. User confirms → Success alert
```

**What User Sees**:
- ✅ Location verified: 42m from office
- ✅ Face photo captured: Yes
- ✅ Time: 2:45:30 PM
- ✅ GPS: 19.260510, 76.820988

## Security Features

### Multi-Layer Verification
1. **GPS Verification**: Physical presence at office
2. **Face Photo**: Biometric evidence of person present
3. **Timestamp**: Exact time of attendance
4. **Combined Logging**: All data logged together

### Privacy & Data Handling
- ⚠️ **Temporary Storage**: Photo only stored during confirmation process
- ⚠️ **No Permanent Local Storage**: Photo cleared after 1 second
- ⚠️ **Backend Upload**: In production, upload immediately to secure backend
- ⚠️ **Base64 Encoding**: Ready for HTTP/REST API transmission

### Photo Specifications
- **Format**: JPEG (default for Expo Camera)
- **Quality**: 0.8 (80% - good balance)
- **Size**: Typically 50-200KB depending on lighting
- **Resolution**: Full camera resolution (device-dependent)
- **Encoding**: Both URI (file path) and base64 available

## Camera Permissions

### Permission Request Flow
1. First time: App requests camera permission
2. Permission screen shows:
   - Camera icon
   - "Camera Permission Required"
   - Explanation text
   - "Grant Permission" button
   - "Cancel" button

3. If denied:
   - User can still cancel and return
   - Next time: Shows same request
   - If "Don't ask again" selected: User must enable in device settings

### Permission Handling
```javascript
const [permission, requestPermission] = useCameraPermissions();

if (!permission.granted) {
  // Show permission request UI
  return <PermissionScreen />;
}
```

## Backend Integration (Production)

### Required API Endpoint
```
POST /api/attendance/mark
```

### Expected Payload
```javascript
{
  employeeId: "EMP001",
  type: "clock-in" | "clock-out",
  timestamp: "2026-01-05T14:45:30.000Z",
  location: {
    latitude: 19.2605095,
    longitude: 76.8209881,
    distance: 42,
    accuracy: 10
  },
  facePhoto: {
    base64: "iVBORw0KGgoAAAANSUhEUgAA...",
    format: "jpeg"
  }
}
```

### Backend Processing Steps
1. **Receive Data**: Parse JSON payload
2. **Validate Location**: Check distance calculation
3. **Store Face Photo**: Save to secure storage (S3, Azure Blob, etc.)
4. **Face Recognition** (Optional): Compare with registered face
5. **Record Attendance**: Store in database with photo reference
6. **Respond**: Return success/failure

### Face Recognition (Optional Enhancement)
If implementing face recognition:
- **Registration**: Capture and store employee face during onboarding
- **Verification**: Compare captured face with stored face
- **Libraries**: Can use Azure Face API, AWS Rekognition, or FaceAPI.js
- **Threshold**: Set confidence threshold (e.g., 80% match)

## Testing Checklist

### Functional Testing
- [ ] Location verification triggers before camera
- [ ] Camera opens with front camera
- [ ] Face guide frame displays correctly
- [ ] Guidance overlay appears and dismisses
- [ ] Capture button works and shows loading
- [ ] Photo is captured successfully
- [ ] Navigation back to HomeScreen works
- [ ] Photo data is received correctly
- [ ] Confirmation modal appears with photo data
- [ ] Attendance is logged with all data
- [ ] Photo is cleared after confirmation

### Permission Testing
- [ ] First-time permission request works
- [ ] Permission denial shows correct UI
- [ ] Re-requesting permission works
- [ ] "Grant Permission" button works
- [ ] Cancel button returns to previous screen

### Edge Cases
- [ ] Low light conditions (photo quality)
- [ ] Very bright conditions (overexposure)
- [ ] Face not in frame (still captures)
- [ ] Multiple faces in frame (captures anyway)
- [ ] No face in frame (captures anyway)
- [ ] Capture during movement (blur)
- [ ] App backgrounded during capture
- [ ] Camera permission revoked mid-session

### UI/UX Testing
- [ ] Loading states display correctly
- [ ] Button disabled during processing
- [ ] Cancel confirmation dialog works
- [ ] Error alerts display correctly
- [ ] Instructions are clear and visible
- [ ] Frame guides are visible on all screen sizes

## Configuration

### Adjustable Parameters

**Camera Quality** (FaceCaptureScreen.js line ~70):
```javascript
quality: 0.8,  // Range: 0.0 - 1.0 (0 = lowest, 1 = highest)
```
- Lower quality = smaller file size, faster upload
- Higher quality = better face recognition, larger file

**Face Guide Size** (FaceCaptureScreen.js styles):
```javascript
top: height * 0.2,    // Vertical position
left: width * 0.15,   // Horizontal position
width: width * 0.7,   // Frame width
height: width * 0.9,  // Frame height
```

**Guidance Timeout** (FaceCaptureScreen.js line ~26):
```javascript
setTimeout(() => {
  setShowGuidance(false);
}, 3000);  // 3 seconds (3000ms)
```

## Troubleshooting

### Common Issues

**Issue**: Camera doesn't open
- **Solution**: Check camera permissions in device settings
- **Log**: Console will show permission status

**Issue**: Photo not captured
- **Solution**: Ensure cameraRef is properly set
- **Log**: Check "Error capturing photo" in console

**Issue**: Photo not received in HomeScreen
- **Solution**: Verify navigation params are passed correctly
- **Log**: Check "Photo captured" and "Face photo captured" logs

**Issue**: App crashes on camera open
- **Solution**: Update expo-camera to latest version
- **Command**: `npm install expo-camera@latest`

**Issue**: Black screen in camera
- **Solution**: Check if device has front camera
- **Solution**: Try restarting app

### Debug Logging

Current logs for debugging:
```javascript
// FaceCaptureScreen
console.log('Photo captured:', {
  uri: photo.uri,
  width: photo.width,
  height: photo.height,
  hasBase64: !!photo.base64,
});

// HomeScreen
console.log('Face photo captured:', {
  hasUri: !!photoData.uri,
  hasBase64: !!photoData.base64,
  action: photoData.action,
});

console.log('Attendance marked with verification:', {
  type: isClockIn ? 'clock-out' : 'clock-in',
  time: timeNow,
  location: todayStatus.location,
  distance: todayStatus.distance,
  facePhotoUri: todayStatus.facePhoto?.uri,
  hasFacePhotoBase64: !!todayStatus.facePhoto?.base64,
});
```

## Future Enhancements

### Recommended Additions
1. **Face Detection**: Use expo-face-detector to verify face is present before capture
2. **Liveness Detection**: Detect if photo is of real person vs. photo of photo
3. **Quality Check**: Verify photo meets minimum quality standards (brightness, blur)
4. **Retry Mechanism**: Allow user to retake photo if not satisfied
5. **Photo Preview**: Show captured photo before confirming
6. **Face Recognition**: Match captured face with registered face from onboarding
7. **Offline Support**: Queue attendance data when offline, sync when online
8. **Photo Compression**: Further reduce file size before upload

### Advanced Features
- **Anti-Spoofing**: Require user to blink or turn head
- **Mask Detection**: Detect if user is wearing face covering
- **Multiple Angles**: Capture from different angles for 3D face mapping
- **Expression Analysis**: Ensure neutral expression for consistency
- **Age Estimation**: Additional verification layer
- **Analytics**: Track capture success rate, lighting conditions, etc.

## Dependencies

### Required Packages
```json
{
  "expo-camera": "^15.0.0",
  "expo-location": "^17.0.0",
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/native-stack": "^6.0.0",
  "@react-navigation/bottom-tabs": "^6.0.0"
}
```

### Installation Commands
```bash
npm install expo-camera --save
npx expo install expo-camera
```

## Performance Considerations

### Memory Management
- Photo stored temporarily (1-2 seconds)
- Base64 encoding is memory-intensive
- Clear photo data after upload

### File Size
- Typical photo: 50-200KB
- Base64 encoding increases size by ~33%
- Consider compression for slower networks

### Network Upload
- Use multipart/form-data for large files
- Implement upload progress indicator
- Handle upload failures gracefully
- Retry failed uploads

## Compliance & Legal

### Data Privacy
- Inform users that photos are captured
- Provide privacy policy explaining usage
- Allow users to request photo deletion
- Secure storage and transmission

### Biometric Data Regulations
- GDPR (Europe): Explicit consent required
- BIPA (Illinois, USA): Written consent required
- CCPA (California, USA): Right to know and delete
- Check local regulations for your region

### Consent Requirements
Add consent screen:
- Explain why face photos are needed
- How photos will be used and stored
- Data retention policy
- Right to withdraw consent

## Summary

The face capture feature provides:
✅ **Two-factor verification**: Location + Face
✅ **Easy implementation**: Single screen, simple flow
✅ **User-friendly**: Clear guidance and feedback
✅ **Secure**: Temporary storage, ready for backend upload
✅ **Extensible**: Ready for face recognition integration

Next steps:
1. Test on physical device
2. Implement backend upload
3. Add face recognition (optional)
4. Deploy to production
