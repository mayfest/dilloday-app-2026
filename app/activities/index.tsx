import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import SponsorBoothsBanner from '@/components/banners/sponsor-booths-banner';
import DrawerScreen from '@/components/drawer-screen';
import { Colors } from '@/constants/Colors';
import { SPONSOR_BOOTHS } from '@/constants/sponsor-booths';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const H_GUTTER = 12;
const V_GUTTER = 12;
const CARD_GAP = 8;
const CARD_WIDTH = (width - H_GUTTER * 2 - CARD_GAP) / 2;
const IMAGE_HEIGHT = CARD_WIDTH;
const INFO_BAR_HEIGHT = 90;

export default function SponsorBoothsScreen() {
  const router = useRouter();

  const renderSponsorItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.sponsorCard}
        onPress={() =>
          router.push(
            `/activities/${item.name.replace(/\s+/g, '-').toLowerCase()}`
          )
        }
      >
        <View style={styles.imageContainer}>
          {item.name === 'Pretty Cool Ice Cream' ? (
            <View style={styles.PrettyCoolBackground}>
              <Image
                source={item.logo}
                style={styles.logoImage}
                resizeMode='contain'
              />
            </View>
          ) : (
            <Image
              source={item.logo}
              style={styles.logoImage}
              resizeMode='contain'
            />
          )}
        </View>
        <View style={styles.infoBar}>
          <ThemedText style={styles.infoName} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.infoType}>{item.activity.name}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => (
    <View style={styles.bannerWrapper}>
      <SponsorBoothsBanner />
    </View>
  );

  return (
    <DrawerScreen>
      <FlatList
        data={SPONSOR_BOOTHS}
        keyExtractor={(item) => item.name}
        renderItem={renderSponsorItem}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
      />
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    paddingBottom: 15,
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: H_GUTTER,
    paddingBottom: V_GUTTER * 2,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: V_GUTTER,
  },
  sponsorCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: V_GUTTER,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '85%',
    height: '75%',
  },
  infoBar: {
    height: INFO_BAR_HEIGHT,
    backgroundColor: Colors.light.text,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  infoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  infoType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    paddingTop: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  PrettyCoolBackground: {
    width: 80,
    height: 60,
    padding: 2,
    backgroundColor: '#f297a7',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
