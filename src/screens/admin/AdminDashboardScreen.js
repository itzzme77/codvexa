import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboardScreen({ navigation, onLogout }) {
  // Mocked admin-level metrics
  const keyMetrics = {
    totalEmployees: 245,
    attendanceCompliance: 96.4, // %
    payrollStatus: 'On Track',
  };

  const alerts = [
    {
      id: 1,
      type: 'policy',
      title: 'Overtime policy breach',
      description: '8 employees exceeded daily overtime limit yesterday.',
      severity: 'high',
      time: '10 mins ago',
    },
    {
      id: 2,
      type: 'data',
      title: 'Missing time entries',
      description: '5 employees have missing clock-out data this week.',
      severity: 'medium',
      time: '30 mins ago',
    },
    {
      id: 3,
      type: 'payroll',
      title: 'Unapproved leave impacting payroll',
      description: '12 pending leave requests close to payroll cut-off.',
      severity: 'medium',
      time: '2 hours ago',
    },
    {
      id: 4,
      type: 'data',
      title: 'Old attendance records not synced',
      description: 'Historical data for 2023 Q4 requires validation.',
      severity: 'low',
      time: 'Yesterday',
    },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'policy':
        return 'shield-checkmark-outline';
      case 'payroll':
        return 'card-outline';
      case 'data':
        return 'document-text-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
      default:
        return '#10B981';
    }
  };

  return (
    <View style={styles.root}>
      {/* Admin header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Console</Text>
          <Text style={styles.headerSubtitle}>Organization overview & compliance</Text>
        </View>
        {onLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#1D4ED8' }]}>
            <Ionicons name="people-outline" size={28} color="#BFDBFE" />
            <Text style={styles.metricLabel}>Total Employees</Text>
            <Text style={styles.metricValue}>{keyMetrics.totalEmployees}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#059669' }]}>
            <Ionicons name="checkmark-done-outline" size={28} color="#A7F3D0" />
            <Text style={styles.metricLabel}>Attendance Compliance</Text>
            <Text style={styles.metricValue}>{keyMetrics.attendanceCompliance}%</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#7C3AED', flex: 1 }]}>
            <Ionicons name="cash-outline" size={28} color="#DDD6FE" />
            <Text style={styles.metricLabel}>Payroll Status</Text>
            <Text style={styles.metricValue}>{keyMetrics.payrollStatus}</Text>
            <Text style={styles.metricSub}>Next cycle: 31 Jan</Text>
          </View>
        </View>

        {/* Administration cards */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Administration</Text>
        <TouchableOpacity
          style={styles.adminCard}
          onPress={() => navigation?.navigate('UserManagement')}
        >
          <View style={styles.adminIconWrap}>
            <Ionicons name="people-circle-outline" size={28} color="#2563EB" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>User Management</Text>
            <Text style={styles.adminSubtitle}>
              Manage employees, managers and admins, roles, departments and policies.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.adminCard}
          onPress={() => navigation?.navigate('AttendancePolicies')}
        >
          <View style={[styles.adminIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time-outline" size={28} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>Attendance Policies</Text>
            <Text style={styles.adminSubtitle}>
              Configure working hours, late & overtime rules, and assign policies.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.adminCard}
          onPress={() => navigation?.navigate('LeaveConfiguration')}
        >
          <View style={[styles.adminIconWrap, { backgroundColor: '#ECFEFF' }]}>
            <Ionicons name="briefcase-outline" size={28} color="#0891B2" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>Leave Configuration</Text>
            <Text style={styles.adminSubtitle}>
              Create leave types (Paid, Unpaid, Comp Off), limits and carry-forward rules.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.adminCard}
          onPress={() => navigation?.navigate('PayrollReports')}
        >
          <View style={[styles.adminIconWrap, { backgroundColor: '#ECFEFF' }]}>
            <Ionicons name="calculator-outline" size={28} color="#0EA5E9" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>Reports & Payroll</Text>
            <Text style={styles.adminSubtitle}>
              Generate payroll-ready attendance reports with CSV export.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.adminCard}
          onPress={() => navigation?.navigate('SecurityAudit')}
        >
          <View style={[styles.adminIconWrap, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="shield-checkmark-outline" size={28} color="#DC2626" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>Security & Audit Logs</Text>
            <Text style={styles.adminSubtitle}>
              View who did what, when, and manage access & MFA.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Alerts */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Alerts & Exceptions</Text>
        <View style={styles.alertContainer}>
          {alerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View
                style={[
                  styles.alertIcon,
                  { backgroundColor: getSeverityColor(alert.severity) + '20' },
                ]}
              >
                <Ionicons
                  name={getAlertIcon(alert.type)}
                  size={22}
                  color={getSeverityColor(alert.severity)}
                />
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertHeaderRow}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <View
                    style={[
                      styles.severityPill,
                      { backgroundColor: getSeverityColor(alert.severity) + '15' },
                    ]}
                  >
                    <View
                      style={[
                        styles.severityDot,
                        { backgroundColor: getSeverityColor(alert.severity) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.severityText,
                        { color: getSeverityColor(alert.severity) },
                      ]}
                    >
                      {alert.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
            </View>
          ))}
        </View>
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
    paddingBottom: 16,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F9FAFB',
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 13,
    color: '#E5E7EB',
    marginTop: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  metricSub: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 4,
  },
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertCard: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  alertDescription: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  adminIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  adminTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  adminSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  severityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  severityDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
