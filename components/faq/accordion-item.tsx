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
  /**
   * Now accepts strings **or** React nodes, so you can
   * do things like `<Text onPress={…}>App Store</Text>` in your steps.
   */
  content: Array<string | React.ReactNode>;
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
    setIsExpanded((prev) => !prev);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.accordionContainer}>
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

      {isExpanded && (
        <View style={styles.accordionContentContainer}>
          <View style={styles.accordionContent}>
            {content.map((item, idx) => {
              // -- if it's a string, highlight and wrap in <Text>
              if (typeof item === 'string') {
                const children = highlightText
                  ? highlightMatches(item, highlightText)
                  : item;
                return (
                  <Text key={idx} style={styles.paragraph}>
                    {children}
                  </Text>
                );
              }

              // -- if it's already a React node, render it directly
              return <View key={idx}>{item}</View>;
            })}
          </View>
        </View>
      )}
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
    fontFamily: 'Poppins_600SemiBold',
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
    fontFamily: 'Poppins_400Regular',
  },
});
