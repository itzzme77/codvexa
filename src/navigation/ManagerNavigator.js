import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

import ManagerHomeScreen from '../screens/manager/ManagerHomeScreen';
import ApprovalRequestsScreen from '../screens/manager/ApprovalRequestsScreen';
import TeamViewScreen from '../screens/manager/TeamViewScreen';
import ShiftManagementScreen from '../screens/manager/ShiftManagementScreen';
import ReportsExportScreen from '../screens/manager/ReportsExportScreen';
import LeaveApprovalScreen from '../screens/manager/LeaveApprovalScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ManagerTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Approvals') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Team') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Shifts') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E8E3E',
        tabBarInactiveTintColor: '#5F6368',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8EAED',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: true,
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
      <Tab.Screen name="Dashboard" component={ManagerHomeScreen} />
      <Tab.Screen name="Approvals" component={ApprovalRequestsScreen} />
      <Tab.Screen name="Team" component={TeamViewScreen} />
      <Tab.Screen name="Shifts" component={ShiftManagementScreen} />
      <Tab.Screen name="Reports" component={ReportsExportScreen} />
    </Tab.Navigator>
  );
}

export default function ManagerNavigator({ onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ManagerTabs">
        {(props) => <ManagerTabs {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="LeaveApproval"
        component={LeaveApprovalScreen}
        options={{
          headerShown: true,
          title: 'Leave Approval',
          headerStyle: { backgroundColor: '#1E8E3E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="AttendanceApproval"
        component={ApprovalRequestsScreen}
        options={{
          headerShown: true,
          title: 'Attendance Approval',
          headerStyle: { backgroundColor: '#1E8E3E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="TeamView"
        component={TeamViewScreen}
        options={{
          headerShown: true,
          title: 'Team View',
          headerStyle: { backgroundColor: '#1E8E3E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}
