import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_LEAVE_TYPES = [
  {
    id: 'paid',
    name: 'Paid Leave',
    code: 'PL',
    annualLimit: '24',
    carryForward: true,
    maxCarryForward: '12',
  },
  {
    id: 'unpaid',
    name: 'Unpaid Leave',
    code: 'UL',
    annualLimit: '999',
    carryForward: false,
    maxCarryForward: '0',
  },
  {
    id: 'comp',
    name: 'Compensatory Off',
    code: 'CO',
    annualLimit: '10',
    carryForward: true,
    maxCarryForward: '5',
  },
];

export default function LeaveConfigurationScreen() {
  const [leaveTypes, setLeaveTypes] = useState(INITIAL_LEAVE_TYPES);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    code: '',
    annualLimit: '',
    carryForward: false,
    maxCarryForward: '',
  });

  const startEdit = (lt) => {
    setEditing(lt.id);
    setForm({ ...lt });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      id: '',
      name: '',
      code: '',
      annualLimit: '',
      carryForward: false,
      maxCarryForward: '',
    });
  };

  const toggleCarryForward = () => {
    setForm((prev) => ({
      ...prev,
      carryForward: !prev.carryForward,
      maxCarryForward: !prev.carryForward ? prev.maxCarryForward || '0' : '0',
    }));
  };

  const saveLeaveType = () => {
    // Validate required fields
    if (!form.name || !form.name.trim()) {
      Alert.alert('Validation Error', 'Display name is required.');
      return;
    }

    if (!form.code || !form.code.trim()) {
      Alert.alert('Validation Error', 'Leave code is required.');
      return;
    }

    // Validate code format (2-3 uppercase letters)
    const codePattern = /^[A-Z]{2,3}$/;
    if (!codePattern.test(form.code.trim())) {
      Alert.alert('Validation Error', 'Code must be 2-3 uppercase letters (e.g., PL, SL, CO).');
      return;
    }

    // Validate annual limit
    const annualLimit = parseInt(form.annualLimit);
    if (isNaN(annualLimit) || annualLimit < 0) {
      Alert.alert('Validation Error', 'Annual limit must be a positive number.');
      return;
    }

    if (annualLimit > 365) {
      Alert.alert('Validation Error', 'Annual limit cannot exceed 365 days.');
      return;
    }

    // Validate carry-forward
    let maxCarryForward = 0;
    if (form.carryForward) {
      maxCarryForward = parseInt(form.maxCarryForward);
      if (isNaN(maxCarryForward) || maxCarryForward < 0) {
        Alert.alert('Validation Error', 'Max carry-forward must be a positive number.');
        return;
      }

      if (maxCarryForward > annualLimit) {
        Alert.alert('Validation Error', 'Max carry-forward cannot exceed annual limit.');
        return;
      }
    }

    // Check for duplicate codes (except when editing the same leave type)
    const duplicateCode = leaveTypes.find(
      (lt) => lt.code === form.code.trim() && lt.id !== form.id
    );
    if (duplicateCode) {
      Alert.alert('Duplicate Code', `Code "${form.code}" is already used by "${duplicateCode.name}".`);
      return;
    }

    // Create clean payload
    const id = form.id || form.code.toLowerCase().trim();
    const payload = {
      id,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      annualLimit: annualLimit.toString(),
      carryForward: form.carryForward,
      maxCarryForward: form.carryForward ? maxCarryForward.toString() : '0',
    };

    // Update or add leave type
    setLeaveTypes((prev) => {
      const exists = prev.find((p) => p.id === id);
      if (exists) {
        return prev.map((p) => (p.id === id ? payload : p));
      }
      return [...prev, payload];
    });

    // Show success message with details
    Alert.alert(
      editing ? 'Leave Type Updated' : 'Leave Type Created',
      `${payload.name} (${payload.code})\n\n` +
      `Annual Limit: ${payload.annualLimit} days\n` +
      `Carry-forward: ${payload.carryForward ? `Yes (max ${payload.maxCarryForward} days)` : 'No'}\n\n` +
      `This leave type is now available for employee leave requests.`,
      [{ text: 'OK', style: 'default' }]
    );

    // Log for backend integration
    console.log(editing ? 'Updated leave type:' : 'Created leave type:', payload);
    
    resetForm();
  };

  const deleteLeaveType = (id) => {
    const leaveType = leaveTypes.find((lt) => lt.id === id);
    if (!leaveType) return;

    Alert.alert(
      'Delete Leave Type',
      `Are you sure you want to delete "${leaveType.name}" (${leaveType.code})?\n\n` +
      `This will remove the leave type from the system. Employees will no longer be able to apply for this leave type.\n\n` +
      `Note: This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLeaveTypes((prev) => prev.filter((p) => p.id !== id));
            if (editing === id) {
              resetForm();
            }
            Alert.alert('Deleted', `${leaveType.name} has been removed.`);
            console.log('Deleted leave type:', leaveType);
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
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Leave Types</Text>
      <View style={styles.card}>
        {leaveTypes.map((lt) => (
          <View key={lt.id} style={styles.leaveRow}>
            <View style={styles.leaveInfo}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={lt.id === 'unpaid' ? 'cash-outline' : 'calendar-outline'}
                  size={18}
                  color={lt.id === 'unpaid' ? '#DC2626' : '#2563EB'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.leaveName}>{lt.name}</Text>
                <Text style={styles.leaveMeta}>
                  Code: {lt.code} · {lt.annualLimit} days / year
                </Text>
                <Text style={styles.leaveMeta}>
                  Carry-forward: {lt.carryForward ? `Yes (max ${lt.maxCarryForward} days)` : 'No'}
                </Text>
              </View>
            </View>
            <View style={styles.rowActions}>
              <TouchableOpacity onPress={() => startEdit(lt)} style={styles.iconButton}>
                <Ionicons name="create-outline" size={18} color="#4B5563" />
              </TouchableOpacity>
              {lt.id !== 'paid' && lt.id !== 'unpaid' && lt.id !== 'comp' && (
                <TouchableOpacity onPress={() => deleteLeaveType(lt.id)} style={styles.iconButton}>
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        {editing ? 'Edit Leave Type' : 'Create Leave Type'}
      </Text>
      <View style={styles.card}>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm((prev) => ({ ...prev, name: t }))}
            placeholder="e.g. Special Leave"
          />
        </View>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            style={styles.input}
            value={form.code}
            onChangeText={(t) => setForm((prev) => ({ ...prev, code: t }))}
            placeholder="Short code, e.g. SL"
            autoCapitalize="characters"
          />
        </View>
        <View style={styles.fieldFull}>
          <Text style={styles.label}>Annual Limit (days)</Text>
          <TextInput
            style={styles.input}
            value={form.annualLimit}
            onChangeText={(t) => setForm((prev) => ({ ...prev, annualLimit: t }))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.label}>Allow carry-forward</Text>
          <TouchableOpacity
            style={[styles.togglePill, form.carryForward && styles.togglePillOn]}
            onPress={toggleCarryForward}
          >
            <Text style={[styles.toggleText, form.carryForward && styles.toggleTextOn]}>
              {form.carryForward ? 'Yes' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>

        {form.carryForward && (
          <View style={styles.fieldFull}>
            <Text style={styles.label}>Max carry-forward (days)</Text>
            <TextInput
              style={styles.input}
              value={form.maxCarryForward}
              onChangeText={(t) => setForm((prev) => ({ ...prev, maxCarryForward: t }))}
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={styles.formActions}>
          {editing && (
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={resetForm}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={saveLeaveType}>
            <Ionicons name="save-outline" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>{editing ? 'Update Type' : 'Create Type'}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  leaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leaveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  leaveName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  leaveMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 4,
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
    marginTop: 4,
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
  formActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#374151',
  },
});
