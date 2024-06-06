import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, TextInput, TouchableOpacity, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '@/components/CustomHeader';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

export default function Fal() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [isBotTyping, setIsBotTyping] = useState(true);
  const [zodiacSign, setZodiacSign] = useState('Avatar');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [deviceId, setDeviceId] = useState(route.params?.deviceId || null);
  const [showPaywall, setShowPaywall] = useState(false); // Yeni state

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const getDeviceId = async () => {
      try {
        let id = await SecureStore.getItemAsync('deviceId');
        if (!id) {
          id = uuidv4();
          await SecureStore.setItemAsync('deviceId', id);
        }
        setDeviceId(id);
        console.log('Device ID:', id);
      } catch (error) {
        console.error('Error getting or setting device ID', error);
      }
    };

    if (!deviceId) {
      getDeviceId();
    }
  }, [deviceId]);

  useEffect(() => {
    if (deviceId) {
      setIsBotTyping(true);
      setShowInput(false); // Input'u inaktif yap
  
      axios.get('https://madampep-backend.vercel.app/api/ai-response', {
        params: { deviceId }
      })
      .then(response => {
        const aiMessage = response.data.message;
        console.log('AI Response:', aiMessage); // Log AI response
        const messageParagraphs = aiMessage.split('\n').filter(paragraph => paragraph.trim() !== '');
        const formattedMessages = messageParagraphs.map((paragraph, index) => ({
          id: `ai-${index}-${Date.now()}`,
          text: paragraph,
          sender: 'bot'
        }));
  
        showMessagesSequentially(formattedMessages);
      })
      .catch(error => {
        console.error('Error fetching AI response:', error);
      });
    }
  }, [deviceId]);
  

  const showMessagesSequentially = (messages) => {
    messages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prevMessages => {
          const updatedMessages = [
            ...prevMessages, 
            { ...message, isTyping: true }
          ];
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
          return updatedMessages;
        });
        setTimeout(() => {
          setMessages(prevMessages => {
            const updatedMessages = prevMessages.map(m => 
              m.id === message.id ? { ...m, isTyping: false } : m
            );
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
            return updatedMessages;
          });
          if (index === messages.length - 1) {
            setIsBotTyping(false);
            setIsLoadingMessages(false);
            setShowInput(true); // İlk mesajlar geldikten sonra input alanını aktif yap
          }
        }, 2000);
      }, index * 4000);
    });
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardVisible(true);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const sendMessage = async (text) => {
    if (text.trim()) {
      const userMessage = { id: `user-${Date.now()}`, text, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');
      setShowPaywall(true); // Paywall'u göster
      setShowInput(false); // Input'u gizle
    }
  };

  const handlePaywallClick = async () => {
    setShowPaywall(false); // Paywall'u gizle
    setIsBotTyping(true);

    try {
      const response = await axios.post('https://madampep-backend.vercel.app/api/short-message', {
        deviceId,
        inputs: [{ question: 'Kullanıcı Mesajı', answer: input }]
      });
      const aiMessage = response.data.message;
      console.log('AI Response:', aiMessage); // Log AI response
      const messageParagraphs = aiMessage.split('\n').filter(paragraph => paragraph.trim() !== '');
      const formattedMessages = messageParagraphs.map((paragraph, index) => ({
        id: `ai-${index}-${Date.now()}`,
        text: paragraph,
        sender: 'bot'
      }));
      showMessagesSequentially(formattedMessages);
    } catch (error) {
      console.error('Error sending data:', error);
      setIsBotTyping(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer, 
      item.sender === "user" ? styles.userMessage : styles.botMessage,
      item.isSpecial && styles.specialMessage
    ]}>
      {item.sender === "bot" && <View style={styles.circle} />}
      <View style={[styles.messageBubble, item.isTyping && styles.typingAnimation]}>
        {item.isTyping ? (
          <LottieView
            source={require('../assets/typing_animation.json')}
            autoPlay
            loop
            style={{ width: 40, height: 40 }}
          />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
      {item.sender === "user" && <View style={styles.circle} />}
    </View>
  );

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
     <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.safeArea}>
          <CustomHeader isBotTyping={isBotTyping} />
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              style={styles.messageList}
              contentContainerStyle={[styles.messageListContent, { paddingBottom: keyboardHeight }]}
            />
            {showPaywall && ( // showPaywall state'ine göre lokumikramet.png'yi göster
              <TouchableOpacity 
                onPress={handlePaywallClick} 
                style={styles.paywallContainer}
                disabled={isLoadingMessages}
              >
                <Image source={require('../assets/images/lokumikramet.png')} style={styles.paywallImage} />
              </TouchableOpacity>
            )}

            {showInput && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Mesajınızı yazın..."
                  placeholderTextColor="#888"
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={() => sendMessage(input)}
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(input)}>
                  <Text style={styles.sendButtonText}>Gönder</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  paywallContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 350, // Height değerini azaltın
    backgroundColor: 'rgba(0, 0, 0, 0)', // Arka planı şeffaf yapmak için

  },
  
paywallImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
},

  paywallBox: {
    backgroundColor: 'rgba(66, 66, 66, 0.05)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)',
    height: 100,
  },
  
  paywallTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CDC3AB',
    marginBottom: 10,
  },
  paywallSubtitleContainer: {
    borderWidth: 1,
    borderColor: '#883AC5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  paywallSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CDC3AB',
    textAlign: 'center',
  },
  paywalSeansContainer: {
    backgroundColor: 'white'
  },
  paywallText: {
    fontSize: 14,
    color: '#CDC3AB',
    textAlign: 'center',
    marginBottom: 10,
  },
  paywallButtonContainer: {
    backgroundColor: 'rgba(136, 58, 197, 0.15)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#883AC5',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  paywallButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  paywallButtonText: {
    color: '#CDC3AB',
    fontSize: 16,
    fontWeight: 'bold',
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
    alignItems: 'center',
    marginVertical: 5,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  circle: {
    width: 0,
    height: 0,
    borderRadius: 10,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
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
  specialMessage: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    padding: 10,
    borderRadius: 20,
    margin: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: 'white',
    borderRadius: 20,
    backgroundColor: '#2e2e2e',
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#883AC5',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'DavidLibre'
  },

  paywallImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

