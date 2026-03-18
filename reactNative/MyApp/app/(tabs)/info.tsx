import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useDateContext } from '../DateContext';
import { BGColor1, BGColor2, buttonColor, textDarkColor, textLightColor } from './_layout';

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
    marginBottom: 16,
    zIndex: 10,
    width: 100,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: textDarkColor,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: textLightColor,
    marginBottom: 8,
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
  arrow: {
    color: textDarkColor,
    fontSize: 11,
  },
  optionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: BGColor2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: buttonColor,
    marginTop: 4,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: 100,
  },
  option: {
    paddingHorizontal: 14,
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
});

// ─── Range Selector ───────────────────────────────────────────────────────────

type RangeSelection = 'previous-selected' | 'selected-next';

interface RangeSelectorProps {
  value: RangeSelection;
  onChange: (value: RangeSelection) => void;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ value, onChange }) => (
  <View style={rangeStyles.container}>
    <TouchableOpacity
      style={[rangeStyles.option, value === 'previous-selected' && rangeStyles.optionActive]}
      onPress={() => onChange('previous-selected')}
      activeOpacity={0.8}
    >
      <Text style={[rangeStyles.optionText, value === 'previous-selected' && rangeStyles.optionTextActive]}>
        Previous → Selected
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[rangeStyles.option, value === 'selected-next' && rangeStyles.optionActive]}
      onPress={() => onChange('selected-next')}
      activeOpacity={0.8}
    >
      <Text style={[rangeStyles.optionText, value === 'selected-next' && rangeStyles.optionTextActive]}>
        Selected → Next
      </Text>
    </TouchableOpacity>
  </View>
);

const rangeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: buttonColor,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  option: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: BGColor2,
  },
  optionActive: {
    backgroundColor: buttonColor,
  },
  optionText: {
    color: textDarkColor,
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextActive: {
    color: textLightColor,
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
  { value: 1, color: '#44DDDD', label: 'Depp Sleep (N3)' },
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
  const [times, setTimes] = useState({
    previous: '12:00 AM',
    selected: '12:00 AM',
    next:     '12:00 AM',
  });

  const [openDropdown, setOpenDropdown] = useState<'previous' | 'selected' | 'next' | null>(null);
  const [range, setRange] = useState<RangeSelection>('previous-selected');

  const toggle = (key: 'previous' | 'selected' | 'next') =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  const setTime = (key: 'previous' | 'selected' | 'next', time: string) =>
    setTimes((prev) => ({ ...prev, [key]: time }));

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
        <View style={{ marginBottom: 5, zIndex: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          
          {/* Previous */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 30 }}>
            <Text style={{ color: textLightColor }}>Previous: {globalPreviousDate}</Text>
            <TimeDropdown
              selected={times.previous}
              onSelect={(t) => setTime('previous', t)}
              isOpen={openDropdown === 'previous'}
              onToggle={() => toggle('previous')}
            />
          </View>

          {/* Selected */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 20 }}>
            <Text style={{ color: textLightColor }}>Selected: {globalSelectedDate}</Text>
            <TimeDropdown
              selected={times.selected}
              onSelect={(t) => setTime('selected', t)}
              isOpen={openDropdown === 'selected'}
              onToggle={() => toggle('selected')}
            />
          </View>

          {/* Next */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 10 }}>
            <Text style={{ color: textLightColor }}>Next: {globalNextDate}</Text>
            <TimeDropdown
              selected={times.next}
              onSelect={(t) => setTime('next', t)}
              isOpen={openDropdown === 'next'}
              onToggle={() => toggle('next')}
            />
          </View>

        </View>

        {/* Range selector + print button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          <RangeSelector value={range} onChange={setRange} />

          <TouchableOpacity
            style={{
              backgroundColor: buttonColor,
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
            onPress={() => {
              const startDate = range === 'previous-selected' ? globalPreviousDate : globalSelectedDate;
              const endDate   = range === 'previous-selected' ? globalSelectedDate : globalNextDate;
              const startTime = range === 'previous-selected' ? times.previous : times.selected;
              const endTime   = range === 'previous-selected' ? times.selected : times.next;

              const startHour = parseTime(startTime);
              const endHour   = parseTime(endTime);

              if (startDate === endDate) {
                for (let h = startHour; h <= endHour; h++) {
                  console.log(`${startDate}(${h})`);
                }
              } else {
                for (let h = startHour; h <= 23; h++) {
                  console.log(`${startDate}(${h})`);
                }
                for (let h = 0; h <= endHour; h++) {
                  console.log(`${endDate}(${h})`);
                }
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: textLightColor, fontWeight: '700', fontSize: 13 }}>Print</Text>
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