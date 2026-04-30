import React from 'react';

import AccordionItem from '@/components/faq/accordion-item';
import { FAQItem } from '@/types/faq';
import { StyleSheet, Text, View } from 'react-native';

interface FAQCategorySectionProps {
  category: string;
  items: FAQItem[];
  searchQuery?: string;
}

export default function FAQCategorySection({
  category,
  items,
  searchQuery = '',
}: FAQCategorySectionProps) {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{category}</Text>

      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          highlightText={searchQuery}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 22,
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
    marginBottom: 8,
    color: '#FFEB3B',
    paddingBottom: 2,
    letterSpacing: 0.5,
  },
});
