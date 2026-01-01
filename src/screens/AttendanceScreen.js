import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AttendanceScreen() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [isOnlineSync, setIsOnlineSync] = useState(true);

  // Generate last 30 days attendance data
  const generateAttendanceData = () => {
    const data = [];
    const today = new Date('2026-01-01');
    const statuses = ['Present', 'Present', 'Present', 'Late', 'Present', 'Absent', 'Present'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      
      let status, clockIn, clockOut, hours;
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'Weekend';
        clockIn = '--';
        clockOut = '--';
        hours = '--';
      } else {
        status = statuses[i % statuses.length];
        if (status === 'Absent') {
          clockIn = '--';
          clockOut = '--';
          hours = '--';
        } else if (status === 'Late') {
          clockIn = '09:45 AM';
          clockOut = '06:15 PM';
          hours = '7h 30m';
        } else {
          const times = [
            { in: '09:00 AM', out: '06:00 PM', hrs: '8h 0m' },
            { in: '09:05 AM', out: '06:10 PM', hrs: '8h 5m' },
            { in: '08:55 AM', out: '06:05 PM', hrs: '8h 10m' },
          ];
          const time = times[i % times.length];
          clockIn = time.in;
          clockOut = time.out;
          hours = time.hrs;
        }
      }
      
      data.push({
        date: date,
        dateStr: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        dayStr: date.toLocaleDateString('en-US', { weekday: 'short' }),
        clockIn,
        clockOut,
        hours,
        status,
      });
    }
    return data;
  };

  const attendanceHistory = generateAttendanceData();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return '#4CAF50';
      case 'Late':
        return '#FF9800';
      case 'Absent':
        return '#f44336';
      case 'Weekend':
        return '#9E9E9E';
      case 'Leave':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  // Calculate statistics
  const stats = {
    present: attendanceHistory.filter(d => d.status === 'Present').length,
    late: attendanceHistory.filter(d => d.status === 'Late').length,
    absent: attendanceHistory.filter(d => d.status === 'Absent').length,
    leave: attendanceHistory.filter(d => d.status === 'Leave').length,
  };

  const renderCalendarView = () => {
    const weeks = [];
    const daysInView = [...attendanceHistory].reverse();
    
    for (let i = 0; i < daysInView.length; i += 7) {
      weeks.push(daysInView.slice(i, i + 7));
    }

    return (
      <View style={styles.calendarContainer}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.calendarDay}>
                <Text style={styles.calendarDayText}>{day.dayStr}</Text>
                <View
                  style={[
                    styles.calendarDayBox,
                    { backgroundColor: getStatusColor(day.status) },
                  ]}
                >
                  <Text style={styles.calendarDate}>
                    {day.date.getDate()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        
        {/* Calendar Legend */}
        <View style={styles.calendarLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Late</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f44336' }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#9E9E9E' }]} />
            <Text style={styles.legendText}>Weekend</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderListView = () => {
    return attendanceHistory.map((record, index) => (
      <View key={index} style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View>
            <Text style={styles.historyDate}>{record.dateStr}</Text>
            <Text style={styles.historyDay}>{record.dayStr}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(record.status) },
            ]}
          >
            <Text style={styles.statusText}>{record.status}</Text>
          </View>
        </View>
        <View style={styles.historyDetails}>
          <View style={styles.historyItem}>
            <Ionicons name="log-in-outline" size={16} color="#666" />
            <Text style={styles.historyLabel}>In: {record.clockIn}</Text>
          </View>
          <View style={styles.historyItem}>
            <Ionicons name="log-out-outline" size={16} color="#666" />
            <Text style={styles.historyLabel}>Out: {record.clockOut}</Text>
          </View>
          <View style={styles.historyItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.historyLabel}>Total: {record.hours}</Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sync Indicator */}
      <View style={[styles.syncIndicator, !isOnlineSync && styles.syncIndicatorOffline]}>
        <Ionicons
          name={isOnlineSync ? 'cloud-done-outline' : 'cloud-offline-outline'}
          size={16}
          color="#fff"
        />
        <Text style={styles.syncText}>
          {isOnlineSync ? 'Synced with server' : 'Offline - Data will sync when online'}
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="checkmark-circle" size={28} color="#fff" />
          <Text style={styles.summaryNumber}>{stats.present}</Text>
          <Text style={styles.summaryLabel}>Present</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FF9800' }]}>
          <Ionicons name="time" size={28} color="#fff" />
          <Text style={styles.summaryNumber}>{stats.late}</Text>
          <Text style={styles.summaryLabel}>Late</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#f44336' }]}>
          <Ionicons name="close-circle" size={28} color="#fff" />
          <Text style={styles.summaryNumber}>{stats.absent}</Text>
          <Text style={styles.summaryLabel}>Absent</Text>
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggleContainer}>
        <Text style={styles.sectionTitle}>Last 30 Days</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === 'list' ? '#fff' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'calendar' && styles.toggleButtonActive]}
            onPress={() => setViewMode('calendar')}
          >
            <Ionicons
              name="calendar"
              size={20}
              color={viewMode === 'calendar' ? '#fff' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Attendance View */}
      {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    gap: 8,
  },
  syncIndicatorOffline: {
    backgroundColor: '#FF9800',
  },
  syncText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  summaryCard: {
    width: '31%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  summaryNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  toggleButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  historyCard: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDay: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  historyLabel: {
    fontSize: 12,
    color: '#666',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  calendarDay: {
    alignItems: 'center',
    width: 40,
  },
  calendarDayText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  calendarDayBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  calendarDate: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});
