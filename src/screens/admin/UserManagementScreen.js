import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

const INITIAL_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Employee', department: 'Engineering', policies: ['Standard Attendance'] },
  { id: '2', name: 'Brian Lee', email: 'brian@example.com', role: 'Manager', department: 'Sales', policies: ['Standard Attendance', 'Overtime Approval'] },
  { id: '3', name: 'Catherine Smith', email: 'catherine@example.com', role: 'Employee', department: 'HR', policies: ['Standard Attendance'] },
  { id: '4', name: 'David Kim', email: 'david@example.com', role: 'Admin', department: 'IT', policies: ['Standard Attendance', 'Admin Access'] },
];

const ALL_POLICIES = ['Standard Attendance', 'Overtime Approval', 'Remote Work', 'Admin Access'];
const ROLES = ['Employee', 'Manager', 'Admin'];

export default function UserManagementScreen() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const stats = useMemo(() => {
    const total = users.length;
    const byRole = users.reduce(
      (acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }),
      {},
    );
    return { total, byRole };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.department.toLowerCase().includes(term),
    );
  }, [users, search]);

  const startBulkImport = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'CSV' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      Alert.alert(
        'File Selected',
        `File: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.mimeType}\n\nIn production, this file would be sent to your backend API for processing and bulk user import.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Process',
            onPress: () => {
              // Simulate processing
              Alert.alert(
                'Import Successful',
                `Successfully imported users from ${file.name}\n\nNote: In a real app, the backend would:\n• Parse the file\n• Validate user data\n• Create user accounts\n• Assign roles & policies\n• Send email notifications`,
              );
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', `Failed to pick file: ${error.message}`);
    }
  };

  const openEdit = (user) => setEditingUser(user);

  const togglePolicy = (policy) => {
    if (!editingUser) return;
    const has = editingUser.policies.includes(policy);
    const nextPolicies = has
      ? editingUser.policies.filter((p) => p !== policy)
      : [...editingUser.policies, policy];
    setEditingUser({ ...editingUser, policies: nextPolicies });
  };

  const saveUser = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
    Alert.alert(
      'User Updated',
      `Successfully updated ${editingUser.name}'s profile:\n• Role: ${editingUser.role}\n• Department: ${editingUser.department}\n• Policies: ${editingUser.policies.length} assigned`,
      [{ text: 'OK' }]
    );
    setEditingUser(null);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>Users, roles, departments & policies</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#0EA5E9' }]}>
            <Text style={styles.summaryLabel}>Total Users</Text>
            <Text style={styles.summaryValue}>{stats.total}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#22C55E' }]}>
            <Text style={styles.summaryLabel}>Employees</Text>
            <Text style={styles.summaryValue}>{stats.byRole.Employee || 0}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#F97316' }]}>
            <Text style={styles.summaryLabel}>Managers</Text>
            <Text style={styles.summaryValue}>{stats.byRole.Manager || 0}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#8B5CF6' }]}>
            <Text style={styles.summaryLabel}>Admins</Text>
            <Text style={styles.summaryValue}>{stats.byRole.Admin || 0}</Text>
          </View>
        </View>

        {/* Bulk import */}
        <Text style={styles.sectionTitle}>Bulk Import</Text>
        <View style={styles.bulkRow}>
          <TouchableOpacity
            style={styles.bulkButton}
            onPress={() => startBulkImport('CSV')}
          >
            <Ionicons name="document-text-outline" size={18} color="#2563EB" />
            <Text style={styles.bulkText}>Import CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bulkButton}
            onPress={() => startBulkImport('Excel')}
          >
            <Ionicons name="logo-microsoft" size={18} color="#16A34A" />
            <Text style={styles.bulkText}>Import Excel</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <Text style={styles.sectionTitle}>Users</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, department"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* User list */}
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.userMetaRow}>
                <View style={[styles.roleBadge, styles[`role_${user.role}`]]}>
                  <Text style={styles.roleBadgeText}>{user.role}</Text>
                </View>
                <Text style={styles.userDept}>{user.department}</Text>
              </View>
              <View style={styles.policyRow}>
                {user.policies.map((p) => (
                  <View key={p} style={styles.policyChip}>
                    <Text style={styles.policyChipText}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => openEdit(user)}>
              <Ionicons name="create-outline" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Edit drawer */}
        {editingUser && (
          <View style={styles.editPanel}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ flex: 1 }}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                <Text style={styles.editTitle}>Edit User</Text>
                <Text style={styles.editName}>{editingUser.name}</Text>

                <Text style={styles.editLabel}>Role</Text>
                <View style={styles.chipRow}>
                  {ROLES.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleChip,
                        editingUser.role === role && styles.roleChipActive,
                      ]}
                      onPress={() => setEditingUser({ ...editingUser, role })}
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          editingUser.role === role && styles.roleChipTextActive,
                        ]}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.editLabel}>Department</Text>
                <TextInput
                  style={styles.editInput}
                  value={editingUser.department}
                  onChangeText={(t) => setEditingUser({ ...editingUser, department: t })}
                />

                <Text style={styles.editLabel}>Policies</Text>
                <View style={styles.chipRow}>
                  {ALL_POLICIES.map((policy) => (
                    <TouchableOpacity
                      key={policy}
                      style={[
                        styles.policySelectChip,
                        editingUser.policies.includes(policy) && styles.policySelectChipActive,
                      ]}
                      onPress={() => togglePolicy(policy)}
                    >
                      <Text
                        style={[
                          styles.policySelectText,
                          editingUser.policies.includes(policy) && styles.policySelectTextActive,
                        ]}
                      >
                        {policy}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.editButtonAction, styles.editCancel]}
                    onPress={() => setEditingUser(null)}
                  >
                    <Text style={styles.editCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.editButtonAction, styles.editSave]}
                    onPress={saveUser}
                  >
                    <Text style={styles.editSaveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        )}
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
    paddingBottom: 12,
    backgroundColor: '#111827',
  },
  headerTitle: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#E5E7EB',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 8,
  },
  bulkRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  bulkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  bulkText: {
    marginLeft: 8,
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginRight: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  role_Employee: {
    backgroundColor: '#3B82F6',
  },
  role_Manager: {
    backgroundColor: '#F97316',
  },
  role_Admin: {
    backgroundColor: '#8B5CF6',
  },
  userDept: {
    fontSize: 12,
    color: '#4B5563',
  },
  policyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  policyChip: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  policyChipText: {
    fontSize: 10,
    color: '#1D4ED8',
  },
  editButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  editPanel: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
  },
  editTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  editName: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
    marginBottom: 8,
  },
  editLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#374151',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleChipActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  roleChipText: {
    fontSize: 12,
    color: '#374151',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
  },
  editInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
  },
  policySelectChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
  },
  policySelectChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  policySelectText: {
    fontSize: 12,
    color: '#374151',
  },
  policySelectTextActive: {
    color: '#166534',
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  editButtonAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  editCancel: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editCancelText: {
    fontSize: 13,
    color: '#4B5563',
  },
  editSave: {
    backgroundColor: '#2563EB',
  },
  editSaveText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
