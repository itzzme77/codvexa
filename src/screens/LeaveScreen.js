import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LeaveScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [showLeaveTypePicker, setShowLeaveTypePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const leaveBalance = {
    sick: { total: 12, used: 3, available: 9 },
    casual: { total: 10, used: 2, available: 8 },
    earned: { total: 20, used: 5, available: 15 },
  };

  const leaveRequests = [
    {
      id: 1,
      type: 'Sick Leave',
      startDate: 'Dec 20, 2025',
      endDate: 'Dec 22, 2025',
      days: 3,
      status: 'Approved',
      reason: 'Medical treatment',
      appliedOn: 'Dec 18, 2025',
      approvedBy: 'Manager Name',
    },
    {
      id: 2,
      type: 'Casual Leave',
      startDate: 'Dec 15, 2025',
      endDate: 'Dec 15, 2025',
      days: 1,
      status: 'Pending',
      reason: 'Personal work',
      appliedOn: 'Dec 13, 2025',
      approvedBy: null,
    },
    {
      id: 3,
      type: 'Earned Leave',
      startDate: 'Nov 10, 2025',
      endDate: 'Nov 12, 2025',
      days: 3,
      status: 'Rejected',
      reason: 'Family function',
      appliedOn: 'Nov 05, 2025',
      approvedBy: 'Manager Name',
      rejectionReason: 'Project deadline approaching',
    },
    {
      id: 4,
      type: 'Sick Leave',
      startDate: 'Oct 25, 2025',
      endDate: 'Oct 26, 2025',
      days: 2,
      status: 'Approved',
      reason: 'Fever and cold',
      appliedOn: 'Oct 24, 2025',
      approvedBy: 'Manager Name',
    },
  ];

  const leaveTypes = [
    { id: 'sick', label: 'Sick Leave', available: leaveBalance.sick.available },
    { id: 'casual', label: 'Casual Leave', available: leaveBalance.casual.available },
    { id: 'earned', label: 'Earned Leave', available: leaveBalance.earned.available },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#4CAF50';
      case 'Pending':
        return '#FF9800';
      case 'Rejected':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return 'checkmark-circle';
      case 'Pending':
        return 'time';
      case 'Rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleSubmitLeave = () => {
    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    Alert.alert('Success', 'Leave request submitted successfully', [
      {
        text: 'OK',
        onPress: () => {
          setModalVisible(false);
          setLeaveType('');
          setStartDate(null);
          setEndDate(null);
          setReason('');
        },
      },
    ]);
  };

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const end = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays <= 0) {
        return 'Invalid range';
      }
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
    }
    return '';
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <ScrollView style={styles.container}>
      {/* Leave Balance Overview */}
      <View style={styles.balanceOverview}>
        <Text style={styles.overviewTitle}>Leave Balance Overview</Text>
        
        <View style={styles.balanceDetailCard}>
          <View style={styles.balanceRow}>
            <View style={[styles.balanceItem, { backgroundColor: '#FF6B6B' }]}>
              <Ionicons name="medical" size={24} color="#fff" />
              <Text style={styles.balanceType}>Sick Leave</Text>
              <View style={styles.balanceNumbers}>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Total</Text>
                  <Text style={styles.balanceNumber}>{leaveBalance.sick.total}</Text>
                </View>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Used</Text>
                  <Text style={styles.balanceNumber}>{leaveBalance.sick.used}</Text>
                </View>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Available</Text>
                  <Text style={[styles.balanceNumber, styles.balanceAvailable]}>
                    {leaveBalance.sick.available}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.balanceRow}>
            <View style={[styles.balanceItem, { backgroundColor: '#4ECDC4' }]}>
              <Ionicons name="umbrella" size={24} color="#fff" />
              <Text style={styles.balanceType}>Casual Leave</Text>
              <View style={styles.balanceNumbers}>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Total</Text>
                  <Text style={styles.balanceNumber}>{leaveBalance.casual.total}</Text>
                </View>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Used</Text>
                  <Text style={styles.balanceNumber}>{leaveBalance.casual.used}</Text>
                </View>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Available</Text>
                  <Text style={[styles.balanceNumber, styles.balanceAvailable]}>
                    {leaveBalance.casual.available}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.balanceRow}>
            <View style={[styles.balanceItem, { backgroundColor: '#FFD93D' }]}>
              <Ionicons name="trophy" size={24} color="#fff" />
              <Text style={styles.balanceType}>Earned Leave</Text>
              <View style={styles.balanceNumbers}>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Total</Text>
                  <Text style={styles.balanceNumber}>{leaveBalance.earned.total}</Text>
                </View>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Used</Text>
                  <Text style={styles.balanceNumber}>{leaveBalance.earned.used}</Text>
                </View>
                <View style={styles.balanceNumberBox}>
                  <Text style={styles.balanceNumberLabel}>Available</Text>
                  <Text style={[styles.balanceNumber, styles.balanceAvailable]}>
                    {leaveBalance.earned.available}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Apply Leave Button */}
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.applyButtonText}>Apply for Leave</Text>
      </TouchableOpacity>

      {/* Leave Status Tracking */}
      <View style={styles.statusHeader}>
        <Text style={styles.sectionTitle}>Leave Requests</Text>
        <View style={styles.statusLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Approved</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f44336' }]} />
            <Text style={styles.legendText}>Rejected</Text>
          </View>
        </View>
      </View>

      {leaveRequests.map((leave) => (
        <View key={leave.id} style={styles.leaveCard}>
          <View style={styles.leaveHeader}>
            <View style={styles.leaveTypeContainer}>
              <Text style={styles.leaveType}>{leave.type}</Text>
              <Text style={styles.appliedDate}>Applied: {leave.appliedOn}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(leave.status) },
              ]}
            >
              <Ionicons name={getStatusIcon(leave.status)} size={14} color="#fff" />
              <Text style={styles.statusText}>{leave.status}</Text>
            </View>
          </View>

          <View style={styles.leaveDates}>
            <Ionicons name="calendar-outline" size={18} color="#4CAF50" />
            <Text style={styles.dateText}>
              {leave.startDate} - {leave.endDate}
            </Text>
            <View style={styles.daysChip}>
              <Text style={styles.daysText}>{leave.days} {leave.days > 1 ? 'Days' : 'Day'}</Text>
            </View>
          </View>

          <View style={styles.leaveDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={16} color="#666" />
              <Text style={styles.detailLabel}>Reason:</Text>
              <Text style={styles.detailText}>{leave.reason}</Text>
            </View>
            
            {leave.approvedBy && (
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.detailLabel}>
                  {leave.status === 'Rejected' ? 'Rejected by:' : 'Approved by:'}
                </Text>
                <Text style={styles.detailText}>{leave.approvedBy}</Text>
              </View>
            )}

            {leave.rejectionReason && (
              <View style={[styles.detailRow, styles.rejectionBox]}>
                <Ionicons name="alert-circle-outline" size={16} color="#f44336" />
                <Text style={styles.detailLabel}>Rejection Reason:</Text>
                <Text style={[styles.detailText, { color: '#f44336' }]}>
                  {leave.rejectionReason}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}

      {/* Apply Leave Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Leave</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Leave Type Selection */}
              <Text style={styles.inputLabel}>Leave Type <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowLeaveTypePicker(!showLeaveTypePicker)}
              >
                <Text style={[styles.pickerText, leaveType && styles.pickerTextSelected]}>
                  {leaveType || 'Select Leave Type'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>

              {showLeaveTypePicker && (
                <View style={styles.pickerDropdown}>
                  {leaveTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        setLeaveType(type.label);
                        setShowLeaveTypePicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{type.label}</Text>
                      <Text style={styles.pickerOptionAvailable}>
                        {type.available} days available
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Date Range */}
              <Text style={styles.inputLabel}>Start Date <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartPicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                <Text style={styles.dateInputText}>
                  {startDate ? formatDate(startDate) : 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>End Date <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  if (!startDate) {
                    Alert.alert('Select Start Date', 'Please select the start date first.');
                    return;
                  }
                  setShowEndPicker(true);
                }}
              >
                <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
                <Text style={styles.dateInputText}>
                  {endDate ? formatDate(endDate) : 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>

              {startDate && endDate && (
                <View style={styles.durationInfo}>
                  <Ionicons name="information-circle" size={18} color="#4CAF50" />
                  <Text style={styles.durationText}>
                    Duration: {calculateDays()}
                  </Text>
                </View>
              )}

              {/* Reason */}
              <Text style={styles.inputLabel}>Reason <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.textArea}
                placeholder="Enter reason for leave (minimum 10 characters)"
                multiline
                numberOfLines={4}
                value={reason}
                onChangeText={setReason}
                maxLength={200}
              />
              <Text style={styles.characterCount}>{reason.length}/200</Text>

              {/* Action Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setLeaveType('');
                    setStartDate(null);
                    setEndDate(null);
                    setReason('');
                  }}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitModalButton]}
                  onPress={handleSubmitLeave}
                >
                  <Text style={styles.submitModalButtonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (event.type === 'set' && selectedDate) {
              setStartDate(selectedDate);
              if (endDate && selectedDate > endDate) {
                setEndDate(selectedDate);
              }
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || startDate || new Date()}
          mode="date"
          display="default"
          minimumDate={startDate || new Date()}
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (event.type === 'set' && selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  balanceOverview: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  balanceDetailCard: {
    gap: 12,
  },
  balanceRow: {
    marginBottom: 5,
  },
  balanceItem: {
    padding: 16,
    borderRadius: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  balanceType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    marginBottom: 10,
  },
  balanceNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceNumberBox: {
    alignItems: 'center',
  },
  balanceNumberLabel: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  balanceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceAvailable: {
    fontSize: 24,
  },
  applyButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statusHeader: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  leaveCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leaveTypeContainer: {
    flex: 1,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appliedDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  leaveDates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  dateText: {
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
  leaveDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    minWidth: 100,
  },
  detailText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  rejectionBox: {
    backgroundColor: '#fff5f5',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f44336',
    marginTop: 5,
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
    maxHeight: '90%',
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
  required: {
    color: '#f44336',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
    minHeight: 54,
  },
  pickerText: {
    fontSize: 14,
    color: '#999',
  },
  pickerTextSelected: {
    color: '#333',
    fontWeight: '500',
  },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
    elevation: 3,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pickerOptionAvailable: {
    fontSize: 12,
    color: '#4CAF50',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f9f9f9',
    gap: 10,
  },
  dateInputText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  durationText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
    fontSize: 14,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
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
});
