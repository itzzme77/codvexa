import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DEPARTMENTS = ['Engineering', 'Sales', 'HR', 'Operations'];
const ROLES = ['Employee', 'Manager', 'Admin'];

export default function AttendancePolicyScreen() {
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
    breakMinutes: '60',
  });

  const [lateRules, setLateRules] = useState({
    graceMinutes: '10',
    markLateAfterMinutes: '15',
    maxLatePerMonth: '3',
  });

  const [overtimeRules, setOvertimeRules] = useState({
    enabled: true,
    roundToMinutes: '30',
    maxPerDayHours: '3',
    maxPerWeekHours: '10',
  });

  const [assignments, setAssignments] = useState({
    departments: ['Engineering', 'Sales'],
    roles: ['Employee', 'Manager'],
  });

  const toggleAssignment = (type, value) => {
    setAssignments((prev) => {
      const list = prev[type];
      const exists = list.includes(value);
      return {
        ...prev,
        [type]: exists ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  };

  const validateTimeFormat = (time) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  const calculateWorkHours = () => {
    const [startH, startM] = workingHours.start.split(':').map(Number);
    const [endH, endM] = workingHours.end.split(':').map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    const breakMin = parseInt(workingHours.breakMinutes) || 0;
    const effectiveMinutes = totalMinutes - breakMin;
    return (effectiveMinutes / 60).toFixed(1);
  };

  const savePolicy = () => {
    // Validate time formats
    if (!validateTimeFormat(workingHours.start)) {
      Alert.alert('Invalid Time', 'Start time must be in HH:MM format (e.g., 09:00)');
      return;
    }
    if (!validateTimeFormat(workingHours.end)) {
      Alert.alert('Invalid Time', 'End time must be in HH:MM format (e.g., 18:00)');
      return;
    }

    // Validate numeric fields
    const breakMin = parseInt(workingHours.breakMinutes);
    const graceMin = parseInt(lateRules.graceMinutes);
    const lateAfter = parseInt(lateRules.markLateAfterMinutes);
    const maxLate = parseInt(lateRules.maxLatePerMonth);
    const otRound = parseInt(overtimeRules.roundToMinutes);
    const otMaxDay = parseFloat(overtimeRules.maxPerDayHours);
    const otMaxWeek = parseFloat(overtimeRules.maxPerWeekHours);

    if (isNaN(breakMin) || breakMin < 0) {
      Alert.alert('Invalid Input', 'Break duration must be a positive number');
      return;
    }
    if (isNaN(graceMin) || graceMin < 0) {
      Alert.alert('Invalid Input', 'Grace period must be a positive number');
      return;
    }
    if (isNaN(lateAfter) || lateAfter < 0) {
      Alert.alert('Invalid Input', 'Late mark threshold must be a positive number');
      return;
    }
    if (isNaN(maxLate) || maxLate < 0) {
      Alert.alert('Invalid Input', 'Max late per month must be a positive number');
      return;
    }

    // Validate assignments
    if (assignments.departments.length === 0) {
      Alert.alert('Missing Assignment', 'Please select at least one department');
      return;
    }
    if (assignments.roles.length === 0) {
      Alert.alert('Missing Assignment', 'Please select at least one role');
      return;
    }

    // Calculate effective work hours
    const effectiveHours = calculateWorkHours();

    // Show detailed confirmation
    Alert.alert(
      'Policy Saved Successfully',
      `Working Hours: ${workingHours.start} - ${workingHours.end}\n` +
      `Effective Work: ${effectiveHours} hours/day\n` +
      `Break: ${breakMin} minutes\n\n` +
      `Late Rules:\n` +
      `• Grace: ${graceMin} min\n` +
      `• Mark late after: ${lateAfter} min\n` +
      `• Max late/month: ${maxLate}\n\n` +
      `Overtime: ${overtimeRules.enabled ? 'Enabled' : 'Disabled'}\n` +
      (overtimeRules.enabled ? `• Max: ${otMaxDay}h/day, ${otMaxWeek}h/week\n\n` : '\n') +
      `Applied to:\n` +
      `• Departments: ${assignments.departments.join(', ')}\n` +
      `• Roles: ${assignments.roles.join(', ')}`,
      [{ text: 'OK', style: 'default' }]
    );

    // In a real app, you would save this to backend/database
    console.log('Policy saved:', {
      workingHours,
      lateRules,
      overtimeRules,
      assignments,
      effectiveHours,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Working hours */}
      <Text style={styles.sectionTitle}>Working Hours</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Start Time</Text>
            <TextInput
              style={styles.input}
              value={workingHours.start}
              onChangeText={(t) => setWorkingHours({ ...workingHours, start: t })}
              placeholder="HH:MM"
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>End Time</Text>
            <TextInput
              style={styles.input}
              value={workingHours.end}
              onChangeText={(t) => setWorkingHours({ ...workingHours, end: t })}
              placeholder="HH:MM"
            />
          </View>
        </View>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Break Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={workingHours.breakMinutes}
            onChangeText={(t) => setWorkingHours({ ...workingHours, breakMinutes: t })}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Late rules */}
      <Text style={styles.sectionTitle}>Late Arrival Rules</Text>
      <View style={styles.card}>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Grace period (minutes)</Text>
          <TextInput
            style={styles.input}
            value={lateRules.graceMinutes}
            onChangeText={(t) => setLateRules({ ...lateRules, graceMinutes: t })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Mark "Late" after (minutes)</Text>
          <TextInput
            style={styles.input}
            value={lateRules.markLateAfterMinutes}
            onChangeText={(t) => setLateRules({ ...lateRules, markLateAfterMinutes: t })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Max late marks per month</Text>
          <TextInput
            style={styles.input}
            value={lateRules.maxLatePerMonth}
            onChangeText={(t) => setLateRules({ ...lateRules, maxLatePerMonth: t })}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Overtime rules */}
      <Text style={styles.sectionTitle}>Overtime Rules</Text>
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Overtime allowed</Text>
          <TouchableOpacity
            style={[styles.togglePill, overtimeRules.enabled && styles.togglePillOn]}
            onPress={() => setOvertimeRules({ ...overtimeRules, enabled: !overtimeRules.enabled })}
          >
            <Text
              style={[styles.toggleText, overtimeRules.enabled && styles.toggleTextOn]}
            >
              {overtimeRules.enabled ? 'Enabled' : 'Disabled'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Round OT to (minutes)</Text>
            <TextInput
              style={styles.input}
              value={overtimeRules.roundToMinutes}
              onChangeText={(t) => setOvertimeRules({ ...overtimeRules, roundToMinutes: t })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.fieldHalf}>
            <Text style={styles.label}>Max OT / day (hours)</Text>
            <TextInput
              style={styles.input}
              value={overtimeRules.maxPerDayHours}
              onChangeText={(t) => setOvertimeRules({ ...overtimeRules, maxPerDayHours: t })}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Max OT / week (hours)</Text>
          <TextInput
            style={styles.input}
            value={overtimeRules.maxPerWeekHours}
            onChangeText={(t) => setOvertimeRules({ ...overtimeRules, maxPerWeekHours: t })}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Policy assignment */}
      <Text style={styles.sectionTitle}>Policy Assignment</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Departments</Text>
        <View style={styles.chipRow}>
          {DEPARTMENTS.map((dep) => {
            const active = assignments.departments.includes(dep);
            return (
              <TouchableOpacity
                key={dep}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleAssignment('departments', dep)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{dep}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Roles</Text>
        <View style={styles.chipRow}>
          {ROLES.map((r) => {
            const active = assignments.roles.includes(r);
            return (
              <TouchableOpacity
                key={r}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleAssignment('roles', r)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{r}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={savePolicy}>
        <Ionicons name="save-outline" size={18} color="#FFFFFF" />
        <Text style={styles.saveText}>Save Policy</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
    marginBottom: 10,
  },
  fieldFull: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    backgroundColor: '#F9FAFB',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  togglePill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  chipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
  },
  chipTextActive: {
    color: '#312E81',
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 4,
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
