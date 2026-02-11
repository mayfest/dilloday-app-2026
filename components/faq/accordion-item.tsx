import React, { useRef, useState } from 'react';

import { Colors } from '@/constants/Colors';
import { highlightMatches } from '@/lib/faq-utils';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Animated,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface AccordionItemProps {
  title: string;
  content: string[];
  highlightText?: string;
}

export default function AccordionItem({
  title,
  content,
  highlightText = '',
}: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    // Animate layout (height auto → measured height)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Rotate the chevron
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 50,
      useNativeDriver: true,
    }).start();

    setIsExpanded((prev) => !prev);
  };

  // Interpolate for 0 → 90deg
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.accordionContainer}>
      {/* Header */}
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.7}
        onPress={toggleAccordion}
      >
        <Text style={styles.accordionTitle}>
          {highlightText ? highlightMatches(title, highlightText) : title}
        </Text>
        <Animated.View
          style={[styles.chevron, { transform: [{ rotate: spin }] }]}
        >
          <FontAwesome6 name='chevron-right' size={16} color='#FFFFFF' />
        </Animated.View>
      </TouchableOpacity>

      {/* Content: layout animation will animate its height */}
      <View style={styles.accordionContentContainer}>
        {isExpanded && (
          <View style={styles.accordionContent}>
            {content.map((para, idx) => (
              <Text key={idx} style={styles.paragraph}>
                {highlightText ? highlightMatches(para, highlightText) : para}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  accordionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chevron: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionContentContainer: {
    overflow: 'hidden',
  },
  accordionContent: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  paragraph: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 22,
  },
});
