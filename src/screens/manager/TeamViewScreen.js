import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
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
      </ScrollView>

      {/* Team Members List */}
      <ScrollView style={styles.content}>
        {filteredMembers.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <View style={styles.memberInfo}>
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: getStatusColor(member.status) },
                  ]}
                >
                  <Ionicons name="person" size={28} color="#fff" />
                </View>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberId}>{member.id}</Text>
                  <Text style={styles.memberDesignation}>{member.designation}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(member.status) },
                ]}
              >
                <Ionicons name={getStatusIcon(member.status)} size={14} color="#fff" />
                <Text style={styles.statusText}>{getStatusLabel(member.status)}</Text>
              </View>
            </View>

            {member.status === 'on-leave' && member.leaveType && (
              <View style={styles.leaveInfo}>
                <Ionicons name="information-circle-outline" size={16} color="#2196F3" />
                <Text style={styles.leaveInfoText}>{member.leaveType}</Text>
              </View>
            )}

            <View style={styles.attendanceRow}>
              <View style={styles.attendanceItem}>
                <Ionicons name="log-in-outline" size={16} color="#4CAF50" />
                <Text style={styles.attendanceLabel}>Clock In</Text>
                <Text style={styles.attendanceValue}>
                  {member.clockIn || '--:--'}
                </Text>
              </View>
              <View style={styles.attendanceItem}>
                <Ionicons name="log-out-outline" size={16} color="#F44336" />
                <Text style={styles.attendanceLabel}>Clock Out</Text>
                <Text style={styles.attendanceValue}>
                  {member.clockOut || '--:--'}
                </Text>
              </View>
              <View style={styles.attendanceItem}>
                <Ionicons name="time-outline" size={16} color="#2196F3" />
                <Text style={styles.attendanceLabel}>Hours</Text>
                <Text style={styles.attendanceValue}>{member.workHours}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Attendance Rate</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${member.attendanceRate}%`,
                        backgroundColor: getStatusColor(member.status),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{member.attendanceRate}%</Text>
              </View>
            </View>

            <View style={styles.leaveBalanceRow}>
              <Text style={styles.leaveBalanceTitle}>Leave Balance:</Text>
              <View style={styles.leaveBalanceChips}>
                <View style={[styles.leaveChip, { backgroundColor: '#EF535020' }]}>
                  <Text style={[styles.leaveChipText, { color: '#EF5350' }]}>
                    SL: {member.leaveBalance.sick}
                  </Text>
                </View>
                <View style={[styles.leaveChip, { backgroundColor: '#42A5F520' }]}>
                  <Text style={[styles.leaveChipText, { color: '#42A5F5' }]}>
                    CL: {member.leaveBalance.casual}
                  </Text>
                </View>
                <View style={[styles.leaveChip, { backgroundColor: '#66BB6A20' }]}>
                  <Text style={[styles.leaveChipText, { color: '#66BB6A' }]}>
                    EL: {member.leaveBalance.earned}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 13,
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
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  memberId: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  memberDesignation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  leaveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  leaveInfoText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  attendanceItem: {
    alignItems: 'center',
    gap: 4,
  },
  attendanceLabel: {
    fontSize: 10,
    color: '#999',
  },
  attendanceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  statsRow: {
    marginBottom: 12,
  },
  statItem: {
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
  },
  leaveBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leaveBalanceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  leaveBalanceChips: {
    flexDirection: 'row',
    gap: 6,
  },
  leaveChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  leaveChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
