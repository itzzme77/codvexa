import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ManagerNavigator from './src/navigation/ManagerNavigator';
import EmployeeNavigator from './src/navigation/EmployeeNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { onAuthChange, logoutUser } from './src/services/authService';

export default function App() {
  const [role, setRole] = useState(null); // 'employee' | 'manager' | 'admin' | null
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthChange((authData) => {
      if (authData) {
        setUser(authData.user);
        setRole(authData.role);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = (userRole, userData) => {
    setRole(userRole);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setRole(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {role === null && <LoginScreen onLogin={handleLogin} />}
      {role === 'employee' && <EmployeeNavigator onLogout={handleLogout} />}
      {role === 'manager' && <ManagerNavigator onLogout={handleLogout} />}
      {role === 'admin' && <AdminNavigator onLogout={handleLogout} />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});
