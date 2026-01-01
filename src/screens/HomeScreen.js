import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockIn, setIsClockIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [todayStatus, setTodayStatus] = useState({
    clockInTime: null,
    clockOutTime: null,
    totalHours: '0h 0m',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleClockAction = () => {
    setModalVisible(true);
  };

  const confirmClockAction = () => {
    const now = new Date();
    if (!isClockIn) {
      setTodayStatus({
        ...todayStatus,
        clockInTime: formatTime(now),
      });
      setIsClockIn(true);
    } else {
      const clockInDate = new Date();
      clockInDate.setHours(9, 0, 0); // Example clock-in time
      const diff = now - clockInDate;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      
      setTodayStatus({
        ...todayStatus,
        clockOutTime: formatTime(now),
        totalHours: `${hours}h ${minutes}m`,
      });
      setIsClockIn(false);
    }
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Date and Time Display */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
      </View>

      {/* Clock In/Out Button */}
      <View style={styles.clockButtonContainer}>
        <TouchableOpacity
          style={[
            styles.clockButton,
            isClockIn ? styles.clockOutButton : styles.clockInButton,
          ]}
          onPress={handleClockAction}
        >
          <Ionicons
            name={isClockIn ? 'log-out-outline' : 'log-in-outline'}
            size={60}
            color="#fff"
          />
          <Text style={styles.clockButtonText}>
            {isClockIn ? 'Clock Out' : 'Clock In'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Today's Attendance Status */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="today-outline" size={24} color="#4CAF50" />
          <Text style={styles.cardTitle}>Today's Attendance</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Clock In</Text>
            <Text style={styles.statusValue}>
              {todayStatus.clockInTime || '--:--'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Clock Out</Text>
            <Text style={styles.statusValue}>
              {todayStatus.clockOutTime || '--:--'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Total Hours</Text>
            <Text style={styles.statusValue}>{todayStatus.totalHours}</Text>
          </View>
        </View>
      </View>

      {/* Shift Timing Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time-outline" size={24} color="#2196F3" />
          <Text style={styles.cardTitle}>Shift Timing</Text>
        </View>
        <View style={styles.shiftInfo}>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>Shift:</Text>
            <Text style={styles.shiftValue}>Day Shift</Text>
          </View>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>Start Time:</Text>
            <Text style={styles.shiftValue}>09:00 AM</Text>
          </View>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>End Time:</Text>
            <Text style={styles.shiftValue}>06:00 PM</Text>
          </View>
          <View style={styles.shiftRow}>
            <Text style={styles.shiftLabel}>Break Time:</Text>
            <Text style={styles.shiftValue}>1 Hour</Text>
          </View>
        </View>
      </View>

      {/* Leave Balance Cards */}
      <Text style={styles.sectionTitle}>Leave Balance</Text>
      <View style={styles.leaveContainer}>
        <View style={[styles.leaveCard, styles.sickLeave]}>
          <Ionicons name="medical-outline" size={32} color="#fff" />
          <Text style={styles.leaveTitle}>Sick Leave</Text>
          <Text style={styles.leaveBalance}>12 Days</Text>
          <Text style={styles.leaveSubtext}>Available</Text>
        </View>

        <View style={[styles.leaveCard, styles.casualLeave]}>
          <Ionicons name="umbrella-outline" size={32} color="#fff" />
          <Text style={styles.leaveTitle}>Casual Leave</Text>
          <Text style={styles.leaveBalance}>8 Days</Text>
          <Text style={styles.leaveSubtext}>Available</Text>
        </View>

        <View style={[styles.leaveCard, styles.earnedLeave]}>
          <Ionicons name="trophy-outline" size={32} color="#fff" />
          <Text style={styles.leaveTitle}>Earned Leave</Text>
          <Text style={styles.leaveBalance}>15 Days</Text>
          <Text style={styles.leaveSubtext}>Available</Text>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name={isClockIn ? 'log-out-outline' : 'log-in-outline'}
              size={64}
              color={isClockIn ? '#f44336' : '#4CAF50'}
            />
            <Text style={styles.modalTitle}>
              {isClockIn ? 'Clock Out' : 'Clock In'}
            </Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to {isClockIn ? 'clock out' : 'clock in'}?
            </Text>
            <Text style={styles.modalTime}>{formatTime(currentTime)}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  isClockIn && styles.confirmButtonOut,
                ]}
                onPress={confirmClockAction}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  dateTimeContainer: {
    backgroundColor: '#4CAF50',
    padding: 24,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.92,
    letterSpacing: 0.3,
  },
  timeText: {
    fontSize: 52,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    letterSpacing: 1,
  },
  clockButtonContainer: {
    alignItems: 'center',
    marginVertical: 35,
  },
  clockButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  clockInButton: {
    backgroundColor: '#4CAF50',
  },
  clockOutButton: {
    backgroundColor: '#F44336',
  },
  clockButtonText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shiftInfo: {
    marginTop: 10,
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  shiftLabel: {
    fontSize: 14,
    color: '#666',
  },
  shiftValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    color: '#333',
  },
  leaveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  leaveCard: {
    width: '48%',
    padding: 22,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sickLeave: {
    backgroundColor: '#EF5350',
  },
  casualLeave: {
    backgroundColor: '#42A5F5',
  },
  earnedLeave: {
    backgroundColor: '#66BB6A',
    width: '100%',
  },
  leaveTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
  },
  leaveBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  leaveSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  modalTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 15,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 110,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButtonOut: {
    backgroundColor: '#F44336',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
