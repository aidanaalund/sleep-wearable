/*
https://www.youtube.com/watch?v=1ETOJloLK3Y
cd MyApp
npx expo start --tunnel
w
*/

import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

  function HexColorsMath(color1, op, color2) {
    // Convert hex strings to numbers
    const num1 = parseInt(color1.replace(/^#/, ''), 16);
    const num2 = parseInt(color2.replace(/^#/, ''), 16);

    let result = -1;
    switch(op) {
      case '*':
        result = Math.min(16777215, num1 * num2);
        break;
      case '+':
        result = Math.min(16777215, num1 + num2);
        break;
      case '-':
        result = Math.max(0,        num1 - num2);
        break;
    }

    return `#${result.toString(16).padStart(6, '0')}`;
  }

/* === Constants === */
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const screenBound = Math.min(screenWidth, screenHeight);
const CalendarWH = screenBound * 0.9;
const cellHeight = 50;
const cellWidth  = 75;
const diffColor          = '#111111';
export const BGColor1           = '#24292b';
export const BGColor2           = HexColorsMath(BGColor1,'+',diffColor);
export const bordersColor       = '#000000';
export const buttonColor        = '#222f55';
export const buttonChoiceColor  = HexColorsMath(buttonColor,'-',HexColorsMath(diffColor,'*','#000002'));
export const textLightColor     = '#99cde6';
export const textDarkColor      = HexColorsMath(textLightColor,'-',HexColorsMath(diffColor,'*','#000002'));

/* === Custom Reusable Button === */
const CustomButton = ({ title, onPress, backgroundColor }) => (
  <TouchableOpacity
    style={[styles.customButton, { backgroundColor }]}
    onPress={onPress}
  >
    <Text style={[styles.customButtonText, { color: textLightColor }]}>{title}</Text>
  </TouchableOpacity>
);

const TimeTable = () => {
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  /* === Generate timestamps for 72 hours === */
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
    { label: 'Sleep0', start: 1,  end: 2,  color: '#DD44DD', day: 'Yesterday' },
    { label: 'Sleep1', start: 6,  end: 18, color: '#DD4444', day: 'Yesterday' },
    { label: 'Sleep2', start: 21, end: 27, color: '#DDDD44', day: 'Yesterday' },
    { label: 'Sleep3', start: 6,  end: 18, color: '#44DD44', day: 'Today' },
    { label: 'Sleep4', start: 21, end: 27, color: '#44DDDD', day: 'Today' },
    { label: 'Sleep5', start: 6,  end: 18, color: '#4444DD', day: 'Tomorrow' },
    { label: 'Sleep6', start: 21, end: 27, color: '#DD44DD', day: 'Tomorrow' },
  ];

  const manyBoxes = createManyBoxes(boxes);

  function createManyBoxes(boxes) {
    return boxes.map((box) => {
      const baseLabel = box.label;
      const baseColor = box.color;
      return [
        { ...box, label: `${baseLabel}Alpha`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000000')) },
        { ...box, label: `${baseLabel}beta `, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000001')) },
        { ...box, label: `${baseLabel}Delta`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000002')) },
        { ...box, label: `${baseLabel}Theta`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000003')) }, 
        { ...box, label: `${baseLabel}Gamma`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000004')) },
      ];
    });
  }

  const toggleScrollDirection = () => setIsHorizontal(!isHorizontal);

  const getBoxIndices = (start, end, day) => {
    let baseOffset = 0;
    switch(day) {
      case 'Today':
        baseOffset = 24;
        break;
      case 'Tomorrow':
        baseOffset = 48;
        break;
    }
    return times
      .map((t, i) => {
        if((start+baseOffset)<=t.hour && t.hour<(end+baseOffset)) {
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
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          flexGrow: 1,
          ...(isHorizontal
            ? { flexDirection: 'row' }
            : { flexDirection: 'column' }),
        }}
        //nestedScrollEnabled={true}
        //scrollEventThrottle={16}
      >
        <View
          style={[
            isHorizontal ? styles.horizontalWrapper : styles.verticalWrapper,
          ]}
        >
          {/* Horizontal View */}
          {isHorizontal && (
            <>
              <View style={[styles.horizontalBoxRow, { width: times.length * cellWidth }]}>
                {manyBoxes.map((row, rowIndex) => {
                  return row.map((subBox, colIndex) => {
                    const indices = getBoxIndices(subBox.start, subBox.end, subBox.day);
                    if (indices.length === 0) return null;
                    const startIndex = indices[0];
                    const spanCount = indices.length;
                    return (
                      <TouchableOpacity
                        key={`${rowIndex}-${colIndex}`}
                        style={[
                          styles.box,
                          {
                            backgroundColor: subBox.color,
                            width: spanCount * cellWidth,
                            height: `${100 / row.length}%`,
                            left: startIndex * cellWidth,
                            position: 'absolute',
                            top: `${(100 / row.length) * colIndex}%`,
                          },
                        ]}
                        onPress={() => alert(`Clicked ${subBox.label}`)}
                      >
                        <Text style={[styles.boxText,
                          {
                            textAlign: 'center',
                            fontSize:  cellWidth/(subBox.label.length/1.6),
                            color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                          }, ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit={Platform.OS !== 'web'}
                          >{ subBox.label }
                        </Text>
                        <Text style={[styles.dayLabel,
                          {
                            textAlign: 'center',
                            fontSize:  cellWidth/(subBox.label.length/1.6),
                            color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                          }, ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit={Platform.OS !== 'web'}
                          >{ subBox.day }
                        </Text>
                      </TouchableOpacity>
                    );
                  });
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
              <View style={[styles.verticalBoxColumn, { height: times.length * cellHeight }]}>
                {manyBoxes.map((row, rowIndex) => {
                  return row.map((subBox, colIndex) => {
                    const indices = getBoxIndices(subBox.start, subBox.end, subBox.day);
                    if (indices.length === 0) return null;
                    const startIndex = indices[0];
                    const spanCount = indices.length;
                    return (
                      <TouchableOpacity
                        key={`${rowIndex}-${colIndex}`}
                        style={[
                          styles.box,
                          {
                            backgroundColor: subBox.color,
                            height: spanCount * cellHeight,
                            width: `${100 / row.length}%`,
                            top: startIndex * cellHeight,
                            position: 'absolute',
                            left: `${(100 / row.length) * colIndex}%`,
                          },
                        ]}
                        onPress={() => alert(`Clicked ${subBox.label}`)}
                      >
                        <Text style={[styles.boxText,
                          {
                            textAlign: 'center',
                            fontSize:  cellHeight/3,
                            color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                          }, ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit={Platform.OS !== 'web'}
                          >{ subBox.label }
                        </Text>
                        <Text style={[styles.dayLabel,
                          {
                            textAlign: 'center',
                            fontSize:  cellHeight/3,
                            color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                          }, ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit={Platform.OS !== 'web'}
                          >{ subBox.day }
                        </Text>
                      </TouchableOpacity>
                    );
                  });
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
              {[
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ].map((name, i) => {
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
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: bordersColor,
    borderRadius: 4,
    backgroundColor: BGColor2,
  },

  /* Timeline Layout */
  horizontalWrapper: { flexDirection: 'column', position: 'relative', flexGrow: 1 },
  horizontalTimeRow: { flexDirection: 'row', width: cellWidth, height: cellHeight },
  horizontalBoxRow: { flex: 1, position: 'relative' },
  timeCellHorizontal: {
    width: cellWidth,
    borderRightWidth: 1,
    borderColor: bordersColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalWrapper: { flexDirection: 'row', position: 'relative', flexGrow: 1 },
  verticalTimeColumn: { flexDirection: 'column', width: cellWidth, height: cellHeight },
  verticalBoxColumn: { flex: 1, position: 'relative' },
  timeCellVertical: {
    height: cellHeight,
    borderBottomWidth: 1,
    borderColor: bordersColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    opacity: 0.9,
  },
  boxText:    { color: textLightColor, fontWeight: 'bold' },
  dayLabel:   { color: textLightColor, fontWeight: 'bold' },
  dayDivider: { fontSize: cellHeight/3.25, color: textLightColor },
  timeText:   { fontSize: cellHeight/3.25, color: textLightColor },

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
    borderRadius: 4,
    padding: 20,
    elevation: 10,
    height: 'auto',
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
    borderRadius: 4,
    backgroundColor: buttonColor,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  monthButtonSelected: { backgroundColor: buttonChoiceColor },
  monthText: { fontSize: 13, color: textLightColor },
  monthTextSelected: { color: textDarkColor, fontWeight: 'bold' },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  weekText: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: textLightColor,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    ...(Platform.OS !== 'web' ? { height: '100%' } : { aspectRatio: 1 }),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellSelected: {
    backgroundColor: buttonColor,
    borderRadius: 4,
  },
  dayText: { fontSize: 14, color: textLightColor },
  dayTextSelected: { color: textLightColor, fontWeight: 'bold' },
  closeButton: {
    marginTop: 15,
    backgroundColor: buttonColor,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  closeText: { color: textDarkColor, fontWeight: 'bold' },
});

export default TimeTable;