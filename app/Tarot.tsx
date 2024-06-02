import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import LottieView from 'lottie-react-native';

export default function Tarot() {
  const allMessages = [
    { id: '1', text: 'Kartlar, Geleceğini kartlardan okumak..' },
    { id: '2', text: 'Ben de danışanlarıma bu imkanları sunmak istiyorum ama az beklememiz gerekiyor.' },
    { id: '3', text: 'Bana biraz zaman tanı' },
    { id: '4', text: 'Hazır olduğumda sana haber vericem…' },
  ];
  const navigation = useNavigation();

  const [messages, setMessages] = useState([{ id: '0', text: '...', isTyping: true }]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    let timeout;
    const addMessages = (index) => {
      if (index < allMessages.length) {
        timeout = setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, prevMessages.length - 1),
            allMessages[index],
            { id: `loading-${index + 1}`, text: '...', isTyping: true },
          ]);
          addMessages(index + 1);
        }, 2000);
      } else {
        setMessages((prevMessages) => prevMessages.slice(0, prevMessages.length - 1));
      }
    };

    addMessages(0);

    return () => clearTimeout(timeout);
  }, []);

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.isTyping ? styles.typingBubbleContainer : styles.messageBubbleContainer]}>
      <View style={[styles.messageBubble, item.isTyping && styles.typingBubble]}>
        {item.isTyping ? (
          <LottieView
            source={require('../assets/typing_animation.json')}
            autoPlay
            loop
            style={styles.typingAnimation}
          />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
    </View>
  );
  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader />
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        />
        <View style={styles.sandTimerContainer}>
          <LottieView
            source={require('../assets/kumsaati.json')}
            autoPlay
            loop
            style={styles.sandTimer}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  messageList: {
    flex: 1,
    width: '100%',
  },
  messageListContent: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  messageBubbleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 20,
    minHeight: 40,
    alignSelf: 'flex-start',
  },
  typingBubbleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  messageBubble: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    padding: 5, // Ekstra küçük boyut için padding ekleyin
  },

  messageText: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre',
  },
  typingAnimation: {
    width: 40,
    height: 40,
  },
  sandTimerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  sandTimer: {
    width: 250,
    height: 250,
  },
});

