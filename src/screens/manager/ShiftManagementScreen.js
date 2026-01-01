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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ShiftManagementScreen() {
  const [selectedView, setSelectedView] = useState('weekly'); // weekly, monthly, daily
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addShiftModalVisible, setAddShiftModalVisible] = useState(false);
  const [editShiftModalVisible, setEditShiftModalVisible] = useState(false);
  const [assignShiftModalVisible, setAssignShiftModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [shiftName, setShiftName] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');
  const [shiftDays, setShiftDays] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Sample shift templates
  const [shiftTemplates, setShiftTemplates] = useState([
    {
      id: 'ST001',
      name: 'Morning Shift',
      startTime: '09:00 AM',
      endTime: '06:00 PM',
      duration: '9 hours',
      color: '#4CAF50',
      employees: 12,
    },
    {
      id: 'ST002',
      name: 'Evening Shift',
      startTime: '02:00 PM',
      endTime: '11:00 PM',
      duration: '9 hours',
      color: '#FF9800',
      employees: 8,
    },
    {
      id: 'ST003',
      name: 'Night Shift',
      startTime: '11:00 PM',
      endTime: '08:00 AM',
      duration: '9 hours',
      color: '#2196F3',
      employees: 6,
    },
    {
      id: 'ST004',
      name: 'Flexible Shift',
      startTime: '10:00 AM',
      endTime: '07:00 PM',
      duration: '9 hours',
      color: '#9C27B0',
      employees: 5,
    },
  ]);

  // Sample employee data
  const [employees, setEmployees] = useState([
    {
      id: 'EMP001',
      name: 'John Doe',
      department: 'Development',
      currentShift: 'Morning Shift',
      shiftId: 'ST001',
      email: 'john.doe@company.com',
    },
    {
      id: 'EMP002',
      name: 'Jane Smith',
      department: 'Design',
      currentShift: 'Morning Shift',
      shiftId: 'ST001',
      email: 'jane.smith@company.com',
    },
    {
      id: 'EMP003',
      name: 'Mike Johnson',
      department: 'Development',
      currentShift: 'Evening Shift',
      shiftId: 'ST002',
      email: 'mike.johnson@company.com',
    },
    {
      id: 'EMP004',
      name: 'Sarah Williams',
      department: 'QA',
      currentShift: 'Morning Shift',
      shiftId: 'ST001',
      email: 'sarah.williams@company.com',
    },
    {
      id: 'EMP005',
      name: 'Tom Brown',
      department: 'Development',
      currentShift: 'Night Shift',
      shiftId: 'ST003',
      email: 'tom.brown@company.com',
    },
    {
      id: 'EMP006',
      name: 'Emily Davis',
      department: 'HR',
      currentShift: 'Flexible Shift',
      shiftId: 'ST004',
      email: 'emily.davis@company.com',
    },
  ]);

  // Weekly schedule data (Mon-Sun for current week)
  const [weeklySchedule, setWeeklySchedule] = useState([
    {
      day: 'Monday',
      date: 'Jan 06',
      shifts: [
        { shiftId: 'ST001', employees: ['EMP001', 'EMP002', 'EMP004'] },
        { shiftId: 'ST002', employees: ['EMP003'] },
        { shiftId: 'ST003', employees: ['EMP005'] },
      ],
    },
    {
      day: 'Tuesday',
      date: 'Jan 07',
      shifts: [
        { shiftId: 'ST001', employees: ['EMP001', 'EMP002', 'EMP004'] },
        { shiftId: 'ST002', employees: ['EMP003'] },
        { shiftId: 'ST004', employees: ['EMP006'] },
      ],
    },
    {
      day: 'Wednesday',
      date: 'Jan 08',
      shifts: [
        { shiftId: 'ST001', employees: ['EMP001', 'EMP002', 'EMP004'] },
        { shiftId: 'ST002', employees: ['EMP003'] },
        { shiftId: 'ST003', employees: ['EMP005'] },
      ],
    },
    {
      day: 'Thursday',
      date: 'Jan 09',
      shifts: [
        { shiftId: 'ST001', employees: ['EMP001', 'EMP002', 'EMP004'] },
        { shiftId: 'ST002', employees: ['EMP003'] },
        { shiftId: 'ST004', employees: ['EMP006'] },
      ],
    },
    {
      day: 'Friday',
      date: 'Jan 10',
      shifts: [
        { shiftId: 'ST001', employees: ['EMP001', 'EMP002', 'EMP004'] },
        { shiftId: 'ST002', employees: ['EMP003'] },
        { shiftId: 'ST003', employees: ['EMP005'] },
      ],
    },
    {
      day: 'Saturday',
      date: 'Jan 11',
      shifts: [
        { shiftId: 'ST002', employees: ['EMP003'] },
        { shiftId: 'ST003', employees: ['EMP005'] },
      ],
    },
    {
      day: 'Sunday',
      date: 'Jan 12',
      shifts: [
        { shiftId: 'ST003', employees: ['EMP005'] },
      ],
    },
  ]);

  const handleAddShift = () => {
    if (!shiftName.trim() || !shiftStartTime.trim() || !shiftEndTime.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newShift = {
      id: `ST${String(shiftTemplates.length + 1).padStart(3, '0')}`,
      name: shiftName,
      startTime: shiftStartTime,
      endTime: shiftEndTime,
      duration: '9 hours',
      color: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#E91E63'][Math.floor(Math.random() * 5)],
      employees: 0,
    };

    setShiftTemplates([...shiftTemplates, newShift]);
    Alert.alert('Success', `${shiftName} created successfully`, [
      {
        text: 'OK',
        onPress: () => {
          setAddShiftModalVisible(false);
          resetForm();
        },
      },
    ]);
  };

  const handleEditShift = () => {
    if (!shiftName.trim() || !shiftStartTime.trim() || !shiftEndTime.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const updatedShifts = shiftTemplates.map((shift) =>
      shift.id === selectedShift.id
        ? { ...shift, name: shiftName, startTime: shiftStartTime, endTime: shiftEndTime }
        : shift
    );

    setShiftTemplates(updatedShifts);
    Alert.alert('Success', 'Shift updated successfully', [
      {
        text: 'OK',
        onPress: () => {
          setEditShiftModalVisible(false);
          resetForm();
        },
      },
    ]);
  };

  const handleDeleteShift = (shift) => {
    Alert.alert(
      'Delete Shift',
      `Are you sure you want to delete "${shift.name}"? This will affect ${shift.employees} employees.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setShiftTemplates(shiftTemplates.filter((s) => s.id !== shift.id));
            Alert.alert('Success', 'Shift deleted successfully');
          },
        },
      ]
    );
  };

  const handleAssignShift = () => {
    if (selectedEmployees.length === 0) {
      Alert.alert('Error', 'Please select at least one employee');
      return;
    }

    if (!selectedShift) {
      Alert.alert('Error', 'Please select a shift');
      return;
    }

    const employeeNames = selectedEmployees
      .map((empId) => employees.find((e) => e.id === empId)?.name)
      .join(', ');

    Alert.alert(
      'Confirm Assignment',
      `Assign ${selectedShift.name} to:\n${employeeNames}\n\nNotify employees about this change?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign & Notify',
          onPress: () => {
            // Update employee shifts
            const updatedEmployees = employees.map((emp) =>
              selectedEmployees.includes(emp.id)
                ? { ...emp, currentShift: selectedShift.name, shiftId: selectedShift.id }
                : emp
            );
            setEmployees(updatedEmployees);

            // Update shift employee count
            const updatedShifts = shiftTemplates.map((shift) => {
              if (shift.id === selectedShift.id) {
                return { ...shift, employees: shift.employees + selectedEmployees.length };
              }
              return shift;
            });
            setShiftTemplates(updatedShifts);

            Alert.alert(
              'Success',
              `${selectedEmployees.length} employee(s) assigned to ${selectedShift.name}\n\nNotifications sent successfully! 📧`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setAssignShiftModalVisible(false);
                    setSelectedEmployees([]);
                    setSelectedShift(null);
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShiftName('');
    setShiftStartTime('');
    setShiftEndTime('');
    setShiftDays([]);
    setSelectedShift(null);
  };

  const openEditModal = (shift) => {
    setSelectedShift(shift);
    setShiftName(shift.name);
    setShiftStartTime(shift.startTime);
    setShiftEndTime(shift.endTime);
    setEditShiftModalVisible(true);
  };

  const openAssignModal = (shift) => {
    setSelectedShift(shift);
    setAssignShiftModalVisible(true);
  };

  const toggleEmployeeSelection = (empId) => {
    if (selectedEmployees.includes(empId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== empId));
    } else {
      setSelectedEmployees([...selectedEmployees, empId]);
    }
  };

  const getShiftById = (shiftId) => {
    return shiftTemplates.find((s) => s.id === shiftId);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderShiftCard = (shift) => (
    <View key={shift.id} style={styles.shiftCard}>
      <View style={styles.shiftHeader}>
        <View style={styles.shiftInfo}>
          <View style={[styles.shiftColorBar, { backgroundColor: shift.color }]} />
          <View>
            <Text style={styles.shiftName}>{shift.name}</Text>
            <Text style={styles.shiftTime}>
              {shift.startTime} - {shift.endTime}
            </Text>
            <Text style={styles.shiftDuration}>{shift.duration}</Text>
          </View>
        </View>
        <View style={styles.shiftActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => openAssignModal(shift)}
          >
            <Ionicons name="person-add-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => openEditModal(shift)}
          >
            <Ionicons name="create-outline" size={20} color="#FF9800" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteShift(shift)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.shiftFooter}>
        <View style={styles.employeeCount}>
          <Ionicons name="people-outline" size={16} color="#4CAF50" />
          <Text style={styles.employeeCountText}>{shift.employees} Employees</Text>
        </View>
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => openAssignModal(shift)}
        >
          <Text style={styles.assignButtonText}>Assign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWeeklySchedule = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weeklyContainer}>
      {weeklySchedule.map((day, index) => (
        <View key={index} style={styles.dayColumn}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayName}>{day.day}</Text>
            <Text style={styles.dayDate}>{day.date}</Text>
          </View>
          <ScrollView style={styles.dayShifts}>
            {day.shifts.map((shift, shiftIndex) => {
              const shiftData = getShiftById(shift.shiftId);
              if (!shiftData) return null;
              return (
                <View
                  key={shiftIndex}
                  style={[styles.scheduleShiftCard, { borderLeftColor: shiftData.color }]}
                >
                  <Text style={styles.scheduleShiftName}>{shiftData.name}</Text>
                  <Text style={styles.scheduleShiftTime}>
                    {shiftData.startTime} - {shiftData.endTime}
                  </Text>
                  <View style={styles.scheduleEmployees}>
                    {shift.employees.map((empId) => {
                      const emp = employees.find((e) => e.id === empId);
                      return (
                        <View key={empId} style={styles.employeeTag}>
                          <Text style={styles.employeeTagText}>{emp?.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );

  const renderEmployeeList = () => (
    <View style={styles.employeeListContainer}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, or department..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView style={styles.employeeList}>
        {filteredEmployees.map((emp) => {
          const empShift = getShiftById(emp.shiftId);
          return (
            <View key={emp.id} style={styles.employeeCard}>
              <View style={styles.employeeCardHeader}>
                <View style={styles.employeeAvatar}>
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <View style={styles.employeeCardInfo}>
                  <Text style={styles.employeeCardName}>{emp.name}</Text>
                  <Text style={styles.employeeCardId}>
                    {emp.id} • {emp.department}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.employeeShiftBadge,
                  { backgroundColor: empShift?.color || '#999' },
                ]}
              >
                <Text style={styles.employeeShiftText}>{emp.currentShift}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shift Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddShiftModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
          <Text style={styles.addButtonText}>Add Shift</Text>
        </TouchableOpacity>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewButton, selectedView === 'weekly' && styles.viewButtonActive]}
          onPress={() => setSelectedView('weekly')}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={selectedView === 'weekly' ? '#4CAF50' : '#999'}
          />
          <Text
            style={[styles.viewButtonText, selectedView === 'weekly' && styles.viewButtonTextActive]}
          >
            Weekly Schedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, selectedView === 'templates' && styles.viewButtonActive]}
          onPress={() => setSelectedView('templates')}
        >
          <Ionicons
            name="time-outline"
            size={18}
            color={selectedView === 'templates' ? '#4CAF50' : '#999'}
          />
          <Text
            style={[
              styles.viewButtonText,
              selectedView === 'templates' && styles.viewButtonTextActive,
            ]}
          >
            Shift Templates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, selectedView === 'employees' && styles.viewButtonActive]}
          onPress={() => setSelectedView('employees')}
        >
          <Ionicons
            name="people-outline"
            size={18}
            color={selectedView === 'employees' ? '#4CAF50' : '#999'}
          />
          <Text
            style={[
              styles.viewButtonText,
              selectedView === 'employees' && styles.viewButtonTextActive,
            ]}
          >
            Employees
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedView === 'weekly' && renderWeeklySchedule()}
        {selectedView === 'templates' && (
          <View style={styles.templatesContainer}>
            {shiftTemplates.map((shift) => renderShiftCard(shift))}
          </View>
        )}
        {selectedView === 'employees' && renderEmployeeList()}
      </ScrollView>

      {/* Add Shift Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addShiftModalVisible}
        onRequestClose={() => setAddShiftModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Shift</Text>
              <TouchableOpacity onPress={() => setAddShiftModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>
                Shift Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning Shift"
                value={shiftName}
                onChangeText={setShiftName}
              />

              <Text style={styles.inputLabel}>
                Start Time <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 09:00 AM"
                value={shiftStartTime}
                onChangeText={setShiftStartTime}
              />

              <Text style={styles.inputLabel}>
                End Time <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 06:00 PM"
                value={shiftEndTime}
                onChangeText={setShiftEndTime}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleAddShift}>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.saveButtonText}>Create Shift</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Shift Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editShiftModalVisible}
        onRequestClose={() => setEditShiftModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Shift</Text>
              <TouchableOpacity onPress={() => setEditShiftModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>
                Shift Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning Shift"
                value={shiftName}
                onChangeText={setShiftName}
              />

              <Text style={styles.inputLabel}>
                Start Time <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 09:00 AM"
                value={shiftStartTime}
                onChangeText={setShiftStartTime}
              />

              <Text style={styles.inputLabel}>
                End Time <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 06:00 PM"
                value={shiftEndTime}
                onChangeText={setShiftEndTime}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleEditShift}>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Assign Shift Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={assignShiftModalVisible}
        onRequestClose={() => setAssignShiftModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Assign Shift</Text>
                {selectedShift && (
                  <Text style={styles.modalSubtitle}>
                    {selectedShift.name} • {selectedShift.startTime} - {selectedShift.endTime}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setAssignShiftModalVisible(false);
                  setSelectedEmployees([]);
                }}
              >
                <Ionicons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search employees..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <Text style={styles.sectionLabel}>
              Select Employees ({selectedEmployees.length} selected)
            </Text>

            <FlatList
              data={filteredEmployees}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.employeeSelectCard,
                    selectedEmployees.includes(item.id) && styles.employeeSelectCardActive,
                  ]}
                  onPress={() => toggleEmployeeSelection(item.id)}
                >
                  <View style={styles.employeeSelectInfo}>
                    <View style={styles.checkboxContainer}>
                      {selectedEmployees.includes(item.id) ? (
                        <Ionicons name="checkbox" size={24} color="#4CAF50" />
                      ) : (
                        <Ionicons name="square-outline" size={24} color="#999" />
                      )}
                    </View>
                    <View>
                      <Text style={styles.employeeSelectName}>{item.name}</Text>
                      <Text style={styles.employeeSelectDetails}>
                        {item.id} • {item.department}
                      </Text>
                      <Text style={styles.employeeSelectShift}>Current: {item.currentShift}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.employeeSelectList}
            />

            <TouchableOpacity
              style={[styles.assignSubmitButton, selectedEmployees.length === 0 && styles.buttonDisabled]}
              onPress={handleAssignShift}
              disabled={selectedEmployees.length === 0}
            >
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.assignSubmitButtonText}>
                Assign & Notify ({selectedEmployees.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    gap: 8,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  viewButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  viewButtonTextActive: {
    color: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  templatesContainer: {
    padding: 16,
  },
  shiftCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shiftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shiftColorBar: {
    width: 4,
    height: 60,
    borderRadius: 2,
  },
  shiftName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  shiftTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  shiftDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  shiftActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  shiftFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  employeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  employeeCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  assignButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  assignButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  weeklyContainer: {
    padding: 16,
  },
  dayColumn: {
    width: 200,
    marginRight: 12,
  },
  dayHeader: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  dayDate: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
    opacity: 0.9,
  },
  dayShifts: {
    maxHeight: 500,
  },
  scheduleShiftCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  scheduleShiftName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  scheduleShiftTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  scheduleEmployees: {
    marginTop: 8,
    gap: 4,
  },
  employeeTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  employeeTagText: {
    fontSize: 11,
    color: '#666',
  },
  employeeListContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  employeeList: {
    flex: 1,
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  employeeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  employeeCardInfo: {
    flex: 1,
  },
  employeeCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  employeeCardId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  employeeShiftBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  employeeShiftText: {
    fontSize: 12,
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
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: '#F44336',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
    minHeight: 52,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  employeeSelectList: {
    maxHeight: 350,
  },
  employeeSelectCard: {
    backgroundColor: '#F8F9FA',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  employeeSelectCardActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  employeeSelectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxContainer: {
    width: 32,
    alignItems: 'center',
  },
  employeeSelectName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  employeeSelectDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  employeeSelectShift: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  assignSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    minHeight: 52,
  },
  assignSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
});
