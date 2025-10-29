/*
https://www.youtube.com/watch?v=1ETOJloLK3Y
cd MyApp
npx expo start --tunnel
w
*/
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';

/* === Constants === */
const VERTICAL_CELL_HEIGHT   = 50;
const HORIZONTAL_CELL_WIDTH  = 100;
const HORIZONTAL_CELL_HEIGHT = 100;

/* === Theme Colors === */
const BGColor1           = '#101820';
const BGColor2           = '#101820';
const bordersColor       = '#000000';
const buttonColor        = '#5B7C85';
const buttonChoiceColor  = '#6A4D9C';
const textDarkColor      = '#000000';
const textLightColor     = '#FFFFFF';

/* === Custom Reusable Button === */
const CustomButton = ({ title, onPress, backgroundColor }) => (
  <TouchableOpacity
    style={[styles.customButton, { backgroundColor }]}
    onPress={onPress}
  >
    <Text style={[styles.customButtonText, { color: textDarkColor }]}>{title}</Text>
  </TouchableOpacity>
);

const TimeTable = () => {
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  /* === Generate timestamps for 48 hours === */
  const times = [];
  const dayLabels = ['Yesterday', 'Today', 'Tomorrow'];
  for (let d = 0; d < 3; d++) {
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
    { label: 'Task A', start: 21, end: 24, color: '#FF7777', day: 'Yesterday' },
    { label: 'Task B', start: 0, end: 5, color: '#77FF77', day: 'Today' },
    { label: 'Task C', start: 5, end: 7, color: '#7777FF', day: 'Today' },
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
    setSelectedDate(new Date(newYear, selectedDate.getMonth(), selectedDate.getDate()));
  };

  const handleMonthChange = (monthIndex) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), monthIndex, selectedDate.getDate()));
  };

  const handleDaySelect = (day) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
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
  const dayNum = selectedDate.getDate();
  const daysArray = getDaysInMonth(year, month);

  return (
    <View style={styles.container}>
      {/* Toggle Scroll Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title={`Switch to ${isHorizontal ? 'Vertical' : 'Horizontal'} Scroll`}
          onPress={toggleScrollDirection}
          backgroundColor={buttonColor}
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
                          width: spanCount * HORIZONTAL_CELL_WIDTH,
                          height: '100%',
                          left: startIndex * HORIZONTAL_CELL_WIDTH,
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
                          height: spanCount * VERTICAL_CELL_HEIGHT,
                          width: '100%',
                          top: startIndex * VERTICAL_CELL_HEIGHT,
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
        <CustomButton
          title="History"
          onPress={() => setShowCalendar(true)}
          backgroundColor={buttonColor}
        />
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
              <Text style={[styles.headerText, { color: textLightColor }]}>
                {monthName} {dayNum}, {year}
              </Text>
              <TouchableOpacity onPress={() => incrementYear(1)}>
                <Text style={styles.yearButton}>{'>'}</Text>
              </TouchableOpacity>
            </View>

            {/* Month Selector (2x6 Grid) */}
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
                    d === dayNum && styles.dayCellSelected,
                  ]}
                  onPress={() => d && handleDaySelect(d)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      d === dayNum && styles.dayTextSelected,
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

/* === Styles === */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGColor1,
    paddingVertical: 40,
    alignItems: 'center',
  },
  buttonContainer: { width: '90%', marginVertical: 10 },
  customButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    width: '90%',
    maxHeight: 500,
    borderWidth: 1,
    borderColor: bordersColor,
    borderRadius: 8,
    backgroundColor: buttonColor,
    overflow: 'visible',
  },

  /* Timeline Layout */
  horizontalWrapper: { flexDirection: 'column', position: 'relative' },
  horizontalTimeRow: { flexDirection: 'row', width: 100, height: 50 },
  horizontalBoxRow: { flex: 1, position: 'relative' },
  timeCellHorizontal: {
    width: HORIZONTAL_CELL_WIDTH,
    borderRightWidth: 1,
    borderColor: bordersColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalWrapper: { flexDirection: 'row', position: 'relative' },
  verticalTimeColumn: { flexDirection: 'column', width: 100, height: 50 },
  verticalBoxColumn: { flex: 1, position: 'relative' },
  timeCellVertical: {
    height: VERTICAL_CELL_HEIGHT,
    borderBottomWidth: 1,
    borderColor: bordersColor,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 15,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    opacity: 0.9,
  },
  boxText: { fontWeight: '600', fontSize: 20 },
  dayLabel: { fontSize: 20, color: textDarkColor },
  dayDivider: { fontSize: 15, fontWeight: 'bold', color: textDarkColor },
  timeText: { fontSize: 15 },

  /* Modal Overlay */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
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
    backgroundColor: BGColor1,
    borderRadius: 8,
    padding: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  yearButton: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10, color: textLightColor },

  /* 2x6 Month Grid */
  monthRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  monthButton: {
    width: '14.16%', // 6 columns per row
    aspectRatio: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: buttonColor,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  monthButtonSelected: { backgroundColor: buttonChoiceColor },
  monthText: { fontSize: 13, color: textLightColor },
  monthTextSelected: { color: textDarkColor, fontWeight: '700' },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  weekText: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
    color: textLightColor,
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
    backgroundColor: buttonChoiceColor,
    borderRadius: 8,
  },
  dayText: { fontSize: 14, color: textLightColor },
  dayTextSelected: { color: textDarkColor, fontWeight: '700' },
  closeButton: {
    marginTop: 15,
    backgroundColor: buttonColor,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeText: { color: textDarkColor, fontWeight: '600' },
});

export default TimeTable;