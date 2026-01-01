import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ManagerHomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const dashboardStats = {
    totalTeamMembers: 15,
    presentToday: 12,
    absentToday: 2,
    onLeave: 1,
    pendingLeaveRequests: 3,
    pendingAttendance: 5,
    lateArrivals: 2,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'leave_request',
      name: 'John Doe',
      action: 'Leave Request',
      details: 'Sick Leave - 2 days',
      time: '10 mins ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'late_arrival',
      name: 'Jane Smith',
      action: 'Late Arrival',
      details: 'Clocked in at 10:15 AM',
      time: '25 mins ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'leave_approved',
      name: 'Mike Johnson',
      action: 'Leave Approved',
      details: 'Casual Leave - 1 day',
      time: '1 hour ago',
      status: 'approved',
    },
    {
      id: 4,
      type: 'attendance',
      name: 'Sarah Williams',
      action: 'Attendance Regularization',
      details: 'Request for Dec 28',
      time: '2 hours ago',
      status: 'pending',
    },
  ];

  const quickActions = [
    {
      icon: 'checkmark-done-outline',
      label: 'Approve Leaves',
      color: '#4CAF50',
      count: dashboardStats.pendingLeaveRequests,
      screen: 'LeaveApproval',
    },
    {
      icon: 'calendar-outline',
      label: 'Attendance',
      color: '#2196F3',
      count: dashboardStats.pendingAttendance,
      screen: 'AttendanceApproval',
    },
    {
      icon: 'people-outline',
      label: 'Team View',
      color: '#FF9800',
      count: dashboardStats.totalTeamMembers,
      screen: 'TeamView',
    },
    {
      icon: 'stats-chart-outline',
      label: 'Reports',
      color: '#9C27B0',
      count: null,
      screen: 'Reports',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'leave_request':
        return 'document-text-outline';
      case 'late_arrival':
        return 'time-outline';
      case 'leave_approved':
        return 'checkmark-circle-outline';
      case 'attendance':
        return 'calendar-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'approved':
        return '#4CAF50';
      case 'info':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.managerName}>Manager Name</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color="#fff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>
              {dashboardStats.pendingLeaveRequests + dashboardStats.pendingAttendance}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Team Overview Cards */}
      <View style={styles.overviewContainer}>
        <View style={styles.overviewRow}>
          <View style={[styles.overviewCard, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="checkmark-circle" size={32} color="#fff" />
            <Text style={styles.overviewNumber}>{dashboardStats.presentToday}</Text>
            <Text style={styles.overviewLabel}>Present Today</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: '#F44336' }]}>
            <Ionicons name="close-circle" size={32} color="#fff" />
            <Text style={styles.overviewNumber}>{dashboardStats.absentToday}</Text>
            <Text style={styles.overviewLabel}>Absent</Text>
          </View>
        </View>
        <View style={styles.overviewRow}>
          <View style={[styles.overviewCard, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="briefcase" size={32} color="#fff" />
            <Text style={styles.overviewNumber}>{dashboardStats.onLeave}</Text>
            <Text style={styles.overviewLabel}>On Leave</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="time" size={32} color="#fff" />
            <Text style={styles.overviewNumber}>{dashboardStats.lateArrivals}</Text>
            <Text style={styles.overviewLabel}>Late Arrivals</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionCard}
            onPress={() => navigation?.navigate(action.screen)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon} size={28} color={action.color} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
            {action.count !== null && (
              <View style={[styles.quickActionBadge, { backgroundColor: action.color }]}>
                <Text style={styles.quickActionCount}>{action.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentActivity.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          <View
            style={[
              styles.activityIcon,
              { backgroundColor: getActivityColor(activity.status) + '20' },
            ]}
          >
            <Ionicons
              name={getActivityIcon(activity.type)}
              size={24}
              color={getActivityColor(activity.status)}
            />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityName}>{activity.name}</Text>
            <Text style={styles.activityAction}>{activity.action}</Text>
            <Text style={styles.activityDetails}>{activity.details}</Text>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.activityTime}>{activity.time}</Text>
            {activity.status === 'pending' && (
              <View style={styles.pendingDot} />
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  greeting: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  managerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  notificationCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  overviewContainer: {
    padding: 16,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  overviewCard: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  overviewNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    opacity: 0.95,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    position: 'relative',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  quickActionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  activityAction: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  activityDetails: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityTime: {
    fontSize: 11,
    color: '#999',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9800',
    marginTop: 6,
  },
});
