import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import CustomHeader from '../components/CustomHeader';

export default function RüyaTabiri() {
  const allMessages = [
    { id: '1', text: 'Benden Rüyalarını Acıklamamı istiyorsun demek..' },
    { id: '2', text: 'Ben de danışanlarımı bu imkanları sunmak istiyorum ama az beklememiz gerekiyor.' },
    { id: '3', text: 'Bana biraz zaman tanı' },
    { id: '4', text: 'Hazır olduğumda sana haber vericem…' },
  ];

  const [messages, setMessages] = useState([{ id: '0', text: '...' }]);
  const navigation = useNavigation();

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
            { id: `loading-${index + 1}`, text: '...' },
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
    <View style={styles.messageBubble}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
        <CustomHeader />
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
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
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black', // Ekranınızın arka plan rengi
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    color: '#FBEFD1',
    fontSize: 20,
    fontFamily: 'DavidLibre-Regular',
    marginHorizontal: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  messageList: {
    flex: 1,
    width: '100%',
  },
  messageListContent: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginVertical: 5,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
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
