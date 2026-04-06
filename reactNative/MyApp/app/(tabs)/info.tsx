import { Asset } from 'expo-asset';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import React, { useEffect, useState, } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useDateContext } from '../DateContext';
import { BGColor1, BGColor2, buttonColor, buttonWrongColor, textDarkColor, textLightColor } from './_layout';

let RNFS: any = null;
let SLEEP_DATA_DIR: string = '';
if (Platform.OS === 'android') {
  RNFS = require('react-native-fs');
  SLEEP_DATA_DIR = `${RNFS.ExternalDirectoryPath}/sleepData`;
}

let globalInputData: Float32Array = new Float32Array([]);
const loadModel = async () => {
  try {
    const asset = await Asset.loadAsync(require('./assets/model.onnx'));
    const modelUri = asset[0].localUri;
    const session = await InferenceSession.create(modelUri);
    return session;
  } catch { console.warn("onnx error"); }
};

// ─── Ring Chart Types ─────────────────────────────────────────────────────────

export interface RingSegment {
  value: number;
  color: string;
  label?: string;
}

export interface RingChartProps {
  segments: RingSegment[];
  size?: number;
  strokeWidth?: number;
  gap?: number;
  centerContent?: React.ReactNode;
  trackColor?: string;
  showLegend?: boolean;
  style?: ViewStyle;
}

// ─── Ring Chart Geometry ──────────────────────────────────────────────────────

const toRad = (deg: number) => (deg * Math.PI) / 180;

const pointOnCircle = (cx: number, cy: number, r: number, deg: number) => ({
  x: +(cx + r * Math.cos(toRad(deg))).toFixed(4),
  y: +(cy + r * Math.sin(toRad(deg))).toFixed(4),
});

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string => {
  const span = endDeg - startDeg;
  if (span <= 0) return '';
  const clampedEnd = startDeg + Math.min(span, 359.999);
  const largeArc = clampedEnd - startDeg > 180 ? 1 : 0;
  const s = pointOnCircle(cx, cy, r, startDeg);
  const e = pointOnCircle(cx, cy, r, clampedEnd);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
};

const normalise = (segments: RingSegment[]) => {
  if (!segments?.length) return [];
  const total = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0);
  if (total === 0) return segments.map((seg) => ({ ...seg, pct: 0 }));
  return segments.map((seg) => ({ ...seg, pct: Math.max(0, seg.value) / total }));
};

// ─── Ring Chart Component ─────────────────────────────────────────────────────

export const RingChart: React.FC<RingChartProps> = ({
  segments = [],
  size = 200,
  strokeWidth = 24,
  gap = 2,
  centerContent,
  trackColor = BGColor2,
  showLegend = true,
  style,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  const normalised = normalise(segments);

  let cursor = -90;
  const segmentData = normalised.map((seg) => {
    const startDeg = cursor + gap / 2;
    const endDeg = cursor + seg.pct * 360 - gap / 2;
    cursor += seg.pct * 360;
    const d = arcPath(cx, cy, r, startDeg, endDeg);
    return { ...seg, startDeg, endDeg, d };
  });

  const trackTop = pointOnCircle(cx, cy, r, -90);
  const trackBot = pointOnCircle(cx, cy, r, 90);
  const trackD = `M ${trackTop.x} ${trackTop.y} A ${r} ${r} 0 1 1 ${trackBot.x} ${trackBot.y} A ${r} ${r} 0 1 1 ${trackTop.x} ${trackTop.y}`;

  return (
    <View style={[ringStyles.container, style]}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Path d={trackD} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
          {segmentData.map((seg, i) =>
            seg.d ? (
              <Path
                key={i}
                d={seg.d}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="butt"
              />
            ) : null
          )}
        </Svg>

        {centerContent && (
          <View style={[StyleSheet.absoluteFillObject, ringStyles.centerContent]} pointerEvents="none">
            {centerContent}
          </View>
        )}
      </View>

      {showLegend && (
        <View style={ringStyles.legend}>
          {normalised.map((seg, i) =>
            seg.label ? (
              <View key={i} style={ringStyles.legendItem}>
                <View style={[ringStyles.legendDot, { backgroundColor: seg.color }]} />
                <Text style={ringStyles.legendLabel}>
                  {seg.label}{' '}
                  <Text style={ringStyles.legendPct}>{(seg.pct * 100).toFixed(1)}%</Text>
                </Text>
              </View>
            ) : null
          )}
        </View>
      )}
    </View>
  );
};

const ringStyles = StyleSheet.create({
  container: { alignItems: 'center' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  legend: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 6, marginVertical: 2 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendLabel: {
    fontSize: 13,
    color: textLightColor,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  legendPct: { color: textDarkColor },
});

// ─── Time Options ─────────────────────────────────────────────────────────────

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'AM' : 'PM';
  return `${hour}:00 ${period}`;
});

// ─── Dropdown Component ───────────────────────────────────────────────────────

interface DateDropdownProps {
  selected: string;
  onSelect: (date: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  options: string[];
}

const DateDropdown: React.FC<DateDropdownProps> = ({ selected, onSelect, isOpen, onToggle, options }) => (
  <View style={dropdownStyles.dateWrapper}>
    <TouchableOpacity style={dropdownStyles.dateTrigger} onPress={onToggle} activeOpacity={0.8}>
      <Text style={dropdownStyles.triggerText}>{selected}</Text>
      <Text style={dropdownStyles.arrow}>{isOpen ? '▲' : '▼'}</Text>
    </TouchableOpacity>

    {isOpen && (
      <View style={dropdownStyles.dateOptionsList}>
        {options.map((date) => (
          <TouchableOpacity
            key={date}
            style={[dropdownStyles.option, selected === date && dropdownStyles.optionSelected]}
            onPress={() => { onSelect(date); onToggle(); }}
            activeOpacity={0.7}
          >
            <Text style={[dropdownStyles.optionText, selected === date && dropdownStyles.optionTextSelected]}>
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

interface TimeDropdownProps {
  selected: string;
  onSelect: (time: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ selected, onSelect, isOpen, onToggle }) => (
  <View style={dropdownStyles.wrapper}>
    <TouchableOpacity style={dropdownStyles.trigger} onPress={onToggle} activeOpacity={0.8}>
      <Text style={dropdownStyles.triggerText}>{selected}</Text>
      <Text style={dropdownStyles.arrow}>{isOpen ? '▲' : '▼'}</Text>
    </TouchableOpacity>

    {isOpen && (
      <View style={dropdownStyles.optionsList}>
        <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
          {TIME_OPTIONS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[dropdownStyles.option, selected === time && dropdownStyles.optionSelected]}
              onPress={() => { onSelect(time); onToggle(); }}
              activeOpacity={0.7}
            >
              <Text style={[dropdownStyles.optionText, selected === time && dropdownStyles.optionTextSelected]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
  </View>
);

const dropdownStyles = StyleSheet.create({
  wrapper: {
    width: 100,
    zIndex: 10,
  },
  dateWrapper: {
    width: 110,
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BGColor2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: buttonColor,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: 100,
  },
  dateTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BGColor2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: buttonColor,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: 110,
  },
  arrow: {
    color: textDarkColor,
    fontSize: 11,
  },
  optionsList: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: BGColor2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: buttonColor,
    marginTop: 4,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: 100,
  },
  dateOptionsList: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: BGColor2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: buttonColor,
    marginTop: 4,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: 110,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: buttonColor,
  },
  triggerText: {
    color: textLightColor,
    fontSize: 13,
  },
  optionText: {
    color: textLightColor,
    fontSize: 13,
  },
  optionTextSelected: {
    fontWeight: '700',
  },
});

// ─── Hour Calculation Helper ──────────────────────────────────────────────────

const parseTime = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  let [hours] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours;
};

const calcHours = (startTime: string, endTime: string): number => {
  const start = parseTime(startTime);
  const end   = parseTime(endTime);
  return end >= start ? end - start : 24 - start + end;
};

// ─── Info Screen Data ─────────────────────────────────────────────────────────

const SLEEP_SEGMENTS: RingSegment[] = [
  { value: 1, color: '#DD4444', label: 'Awake' },
  { value: 1, color: '#DDDD44', label: 'Light Sleep (N1)' },
  { value: 1, color: '#44DD44', label: 'Light Sleep (N2)' },
  { value: 1, color: '#44DDDD', label: 'Deep Sleep (N3)' },
  { value: 1, color: '#4444DD', label: 'REM' },
  { value: 1, color: '#DD44DD', label: 'Awake' },
];

const BOX_COUNT = 3;

const BOX_TEMPLATES = [
  { label: 'Sleep Score', body: '0/10' },
  { label: 'Summary', body: 'Sleep summary' },
  { label: 'How to Improve', body: 'List of improvements' },
];

const boxes = Array.from({ length: BOX_COUNT }, (_, i) => ({
  ...BOX_TEMPLATES[i % BOX_TEMPLATES.length],
  label:
    BOX_COUNT > BOX_TEMPLATES.length && i >= BOX_TEMPLATES.length
      ? `${BOX_TEMPLATES[i % BOX_TEMPLATES.length].label} ${Math.floor(i / BOX_TEMPLATES.length) + 1}`
      : BOX_TEMPLATES[i % BOX_TEMPLATES.length].label,
}));

// ─── Default Screen Export ────────────────────────────────────────────────────

export default function InfoScreen() {
  const { globalSelectedDate, globalPreviousDate, globalNextDate } = useDateContext();
  const [times, setTimes] = useState({ start: '12:00 AM', end: '12:00 AM' });
  const [selectedDates, setSelectedDates] = useState({ start: globalPreviousDate, end: globalSelectedDate });
  const [openDropdown, setOpenDropdown] = useState<'startDate' | 'startTime' | 'endDate' | 'endTime' | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    if (globalPreviousDate && globalSelectedDate) {
      setSelectedDates({ start: globalPreviousDate, end: globalSelectedDate });
    }
    if (typeof window !== 'undefined' && window.electronAPI) {
      setIsElectron(true);
    }
  }, [globalPreviousDate, globalSelectedDate]);

  const dateOptions = [globalPreviousDate, globalSelectedDate, globalNextDate].filter(Boolean);

  const toggle = (key: 'startDate' | 'startTime' | 'endDate' | 'endTime') =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  const setTime = (key: 'start' | 'end', time: string) =>
    setTimes((prev) => ({ ...prev, [key]: time }));

  const setSelectedDate = (key: 'start' | 'end', date: string) =>
    setSelectedDates((prev) => ({ ...prev, [key]: date }));

  const isViable = (() => {
    const startHour = parseTime(times.start);
    const endHour   = parseTime(times.end);
    const startDate = selectedDates.start;
    const endDate   = selectedDates.end;

    if (startDate > endDate) return false;
    if (startDate === endDate) return endHour >= startHour;
    return true; // startDate < endDate, any time combo is fine
  })();

  const readManyCSVData = async (fileName: string) => {
    if (isElectron) {
      try {
        const result = await window.electronAPI.readFile(fileName);
        if (result !== null) {
          console.log(`FOUND ${fileName}`);
        } else {
          console.log(`SKIPPING ${fileName}`);
        }
      } catch (fileError) {
        console.warn(`Unexpected error reading file: ${fileName}`);
      }
    } else {
      try {
        const filePath = `${SLEEP_DATA_DIR}/${fileName}.csv`;
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
          console.log(`FOUND ${fileName}`);
          const csvContent = await RNFS.readFile(filePath, 'utf8');
          const newValues = csvContent
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => parseFloat(line.split(',')[1]));
          const merged = new Float32Array(globalInputData.length + newValues.length);
          merged.set(globalInputData);
          merged.set(newValues, globalInputData.length);
          globalInputData = merged;
        } else {
          console.log(`SKIPPING ${fileName}`);
        }
      } catch (fileError) {
        console.warn(`Unexpected error reading file: ${fileName}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Information</Text>

        {/* Ring chart */}
        <View style={styles.ringWrapper}>
          <RingChart
            segments={SLEEP_SEGMENTS}
            size={220}
            strokeWidth={28}
            gap={3}
            trackColor={BGColor2}
            centerContent={
              <Text style={{ color: textLightColor, fontSize: 18, fontWeight: '700' }}>
                Sleep
              </Text>
            }
          />
        </View>
        
        {/* Inline date + time dropdowns */}
        <View style={{ marginBottom: 10, zIndex: 30, overflow: 'visible', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          {/* Start */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 999, overflow: 'visible' }}>
            <Text style={{ color: textLightColor }}>Start:</Text>
            <DateDropdown
              selected={selectedDates.start}
              onSelect={(d) => setSelectedDate('start', d)}
              isOpen={openDropdown === 'startDate'}
              onToggle={() => toggle('startDate')}
              options={dateOptions}
            />
            <TimeDropdown
              selected={times.start}
              onSelect={(t) => setTime('start', t)}
              isOpen={openDropdown === 'startTime'}
              onToggle={() => toggle('startTime')}
            />
          </View>
        </View>
        <View style={{ marginBottom: 10, zIndex: 20, overflow: 'visible', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          {/* End */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 998, overflow: 'visible' }}>
            <Text style={{ color: textLightColor }}>End:</Text>
            <DateDropdown
              selected={selectedDates.end}
              onSelect={(d) => setSelectedDate('end', d)}
              isOpen={openDropdown === 'endDate'}
              onToggle={() => toggle('endDate')}
              options={dateOptions}
            />
            <TimeDropdown
              selected={times.end}
              onSelect={(t) => setTime('end', t)}
              isOpen={openDropdown === 'endTime'}
              onToggle={() => toggle('endTime')}
            />
          </View>
        </View>
        <View style={{ marginBottom: 10, zIndex: 10, overflow: 'visible', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <TouchableOpacity
            style={{ backgroundColor: isViable ? buttonColor : buttonWrongColor, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 }}
            onPress={async () => {
              if (!isViable) return;
              globalInputData = new Float32Array([]);
              const startHour = parseTime(times.start);
              const endHour   = parseTime(times.end);
              if (selectedDates.start === selectedDates.end) {
                for (let h = startHour; h <= endHour; h++) {
                  //console.log(`${selectedDates.start}(${h})`);
                  await readManyCSVData(`${selectedDates.start}(${h})`);
                }
              } else {
                for (let h = startHour; h <= 23; h++) {
                  //console.log(`${selectedDates.start}(${h})`);
                  await readManyCSVData(`${selectedDates.start}(${h})`);
                }
                for (let h = 0; h <= endHour; h++) {
                  //console.log(`${selectedDates.end}(${h})`);
                  await readManyCSVData(`${selectedDates.start}(${h})`);
                }
              }
              console.log(globalInputData);
              try {
                const session = await loadModel();
                console.log('Model loaded:', session);
                const tensor = new Tensor('float32', globalInputData);
                const results = await session.run({ float_input: tensor });
                console.log('Inference result:', JSON.stringify(results));
              } catch { console.warn("Sleep ML error") }
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: textLightColor, fontWeight: '700', fontSize: 13 }}>
              {isViable ? 'Process' : 'Select Viable Times'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Info boxes */}
        <View style={styles.container}>
          {boxes.map((box) => (
            <View key={box.label} style={styles.box}>
              <View style={styles.accentBar} />
              <Text style={styles.label}>{box.label}</Text>
              <View style={styles.divider} />
              <Text style={styles.body}>{box.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BGColor1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '500',
    color: textLightColor,
    letterSpacing: -0.5,
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  ringWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
  },
  box: {
    flex: 1,
    backgroundColor: BGColor2,
    borderRadius: 4,
    padding: 20,
    shadowColor: textLightColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    minHeight: 160,
  },
  accentBar: {
    width: 36,
    height: 4,
    backgroundColor: buttonColor,
    borderRadius: 2,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: textLightColor,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: buttonColor,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: textLightColor,
    fontWeight: '400',
  },
});