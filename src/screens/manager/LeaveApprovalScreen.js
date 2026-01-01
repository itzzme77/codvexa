import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LeaveApprovalScreen() {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const leaveRequests = {
    pending: [
      {
        id: 1,
        employeeName: 'John Doe',
        employeeId: 'EMP001',
        leaveType: 'Sick Leave',
        startDate: 'Jan 05, 2026',
        endDate: 'Jan 06, 2026',
        days: 2,
        reason: 'Fever and cold, need rest',
        appliedOn: 'Jan 01, 2026',
        balance: { total: 12, used: 3, available: 9 },
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        employeeId: 'EMP002',
        leaveType: 'Casual Leave',
        startDate: 'Jan 08, 2026',
        endDate: 'Jan 08, 2026',
        days: 1,
        reason: 'Personal work',
        appliedOn: 'Jan 01, 2026',
        balance: { total: 10, used: 4, available: 6 },
      },
      {
        id: 3,
        employeeName: 'Mike Johnson',
        employeeId: 'EMP003',
        leaveType: 'Earned Leave',
        startDate: 'Jan 15, 2026',
        endDate: 'Jan 19, 2026',
        days: 5,
        reason: 'Family vacation',
        appliedOn: 'Dec 31, 2025',
        balance: { total: 20, used: 8, available: 12 },
      },
    ],
    approved: [
      {
        id: 4,
        employeeName: 'Sarah Williams',
        employeeId: 'EMP004',
        leaveType: 'Sick Leave',
        startDate: 'Dec 28, 2025',
        endDate: 'Dec 30, 2025',
        days: 3,
        reason: 'Medical treatment',
        approvedOn: 'Dec 27, 2025',
      },
    ],
    rejected: [
      {
        id: 5,
        employeeName: 'Tom Brown',
        employeeId: 'EMP005',
        leaveType: 'Casual Leave',
        startDate: 'Dec 25, 2025',
        endDate: 'Dec 26, 2025',
        days: 2,
        reason: 'Personal reasons',
        rejectedOn: 'Dec 24, 2025',
        rejectionReason: 'Project deadline approaching',
      },
    ],
  };

  const handleApprove = (request) => {
    Alert.alert(
      'Approve Leave',
      `Approve leave request for ${request.employeeName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            Alert.alert('Success', 'Leave request approved successfully');
          },
        },
      ]
    );
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectModalVisible(true);
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    Alert.alert('Success', 'Leave request rejected', [
      {
        text: 'OK',
        onPress: () => {
          setRejectModalVisible(false);
          setRejectionReason('');
          setSelectedRequest(null);
        },
      },
    ]);
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Sick Leave':
        return '#EF5350';
      case 'Casual Leave':
        return '#42A5F5';
      case 'Earned Leave':
        return '#66BB6A';
      default:
        return '#9E9E9E';
    }
  };

  const renderLeaveCard = (request, showActions = false) => (
    <View key={request.id} style={styles.leaveCard}>
      <View style={styles.leaveHeader}>
        <View style={styles.employeeInfo}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.employeeName}>{request.employeeName}</Text>
            <Text style={styles.employeeId}>{request.employeeId}</Text>
          </View>
        </View>
        <View
          style={[
            styles.leaveTypeBadge,
            { backgroundColor: getLeaveTypeColor(request.leaveType) },
          ]}
        >
          <Text style={styles.leaveTypeText}>{request.leaveType}</Text>
        </View>
      </View>

      <View style={styles.leaveDateRow}>
        <Ionicons name="calendar-outline" size={18} color="#4CAF50" />
        <Text style={styles.leaveDateText}>
          {request.startDate} - {request.endDate}
        </Text>
        <View style={styles.daysChip}>
          <Text style={styles.daysText}>{request.days} {request.days > 1 ? 'Days' : 'Day'}</Text>
        </View>
      </View>

      <View style={styles.reasonBox}>
        <Ionicons name="document-text-outline" size={16} color="#666" />
        <Text style={styles.reasonLabel}>Reason:</Text>
        <Text style={styles.reasonText}>{request.reason}</Text>
      </View>

      {request.balance && (
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Leave Balance:</Text>
          <Text style={styles.balanceText}>
            Available: {request.balance.available} | Used: {request.balance.used} | Total: {request.balance.total}
          </Text>
        </View>
      )}

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color="#999" />
        <Text style={styles.metaText}>
          {request.appliedOn ? `Applied: ${request.appliedOn}` : 
           request.approvedOn ? `Approved: ${request.approvedOn}` :
           request.rejectedOn ? `Rejected: ${request.rejectedOn}` : ''}
        </Text>
      </View>

      {request.rejectionReason && (
        <View style={styles.rejectionReasonBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#F44336" />
          <Text style={styles.rejectionReasonLabel}>Rejection Reason:</Text>
          <Text style={styles.rejectionReasonText}>{request.rejectionReason}</Text>
        </View>
      )}

      {showActions && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(request)}
          >
            <Ionicons name="close-circle-outline" size={20} color="#F44336" />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(request)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
          onPress={() => setSelectedTab('pending')}
        >
          <Text
            style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}
          >
            Pending ({leaveRequests.pending.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'approved' && styles.activeTab]}
          onPress={() => setSelectedTab('approved')}
        >
          <Text
            style={[styles.tabText, selectedTab === 'approved' && styles.activeTabText]}
          >
            Approved ({leaveRequests.approved.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'rejected' && styles.activeTab]}
          onPress={() => setSelectedTab('rejected')}
        >
          <Text
            style={[styles.tabText, selectedTab === 'rejected' && styles.activeTabText]}
          >
            Rejected ({leaveRequests.rejected.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Leave Requests List */}
      <ScrollView style={styles.content}>
        {leaveRequests[selectedTab].map((request) =>
          renderLeaveCard(request, selectedTab === 'pending')
        )}
      </ScrollView>

      {/* Rejection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rejectModalVisible}
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reject Leave Request</Text>
              <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <View style={styles.requestSummary}>
                <Text style={styles.summaryText}>
                  {selectedRequest.employeeName} - {selectedRequest.leaveType}
                </Text>
                <Text style={styles.summarySubtext}>
                  {selectedRequest.days} {selectedRequest.days > 1 ? 'days' : 'day'} | {selectedRequest.startDate} - {selectedRequest.endDate}
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Reason for Rejection</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter reason for rejecting this leave request..."
              multiline
              numberOfLines={4}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              maxLength={200}
            />
            <Text style={styles.characterCount}>{rejectionReason.length}/200</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setRejectModalVisible(false);
                  setRejectionReason('');
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitModalButton]}
                onPress={submitRejection}
              >
                <Text style={styles.submitModalButtonText}>Reject Leave</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  leaveCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  employeeId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  leaveTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  leaveTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  leaveDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  leaveDateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  daysChip: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  daysText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  reasonText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
  balanceText: {
    fontSize: 11,
    color: '#4CAF50',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 11,
    color: '#999',
  },
  rejectionReasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
    marginBottom: 12,
    gap: 8,
  },
  rejectionReasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336',
  },
  rejectionReasonText: {
    fontSize: 12,
    color: '#F44336',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  rejectButton: {
    backgroundColor: '#FFEBEE',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F44336',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  approveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  requestSummary: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  summarySubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    fontSize: 14,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
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
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
  submitModalButton: {
    backgroundColor: '#F44336',
  },
  submitModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
