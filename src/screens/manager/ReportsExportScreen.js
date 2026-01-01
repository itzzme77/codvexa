import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsExportScreen() {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  // Sample data for export
  const attendanceData = [
    { date: 'Jan 01, 2026', employeeId: 'EMP001', name: 'John Doe', clockIn: '09:00 AM', clockOut: '06:00 PM', hours: '9h 0m', status: 'Present' },
    { date: 'Jan 01, 2026', employeeId: 'EMP002', name: 'Jane Smith', clockIn: '09:15 AM', clockOut: '06:30 PM', hours: '9h 15m', status: 'Present' },
    { date: 'Jan 01, 2026', employeeId: 'EMP003', name: 'Mike Johnson', clockIn: '10:45 AM', clockOut: '07:15 PM', hours: '8h 30m', status: 'Late' },
    { date: 'Jan 01, 2026', employeeId: 'EMP004', name: 'Sarah Williams', clockIn: '-', clockOut: '-', hours: '-', status: 'On Leave' },
    { date: 'Jan 01, 2026', employeeId: 'EMP005', name: 'Tom Brown', clockIn: '-', clockOut: '-', hours: '-', status: 'Absent' },
  ];

  const leaveData = [
    { employeeId: 'EMP001', name: 'John Doe', leaveType: 'Sick Leave', startDate: 'Dec 28, 2025', endDate: 'Dec 30, 2025', days: 3, status: 'Approved' },
    { employeeId: 'EMP002', name: 'Jane Smith', leaveType: 'Casual Leave', startDate: 'Jan 05, 2026', endDate: 'Jan 06, 2026', days: 2, status: 'Pending' },
    { employeeId: 'EMP004', name: 'Sarah Williams', leaveType: 'Earned Leave', startDate: 'Jan 01, 2026', endDate: 'Jan 01, 2026', days: 1, status: 'Approved' },
  ];

  const summaryData = {
    totalEmployees: 31,
    presentToday: 22,
    absentToday: 4,
    onLeave: 3,
    lateArrivals: 2,
    avgAttendanceRate: '88.5%',
    totalWorkHours: '1,760 hours',
    overtimeHours: '45 hours',
  };

  const dateRanges = [
    { id: 'today', label: 'Today', icon: 'today-outline' },
    { id: 'yesterday', label: 'Yesterday', icon: 'calendar-outline' },
    { id: 'thisWeek', label: 'This Week', icon: 'calendar-outline' },
    { id: 'lastWeek', label: 'Last Week', icon: 'calendar-outline' },
    { id: 'thisMonth', label: 'This Month', icon: 'calendar-outline' },
    { id: 'lastMonth', label: 'Last Month', icon: 'calendar-outline' },
    { id: 'thisYear', label: 'This Year', icon: 'calendar-outline' },
    { id: 'custom', label: 'Custom Range', icon: 'options-outline' },
  ];

  const reportTypes = [
    { id: 'attendance', label: 'Attendance Report', icon: 'checkmark-circle-outline', color: '#4CAF50' },
    { id: 'leave', label: 'Leave Report', icon: 'calendar-outline', color: '#2196F3' },
    { id: 'summary', label: 'Summary Report', icon: 'stats-chart-outline', color: '#FF9800' },
    { id: 'detailed', label: 'Detailed Report', icon: 'document-text-outline', color: '#9C27B0' },
  ];

  const exportFormats = [
    { id: 'csv', label: 'CSV', icon: 'document-text-outline', description: 'Comma-separated values' },
    { id: 'excel', label: 'Excel', icon: 'grid-outline', description: 'Microsoft Excel format' },
    { id: 'pdf', label: 'PDF', icon: 'document-outline', description: 'Portable document format' },
  ];

  const getDateRangeText = () => {
    switch (dateRange) {
      case 'today':
        return 'Jan 01, 2026';
      case 'yesterday':
        return 'Dec 31, 2025';
      case 'thisWeek':
        return 'Dec 29, 2025 - Jan 04, 2026';
      case 'lastWeek':
        return 'Dec 22, 2025 - Dec 28, 2025';
      case 'thisMonth':
        return 'Jan 01, 2026 - Jan 31, 2026';
      case 'lastMonth':
        return 'Dec 01, 2025 - Dec 31, 2025';
      case 'thisYear':
        return 'Jan 01, 2026 - Dec 31, 2026';
      case 'custom':
        return customStartDate && customEndDate
          ? `${customStartDate} - ${customEndDate}`
          : 'Select dates...';
      default:
        return '';
    }
  };

  const getRecordCount = () => {
    switch (selectedReport) {
      case 'attendance':
        return attendanceData.length * 20; // Simulate more records
      case 'leave':
        return leaveData.length * 10;
      case 'summary':
        return Object.keys(summaryData).length;
      case 'detailed':
        return attendanceData.length * 30;
      default:
        return 0;
    }
  };

  const handleExport = () => {
    const formatLabel = exportFormats.find((f) => f.id === selectedFormat)?.label || 'CSV';
    const reportLabel = reportTypes.find((r) => r.id === selectedReport)?.label || 'Attendance Report';
    const recordCount = getRecordCount();

    Alert.alert(
      'Export Report',
      `Export ${reportLabel}\nFormat: ${formatLabel}\nPeriod: ${getDateRangeText()}\nRecords: ${recordCount}\n\nProceed with export?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // Simulate export process
            setTimeout(() => {
              Alert.alert(
                'Export Successful! ✓',
                `${reportLabel} has been exported as ${formatLabel}\n\nFile saved to:\nDownloads/attendance_report_${Date.now()}.${selectedFormat}\n\n📧 Report also sent to your email`,
                [{ text: 'OK' }]
              );
            }, 1000);
          },
        },
      ]
    );
  };

  const handleCustomDateRange = () => {
    // In real implementation, this would open a date picker
    Alert.alert(
      'Select Custom Date Range',
      'Date picker will be implemented here',
      [
        {
          text: 'Set Range',
          onPress: () => {
            setCustomStartDate('Dec 15, 2025');
            setCustomEndDate('Jan 15, 2026');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderPreviewData = () => {
    switch (selectedReport) {
      case 'attendance':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview - Attendance Data</Text>
            <ScrollView horizontal>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { width: 100 }]}>Date</Text>
                  <Text style={[styles.tableHeaderCell, { width: 80 }]}>Emp ID</Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>Name</Text>
                  <Text style={[styles.tableHeaderCell, { width: 80 }]}>Clock In</Text>
                  <Text style={[styles.tableHeaderCell, { width: 80 }]}>Clock Out</Text>
                  <Text style={[styles.tableHeaderCell, { width: 70 }]}>Hours</Text>
                  <Text style={[styles.tableHeaderCell, { width: 80 }]}>Status</Text>
                </View>
                {attendanceData.slice(0, 5).map((record, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: 100 }]}>{record.date}</Text>
                    <Text style={[styles.tableCell, { width: 80 }]}>{record.employeeId}</Text>
                    <Text style={[styles.tableCell, { width: 120 }]}>{record.name}</Text>
                    <Text style={[styles.tableCell, { width: 80 }]}>{record.clockIn}</Text>
                    <Text style={[styles.tableCell, { width: 80 }]}>{record.clockOut}</Text>
                    <Text style={[styles.tableCell, { width: 70 }]}>{record.hours}</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.statusCell,
                        { width: 80 },
                        record.status === 'Present' && styles.statusPresent,
                        record.status === 'Late' && styles.statusLate,
                        record.status === 'Absent' && styles.statusAbsent,
                        record.status === 'On Leave' && styles.statusLeave,
                      ]}
                    >
                      {record.status}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.previewNote}>Showing 5 of {getRecordCount()} records</Text>
          </View>
        );
      case 'leave':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview - Leave Data</Text>
            <ScrollView horizontal>
              <View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { width: 80 }]}>Emp ID</Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>Name</Text>
                  <Text style={[styles.tableHeaderCell, { width: 100 }]}>Leave Type</Text>
                  <Text style={[styles.tableHeaderCell, { width: 100 }]}>Start Date</Text>
                  <Text style={[styles.tableHeaderCell, { width: 100 }]}>End Date</Text>
                  <Text style={[styles.tableHeaderCell, { width: 60 }]}>Days</Text>
                  <Text style={[styles.tableHeaderCell, { width: 80 }]}>Status</Text>
                </View>
                {leaveData.map((record, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: 80 }]}>{record.employeeId}</Text>
                    <Text style={[styles.tableCell, { width: 120 }]}>{record.name}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{record.leaveType}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{record.startDate}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{record.endDate}</Text>
                    <Text style={[styles.tableCell, { width: 60 }]}>{record.days}</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        styles.statusCell,
                        { width: 80 },
                        record.status === 'Approved' && styles.statusPresent,
                        record.status === 'Pending' && styles.statusLate,
                      ]}
                    >
                      {record.status}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.previewNote}>Showing {leaveData.length} of {getRecordCount()} records</Text>
          </View>
        );
      case 'summary':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview - Summary Data</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Ionicons name="people-outline" size={28} color="#4CAF50" />
                <Text style={styles.summaryValue}>{summaryData.totalEmployees}</Text>
                <Text style={styles.summaryLabel}>Total Employees</Text>
              </View>
              <View style={styles.summaryCard}>
                <Ionicons name="checkmark-circle-outline" size={28} color="#4CAF50" />
                <Text style={styles.summaryValue}>{summaryData.presentToday}</Text>
                <Text style={styles.summaryLabel}>Present Today</Text>
              </View>
              <View style={styles.summaryCard}>
                <Ionicons name="close-circle-outline" size={28} color="#F44336" />
                <Text style={styles.summaryValue}>{summaryData.absentToday}</Text>
                <Text style={styles.summaryLabel}>Absent Today</Text>
              </View>
              <View style={styles.summaryCard}>
                <Ionicons name="calendar-outline" size={28} color="#2196F3" />
                <Text style={styles.summaryValue}>{summaryData.onLeave}</Text>
                <Text style={styles.summaryLabel}>On Leave</Text>
              </View>
              <View style={styles.summaryCard}>
                <Ionicons name="time-outline" size={28} color="#FF9800" />
                <Text style={styles.summaryValue}>{summaryData.lateArrivals}</Text>
                <Text style={styles.summaryLabel}>Late Arrivals</Text>
              </View>
              <View style={styles.summaryCard}>
                <Ionicons name="trending-up-outline" size={28} color="#9C27B0" />
                <Text style={styles.summaryValue}>{summaryData.avgAttendanceRate}</Text>
                <Text style={styles.summaryLabel}>Avg Attendance</Text>
              </View>
            </View>
          </View>
        );
      case 'detailed':
        return (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview - Detailed Report</Text>
            <Text style={styles.detailedNote}>
              Includes: Attendance records, leave history, late arrivals, early departures, overtime, work hours, and performance metrics
            </Text>
            <View style={styles.detailedStats}>
              <View style={styles.detailedStatRow}>
                <Text style={styles.detailedStatLabel}>Total Records:</Text>
                <Text style={styles.detailedStatValue}>{getRecordCount()}</Text>
              </View>
              <View style={styles.detailedStatRow}>
                <Text style={styles.detailedStatLabel}>Date Range:</Text>
                <Text style={styles.detailedStatValue}>{getDateRangeText()}</Text>
              </View>
              <View style={styles.detailedStatRow}>
                <Text style={styles.detailedStatLabel}>Employees Covered:</Text>
                <Text style={styles.detailedStatValue}>{summaryData.totalEmployees}</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reports & Export</Text>
          <Text style={styles.headerSubtitle}>Generate and download reports</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="download-outline" size={20} color="#4CAF50" />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Report Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Report Type</Text>
          <View style={styles.reportTypeGrid}>
            {reportTypes.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={[
                  styles.reportTypeCard,
                  selectedReport === report.id && styles.reportTypeCardActive,
                ]}
                onPress={() => setSelectedReport(report.id)}
              >
                <View
                  style={[
                    styles.reportIconContainer,
                    { backgroundColor: `${report.color}15` },
                  ]}
                >
                  <Ionicons name={report.icon} size={28} color={report.color} />
                </View>
                <Text
                  style={[
                    styles.reportTypeLabel,
                    selectedReport === report.id && styles.reportTypeLabelActive,
                  ]}
                >
                  {report.label}
                </Text>
                {selectedReport === report.id && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Range Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Select Date Range</Text>
          <View style={styles.dateRangeGrid}>
            {dateRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.dateRangeChip,
                  dateRange === range.id && styles.dateRangeChipActive,
                ]}
                onPress={() => {
                  setDateRange(range.id);
                  if (range.id === 'custom') {
                    handleCustomDateRange();
                  }
                }}
              >
                <Ionicons
                  name={range.icon}
                  size={16}
                  color={dateRange === range.id ? '#4CAF50' : '#999'}
                />
                <Text
                  style={[
                    styles.dateRangeChipText,
                    dateRange === range.id && styles.dateRangeChipTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.selectedRangeBox}>
            <Ionicons name="calendar" size={20} color="#4CAF50" />
            <View style={styles.selectedRangeInfo}>
              <Text style={styles.selectedRangeLabel}>Selected Period:</Text>
              <Text style={styles.selectedRangeValue}>{getDateRangeText()}</Text>
            </View>
          </View>
        </View>

        {/* Export Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Select Export Format</Text>
          <View style={styles.formatGrid}>
            {exportFormats.map((format) => (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatCard,
                  selectedFormat === format.id && styles.formatCardActive,
                ]}
                onPress={() => setSelectedFormat(format.id)}
              >
                <Ionicons
                  name={format.icon}
                  size={32}
                  color={selectedFormat === format.id ? '#4CAF50' : '#999'}
                />
                <Text
                  style={[
                    styles.formatLabel,
                    selectedFormat === format.id && styles.formatLabelActive,
                  ]}
                >
                  {format.label}
                </Text>
                <Text style={styles.formatDescription}>{format.description}</Text>
                {selectedFormat === format.id && (
                  <View style={styles.formatCheckmark}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Preview Data</Text>
          {renderPreviewData()}
        </View>

        {/* Export Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryBoxHeader}>
            <Ionicons name="information-circle" size={22} color="#2196F3" />
            <Text style={styles.summaryBoxTitle}>Export Summary</Text>
          </View>
          <View style={styles.summaryBoxContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Report Type:</Text>
              <Text style={styles.summaryRowValue}>
                {reportTypes.find((r) => r.id === selectedReport)?.label}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Date Range:</Text>
              <Text style={styles.summaryRowValue}>{getDateRangeText()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Format:</Text>
              <Text style={styles.summaryRowValue}>
                {exportFormats.find((f) => f.id === selectedFormat)?.label}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Total Records:</Text>
              <Text style={styles.summaryRowValue}>{getRecordCount()}</Text>
            </View>
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Ionicons name="download" size={24} color="#fff" />
          <Text style={styles.exportButtonText}>Export Report</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Export</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="today-outline" size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>Today's Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="calendar-outline" size={24} color="#2196F3" />
              <Text style={styles.quickActionText}>This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="bar-chart-outline" size={24} color="#FF9800" />
              <Text style={styles.quickActionText}>Monthly Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Ionicons name="document-text-outline" size={24} color="#9C27B0" />
              <Text style={styles.quickActionText}>Full Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reportTypeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8EAED',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  reportTypeCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  reportIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  reportTypeLabelActive: {
    color: '#4CAF50',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  dateRangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateRangeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateRangeChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  dateRangeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  dateRangeChipTextActive: {
    color: '#4CAF50',
  },
  selectedRangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  selectedRangeInfo: {
    flex: 1,
  },
  selectedRangeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  selectedRangeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  formatGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  formatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  formatCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  formatLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
    marginTop: 8,
  },
  formatLabelActive: {
    color: '#4CAF50',
  },
  formatDescription: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  formatCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
    paddingHorizontal: 6,
  },
  statusCell: {
    fontWeight: '600',
  },
  statusPresent: {
    color: '#4CAF50',
  },
  statusLate: {
    color: '#FF9800',
  },
  statusAbsent: {
    color: '#F44336',
  },
  statusLeave: {
    color: '#2196F3',
  },
  previewNote: {
    fontSize: 11,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  detailedNote: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailedStats: {
    gap: 10,
  },
  detailedStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailedStatLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  detailedStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#E3F2FD',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  summaryBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  summaryBoxContent: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  summaryRowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 16,
    gap: 10,
    elevation: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minHeight: 56,
  },
  exportButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  quickActionsSection: {
    padding: 16,
    paddingTop: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});
