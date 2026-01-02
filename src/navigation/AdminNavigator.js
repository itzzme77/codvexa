import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import AttendancePolicyScreen from '../screens/admin/AttendancePolicyScreen';
import LeaveConfigurationScreen from '../screens/admin/LeaveConfigurationScreen';
import PayrollReportsScreen from '../screens/admin/PayrollReportsScreen';
import SecurityAuditScreen from '../screens/admin/SecurityAuditScreen';

const Stack = createStackNavigator();

export default function AdminNavigator({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        options={{
          title: 'Admin Dashboard',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () =>
            onLogout ? (
              <TouchableOpacity
                onPress={onLogout}
                style={{ marginRight: 12 }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Logout</Text>
              </TouchableOpacity>
            ) : null,
        }}
      >
        {(props) => <AdminDashboardScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          title: 'User Management',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="AttendancePolicies"
        component={AttendancePolicyScreen}
        options={{
          title: 'Attendance Policies',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="LeaveConfiguration"
        component={LeaveConfigurationScreen}
        options={{
          title: 'Leave Configuration',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="PayrollReports"
        component={PayrollReportsScreen}
        options={{
          title: 'Reports & Payroll',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="SecurityAudit"
        component={SecurityAuditScreen}
        options={{
          title: 'Security & Audit',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Stack.Navigator>
  );
}
