import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SettingsScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Image source={require('../assets/icons/right-arrow.png')} style={[styles.backIcon, styles.rotatedIcon]} />
          </TouchableOpacity>
        </View>
        <View style={styles.overlay}>
          <Image source={require('../assets/icons/settings-big.png')} style={styles.settingsIcon} />
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem}>
              <Image source={require('../assets/icons/notifications.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Bildirimler</Text>
              <Image source={require('../assets/icons/right-arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image source={require('../assets/icons/rate.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Bize Oy Ver</Text>
              <Image source={require('../assets/icons/right-arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image source={require('../assets/icons/language.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Dil Ayarları</Text>
              <Image source={require('../assets/icons/right-arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image source={require('../assets/icons/write.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Bize Yaz</Text>
              <Image source={require('../assets/icons/right-arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Image source={require('../assets/icons/delete.png')} style={styles.menuIcon} />
              <Text style={styles.menuText}>Hesabı Sil</Text>
              <Image source={require('../assets/icons/right-arrow.png')} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: height * 0.05,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: width * 0.05,
    zIndex: 2,
  },
  backButton: {},
  backIcon: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
  rotatedIcon: {
    transform: [{ rotate: '180deg' }],
  },
  overlay: {
    position: 'absolute',
    top: height * 0.1,
    backgroundColor: 'rgba(66, 66, 66, 0.05)',
    width: '90%',
    height: '75%',
    borderColor: 'rgba(205, 195, 171, 0.15)',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  settingsIcon: {
    width: width * 0.15,
    height: width * 0.15,
    tintColor: '#CDC3AB',
    marginBottom: height * 0.03,
    resizeMode: 'contain',
  },
  menu: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(66, 66, 66, 0.05)',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)',
  },
  menuIcon: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#CDC3AB',
    marginRight: width * 0.03,
    resizeMode: 'contain',
  },
  menuText: {
    color: '#FBEFD1',
    fontSize: width * 0.045,
    fontFamily: 'DavidLibre',
    flex: 1,
  },
  arrowIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#CDC3AB',
    resizeMode: 'contain',
  },
});
