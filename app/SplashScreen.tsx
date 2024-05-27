import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';

export default function SplashScreen({ onAnimationEnd }) {
  const animationRef = useRef(null);
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function playSound() {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/madampep.mp3')
      );
      await sound.playAsync();

      // 7 saniye sonra müziği durdur ve UploadImage ekranına geç
      setTimeout(() => {
        sound.unloadAsync();
        onAnimationEnd();
      }, 7000);
    }

    playSound();

    // İlk yazı animasyonu
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (animationRef.current) {
      animationRef.current.play();
    }
  }, [textOpacity, onAnimationEnd]);

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <LottieView
            ref={animationRef}
            source={require('../assets/Mandala2.json')}
            autoPlay
            loop
            style={styles.mandalaAnimation}
          />
          <LottieView
            ref={animationRef}
            source={require('../assets/eye.json')}
            autoPlay
            loop
            style={styles.eyeAnimation}
          />
        </View>
        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.title}>Selam tatlım!</Text>
          <Text style={styles.text}>
            Gizem perdesini arala,{'\n'}
            ışıkların arasından geç,{'\n'}
            gel sırlarını keşfedelim!
          </Text>
        </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginTop: 80,
  },
  mandalaAnimation: {
    width: '100%',
    height: '100%',
  },
  eyeAnimation: {
    position: 'absolute',
    top: '30%',
    left: '28%',
    width: '45%',
    height: '45%',
  },
  title: {
    color: '#FBEFD1',
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'DavidLibre',
  },
  text: {
    color: '#FBEFD1',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'DavidLibre',
    marginTop: 10,
  },
});
