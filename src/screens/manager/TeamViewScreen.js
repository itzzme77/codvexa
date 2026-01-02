import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TeamViewScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const teamMembers = [
    {
      id: 'EMP001',
      name: 'John Doe',
      designation: 'Senior Developer',
      status: 'present',
      clockIn: '09:05 AM',
      clockOut: null,
      workHours: '4h 30m',
      leaveBalance: { sick: 9, casual: 6, earned: 12 },
      attendanceRate: 95,
    },
    {
      id: 'EMP002',
      name: 'Jane Smith',
      designation: 'UI/UX Designer',
      status: 'present',
      clockIn: '09:00 AM',
      clockOut: null,
      workHours: '4h 35m',
      leaveBalance: { sick: 10, casual: 8, earned: 15 },
      attendanceRate: 98,
    },
    {
      id: 'EMP003',
      name: 'Mike Johnson',
      designation: 'Backend Developer',
      status: 'late',
      clockIn: '10:15 AM',
      clockOut: null,
      workHours: '3h 20m',
      leaveBalance: { sick: 12, casual: 5, earned: 10 },
      attendanceRate: 92,
    },
    {
      id: 'EMP004',
      name: 'Sarah Williams',
      designation: 'QA Engineer',
      status: 'absent',
      clockIn: null,
      clockOut: null,
      workHours: '0h 0m',
      leaveBalance: { sick: 8, casual: 7, earned: 14 },
      attendanceRate: 94,
    },
    {
      id: 'EMP005',
      name: 'Tom Brown',
      designation: 'DevOps Engineer',
      status: 'on-leave',
      clockIn: null,
      clockOut: null,
      workHours: '0h 0m',
      leaveBalance: { sick: 11, casual: 6, earned: 13 },
      attendanceRate: 96,
      leaveType: 'Sick Leave',
    },
  ];

  const statusFilters = [
    { key: 'all', label: 'All', count: teamMembers.length },
    { key: 'present', label: 'Present', count: teamMembers.filter(m => m.status === 'present').length },
    { key: 'late', label: 'Late', count: teamMembers.filter(m => m.status === 'late').length },
    { key: 'absent', label: 'Absent', count: teamMembers.filter(m => m.status === 'absent').length },
    { key: 'on-leave', label: 'On Leave', count: teamMembers.filter(m => m.status === 'on-leave').length },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'late':
        return '#FF9800';
      case 'absent':
        return '#F44336';
      case 'on-leave':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return 'checkmark-circle';
      case 'late':
        return 'time';
      case 'absent':
        return 'close-circle';
      case 'on-leave':
        return 'briefcase';
      default:
        return 'help-circle';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'late':
        return 'Late Arrival';
      case 'absent':
        return 'Absent';
      case 'on-leave':
        return 'On Leave';
      default:
        return 'Unknown';
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or employee ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filters */}
      <View style={styles.filterContainer}>
        {statusFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              filterStatus === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === filter.key && styles.filterChipTextActive,
              ]}
            >
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Team Members List */}
      <ScrollView style={styles.content}>
        {filteredMembers.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberRow}>
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: getStatusColor(member.status) },
                ]}
              >
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberMeta}>{member.id} • {member.designation}</Text>
                
                {member.status === 'on-leave' && member.leaveType && (
                  <Text style={styles.leaveNote}>🏖️ {member.leaveType}</Text>
                )}
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(member.status) },
                ]}
              >
                <Ionicons name={getStatusIcon(member.status)} size={12} color="#fff" />
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Clock In</Text>
                <Text style={styles.infoValue}>{member.clockIn || '--:--'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Clock Out</Text>
                <Text style={styles.infoValue}>{member.clockOut || '--:--'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Hours</Text>
                <Text style={styles.infoValue}>{member.workHours}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  memberMeta: {
    fontSize: 12,
    color: '#999',
  },
  leaveNote: {
    fontSize: 11,
    color: '#2196F3',
    marginTop: 4,
    fontWeight: '500',
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
});
