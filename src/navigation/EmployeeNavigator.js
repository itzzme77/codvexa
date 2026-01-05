import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import LeaveScreen from '../screens/LeaveScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FaceCaptureScreen from '../screens/FaceCaptureScreen';

const Tab = createBottomTabNavigator();

export default function EmployeeNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Leave') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E8E3E',
        tabBarInactiveTintColor: '#64748B',
        headerStyle: {
          backgroundColor: '#1E8E3E',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () =>
          onLogout ? (
            <TouchableOpacity
              onPress={onLogout}
              style={{ marginRight: 12 }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Logout</Text>
            </TouchableOpacity>
          ) : null,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} />
      <Tab.Screen name="Leave" component={LeaveScreen} options={{ title: 'Leave Requests' }} />
      <Tab.Screen
        name="Profile"
        options={{ title: 'Profile' }}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="FaceCapture" 
        component={FaceCaptureScreen}
        options={{
          tabBarButton: () => null, // Hide from tab bar
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
