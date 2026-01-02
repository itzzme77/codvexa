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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ApprovalRequestsScreen() {
  const [selectedTab, setSelectedTab] = useState('leave');
  const [statusTab, setStatusTab] = useState('pending');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');

  const leaveRequests = {
    pending: [
      {
        id: 'L001',
        type: 'leave',
        employeeName: 'John Doe',
        employeeId: 'EMP001',
        leaveType: 'Sick Leave',
        startDate: 'Jan 05, 2026',
        endDate: 'Jan 06, 2026',
        days: 2,
        reason: 'Fever and cold, need rest for recovery',
        appliedOn: 'Jan 01, 2026',
        balance: { total: 12, used: 3, available: 9 },
      },
      {
        id: 'L002',
        type: 'leave',
        employeeName: 'Jane Smith',
        employeeId: 'EMP002',
        leaveType: 'Casual Leave',
        startDate: 'Jan 08, 2026',
        endDate: 'Jan 08, 2026',
        days: 1,
        reason: 'Personal work - need to visit bank',
        appliedOn: 'Jan 01, 2026',
        balance: { total: 10, used: 4, available: 6 },
      },
    ],
    approved: [
      {
        id: 'L003',
        type: 'leave',
        employeeName: 'Sarah Williams',
        employeeId: 'EMP004',
        leaveType: 'Sick Leave',
        startDate: 'Dec 28, 2025',
        endDate: 'Dec 30, 2025',
        days: 3,
        reason: 'Medical treatment',
        approvedOn: 'Dec 27, 2025',
        approvedBy: 'Manager Name',
      },
    ],
    rejected: [
      {
        id: 'L004',
        type: 'leave',
        employeeName: 'Tom Brown',
        employeeId: 'EMP005',
        leaveType: 'Casual Leave',
        startDate: 'Dec 25, 2025',
        endDate: 'Dec 26, 2025',
        days: 2,
        reason: 'Personal reasons',
        rejectedOn: 'Dec 24, 2025',
        rejectedBy: 'Manager Name',
        rejectionReason: 'Project deadline approaching, team availability critical',
      },
    ],
  };

  const attendanceRequests = {
    pending: [
      {
        id: 'A001',
        type: 'attendance',
        employeeName: 'Mike Johnson',
        employeeId: 'EMP003',
        date: 'Dec 28, 2025',
        requestType: 'Missing Clock Out',
        actualClockIn: '09:00 AM',
        actualClockOut: null,
        requestedClockOut: '06:30 PM',
        reason: 'Forgot to clock out, left office at 6:30 PM after project deployment',
        appliedOn: 'Dec 29, 2025',
      },
      {
        id: 'A002',
        type: 'attendance',
        employeeName: 'Sarah Williams',
        employeeId: 'EMP004',
        date: 'Dec 27, 2025',
        requestType: 'Late Arrival',
        actualClockIn: '10:45 AM',
        actualClockOut: '07:15 PM',
        requestedClockIn: null,
        reason: 'Medical emergency in family, had to take family member to hospital',
        appliedOn: 'Dec 27, 2025',
      },
      {
        id: 'A003',
        type: 'attendance',
        employeeName: 'Tom Brown',
        employeeId: 'EMP005',
        date: 'Dec 26, 2025',
        requestType: 'Missing Punch',
        actualClockIn: null,
        actualClockOut: null,
        requestedClockIn: '09:00 AM',
        requestedClockOut: '06:00 PM',
        reason: 'System error, attendance not recorded. Worked full day as confirmed by team.',
        appliedOn: 'Dec 28, 2025',
      },
    ],
    approved: [
      {
        id: 'A004',
        type: 'attendance',
        employeeName: 'John Doe',
        employeeId: 'EMP001',
        date: 'Dec 20, 2025',
        requestType: 'Missing Clock Out',
        requestedClockOut: '06:00 PM',
        reason: 'Technical issue with attendance system',
        approvedOn: 'Dec 21, 2025',
        approvedBy: 'Manager Name',
      },
    ],
    rejected: [
      {
        id: 'A005',
        type: 'attendance',
        employeeName: 'Jane Smith',
        employeeId: 'EMP002',
        date: 'Dec 15, 2025',
        requestType: 'Late Arrival',
        actualClockIn: '11:00 AM',
        reason: 'Traffic jam',
        rejectedOn: 'Dec 16, 2025',
        rejectedBy: 'Manager Name',
        rejectionReason: 'Third late arrival this month, please plan commute accordingly',
      },
    ],
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApproveModalVisible(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      Alert.alert('Success', `${selectedRequest.type === 'leave' ? 'Leave' : 'Attendance'} request approved successfully`, [
        {
          text: 'OK',
          onPress: () => {
            setApproveModalVisible(false);
            setApprovalNotes('');
            setSelectedRequest(null);
          },
        },
      ]);
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectModalVisible(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    Alert.alert('Success', `${selectedRequest.type === 'leave' ? 'Leave' : 'Attendance'} request rejected`, [
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

  const getRequestTypeColor = (type) => {
    switch (type) {
      case 'Missing Clock Out':
        return '#FF9800';
      case 'Late Arrival':
        return '#F44336';
      case 'Missing Punch':
        return '#9C27B0';
      default:
        return '#607D8B';
    }
  };

  const renderLeaveCard = (request, showActions = false) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
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
            styles.typeBadge,
            { backgroundColor: getLeaveTypeColor(request.leaveType) },
          ]}
        >
          <Text style={styles.typeText}>{request.leaveType}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={18} color="#4CAF50" />
        <Text style={styles.detailLabel}>Date Range:</Text>
        <Text style={styles.detailValue}>
          {request.startDate} - {request.endDate}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="time-outline" size={18} color="#2196F3" />
        <Text style={styles.detailLabel}>Duration:</Text>
        <Text style={styles.detailValue}>
          {request.days} {request.days > 1 ? 'Days' : 'Day'}
        </Text>
      </View>

      <View style={styles.reasonBox}>
        <View style={styles.reasonHeader}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <Text style={styles.reasonLabel}>Reason:</Text>
        </View>
        <Text style={styles.reasonText}>{request.reason}</Text>
      </View>

      {request.balance && (
        <View style={styles.balanceBox}>
          <Ionicons name="information-circle-outline" size={16} color="#4CAF50" />
          <Text style={styles.balanceText}>
            Balance: {request.balance.available} available | {request.balance.used} used | {request.balance.total} total
          </Text>
        </View>
      )}

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color="#999" />
        <Text style={styles.metaText}>
          {request.appliedOn ? `Applied: ${request.appliedOn}` : 
           request.approvedOn ? `Approved: ${request.approvedOn} by ${request.approvedBy}` :
           request.rejectedOn ? `Rejected: ${request.rejectedOn} by ${request.rejectedBy}` : ''}
        </Text>
      </View>

      {request.rejectionReason && (
        <View style={styles.rejectionBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#F44336" />
          <View style={styles.rejectionContent}>
            <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
            <Text style={styles.rejectionText}>{request.rejectionReason}</Text>
          </View>
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

  const renderAttendanceCard = (request, showActions = false) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
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
            styles.typeBadge,
            { backgroundColor: getRequestTypeColor(request.requestType) },
          ]}
        >
          <Text style={styles.typeText}>{request.requestType}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={18} color="#4CAF50" />
        <Text style={styles.detailLabel}>Date:</Text>
        <Text style={styles.detailValue}>{request.date}</Text>
      </View>

      {request.actualClockIn && (
        <View style={styles.detailRow}>
          <Ionicons name="log-in-outline" size={18} color="#4CAF50" />
          <Text style={styles.detailLabel}>Clock In:</Text>
          <Text style={styles.detailValue}>{request.actualClockIn}</Text>
        </View>
      )}

      {request.actualClockOut && (
        <View style={styles.detailRow}>
          <Ionicons name="log-out-outline" size={18} color="#F44336" />
          <Text style={styles.detailLabel}>Clock Out:</Text>
          <Text style={styles.detailValue}>{request.actualClockOut}</Text>
        </View>
      )}

      {request.requestedClockIn && (
        <View style={styles.requestedBox}>
          <Ionicons name="arrow-forward-outline" size={16} color="#2196F3" />
          <Text style={styles.requestedLabel}>Requested Clock In:</Text>
          <Text style={styles.requestedValue}>{request.requestedClockIn}</Text>
        </View>
      )}

      {request.requestedClockOut && (
        <View style={styles.requestedBox}>
          <Ionicons name="arrow-forward-outline" size={16} color="#2196F3" />
          <Text style={styles.requestedLabel}>Requested Clock Out:</Text>
          <Text style={styles.requestedValue}>{request.requestedClockOut}</Text>
        </View>
      )}

      <View style={styles.reasonBox}>
        <View style={styles.reasonHeader}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <Text style={styles.reasonLabel}>Reason:</Text>
        </View>
        <Text style={styles.reasonText}>{request.reason}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color="#999" />
        <Text style={styles.metaText}>
          {request.appliedOn ? `Applied: ${request.appliedOn}` : 
           request.approvedOn ? `Approved: ${request.approvedOn} by ${request.approvedBy}` :
           request.rejectedOn ? `Rejected: ${request.rejectedOn} by ${request.rejectedBy}` : ''}
        </Text>
      </View>

      {request.rejectionReason && (
        <View style={styles.rejectionBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#F44336" />
          <View style={styles.rejectionContent}>
            <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
            <Text style={styles.rejectionText}>{request.rejectionReason}</Text>
          </View>
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

  const currentRequests = selectedTab === 'leave' ? leaveRequests : attendanceRequests;
  const renderCard = selectedTab === 'leave' ? renderLeaveCard : renderAttendanceCard;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <View style={styles.container}>
      {/* Main Tab Navigation - Leave / Attendance */}
      <View style={styles.mainTabContainer}>
        <TouchableOpacity
          style={[styles.mainTab, selectedTab === 'leave' && styles.mainTabActive]}
          onPress={() => setSelectedTab('leave')}
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={selectedTab === 'leave' ? '#4CAF50' : '#999'}
          />
          <Text
            style={[styles.mainTabText, selectedTab === 'leave' && styles.mainTabTextActive]}
          >
            Leave Requests
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{leaveRequests.pending.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, selectedTab === 'attendance' && styles.mainTabActive]}
          onPress={() => setSelectedTab('attendance')}
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color={selectedTab === 'attendance' ? '#4CAF50' : '#999'}
          />
          <Text
            style={[styles.mainTabText, selectedTab === 'attendance' && styles.mainTabTextActive]}
          >
            Attendance Regularization
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{attendanceRequests.pending.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Status Tab Navigation - Pending / Approved / Rejected */}
      <View style={styles.statusTabContainer}>
        <TouchableOpacity
          style={[styles.statusTab, statusTab === 'pending' && styles.statusTabActive]}
          onPress={() => setStatusTab('pending')}
        >
          <Text
            style={[styles.statusTabText, statusTab === 'pending' && styles.statusTabTextActive]}
          >
            Pending ({currentRequests.pending.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusTab, statusTab === 'approved' && styles.statusTabActive]}
          onPress={() => setStatusTab('approved')}
        >
          <Text
            style={[styles.statusTabText, statusTab === 'approved' && styles.statusTabTextActive]}
          >
            Approved ({currentRequests.approved.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusTab, statusTab === 'rejected' && styles.statusTabActive]}
          onPress={() => setStatusTab('rejected')}
        >
          <Text
            style={[styles.statusTabText, statusTab === 'rejected' && styles.statusTabTextActive]}
          >
            Rejected ({currentRequests.rejected.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <ScrollView style={styles.content}>
        {currentRequests[statusTab].map((request) =>
          renderCard(request, statusTab === 'pending')
        )}
      </ScrollView>

      {/* Approve Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={approveModalVisible}
        onRequestClose={() => setApproveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <Text style={styles.modalTitle}>Approve Request</Text>
            </View>

            {selectedRequest && (
              <View style={styles.requestSummary}>
                <Text style={styles.summaryText}>
                  {selectedRequest.employeeName} - {selectedRequest.type === 'leave' ? selectedRequest.leaveType : selectedRequest.requestType}
                </Text>
                <Text style={styles.summarySubtext}>
                  {selectedRequest.type === 'leave'
                    ? `${selectedRequest.days} ${selectedRequest.days > 1 ? 'days' : 'day'} | ${selectedRequest.startDate} - ${selectedRequest.endDate}`
                    : `Date: ${selectedRequest.date}`}
                </Text>
              </View>
            )}

            <Text style={styles.confirmText}>
              Are you sure you want to approve this request?
            </Text>

            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Add any notes or comments..."
              multiline
              numberOfLines={3}
              value={approvalNotes}
              onChangeText={setApprovalNotes}
              maxLength={200}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => {
                  setApproveModalVisible(false);
                  setApprovalNotes('');
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmApproveButton]}
                onPress={confirmApprove}
              >
                <Text style={styles.confirmApproveButtonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rejectModalVisible}
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="close-circle" size={48} color="#F44336" />
              <Text style={styles.modalTitle}>Reject Request</Text>
            </View>

            {selectedRequest && (
              <View style={styles.requestSummary}>
                <Text style={styles.summaryText}>
                  {selectedRequest.employeeName} - {selectedRequest.type === 'leave' ? selectedRequest.leaveType : selectedRequest.requestType}
                </Text>
                <Text style={styles.summarySubtext}>
                  {selectedRequest.type === 'leave'
                    ? `${selectedRequest.days} ${selectedRequest.days > 1 ? 'days' : 'day'} | ${selectedRequest.startDate} - ${selectedRequest.endDate}`
                    : `Date: ${selectedRequest.date}`}
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Reason for Rejection <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter reason for rejecting this request..."
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
                style={[styles.modalButton, styles.confirmRejectButton]}
                onPress={confirmReject}
              >
                <Text style={styles.confirmRejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  mainTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  mainTabActive: {
    borderBottomColor: '#4CAF50',
  },
  mainTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  mainTabTextActive: {
    color: '#4CAF50',
  },
  tabBadge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  statusTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  statusTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  statusTabActive: {
    borderBottomColor: '#4CAF50',
  },
  statusTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  statusTabTextActive: {
    color: '#4CAF50',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  requestedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  requestedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  requestedValue: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '700',
  },
  reasonBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  reasonText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  balanceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  metaText: {
    fontSize: 11,
    color: '#5F6368',
    fontWeight: '500',
  },
  rejectionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF7E0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F9AB00',
    marginBottom: 12,
    gap: 8,
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 6,
    minHeight: 48,
  },
  rejectButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EA4335',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EA4335',
  },
  approveButton: {
    backgroundColor: '#1E8E3E',
  },
  approveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },proveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
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
  confirmText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
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
    marginTop: 10,
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
  confirmApproveButton: {
    backgroundColor: '#1E8E3E',
  },
  confirmApproveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmRejectButton: {
    backgroundColor: '#EA4335',
  },
  confirmRejectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
