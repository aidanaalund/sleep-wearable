import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BGColor1, BGColor2, buttonColor, textLightColor } from './_layout';

const BOX_COUNT = 3;

const BOX_TEMPLATES = [
  {
    label: 'Sleep Score',
    body: '0/10',
  },
  {
    label: 'Summary',
    body: 'Sleep summary',
  },
  {
    label: 'How to Improve',
    body: 'List of improvements',
  },
];

// Auto-generates boxes up to BOX_COUNT, cycling through templates if needed
const boxes = Array.from({ length: BOX_COUNT }, (_, i) => ({
  ...BOX_TEMPLATES[i % BOX_TEMPLATES.length],
  // Append an index if the same template repeats (e.g. "Overview 2")
  label:
    BOX_COUNT > BOX_TEMPLATES.length && i >= BOX_TEMPLATES.length
      ? `${BOX_TEMPLATES[i % BOX_TEMPLATES.length].label} ${Math.floor(i / BOX_TEMPLATES.length) + 1}`
      : BOX_TEMPLATES[i % BOX_TEMPLATES.length].label,
}));

export default function ThreeBoxes() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Information</Text>
        <View style={styles.container}>
          {boxes.map((box) => (
            <View key={box.label} style={styles.box}>
              {/* Accent bar */}
              <View style={styles.accentBar} />

              {/* Label */}
              <Text style={styles.label}>{box.label}</Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Body text */}
              <Text style={styles.body}>{box.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 16, // React Native 0.71+ supports gap; otherwise use marginBottom on each box
  },
  box: {
    flex: 1,            // equal height distribution when inside a flex column
    backgroundColor: BGColor2,
    borderRadius: 4,
    padding: 20,
    // Shadow (iOS)
    shadowColor: textLightColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    // Shadow (Android)
    elevation: 3,
    // Minimum height so boxes feel substantial
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