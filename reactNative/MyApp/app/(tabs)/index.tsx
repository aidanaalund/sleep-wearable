import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
  Pressable,
  Modal,
  Platform,
} from 'react-native';

const TimeTable = () => {
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  /* === Generate timestamps for 48 hours === */
  const times = [];
  const dayLabels = ['Yesterday', 'Today'];
  for (let d = 0; d < 2; d++) {
    for (let h = 0; h < 24; h++) {
      const period = h < 12 ? 'AM' : 'PM';
      const formattedHour = h % 12 === 0 ? 12 : h % 12;
      times.push({
        label: `${formattedHour}:00 ${period}`,
        hour: h + d * 24,
        day: dayLabels[d],
      });
    }
  }

  const boxes = [
    { label: 'Task A', start: 21, end: 24, color: '#FFB6C1', day: 'Yesterday' },
    { label: 'Task B', start: 0, end: 5, color: '#ADD8E6', day: 'Today' },
    { label: 'Task C', start: 5, end: 7, color: '#90EE90', day: 'Today' },
  ];

  const toggleScrollDirection = () => setIsHorizontal(!isHorizontal);

  const getBoxIndices = (start, end, day) => {
    const baseOffset = day === 'Yesterday' ? 0 : 24;
    return times
      .map((t, i) => {
        const localHour = t.hour - baseOffset;
        if (
          t.day === day &&
          ((start < end && localHour >= start && localHour < end) ||
            (start > end && (localHour >= start || localHour < end)))
        ) {
          return i;
        }
        return null;
      })
      .filter((i) => i !== null);
  };

  const incrementYear = (dir) => {
    const newYear = selectedDate.getFullYear() + dir;
    setSelectedDate(
      new Date(newYear, selectedDate.getMonth(), selectedDate.getDate())
    );
  };

  const handleMonthChange = (monthIndex) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), monthIndex, 1));
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  /* === Calendar generation === */
  const getDaysInMonth = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
    const numDays = new Date(year, month + 1, 0).getDate();
    const days = Array(firstDayOfMonth).fill(null);
    for (let d = 1; d <= numDays; d++) days.push(d);
    return days;
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });
  const daysArray = getDaysInMonth(year, month);

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={`Switch to ${isHorizontal ? 'Vertical' : 'Horizontal'} Scroll`}
          onPress={toggleScrollDirection}
        />
      </View>

      {/* Scrollable Timeline */}
      <ScrollView
        style={styles.tableContainer}
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator
        showsVerticalScrollIndicator
      >
        <View
          style={[
            isHorizontal ? styles.horizontalWrapper : styles.verticalWrapper,
          ]}
        >
          {/* Horizontal View */}
          {isHorizontal && (
            <>
              <View style={styles.horizontalBoxRow}>
                {boxes.map((box, i) => {
                  const indices = getBoxIndices(box.start, box.end, box.day);
                  if (indices.length === 0) return null;
                  const startIndex = indices[0];
                  const spanCount = indices.length;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.box,
                        {
                          backgroundColor: box.color,
                          width: spanCount * CELL_WIDTH,
                          height: CELL_HEIGHT_HORIZONTAL,
                          left: startIndex * CELL_WIDTH,
                          position: 'absolute',
                          top: 0,
                        },
                      ]}
                      onPress={() => alert(`Clicked ${box.label}`)}
                    >
                      <Text style={styles.boxText}>{box.label}</Text>
                      <Text style={styles.dayLabel}>{box.day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.horizontalTimeRow}>
                {times.map((t, i) => (
                  <View key={i} style={styles.timeCellHorizontal}>
                    {i % 24 === 0 && (
                      <Text style={styles.dayDivider}>{t.day}</Text>
                    )}
                    <Text style={styles.timeText}>{t.label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Vertical View */}
          {!isHorizontal && (
            <>
              <View style={styles.verticalTimeColumn}>
                {times.map((t, i) => (
                  <View key={i} style={styles.timeCellVertical}>
                    {i % 24 === 0 && (
                      <Text style={styles.dayDivider}>{t.day}</Text>
                    )}
                    <Text style={styles.timeText}>{t.label}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.verticalBoxColumn}>
                {boxes.map((box, i) => {
                  const indices = getBoxIndices(box.start, box.end, box.day);
                  if (indices.length === 0) return null;
                  const startIndex = indices[0];
                  const spanCount = indices.length;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.box,
                        {
                          backgroundColor: box.color,
                          height: spanCount * CELL_HEIGHT_VERTICAL,
                          width: '100%',
                          top: startIndex * CELL_HEIGHT_VERTICAL,
                          position: 'absolute',
                          left: 0,
                        },
                      ]}
                      onPress={() => alert(`Clicked ${box.label}`)}
                    >
                      <Text style={styles.boxText}>{box.label}</Text>
                      <Text style={styles.dayLabel}>{box.day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* History Button */}
      <View style={styles.buttonContainer}>
        <Button title="History" onPress={() => setShowCalendar(true)} />
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => incrementYear(-1)}>
                <Text style={styles.yearButton}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.headerText}>
                {monthName} {year}
              </Text>
              <TouchableOpacity onPress={() => incrementYear(1)}>
                <Text style={styles.yearButton}>{'>'}</Text>
              </TouchableOpacity>
            </View>

            {/* Month Selector */}
            <View style={styles.monthRow}>
              {Array.from({ length: 12 }).map((_, i) => {
                const name = new Date(0, i).toLocaleString('default', {
                  month: 'short',
                });
                const selected = i === month;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.monthButton,
                      selected && styles.monthButtonSelected,
                    ]}
                    onPress={() => handleMonthChange(i)}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        selected && styles.monthTextSelected,
                      ]}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Week Headers */}
            <View style={styles.weekRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <Text key={d} style={styles.weekText}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Days */}
            <View style={styles.daysGrid}>
              {daysArray.map((d, i) => (
                <Pressable
                  key={i}
                  style={[
                    styles.dayCell,
                    d === selectedDay && styles.dayCellSelected,
                  ]}
                  onPress={() => d && handleDaySelect(d)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      d === selectedDay && styles.dayTextSelected,
                    ]}
                  >
                    {d ?? ''}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* === Constants === */
const CELL_HEIGHT_VERTICAL = 50;
const CELL_WIDTH = 100;
const CELL_HEIGHT_HORIZONTAL = 100;

/* === Styles === */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingVertical: 40,
    alignItems: 'center',
  },
  buttonContainer: { width: '90%', marginVertical: 10 },
  tableContainer: {
    width: '90%',
    maxHeight: 500,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    overflow: 'visible', // important for web
  },

  /* Timeline Layout */
  horizontalWrapper: { flexDirection: 'column', position: 'relative' },
  verticalWrapper: { flexDirection: 'row', position: 'relative' },
  horizontalBoxRow: { height: CELL_HEIGHT_HORIZONTAL, position: 'relative' },
  horizontalTimeRow: { flexDirection: 'row', height: 50 },
  timeCellHorizontal: {
    width: CELL_WIDTH,
    borderRightWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalTimeColumn: { width: 80 },
  verticalBoxColumn: { flex: 1, position: 'relative' },
  timeCellVertical: {
    height: CELL_HEIGHT_VERTICAL,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    opacity: 0.9,
  },
  boxText: { fontWeight: '600', fontSize: 14 },
  dayLabel: { fontSize: 10, color: '#333' },
  dayDivider: { fontSize: 12, fontWeight: 'bold', color: '#555' },
  timeText: { fontSize: 13 },

  /* Modal Overlay (Fix for Web) */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: 360,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  yearButton: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10 },

  monthRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  monthButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#eee',
    margin: 2,
  },
  monthButtonSelected: { backgroundColor: '#4A90E2' },
  monthText: { fontSize: 12 },
  monthTextSelected: { color: '#fff', fontWeight: '600' },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  weekText: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#555',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellSelected: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
  },
  dayText: { fontSize: 14 },
  dayTextSelected: { color: '#fff', fontWeight: '700' },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#4A90E2',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  closeText: { color: '#fff', fontWeight: '600' },
});

export default TimeTable;