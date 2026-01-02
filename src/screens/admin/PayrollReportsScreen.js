import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const dateRanges = [
  { id: 'thisMonth', label: 'This Month', icon: 'calendar-outline' },
  { id: 'lastMonth', label: 'Last Month', icon: 'calendar-outline' },
  { id: 'thisQuarter', label: 'This Quarter', icon: 'calendar-outline' },
  { id: 'thisYear', label: 'This Year', icon: 'calendar-outline' },
  { id: 'custom', label: 'Custom Range', icon: 'options-outline' },
];

const samplePayrollRows = [
  {
    employeeId: 'EMP001',
    name: 'John Doe',
    presentDays: 22,
    leaveDays: 2,
    unpaidDays: 0,
    overtimeHours: 6,
    payableDays: 24,
  },
  {
    employeeId: 'EMP002',
    name: 'Jane Smith',
    presentDays: 20,
    leaveDays: 4,
    unpaidDays: 1,
    overtimeHours: 10,
    payableDays: 23,
  },
  {
    employeeId: 'EMP003',
    name: 'Mike Johnson',
    presentDays: 18,
    leaveDays: 3,
    unpaidDays: 3,
    overtimeHours: 0,
    payableDays: 21,
  },
];

export default function PayrollReportsScreen() {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [customRange, setCustomRange] = useState(null);
  const [groupBy, setGroupBy] = useState('employee'); // employee | department
  const [includeOvertime, setIncludeOvertime] = useState(true);
  const [includeUnpaidLeave, setIncludeUnpaidLeave] = useState(true);

  const getDateRangeText = () => {
    switch (dateRange) {
      case 'thisMonth':
        return 'Jan 01, 2026 - Jan 31, 2026';
      case 'lastMonth':
        return 'Dec 01, 2025 - Dec 31, 2025';
      case 'thisQuarter':
        return 'Jan 01, 2026 - Mar 31, 2026';
      case 'thisYear':
        return 'Jan 01, 2026 - Dec 31, 2026';
      case 'custom':
        return customRange || 'Select dates...';
      default:
        return '';
    }
  };

  const handleCustomRange = () => {
    Alert.alert(
      'Custom Date Range',
      'In a real app this opens a date picker.',
      [
        {
          text: 'Set Example Range',
          onPress: () => setCustomRange('Dec 15, 2025 - Jan 15, 2026'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const generatePayrollCSV = () => {
    // Build CSV content based on current settings
    let csv = '';
    
    // Header row
    const headers = [
      'Employee ID',
      'Employee Name',
      groupBy === 'department' ? 'Department' : '',
      'Present Days',
      'Paid Leave Days',
      includeUnpaidLeave ? 'Unpaid Leave Days' : '',
      includeOvertime ? 'Overtime Hours' : '',
      'Total Payable Days',
      'Period Start',
      'Period End'
    ].filter(h => h !== '');
    
    csv += headers.join(',') + '\n';
    
    // Data rows (using sample data - in real app would fetch from backend)
    const periodText = getDateRangeText();
    const [startDate, endDate] = periodText.includes('-') 
      ? periodText.split(' - ').map(d => d.trim())
      : [periodText, periodText];
    
    samplePayrollRows.forEach(row => {
      const rowData = [
        row.employeeId,
        `"${row.name}"`,
        groupBy === 'department' ? '"Engineering"' : '',
        row.presentDays,
        row.leaveDays,
        includeUnpaidLeave ? row.unpaidDays : '',
        includeOvertime ? row.overtimeHours : '',
        row.payableDays,
        `"${startDate}"`,
        `"${endDate}"`
      ].filter(d => d !== '');
      
      csv += rowData.join(',') + '\n';
    });
    
    return csv;
  };

  const handleExportCsv = async () => {
    try {
      const rowCount = samplePayrollRows.length * 10;
      const periodText = getDateRangeText();
      
      // Show confirmation with details
      Alert.alert(
        'Generate Payroll CSV',
        `Payroll-ready attendance file\n\n` +
        `Period: ${periodText}\n` +
        `Grouping: ${groupBy === 'employee' ? 'By employee' : 'By department'}\n` +
        `Include overtime: ${includeOvertime ? 'Yes' : 'No'}\n` +
        `Include unpaid leave: ${includeUnpaidLeave ? 'Yes' : 'No'}\n` +
        `Estimated rows: ${rowCount}\n\n` +
        `The CSV layout is compatible with common accounting/payroll tools (e.g. Tally, SAP, QuickBooks).`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export CSV',
            onPress: async () => {
              try {
                // Generate CSV content
                const csvContent = generatePayrollCSV();
                
                // Create filename with timestamp
                const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
                const filename = `payroll_attendance_${timestamp}.csv`;
                const fileUri = FileSystem.documentDirectory + filename;
                
                // Write file
                await FileSystem.writeAsStringAsync(fileUri, csvContent);
                
                // Share the file
                const canShare = await Sharing.isAvailableAsync();
                if (canShare) {
                  await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Export Payroll CSV'
                  });
                  
                  Alert.alert(
                    'Export Successful',
                    `File saved as: ${filename}\n\n` +
                    `You can import this file into your accounting / payroll system.`,
                    [{ text: 'OK' }]
                  );
                } else {
                  Alert.alert('Success', `File saved to: ${filename}`);
                }
              } catch (error) {
                Alert.alert('Export Failed', `Error: ${error.message}`);
                console.error('CSV export error:', error);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to generate CSV: ${error.message}`);
      console.error('Export error:', error);
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reports & Payroll</Text>
          <Text style={styles.headerSubtitle}>Payroll-ready attendance exports</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="calculator-outline" size={22} color="#0EA5E9" />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Step 1: Period */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Payroll Period</Text>
          <View style={styles.dateRangeGrid}>
            {dateRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.dateChip,
                  dateRange === range.id && styles.dateChipActive,
                ]}
                onPress={() => {
                  setDateRange(range.id);
                  if (range.id === 'custom') {
                    handleCustomRange();
                  }
                }}
              >
                <Ionicons
                  name={range.icon}
                  size={16}
                  color={dateRange === range.id ? '#0EA5E9' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.dateChipText,
                    dateRange === range.id && styles.dateChipTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.selectedRangeBox}>
            <Ionicons name="calendar" size={20} color="#0EA5E9" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.selectedRangeLabel}>Selected period</Text>
              <Text style={styles.selectedRangeValue}>{getDateRangeText()}</Text>
            </View>
          </View>
        </View>

        {/* Step 2: Layout options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Layout & Columns</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Group rows by</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  groupBy === 'employee' && styles.chipActive,
                ]}
                onPress={() => setGroupBy('employee')}
              >
                <Text
                  style={[
                    styles.chipText,
                    groupBy === 'employee' && styles.chipTextActive,
                  ]}
                >
                  Employee
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  groupBy === 'department' && styles.chipActive,
                ]}
                onPress={() => setGroupBy('department')}
              >
                <Text
                  style={[
                    styles.chipText,
                    groupBy === 'department' && styles.chipTextActive,
                  ]}
                >
                  Department
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.optionRow, { marginTop: 12 }]}>
              <Text style={styles.label}>Include overtime hours</Text>
              <TouchableOpacity
                style={[
                  styles.togglePill,
                  includeOvertime && styles.togglePillOn,
                ]}
                onPress={() => setIncludeOvertime(!includeOvertime)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    includeOvertime && styles.toggleTextOn,
                  ]}
                >
                  {includeOvertime ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.optionRow}>
              <Text style={styles.label}>Include unpaid leave days</Text>
              <TouchableOpacity
                style={[
                  styles.togglePill,
                  includeUnpaidLeave && styles.togglePillOn,
                ]}
                onPress={() => setIncludeUnpaidLeave(!includeUnpaidLeave)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    includeUnpaidLeave && styles.toggleTextOn,
                  ]}
                >
                  {includeUnpaidLeave ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.helperText, { marginTop: 10 }]}>
              The exported CSV includes columns like Employee ID, Name, Working Days,
              Paid Leave, Unpaid Leave, Overtime Hours, and Payable Days.
            </Text>
          </View>
        </View>

        {/* Step 3: Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Payroll Preview</Text>
          <View style={styles.previewCard}>
            <ScrollView horizontal>
              <View>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { width: 90 }]}>Emp ID</Text>
                  <Text style={[styles.tableHeaderCell, { width: 130 }]}>Name</Text>
                  <Text style={[styles.tableHeaderCell, { width: 90 }]}>Present</Text>
                  <Text style={[styles.tableHeaderCell, { width: 90 }]}>Leave</Text>
                  <Text style={[styles.tableHeaderCell, { width: 100 }]}>Unpaid</Text>
                  <Text style={[styles.tableHeaderCell, { width: 110 }]}>Overtime (h)</Text>
                  <Text style={[styles.tableHeaderCell, { width: 110 }]}>Payable Days</Text>
                </View>
                {samplePayrollRows.map((row) => (
                  <View key={row.employeeId} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: 90 }]}>{row.employeeId}</Text>
                    <Text style={[styles.tableCell, { width: 130 }]}>{row.name}</Text>
                    <Text style={[styles.tableCell, { width: 90 }]}>{row.presentDays}</Text>
                    <Text style={[styles.tableCell, { width: 90 }]}>{row.leaveDays}</Text>
                    <Text style={[styles.tableCell, { width: 100 }]}>{row.unpaidDays}</Text>
                    <Text style={[styles.tableCell, { width: 110 }]}>{row.overtimeHours}</Text>
                    <Text style={[styles.tableCell, { width: 110 }]}>{row.payableDays}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.previewNote}>
              Previewing 3 employees · CSV will contain all employees in the selected period.
            </Text>
          </View>
        </View>

        {/* Step 4: Export */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Export CSV</Text>
          <View style={styles.card}>
            <View style={styles.csvRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.csvTitle}>Payroll-ready CSV</Text>
                <Text style={styles.csvSubtitle}>
                  Comma-separated file optimized for import into accounting and payroll systems.
                </Text>
              </View>
              <View style={styles.csvBadge}>
                <Text style={styles.csvBadgeText}>CSV</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportCsv}>
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
              <Text style={styles.exportText}>Generate CSV</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
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
    paddingBottom: 14,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#0EA5E91A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  dateRangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
    gap: 6,
  },
  dateChipActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  dateChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  dateChipTextActive: {
    color: '#0369A1',
    fontWeight: '600',
  },
  selectedRangeBox: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  selectedRangeLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedRangeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  card: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  optionRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  togglePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  togglePillOn: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  toggleText: {
    fontSize: 12,
    color: '#374151',
  },
  toggleTextOn: {
    color: '#166534',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    fontSize: 11,
    color: '#111827',
  },
  previewNote: {
    marginTop: 10,
    fontSize: 11,
    color: '#6B7280',
  },
  csvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  csvTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  csvSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  csvBadge: {
    backgroundColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  csvBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  exportButton: {
    marginTop: 14,
    backgroundColor: '#0EA5E9',
    borderRadius: 999,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
