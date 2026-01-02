import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const AUDIT_LOGS = [
  {
    id: '1',
    actor: 'Admin01',
    role: 'Admin',
    action: 'Updated attendance policy',
    target: 'Standard Office Hours',
    time: 'Jan 01, 2026 10:12 AM',
    ip: '192.168.1.24',
    device: 'Android · Expo Go',
  },
  {
    id: '2',
    actor: 'Manager01',
    role: 'Manager',
    action: 'Approved leave request',
    target: 'EMP004 · Sarah Williams',
    time: 'Jan 01, 2026 09:47 AM',
    ip: '192.168.1.52',
    device: 'iPhone · Expo Go',
  },
  {
    id: '3',
    actor: 'Admin01',
    role: 'Admin',
    action: 'Changed leave limits',
    target: 'Compensatory Off',
    time: 'Dec 31, 2025 05:02 PM',
    ip: '10.0.0.3',
    device: 'Web · Chrome',
  },
  {
    id: '4',
    actor: 'Manager01',
    role: 'Manager',
    action: 'Exported payroll CSV',
    target: 'Dec 2025 Payroll',
    time: 'Dec 30, 2025 06:15 PM',
    ip: '10.0.0.5',
    device: 'Windows · Expo Go',
  },
];

const RBAC_FEATURES = [
  { id: 'attendance', label: 'Attendance Dashboard' },
  { id: 'leave', label: 'Leave Management' },
  { id: 'payroll', label: 'Payroll Reports' },
  { id: 'policies', label: 'Attendance Policies' },
  { id: 'users', label: 'User Management' },
];

const ROLES = ['Employee', 'Manager', 'Admin'];

export default function SecurityAuditScreen() {
  const [roleFilter, setRoleFilter] = useState('all');
  const [sessionTimeout, setSessionTimeout] = useState('30'); // minutes
  const [idleTimeoutEnabled, setIdleTimeoutEnabled] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaMethods, setMfaMethods] = useState(['Email', 'Authenticator App']);
  const [rbacMatrix, setRbacMatrix] = useState({
    attendance: ['Employee', 'Manager', 'Admin'],
    leave: ['Employee', 'Manager', 'Admin'],
    payroll: ['Manager', 'Admin'],
    policies: ['Admin'],
    users: ['Admin'],
  });

  const filteredLogs = AUDIT_LOGS.filter((log) =>
    roleFilter === 'all' ? true : log.role.toLowerCase() === roleFilter
  );

  const toggleRbac = (featureId, role) => {
    setRbacMatrix((prev) => {
      const current = prev[featureId] || [];
      const hasRole = current.includes(role);
      return {
        ...prev,
        [featureId]: hasRole ? current.filter((r) => r !== role) : [...current, role],
      };
    });
  };

  const toggleMfaMethod = (method) => {
    setMfaMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const setTimeoutValue = (value) => {
    setSessionTimeout(value);
  };

  const saveSecuritySettings = () => {
    // Validate settings
    if (mfaEnabled && mfaMethods.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one MFA method when MFA is enabled.');
      return;
    }

    // Show detailed confirmation
    Alert.alert(
      'Security Settings Saved',
      `Session Settings:\n` +
      `• Timeout: ${sessionTimeout} minutes\n` +
      `• Idle timeout: ${idleTimeoutEnabled ? 'Enabled' : 'Disabled'}\n\n` +
      `Multi-factor Authentication:\n` +
      `• Status: ${mfaEnabled ? 'Enabled' : 'Disabled'}\n` +
      (mfaEnabled ? `• Methods: ${mfaMethods.join(', ')}\n\n` : '\n') +
      `Role-based Access:\n` +
      `• Attendance: ${rbacMatrix.attendance.join(', ')}\n` +
      `• Leave: ${rbacMatrix.leave.join(', ')}\n` +
      `• Payroll: ${rbacMatrix.payroll.join(', ')}\n` +
      `• Policies: ${rbacMatrix.policies.join(', ')}\n` +
      `• Users: ${rbacMatrix.users.join(', ')}\n\n` +
      `Settings have been saved successfully.`,
      [{ text: 'OK', style: 'default' }]
    );

    // Log for backend integration
    console.log('Security settings saved:', {
      sessionTimeout,
      idleTimeoutEnabled,
      mfaEnabled,
      mfaMethods,
      rbacMatrix
    });
  };

  const exportAuditLogs = async () => {
    try {
      // Generate CSV content
      let csv = 'Timestamp,Actor,Role,Action,Target,IP Address,Device\n';
      
      filteredLogs.forEach(log => {
        csv += `"${log.time}","${log.actor}","${log.role}","${log.action}","${log.target}","${log.ip}","${log.device}"\n`;
      });

      // Create filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const filename = `audit_logs_${timestamp}.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, csv);

      // Share the file
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Audit Logs'
        });

        Alert.alert(
          'Export Successful',
          `Exported ${filteredLogs.length} audit log entries.\n\n` +
          `File: ${filename}\n\n` +
          `Filter applied: ${roleFilter === 'all' ? 'All roles' : roleFilter === 'admin' ? 'Admin only' : 'Manager only'}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Success', `File saved to: ${filename}`);
      }

      console.log('Audit logs exported:', { filename, count: filteredLogs.length, filter: roleFilter });
    } catch (error) {
      Alert.alert('Export Failed', `Error: ${error.message}`);
      console.error('Audit log export error:', error);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Security & Audit</Text>
          <Text style={styles.headerSubtitle}>Audit logs, access control & session settings</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#22C55E" />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Audit logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Audit Logs</Text>
          <View style={styles.chipRow}>
            {['all', 'admin', 'manager'].map((filterId) => (
              <TouchableOpacity
                key={filterId}
                style={[
                  styles.filterChip,
                  roleFilter === filterId && styles.filterChipActive,
                ]}
                onPress={() => setRoleFilter(filterId)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    roleFilter === filterId && styles.filterChipTextActive,
                  ]}
                >
                  {filterId === 'all'
                    ? 'All roles'
                    : filterId === 'admin'
                    ? 'Admin only'
                    : 'Manager only'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.auditCard}>
            {filteredLogs.map((log) => (
              <View key={log.id} style={styles.logRow}>
                <View style={styles.logIconWrap}>
                  <Ionicons name="time-outline" size={18} color="#4B5563" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.logHeaderRow}>
                    <Text style={styles.logActor}>{log.actor}</Text>
                    <View
                      style={[
                        styles.rolePill,
                        log.role === 'Admin' && styles.rolePillAdmin,
                        log.role === 'Manager' && styles.rolePillManager,
                      ]}
                    >
                      <Text style={styles.rolePillText}>{log.role}</Text>
                    </View>
                  </View>
                  <Text style={styles.logAction}>{log.action}</Text>
                  <Text style={styles.logTarget}>{log.target}</Text>
                  <View style={styles.logMetaRow}>
                    <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.logMetaText}>{log.time}</Text>
                  </View>
                  <View style={styles.logMetaRow}>
                    <Ionicons name="locate-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.logMetaText}>{log.ip}</Text>
                  </View>
                  <View style={styles.logMetaRow}>
                    <Ionicons name="phone-portrait-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.logMetaText}>{log.device}</Text>
                  </View>
                </View>
              </View>
            ))}
            {filteredLogs.length === 0 && (
              <Text style={styles.emptyText}>No audit events for this filter.</Text>
            )}
          </View>

          <TouchableOpacity style={styles.exportButton} onPress={exportAuditLogs}>
            <Ionicons name="download-outline" size={18} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Export Audit Logs (CSV)</Text>
          </TouchableOpacity>
        </View>

        {/* Role-based access control */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Role-based Access Control</Text>
          <View style={styles.card}>
            <Text style={styles.helperText}>
              Configure which roles can access each module. These settings are for demonstration
              and are not yet enforced against live data.
            </Text>
            {RBAC_FEATURES.map((feature) => (
              <View key={feature.id} style={styles.rbacRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rbacFeature}>{feature.label}</Text>
                  <Text style={styles.rbacFeatureSub}>Feature key: {feature.id}</Text>
                </View>
                <View style={styles.rbacRoles}>
                  {ROLES.map((role) => {
                    const active = (rbacMatrix[feature.id] || []).includes(role);
                    return (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleChip,
                          active && styles.roleChipActive,
                        ]}
                        onPress={() => toggleRbac(feature.id, role)}
                      >
                        <Text
                          style={[
                            styles.roleChipText,
                            active && styles.roleChipTextActive,
                          ]}
                        >
                          {role.charAt(0)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Session & MFA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Session & MFA Settings</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Default session timeout</Text>
            <View style={styles.chipRow}>
              {[15, 30, 60].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.timeoutChip,
                    sessionTimeout === String(v) && styles.timeoutChipActive,
                  ]}
                  onPress={() => setTimeoutValue(String(v))}
                >
                  <Text
                    style={[
                      styles.timeoutChipText,
                      sessionTimeout === String(v) && styles.timeoutChipTextActive,
                    ]}
                  >
                    {v} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.helperText}>
              After this period of inactivity, users are logged out and must sign in again.
            </Text>

            <View style={[styles.optionRow, { marginTop: 14 }]}>
              <Text style={styles.label}>Idle timeout enabled</Text>
              <TouchableOpacity
                style={[
                  styles.togglePill,
                  idleTimeoutEnabled && styles.togglePillOn,
                ]}
                onPress={() => setIdleTimeoutEnabled(!idleTimeoutEnabled)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    idleTimeoutEnabled && styles.toggleTextOn,
                  ]}
                >
                  {idleTimeoutEnabled ? 'On' : 'Off'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.optionRow}>
              <Text style={styles.label}>Multi-factor authentication (MFA)</Text>
              <TouchableOpacity
                style={[
                  styles.togglePill,
                  mfaEnabled && styles.togglePillOn,
                ]}
                onPress={() => setMfaEnabled(!mfaEnabled)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    mfaEnabled && styles.toggleTextOn,
                  ]}
                >
                  {mfaEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </TouchableOpacity>
            </View>

            {mfaEnabled && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Allowed MFA methods</Text>
                <View style={styles.chipRow}>
                  {['Email', 'SMS', 'Authenticator App'].map((method) => {
                    const active = mfaMethods.includes(method);
                    return (
                      <TouchableOpacity
                        key={method}
                        style={[
                          styles.timeoutChip,
                          active && styles.timeoutChipActive,
                        ]}
                        onPress={() => toggleMfaMethod(method)}
                      >
                        <Text
                          style={[
                            styles.timeoutChipText,
                            active && styles.timeoutChipTextActive,
                          ]}
                        >
                          {method}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.helperText}>
                  In a real deployment, these settings would be enforced by your identity
                  provider (IdP) or authentication backend.
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveSecuritySettings}>
            <Ionicons name="save-outline" size={18} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Security Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#22C55E1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  auditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  logRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logActor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  logAction: {
    fontSize: 13,
    color: '#111827',
    marginTop: 2,
  },
  logTarget: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  logMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  logMetaText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 10,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  rolePillAdmin: {
    backgroundColor: '#FEE2E2',
  },
  rolePillManager: {
    backgroundColor: '#DBEAFE',
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  rbacRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rbacFeature: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  rbacFeatureSub: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  rbacRoles: {
    flexDirection: 'row',
    gap: 6,
  },
  roleChip: {
    width: 26,
    height: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  roleChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  roleChipText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: '#312E81',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  timeoutChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  timeoutChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  timeoutChipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  timeoutChipTextActive: {
    color: '#0369A1',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  togglePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  togglePillOn: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  toggleText: {
    fontSize: 12,
    color: '#374151',
  },
  toggleTextOn: {
    color: '#166534',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  exportButton: {
    marginTop: 12,
    backgroundColor: '#0EA5E9',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#22C55E',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

