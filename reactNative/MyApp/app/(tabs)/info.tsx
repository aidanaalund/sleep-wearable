import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BGColor1, BGColor2, buttonColor, textLightColor } from './_layout';

const BOX_COUNT = 3;

const BOX_TEMPLATES = [
  {
    label: 'Overview',
    body: 'This section provides a high-level summary of the project. Key milestones have been reached and the team is aligned on next steps moving into the upcoming quarter.',
  },
  {
    label: 'Progress',
    body: 'Development is currently at 74% completion. Three major features have shipped successfully, and two remain in active review. Velocity has increased week-over-week.',
  },
  {
    label: 'Next Steps',
    body: 'The team will focus on final QA, performance profiling, and preparing the release build. A stakeholder demo is scheduled for the end of the sprint.',
  },
  {
    label: 'Resources',
    body: 'Budget utilization sits at 61%. Two additional contractors have been onboarded this month. Tool subscriptions are up for renewal at the end of the quarter.',
  },
  {
    label: 'Risks',
    body: 'A dependency on a third-party API introduces moderate schedule risk. Mitigation plans are documented and a fallback implementation is scoped and ready.',
  },
  {
    label: 'Team',
    body: 'The core team consists of six engineers, one designer, and a product lead. Morale is high and sprint ceremonies are running smoothly across time zones.',
  },
  {
    label: 'Metrics',
    body: 'Weekly active users are up 12% month-over-month. Error rates have dropped below 0.3% following the latest hotfix. Load times average under 800ms.',
  },
  {
    label: 'Feedback',
    body: 'Recent user interviews surfaced strong demand for offline support and improved search. Both items have been added to the backlog and prioritized for Q3.',
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