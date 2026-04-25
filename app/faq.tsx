import React, { useState } from 'react';

import DrawerScreen from '@/components/drawer-screen';
import FAQCategorySection from '@/components/faq/faq-category-section';
import SearchBar from '@/components/faq/faq-search-bar';
import { Colors } from '@/constants/Colors';
import { FAQ_DATA } from '@/constants/faq';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FAQScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(FAQ_DATA);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredData(FAQ_DATA);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = FAQ_DATA.map((category) => {
      const filteredItems = category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.content.some((paragraph) =>
            paragraph.toLowerCase().includes(lowercaseQuery)
          )
      );
      return {
        ...category,
        items: filteredItems,
      };
    }).filter((category) => category.items.length > 0);
    setFilteredData(filtered);
  };

  return (
    <DrawerScreen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>FAQ</Text>
        </View>
        <SearchBar onSearch={handleSearch} value={searchQuery} />
        {filteredData.length > 0 ? (
          filteredData.map((category, index) => (
            <FAQCategorySection
              key={index}
              category={category.category}
              items={category.items}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No results found for "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 16,
    overflow: 'visible',
  },
  pageTitle: {
    color: '#FFEB3B',
    fontFamily: 'SofachromeIt',
    fontSize: 38,
    letterSpacing: 1,
    paddingRight: 8,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
    color: Colors.light.text,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
