import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ManagerNavigator from './src/navigation/ManagerNavigator';
import EmployeeNavigator from './src/navigation/EmployeeNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [role, setRole] = useState(null); // 'employee' | 'manager' | 'admin' | null

  const handleLogin = (nextRole) => {
    setRole(nextRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <NavigationContainer>
      {role === null && <LoginScreen onLogin={handleLogin} />}
      {role === 'employee' && <EmployeeNavigator onLogout={handleLogout} />}
      {role === 'manager' && <ManagerNavigator onLogout={handleLogout} />}
      {role === 'admin' && <AdminNavigator onLogout={handleLogout} />}
    </NavigationContainer>
  );
}
