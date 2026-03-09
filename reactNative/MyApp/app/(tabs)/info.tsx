import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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