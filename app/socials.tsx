import React, { useEffect, useState } from 'react';

import SocialsPageBanner from '@/components/banners/socials-banner';
import DrawerScreen from '@/components/drawer-screen';
import { Colors } from '@/constants/Colors';
import { SOCIALS } from '@/constants/socials';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SocialsPage() {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  useEffect(() => {
    const updateLayout = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    Dimensions.addEventListener('change', updateLayout);
    return () => {
      const subscription = Dimensions.addEventListener('change', updateLayout);
      subscription.remove();
    };
  }, []);
  const isSmallScreen = screenWidth < 375;

  const open = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  };

  return (
    <DrawerScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bannerWrapper}>
          <SocialsPageBanner />
        </View>
        {SOCIALS.map(({ label, handle, url, icon }, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.row,
              isSmallScreen && styles.smallScreenRow,
              i === SOCIALS.length - 1 && { borderBottomWidth: 0 },
            ]}
            activeOpacity={0.7}
            onPress={() => open(url)}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome6
                name={icon as any}
                size={25}
                color={Colors.light.action}
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[styles.label, isSmallScreen && styles.smallScreenLabel]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {label.toUpperCase()}
              </Text>
              <Text
                style={[
                  styles.handle,
                  isSmallScreen && styles.smallScreenHandle,
                ]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {handle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.light.text,
    fontFamily: 'Rye_400Regular',
  },
  underline: {
    height: 1,
    backgroundColor: Colors.light.text,
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1.25,
    borderBottomColor: Colors.light.text,
  },
  smallScreenRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'Poppins_700Bold',
  },
  handle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.action,
    fontFamily: 'Poppins_700Bold',
    marginLeft: 8,
  },
  smallScreenLabel: {
    fontSize: 16,
  },
  smallScreenHandle: {
    fontSize: 16,
  },
});
