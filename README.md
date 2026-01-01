# Attendance App

A mobile attendance application built with React Native and Expo.

## Features

- **Home Dashboard**
  - Large central Clock In / Clock Out button with confirmation modal
  - Real-time clock display
  - Today's attendance status (Clock In/Out times, Total hours)
  - Shift timing card with shift details
  - Leave balance cards (Sick, Casual, Earned Leave)

- **Bottom Navigation**
  - Home: Dashboard with attendance controls
  - Attendance: View attendance history and statistics
  - Leave: Apply for leave and view leave requests
  - Profile: View and manage user profile

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## Project Structure

```
attendance-app/
├── App.js                      # Main navigation setup
├── src/
│   └── screens/
│       ├── HomeScreen.js       # Home dashboard with clock in/out
│       ├── AttendanceScreen.js # Attendance history
│       ├── LeaveScreen.js      # Leave management
│       └── ProfileScreen.js    # User profile
├── package.json
├── app.json
└── babel.config.js
```

## Technologies Used

- React Native
- Expo
- React Navigation (Bottom Tabs)
- Expo Vector Icons

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on physical device)

## Screenshots

The app includes:
- Green-themed UI with modern card designs
- Smooth animations and transitions
- Modal confirmations for clock actions
- Responsive layouts for different screen sizes

## Future Enhancements

- Backend integration for data persistence
- Push notifications for shift reminders
- Biometric authentication
- GPS-based attendance tracking
- Report generation
- Admin panel

## License

MIT
