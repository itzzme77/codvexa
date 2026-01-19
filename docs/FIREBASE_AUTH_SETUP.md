# Firebase Authentication Setup Guide

This guide explains how to set up and use Firebase Authentication with role-based access control in the Attendance App.

## Overview

The app now uses Firebase Authentication with three user roles:
- **Employee**: Basic users who can mark attendance and manage their leaves
- **Manager**: Can manage teams, approve leaves, and view reports
- **Admin**: Full access to all features including user management and system configuration

## Setup Instructions

### 1. Firebase Project Configuration

The Firebase configuration is already set up in `config/firebaseConfig.js` with your project credentials:
- Project ID: `attendanceapp-7a8b6`
- Auth Domain: `attendanceapp-7a8b6.firebaseapp.com`

### 2. Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `attendanceapp-7a8b6`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

### 3. Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Start in **Production mode** (we'll add rules next)
4. Choose your preferred region
5. Click **Enable**

### 4. Configure Firestore Security Rules

Add these rules to allow authenticated users to access their data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      // Only admins can write to users collection
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Attendance collection
    match /attendance/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Leave requests collection
    match /leaveRequests/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Other collections as needed
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Create Initial Users

#### Option A: Using Firebase Console (Recommended for beginners)

1. Go to Firebase Console → **Authentication** → **Users**
2. Click **Add user**
3. Create users with these credentials:
   - **Admin**: admin@example.com / admin123
   - **Manager**: manager@example.com / manager123
   - **Employee**: employee@example.com / employee123

4. After creating each user, go to **Firestore Database** → **users** collection
5. Create a document for each user with their UID as the document ID:
   ```json
   {
     "email": "admin@example.com",
     "role": "admin",
     "displayName": "Admin User",
     "createdAt": "2026-01-19T12:00:00.000Z",
     "isActive": true
   }
   ```

#### Option B: Using the Creation Script

1. Install Node.js if not already installed
2. Run the user creation script:
   ```bash
   node scripts/createUsers.js
   ```
3. The script will create all test users automatically

## Architecture

### File Structure

```
config/
  └── firebaseConfig.js         # Firebase initialization
src/
  └── services/
      └── authService.js        # Authentication functions
  └── screens/
      └── LoginScreen.js        # Updated login UI
App.js                          # Auth state management
```

### Authentication Flow

1. **Login**: User enters email and password
2. **Firebase Auth**: Validates credentials
3. **Role Check**: Fetches user role from Firestore
4. **Navigation**: Routes to appropriate dashboard based on role

### Key Functions

#### `loginUser(email, password)`
Authenticates user and returns user data with role.

```javascript
const { user, role } = await loginUser('admin@example.com', 'admin123');
```

#### `registerUser(email, password, role, displayName)`
Creates new user account with specified role (admin only).

#### `logoutUser()`
Signs out the current user.

#### `getUserRole(uid)`
Fetches user role from Firestore.

#### `onAuthChange(callback)`
Listens to authentication state changes.

## User Management

### Creating New Users (Admin Only)

You can create a user management screen that uses the `registerUser` function:

```javascript
import { registerUser } from '../services/authService';

const createNewEmployee = async () => {
  try {
    await registerUser(
      'newemployee@example.com',
      'password123',
      'employee',
      'New Employee Name'
    );
    Alert.alert('Success', 'Employee account created');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

### Role-Based Access

The app automatically routes users based on their role:
- Employees → `EmployeeNavigator`
- Managers → `ManagerNavigator`
- Admins → `AdminNavigator`

Admin users can access any section regardless of which login tab they use.

## Testing

Use these test credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Manager | manager@example.com | manager123 |
| Employee | employee@example.com | employee123 |

## Security Best Practices

1. **Change default passwords** after initial setup
2. **Enable 2FA** in Firebase Console for admin accounts
3. **Review Firestore rules** regularly
4. **Monitor authentication logs** in Firebase Console
5. **Rotate API keys** periodically
6. **Use environment variables** for sensitive configuration in production

## Troubleshooting

### Login fails with "User role not found"
- Ensure user document exists in Firestore `users` collection
- Verify the document has a `role` field

### "Permission denied" errors
- Check Firestore security rules
- Ensure user is authenticated
- Verify user has correct role for the operation

### Can't create new users
- Check if Email/Password auth is enabled in Firebase Console
- Verify you have proper permissions in Firebase project
- Check for existing users with same email

## Next Steps

1. ✅ Set up Firebase Authentication
2. ✅ Configure Firestore
3. ✅ Create test users
4. 🔲 Implement password reset functionality
5. 🔲 Add user profile editing
6. 🔲 Create admin user management screen
7. 🔲 Add email verification

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Native Firebase](https://rnfirebase.io/)
