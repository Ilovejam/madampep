import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, ImageBackground, TouchableOpacity, Alert, Image, Modal, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import CustomHeader from '../components/CustomHeader';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

export default function Falla() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(900); // 900 saniye = 15 dakika
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          router.push('/Fal'); // Süre bitince Fal ekranına yönlendir
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [router]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 10000, // 10 saniye içinde 180 derece dönecek
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSpeedUpPress = () => {
    Alert.alert('Reklam İzle', 'Örnek bir reklam izliyorsunuz...', [
      { text: 'Tamam', onPress: () => setTimer(10) }
    ]);
  };

  const handleLokumlaPress = () => {
    setModalVisible(true);
  };

  const handleModalPress = () => {
    setModalVisible(false);
    router.push('/Fal');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
        <CustomHeader />

        <View style={styles.sandTimerContainer}>
          <LottieView
            source={require('../assets/kumsaati.json')}
            autoPlay
            loop
            style={styles.sandTimer}
          />
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
          <View style={styles.speedUpContainer}>
            <View style={styles.speedUpButtons}>
              <TouchableOpacity style={styles.speedUpButton} onPress={handleSpeedUpPress}>
                <Image source={require('../assets/images/videola.png')} style={styles.buttonImage} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.speedUpButton} onPress={handleLokumlaPress}>
                <Image source={require('../assets/images/lokumla.png')} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={handleModalPress}>
            <BlurView intensity={50} style={styles.blurView}>
              <Image source={require('../assets/images/paywall.png')} style={styles.paywallImage} />
            </BlurView>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  sandTimerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sandTimer: {
    width: 300,
    height: 300,
  },
  timerText: {
    color: 'white',
    fontSize: 30,
    marginVertical: 10,
  },
  speedUpContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  speedUpButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  speedUpButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  blurView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paywallImage: {
    width: '80%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: -290,
  },
});
