import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ onLogout }) {
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const initialProfile = {
    name: 'John Doe',
    employeeId: 'EMP001',
    department: 'Software Development',
    designation: 'Senior Developer',
    email: 'john.doe@company.com',
    phone: '+1 234-567-8900',
    joinDate: 'Jan 15, 2023',
    reportingManager: 'Jane Smith',
    workLocation: 'New York Office',
  };

  const [profile, setProfile] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState(initialProfile);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }
    
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }
    
    Alert.alert('Success', 'Password changed successfully', [
      {
        text: 'OK',
        onPress: () => {
          setChangePasswordModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      },
    ]);
  };

  const handleBiometricToggle = (value) => {
    if (value) {
      Alert.alert(
        'Enable Biometric Login',
        'Do you want to enable fingerprint/face recognition for quick login?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => {
              setBiometricEnabled(true);
              Alert.alert('Success', 'Biometric login enabled successfully');
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Disable Biometric Login',
        'Are you sure you want to disable biometric login?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            onPress: () => {
              setBiometricEnabled(false);
              Alert.alert('Success', 'Biometric login disabled');
            },
          },
        ]
      );
    }
  };

  const handleStartEditProfile = () => {
    setDraftProfile(profile);
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setDraftProfile(profile);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    setProfile(draftProfile);
    setIsEditingProfile(false);
    Alert.alert('Profile Updated', 'Your profile details have been updated.');
  };

  const updateDraftProfileField = (field, value) => {
    setDraftProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (typeof onLogout === 'function') {
              onLogout();
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.employeeId}>{profile.employeeId}</Text>
        <Text style={styles.designation}>{profile.designation}</Text>
      </View>

      {/* User Information (Read-only) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="information-circle" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          {isEditingProfile ? (
            <View style={styles.cardHeaderActions}>
              <TouchableOpacity
                style={[styles.chipButton, styles.chipButtonSecondary]}
                onPress={handleCancelEditProfile}
              >
                <Text style={styles.chipButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chipButton, styles.chipButtonPrimary]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.chipButtonPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.chipButton, styles.chipButtonPrimary]}
              onPress={handleStartEditProfile}
            >
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.chipButtonPrimaryText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Department</Text>
            {isEditingProfile ? (
              <TextInput
                style={styles.infoInput}
                value={draftProfile.department}
                onChangeText={(text) => updateDraftProfileField('department', text)}
                placeholder="Enter department"
              />
            ) : (
              <Text style={styles.infoValue}>{profile.department}</Text>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            {isEditingProfile ? (
              <TextInput
                style={styles.infoInput}
                value={draftProfile.phone}
                onChangeText={(text) => updateDraftProfileField('phone', text)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{profile.phone}</Text>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Work Location</Text>
            {isEditingProfile ? (
              <TextInput
                style={styles.infoInput}
                value={draftProfile.workLocation}
                onChangeText={(text) => updateDraftProfileField('workLocation', text)}
                placeholder="Enter work location"
              />
            ) : (
              <Text style={styles.infoValue}>{profile.workLocation}</Text>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Reporting Manager</Text>
            <Text style={styles.infoValue}>{profile.reportingManager}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Join Date</Text>
            <Text style={styles.infoValue}>{profile.joinDate}</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <Text style={styles.sectionTitle}>Settings</Text>

      {/* Change Password */}
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => setChangePasswordModal(true)}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIconContainer, { backgroundColor: '#2196F320' }]}>
            <Ionicons name="lock-closed-outline" size={24} color="#2196F3" />
          </View>
          <View>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingDescription}>Update your account password</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Biometric Login */}
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <View style={[styles.settingIconContainer, { backgroundColor: '#9C27B020' }]}>
            <Ionicons name="finger-print-outline" size={24} color="#9C27B0" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingLabel}>Biometric Login</Text>
            <Text style={styles.settingDescription}>
              {biometricEnabled ? 'Fingerprint/Face ID enabled' : 'Use fingerprint or face recognition'}
            </Text>
          </View>
        </View>
        <Switch
          value={biometricEnabled}
          onValueChange={handleBiometricToggle}
          trackColor={{ false: '#ddd', true: '#81C784' }}
          thumbColor={biometricEnabled ? '#4CAF50' : '#f4f3f4'}
        />
      </View>

      {/* Notifications */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <View style={[styles.settingIconContainer, { backgroundColor: '#FF980020' }]}>
            <Ionicons name="notifications-outline" size={24} color="#FF9800" />
          </View>
          <View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>Manage notification preferences</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Help & Support */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <View style={[styles.settingIconContainer, { backgroundColor: '#00BCD420' }]}>
            <Ionicons name="help-circle-outline" size={24} color="#00BCD4" />
          </View>
          <View>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <Text style={styles.settingDescription}>Get help or contact support</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Privacy Policy */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <View style={[styles.settingIconContainer, { backgroundColor: '#607D8B20' }]}>
            <Ionicons name="document-text-outline" size={24} color="#607D8B" />
          </View>
          <View>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingDescription}>Read our privacy policy</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.version}>Version 1.0.0</Text>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModal}
        onRequestClose={() => setChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordModal(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Current Password */}
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.passwordInput}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  style={styles.passwordInputField}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Ionicons
                    name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* New Password */}
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInput}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  style={styles.passwordInputField}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>Must be at least 8 characters</Text>

              {/* Confirm Password */}
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInput}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  style={styles.passwordInputField}
                  placeholder="Re-enter new password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => {
                    setChangePasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitModalButton]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.submitModalButtonText}>Change Password</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#45a049',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  employeeId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  designation: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.85,
    marginTop: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoInput: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginBottom: 12,
    marginTop: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    minHeight: 72,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#F44336',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    minHeight: 54,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FAFAFA',
    gap: 10,
    minHeight: 54,
  },
  passwordInputField: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  passwordHint: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginLeft: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelModalButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitModalButton: {
    backgroundColor: '#4CAF50',
  },
  submitModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipButtonPrimary: {
    backgroundColor: '#4CAF50',
    gap: 6,
  },
  chipButtonSecondary: {
    backgroundColor: '#F5F5F5',
  },
  chipButtonPrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chipButtonSecondaryText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
});
