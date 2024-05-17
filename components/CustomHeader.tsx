// CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CustomHeader() {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Image source={require('../assets/images/eye.png')} style={styles.headerImage} />
        <View>
          <Text style={styles.headerTitle}>Madampep</Text>
          <Text style={styles.headerSubtitle}>online</Text>
        </View>
      </View>
      <Image source={require('../assets/images/frame.png')} style={[styles.profileImage, styles.marginRight]} />
      <Image source={require('../assets/images/Avatar.png')} style={styles.profileImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  headerImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre-Regular',
  },
  headerSubtitle: {
    color: 'green',
    fontSize: 12,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  marginRight: {
    marginRight: 10, // İki resim arasına boşluk bırakın
  },
});
