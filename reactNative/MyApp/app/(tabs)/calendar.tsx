import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useDateContext } from '../DateContext';
import { BGColor1, BGColor2, bordersColor, buttonChoiceColor, buttonColor, diffColor, textDarkColor, textInverseColor, textLightColor } from './_layout';

let VictoryChart, VictoryLine, VictoryAxis;
if (Platform.OS === 'web') {
  const Victory = require('victory');
  VictoryChart = Victory.VictoryChart;
  VictoryLine = Victory.VictoryLine;
  VictoryAxis = Victory.VictoryAxis;
} else {
  const VictoryNative = require('victory-native');
  VictoryChart = VictoryNative.VictoryChart;
  VictoryLine = VictoryNative.VictoryLine;  
  VictoryAxis = VictoryNative.VictoryAxis;
}

let RNFS: any = null;
let SLEEP_DATA_DIR: string = '';
if (Platform.OS === 'android') {
  RNFS = require('react-native-fs');
  SLEEP_DATA_DIR = `${RNFS.ExternalDirectoryPath}/sleepData`;
}

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

function fillTimeGaps(data, interval) {
  if (data.length === 0) return data;
  
  const filled = [];
  for (let i = 0; i < data.length - 1; i++) {
    filled.push(data[i]);
    
    const currentTime = new Date(data[i].x).getTime();
    const nextTime = new Date(data[i + 1].x).getTime();
    const gap = nextTime - currentTime;
    
    // Fill gaps larger than expected interval
    if (gap > interval) {
      const pointsToAdd = Math.floor(gap / interval) - 1;
      for (let j = 1; j <= pointsToAdd; j++) {
        filled.push({
          x: new Date(currentTime + (j * interval)),
          y: data[i].y
        });
      }
    }
  }
  filled.push(data[data.length - 1]);
  return filled;
}

/* === Constants === */
const isAndroid = Platform.OS === 'android';
const isWeb = Platform.OS === 'web';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const screenBound = Math.min(screenWidth, screenHeight);
const CalendarWH = screenBound * 0.9;
const cellHeight = 50;
const cellWidth  = 75;
/* === Custom Reusable Button === */
const CustomButton = ({ title, onPress, backgroundColor }) => (
  <TouchableOpacity
    style={[styles.customButton, { backgroundColor }]}
    onPress={onPress}
  >
    <Text style={[styles.customButtonText, { color: textLightColor }]}>{title}</Text>
  </TouchableOpacity>
);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TimeTable = () => {
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [chartTitle, setChartTitle] = useState('');
  const [boxHours, setBoxHours] = useState({});
  const intervalInMs = 1000;
  const filledChartData = fillTimeGaps(chartData, intervalInMs);
  const [modalDims, setModalDims] = useState({ width: 0, height: 0 });
  const [isElectron, setIsElectron] = useState(false);
  const WINDOW_SIZE = 100;
  const [windowStart, setWindowStart] = useState(0);
  const { setGlobalSelectedDate, setGlobalPreviousDate, setGlobalNextDate } = useDateContext();

  const visibleData = useMemo(() =>
    filledChartData.slice(windowStart, windowStart + WINDOW_SIZE),
    [filledChartData, windowStart]
  );

  const maxStart = Math.max(0, filledChartData.length - WINDOW_SIZE);

  const handleChartScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollFraction = contentOffset.x / (contentSize.width - layoutMeasurement.width);
    const newStart = Math.round(scrollFraction * maxStart);
    setWindowStart(Math.min(Math.max(newStart, 0), maxStart));
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      setIsElectron(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const previousDate = new Date(selectedDate);
      previousDate.setDate(selectedDate.getDate() - 1);
      
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      
      updateBoxHoursForDates(
        formatDate(previousDate),
        formatDate(selectedDate),
        formatDate(nextDate)
      );
    }, [selectedDate])
  );
  
  // Calculate dates from selectedDate
  const previousDate = new Date(selectedDate);
  previousDate.setDate(selectedDate.getDate() - 1);
  
  const nextDate = new Date(selectedDate);
  nextDate.setDate(selectedDate.getDate() + 1);
  
  const globalSelectedDate = formatDate(selectedDate);
  const globalPreviousDate = formatDate(previousDate);
  const globalNextDate = formatDate(nextDate);

  // Define boxes based on current dates
  const boxes = [
    // Previous Day (#DD4444)
    { label: '', start: 0, end: ((isAndroid || isElectron) ? 0 : 1), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 1, end: ((isAndroid || isElectron) ? 1 : 2), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 2, end: ((isAndroid || isElectron) ? 2 : 3), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 3, end: ((isAndroid || isElectron) ? 3 : 4), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 4, end: ((isAndroid || isElectron) ? 4 : 5), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 5, end: ((isAndroid || isElectron) ? 5 : 6), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 6, end: ((isAndroid || isElectron) ? 6 : 7), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 7, end: ((isAndroid || isElectron) ? 7 : 8), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 8, end: ((isAndroid || isElectron) ? 8 : 9), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 9, end: ((isAndroid || isElectron) ? 9 : 10), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 10, end: ((isAndroid || isElectron) ? 10 : 11), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 11, end: ((isAndroid || isElectron) ? 11 : 12), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 12, end: ((isAndroid || isElectron) ? 12 : 13), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 13, end: ((isAndroid || isElectron) ? 13 : 14), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 14, end: ((isAndroid || isElectron) ? 14 : 15), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 15, end: ((isAndroid || isElectron) ? 15 : 16), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 16, end: ((isAndroid || isElectron) ? 16 : 17), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 17, end: ((isAndroid || isElectron) ? 17 : 18), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 18, end: ((isAndroid || isElectron) ? 18 : 19), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 19, end: ((isAndroid || isElectron) ? 19 : 20), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 20, end: ((isAndroid || isElectron) ? 20 : 21), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 21, end: ((isAndroid || isElectron) ? 21 : 22), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 22, end: ((isAndroid || isElectron) ? 22 : 23), color: '#DD4444', day: globalPreviousDate },
    { label: '', start: 23, end: ((isAndroid || isElectron) ? 23 : 24), color: '#DD4444', day: globalPreviousDate },

    // Selected Day (#44DD44)
    { label: '', start: 0, end: ((isAndroid || isElectron) ? 0 : 1), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 1, end: ((isAndroid || isElectron) ? 1 : 2), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 2, end: ((isAndroid || isElectron) ? 2 : 3), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 3, end: ((isAndroid || isElectron) ? 3 : 4), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 4, end: ((isAndroid || isElectron) ? 4 : 5), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 5, end: ((isAndroid || isElectron) ? 5 : 6), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 6, end: ((isAndroid || isElectron) ? 6 : 7), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 7, end: ((isAndroid || isElectron) ? 7 : 8), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 8, end: ((isAndroid || isElectron) ? 8 : 9), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 9, end: ((isAndroid || isElectron) ? 9 : 10), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 10, end: ((isAndroid || isElectron) ? 10 : 11), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 11, end: ((isAndroid || isElectron) ? 11 : 12), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 12, end: ((isAndroid || isElectron) ? 12 : 13), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 13, end: ((isAndroid || isElectron) ? 13 : 14), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 14, end: ((isAndroid || isElectron) ? 14 : 15), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 15, end: ((isAndroid || isElectron) ? 15 : 16), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 16, end: ((isAndroid || isElectron) ? 16 : 17), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 17, end: ((isAndroid || isElectron) ? 17 : 18), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 18, end: ((isAndroid || isElectron) ? 18 : 19), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 19, end: ((isAndroid || isElectron) ? 19 : 20), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 20, end: ((isAndroid || isElectron) ? 20 : 21), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 21, end: ((isAndroid || isElectron) ? 21 : 22), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 22, end: ((isAndroid || isElectron) ? 22 : 23), color: '#44DD44', day: globalSelectedDate },
    { label: '', start: 23, end: ((isAndroid || isElectron) ? 23 : 24), color: '#44DD44', day: globalSelectedDate },

    // Next Day (#4444DD)
    { label: '', start: 0, end: ((isAndroid || isElectron) ? 0 : 1), color: '#4444DD', day: globalNextDate },
    { label: '', start: 1, end: ((isAndroid || isElectron) ? 1 : 2), color: '#4444DD', day: globalNextDate },
    { label: '', start: 2, end: ((isAndroid || isElectron) ? 2 : 3), color: '#4444DD', day: globalNextDate },
    { label: '', start: 3, end: ((isAndroid || isElectron) ? 3 : 4), color: '#4444DD', day: globalNextDate },
    { label: '', start: 4, end: ((isAndroid || isElectron) ? 4 : 5), color: '#4444DD', day: globalNextDate },
    { label: '', start: 5, end: ((isAndroid || isElectron) ? 5 : 6), color: '#4444DD', day: globalNextDate },
    { label: '', start: 6, end: ((isAndroid || isElectron) ? 6 : 7), color: '#4444DD', day: globalNextDate },
    { label: '', start: 7, end: ((isAndroid || isElectron) ? 7 : 8), color: '#4444DD', day: globalNextDate },
    { label: '', start: 8, end: ((isAndroid || isElectron) ? 8 : 9), color: '#4444DD', day: globalNextDate },
    { label: '', start: 9, end: ((isAndroid || isElectron) ? 9 : 10), color: '#4444DD', day: globalNextDate },
    { label: '', start: 10, end: ((isAndroid || isElectron) ? 10 : 11), color: '#4444DD', day: globalNextDate },
    { label: '', start: 11, end: ((isAndroid || isElectron) ? 11 : 12), color: '#4444DD', day: globalNextDate },
    { label: '', start: 12, end: ((isAndroid || isElectron) ? 12 : 13), color: '#4444DD', day: globalNextDate },
    { label: '', start: 13, end: ((isAndroid || isElectron) ? 13 : 14), color: '#4444DD', day: globalNextDate },
    { label: '', start: 14, end: ((isAndroid || isElectron) ? 14 : 15), color: '#4444DD', day: globalNextDate },
    { label: '', start: 15, end: ((isAndroid || isElectron) ? 15 : 16), color: '#4444DD', day: globalNextDate },
    { label: '', start: 16, end: ((isAndroid || isElectron) ? 16 : 17), color: '#4444DD', day: globalNextDate },
    { label: '', start: 17, end: ((isAndroid || isElectron) ? 17 : 18), color: '#4444DD', day: globalNextDate },
    { label: '', start: 18, end: ((isAndroid || isElectron) ? 18 : 19), color: '#4444DD', day: globalNextDate },
    { label: '', start: 19, end: ((isAndroid || isElectron) ? 19 : 20), color: '#4444DD', day: globalNextDate },
    { label: '', start: 20, end: ((isAndroid || isElectron) ? 20 : 21), color: '#4444DD', day: globalNextDate },
    { label: '', start: 21, end: ((isAndroid || isElectron) ? 21 : 22), color: '#4444DD', day: globalNextDate },
    { label: '', start: 22, end: ((isAndroid || isElectron) ? 22 : 23), color: '#4444DD', day: globalNextDate },
    { label: '', start: 23, end: ((isAndroid || isElectron) ? 23 : 24), color: '#4444DD', day: globalNextDate },
  ];

  // Merge boxes with hours from state
  const boxesWithHours = boxes.map((box, index) => ({
    ...box,
    start: boxHours[index]?.firstHour ?? box.start,
    end: boxHours[index]?.lastHour ?? box.end
  }));

  /* === Generate timestamps for 72 hours === */
  const times = [];
  const dayLabels = [globalPreviousDate, globalSelectedDate, globalNextDate];
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

  const manyBoxes = createManyBoxes(boxesWithHours);

  function createManyBoxes(boxes) {
    return boxes.map((box) => {
      const baseLabel = box.label;
      const baseColor = box.color;
      return [
        { ...box, label: `${baseLabel}`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000000')) },
        // { ...box, label: `${baseLabel}Alpha`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000000')) },
        // { ...box, label: `${baseLabel}beta `, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000001')) },
        // { ...box, label: `${baseLabel}Delta`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000002')) },
        // { ...box, label: `${baseLabel}Theta`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000003')) }, 
        // { ...box, label: `${baseLabel}Gamma`, color: HexColorsMath(baseColor,'-',HexColorsMath(diffColor,'*','#000004')) },
      ];
    });
  }

  const parseCSV = (csvString, dateHeader) => {
    const lines = csvString.trim().split('\n');
    const data = [];
    for (let i = 0; i < lines.length; i++) {
      const values = lines[i].split(',');
      const timeWithoutZ = values[0].replace('Z', '');
      const timestamp = new Date(dateHeader + 'T' + timeWithoutZ).getTime();
      const value = parseFloat(values[1]);
      data.push({ x: timestamp, y: value });
    }
    return data;
  };

  const readCSVFile = async (filePath, boxHour) => {
    try {
      let csvContent;
      
      if (isElectron) {
        csvContent = await window.electronAPI.readFileContent(filePath + '(' + boxHour + ')');
      } else {
        //const response = await fetch(filePath); // for webapp
        //csvContent = await response.text();
        csvContent = await RNFS.readFile(`${SLEEP_DATA_DIR}/${filePath}(${boxHour}).csv`, 'utf8');
      }
      
      const parsedData = parseCSV(csvContent, filePath);
      setChartData(parsedData);
      setChartTitle(filePath.split('/').pop());
      setWindowStart(0);
      setShowChart(true);
    } catch (err) {
      console.error('Error reading CSV:', err);
      alert(`Failed to read CSV file: ${err.message}`);
    }
  };

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const handleBoxPress = (subBox) => {
    if(isElectron || isAndroid) {
      readCSVFile(subBox.day, subBox.start);
    } else {
      const parsedData = [
        { x: new Date('2026-01-28T22:35:01.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:02.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:03.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:04.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:05.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:06.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:07.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:08.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:09.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:10.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:11.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:12.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:13.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:14.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:15.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:16.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:17.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:18.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:19.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:20.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:21.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:22.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:23.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:24.799').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:25.834').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:26.823').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:27.813').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:28.804').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:29.838').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:30.829').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:31.818').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:32.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:33.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:34.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:35.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:36.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:37.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:38.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:39.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:40.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:41.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:42.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:43.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:44.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:45.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:46.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:47.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:48.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:49.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:50.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:51.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:52.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:53.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:54.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:55.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:56.808').getTime(), y: 1 },
        { x: new Date('2026-01-28T22:35:57.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:35:58.808').getTime(), y: 2 },
        { x: new Date('2026-01-28T22:35:59.808').getTime(), y: 0 },
        { x: new Date('2026-01-28T22:36:00.808').getTime(), y: 1 },
      ];
      setChartData(parsedData);
      setChartTitle("Web Test");
      setShowChart(true);
    }
  };

  const toggleScrollDirection = () => setIsHorizontal(!isHorizontal);

  const getBoxIndices = (start, end, day) => {
    let baseOffset = 0;
    switch(day) {
      case globalSelectedDate:
        baseOffset = 24;
        break;
      case globalNextDate:
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
    const currentDay = selectedDate.getDate();
    const maxDay = new Date(newYear, selectedDate.getMonth() + 1, 0).getDate();
    const safeDay = Math.min(currentDay, maxDay);
    const newDate = new Date(newYear, selectedDate.getMonth(), safeDay);
    setSelectedDate(newDate);
    
    // Calculate the new dates
    const previousDate = new Date(newDate);
    previousDate.setDate(newDate.getDate() - 1);
    
    const nextDate = new Date(newDate);
    nextDate.setDate(newDate.getDate() + 1);
    
    // Update boxes with the new dates immediately
    updateBoxHoursForDates(
      formatDate(previousDate),
      formatDate(newDate),
      formatDate(nextDate)
    );
  };

  const handleMonthChange = (monthIndex) => {
    const currentDay = selectedDate.getDate();
    const maxDay = new Date(selectedDate.getFullYear(), monthIndex + 1, 0).getDate();
    const safeDay = Math.min(currentDay, maxDay);
    const newDate = new Date(selectedDate.getFullYear(), monthIndex, safeDay);
    setSelectedDate(newDate);
    
    const previousDate = new Date(newDate);
    previousDate.setDate(newDate.getDate() - 1);
    
    const nextDate = new Date(newDate);
    nextDate.setDate(newDate.getDate() + 1);
    
    updateBoxHoursForDates(
      formatDate(previousDate),
      formatDate(newDate),
      formatDate(nextDate)
    );
  };

  const handleDaySelect = (day) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
    
    const previousDate = new Date(newDate);
    previousDate.setDate(newDate.getDate() - 1);
    
    const nextDate = new Date(newDate);
    nextDate.setDate(newDate.getDate() + 1);
    
    updateBoxHoursForDates(
      formatDate(previousDate),
      formatDate(newDate),
      formatDate(nextDate)
    );
  };

  const updateBoxHoursForDates = async (prevDate, selDate, nxtDate) => {
    setGlobalPreviousDate(prevDate);
    setGlobalSelectedDate(selDate);
    setGlobalNextDate(nxtDate);
    if (isElectron) {
      try {
        const dayHoursMap = {};
        const uniqueDays = [prevDate, selDate, nxtDate];
        
        for (let d=0; d<3; d++) {
          for(let h=0; h<24; h++) {
            try {
              const firstHour = await window.electronAPI.readFile(`${uniqueDays[d]}(${h})`);
              if (firstHour !== null) {
                dayHoursMap[d*24+h] = {
                  firstHour: h,
                  lastHour: h + 1
                };
              } else {
                //console.warn(`SKIPPING ${uniqueDays[d]}(${h})`);
              }
            } catch (fileError) {
              console.warn(`Unexpected error reading files`);
              continue;
            }
          }
        }
        //console.log(JSON.stringify(dayHoursMap, null, 2));
        setBoxHours(dayHoursMap);
      } catch (error) {
        console.error('Error updating box hours:', error);
      }
    } else {
      // Android: read each day's file from local storage
      try {
        const dayHoursMap = {};
        const uniqueDays = [prevDate, selDate, nxtDate];

        for (let d=0; d<3; d++) {
          for(let h=0; h<24; h++) {
            try {
              const filePath = `${SLEEP_DATA_DIR}/${uniqueDays[d]}(${h}).csv`;
              const fileExists = await RNFS.exists(filePath);
              if (fileExists) {
                dayHoursMap[(d*24)+h] = {
                  firstHour: h,
                  lastHour: h + 1
                };
              } else {
                //console.warn(`SKIPPING ${uniqueDays[d]}(${h})`);
              }
            } catch (fileError) {
              console.warn(`Unexpected error reading files`);
              continue;
            }
          }
        }
        setBoxHours(dayHoursMap);
      } catch (error) {
        console.error('Error updating box hours:', error);
      }
    }
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
      {/* Toggle Scroll Button
      <View style={styles.buttonContainer}>
        <CustomButton
          title={`Switch to ${isHorizontal ? 'Vertical' : 'Horizontal'} Scroll`}
          onPress={toggleScrollDirection}
          backgroundColor={buttonColor}
        />
      </View> */}

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
                        onPress={() => handleBoxPress(subBox)}
                      >
                        <Text style={[styles.boxText,
                          {
                            textAlign: 'center',
                            fontSize:  cellWidth/(subBox.label.length/1.6),
                            //color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                            color: '#FFFFFF',
                          }, ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit={Platform.OS !== 'web'}
                          >{ subBox.label }
                        </Text>
                        <Text style={[styles.dayLabel,
                          {
                            textAlign: 'center',
                            fontSize:  cellWidth/(subBox.label.length/1.6),
                            //color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                            color: '#FFFFFF',
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
                        onPress={() => handleBoxPress(subBox)}
                      >
                        {/* <Text style={[styles.boxText,
                          {
                            textAlign: 'center',
                            fontSize:  cellHeight/3,
                            //color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                            color: '#FFFFFF',
                          }, ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit={Platform.OS !== 'web'}
                          >{ subBox.label }
                        </Text> */}
                        <Text style={[styles.dayLabel,
                          {
                            textAlign: 'center',
                            fontSize:  cellHeight/3,
                            //color: HexColorsMath('#FFFFFF','-',row[row.length-1-colIndex].color),
                            color: '#FFFFFF',
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
                  onPress={() => handleDaySelect(d)}
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

      {/* Chart Modal */}
      <Modal
        visible={showChart}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChart(false)}
      >
        <View
          style={styles.chartModalOverlay}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setModalDims({ width, height });
          }}
        >
          <View
            style={[
              styles.chartModalContent,
              isAndroid && {
                width: modalDims.height,
                height: modalDims.width,
                transform: [{ rotate: '90deg' }],
              }
            ]}
          >
            <View style={[styles.chartHeader, { marginTop: -15 }]}>
              <Text style={styles.chartTitle}>{chartTitle}</Text>
              <TouchableOpacity
                onPress={() => setShowChart(false)} 
                style={[styles.chartCloseButton, { marginRight: 25 }]}
              >
                <Text style={styles.chartCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {(() => {
              const totalPoints = filledChartData.length;
              const chartWidth  = (isAndroid) ? modalDims.height : modalDims.width;
              const chartHeight = (isAndroid) ? modalDims.width : modalDims.height;
              return (
                <>
                  <VictoryChart
                    width={chartWidth * 0.9}
                    height={chartHeight * 0.7}
                    scale={{ x: 'time' }}
                    domain={{ y: [0, Math.max(...visibleData.map(d => d.y)) * 1.1] }}
                    style={{
                      background: { fill: BGColor2 },
                      justifyContent: 'center',
                    }}
                    padding={{ top: 10, bottom: 40, left: 50, right: 10 }} 
                  > 
                    <VictoryAxis
                      dependentAxis
                      label=""
                      style={{
                        axisLabel: { padding: 60, angle: 0, fill: textLightColor },
                        tickLabels: { fill: textLightColor },
                        axis: { stroke: textDarkColor, strokeWidth: 5 },
                        grid: { stroke: bordersColor }
                      }}
                    />
                    <VictoryAxis
                      label="HH:MM:SS"
                      tickFormat={formatXAxis}
                      style={{
                        axisLabel: { padding: 10, fill: textDarkColor },
                        tickLabels: { angle: -45, fill: textLightColor },
                        axis: { stroke: textDarkColor, strokeWidth: 5 },
                        grid: { stroke: bordersColor }
                      }}
                    />
                    <VictoryLine
                      data={visibleData}
                      style={{
                        data: { stroke: textInverseColor, strokeWidth: 2 }
                      }}
                    />
                  </VictoryChart>

                  {/* Prev/Next buttons */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 50 }}>
                    <TouchableOpacity
                      onPress={() => setWindowStart(w => Math.max(0, w - WINDOW_SIZE))}
                      disabled={windowStart === 0}
                      style={{ opacity: windowStart === 0 ? 0.3 : 1 }}
                    >
                      <Text style={{ color: textLightColor, fontSize: 16 }}>◀ Prev</Text>
                    </TouchableOpacity>
                    {/* Progress indicator */}
                    {(!isAndroid) ? (
                      <input
                        type="range"
                        min={0}
                        max={maxStart}
                        value={windowStart}
                        onChange={(e) => setWindowStart(Number(e.target.value))}
                        style={{ width: '90%', marginTop: 0, marginBottom: 0, display: 'block', margin: '0 auto' }}
                      />
                    ) : (
                    /* Android: use invisible ScrollView as scrubber */
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={true}
                      //persistentScrollbar={true}
                      onScroll={(e) => {
                        const x = e.nativeEvent.contentOffset.x;
                        const scrollWidth = Math.max(1280, filledChartData.length * 8);
                        const ratio = x / (scrollWidth - chartWidth);
                        setWindowStart(Math.round(ratio * maxStart));
                      }}
                      scrollEventThrottle={16}
                      style={{ width: '100%', height: 15 }}
                    >
                      <View style={{ width: Math.max(1280, filledChartData.length * 8), height: 0 }} />
                    </ScrollView>
                  )}
                    <TouchableOpacity
                      onPress={() => setWindowStart(w => Math.min(maxStart, w + WINDOW_SIZE))}
                      disabled={windowStart >= maxStart}
                      style={{ opacity: windowStart >= maxStart ? 0.3 : 1 }}
                    >
                      <Text style={{ color: textLightColor, fontSize: 16 }}>Next ▶</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={{ color: textLightColor, textAlign: 'center' }}>
                    {windowStart + 1}–{Math.min(windowStart + WINDOW_SIZE, filledChartData.length)} of {filledChartData.length} points
                  </Text>
                </>
              );
            })()}
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
  dayDivider: { fontSize: cellHeight/3.5, color: textLightColor },
  timeText:   { fontSize: cellHeight/3.5, color: textLightColor },

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
  closeText: { color: textLightColor, fontWeight: 'bold' },

  /* Chart Modal Styles */
  chartModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartModalContent: {
    backgroundColor: BGColor1,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    height: '90%',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: textLightColor,
  },
  chartCloseButton: {
    padding: 5,
  },
  chartCloseButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: textLightColor,
  },
});

export default TimeTable;