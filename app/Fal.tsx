import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, TextInput, TouchableOpacity, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '@/components/CustomHeader';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import { Audio } from 'expo-av';
import { Buffer } from 'buffer';

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
  const messageHeights = useRef({});

  const isPlaying = useRef(false);
  
  const soundRef = useRef(new Audio.Sound());
  const messageQueue = useRef([]);
  const XI_API_KEY = 'f9dbeae10b73feaf8374ee06837c40c8';
  const VOICE_ID = 'OVZaeezkMlYaC2nWNJoy'; // Türkçe ses kimliği

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
      setIsBotTyping(true); // Typing animasyonunu başlat
      setShowInput(false); // Input'u inaktif yap
  
      // İlk başta "typing" mesajı ekle
      setMessages([{ id: 'typing', isTyping: true, sender: 'bot' }]);
  
      axios.get('https://madampep-backend.vercel.app/api/ai-response', {
        params: { deviceId }
      })
      .then(response => {
        const aiMessage = response.data.message;
        console.log('AI Response:', aiMessage); // Log AI response
        const messageParagraphs = aiMessage.split('\n').filter(paragraph => paragraph.trim() !== '');
        const additionalMessages = messageParagraphs.map((paragraph, index) => ({
          id: `ai-${index}-${Date.now()}`,
          text: paragraph,
          sender: 'bot'
        }));
  
        sendDelayedMessages(additionalMessages, () => {
          setShowInput(true); // Mesajlar geldikten sonra input'u aktif yap
        });
      })
      .catch(error => {
        console.error('Error fetching AI response:', error);
        setIsBotTyping(false); // Hata durumunda typing animasyonunu durdur
      });
    }
  }, [deviceId]);
  
  
  

  
  
  const sendDelayedMessages = async (messages, callback) => {
    if (messages.length === 0) {
      setIsBotTyping(false);
      return;
    }
  
    for (let index = 0; index < messages.length; index++) {
      const message = messages[index];
  
      // Her mesajdan önce typing animasyonunu başlat
      setMessages(prevMessages => [
        ...prevMessages.filter(msg => !msg.isTyping), // Önceki typing mesajını temizle
        { id: `typing-${index}`, isTyping: true, sender: 'bot' } // Yeni typing mesajı ekle
      ]);
  
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
  
      // Animasyonun görünmesi için kısa bir süre bekle
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      // Ses dosyasını önceden yükle
      const audioData = await convertTextToSpeech(message.text, XI_API_KEY, VOICE_ID);
      if (!audioData) {
        console.error('Ses dosyası yüklenemedi');
        continue;
      }
  
      // Typing animasyonunu kaldır ve gerçek mesajı ekle
      setMessages(prevMessages => [
        ...prevMessages.filter(msg => !msg.isTyping),
        { id: `msg-${Date.now()}`, text: message.text, sender: 'bot' }
      ]);
  
      // Mesajı gösterdikten sonra hemen sesi oynat ve bitene kadar bekle
      await playSound(audioData);
  
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  
    setIsBotTyping(false);
    if (callback) callback();
  };
  



const processQueue = async () => {
  while (messageQueue.current.length > 0 && !isPlaying.current) {
      isPlaying.current = true;
      const nextMessage = messageQueue.current.shift();

      const audioData = await convertTextToSpeech(nextMessage.text, XI_API_KEY, VOICE_ID);
      if (audioData) {
          await playSound(audioData);
          setMessages(prevMessages => [
              ...prevMessages,
              { id: `msg-${Date.now()}`, text: nextMessage.text, sender: 'bot' }
          ]);
          flatListRef.current.scrollToEnd({ animated: true });
      } else {
          console.error('Ses dosyası yüklenemedi');
          isPlaying.current = false;
      }
  }
};

  
  const convertTextToSpeech = async (text, apiKey, voiceId) => {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  
    const headers = {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    };
  
    const data = {
      text,
      "model_id": "eleven_multilingual_v2",
      "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.5,
        "style": 0.0,
        "use_speaker_boost": true
      }
    };
  
    try {
      const response = await axios.post(url, data, { headers, responseType: 'arraybuffer' });
      return response.data;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      return null;
    }
  };

  const playSound = async (audioData) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      await soundRef.current.loadAsync({ uri: `data:audio/mpeg;base64,${Buffer.from(audioData).toString('base64')}` });
      await soundRef.current.playAsync();
      await new Promise((resolve) => {
        soundRef.current.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            isPlaying.current = false;
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      isPlaying.current = false;
    }
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

  // Kullanıcı mesajını gönder ve paywall'u göster
  const sendMessage = async (text) => {
    if (text.trim()) {
      const userMessage = { id: `user-${Date.now()}`, text, sender: 'user' };
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, userMessage];
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100); // FlatList'in yeni mesajları render etmesi için kısa bir süre bekle
        return newMessages;
      });
      setInput('');
      setIsBotTyping(true);
      setShowInput(false); // Input'u gizle
      setShowPaywall(true); // Paywall'ı göster
  
      try {
        const response = await axios.post('https://madampep-backend.vercel.app/api/short-message', {
          deviceId,
          inputs: [{ question: 'Kullanıcı Mesajı', answer: text }]
        });
        const aiMessage = response.data.message;
        const messageParagraphs = aiMessage.split('\n').filter(paragraph => paragraph.trim() !== '');
        const formattedMessages = messageParagraphs.map((paragraph, index) => ({
          id: `ai-${index}-${Date.now()}`,
          text: paragraph,
          sender: 'bot'
        }));
        sendDelayedMessages(formattedMessages, () => {
          setShowInput(true); // Mesajlar geldikten sonra input'u göster
        });
      } catch (error) {
        console.error('Error sending data:', error);
        setIsBotTyping(false);
      }
  
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 0);
    }
  };
  
  
  
  

  
  

// Paywall'a tıklandığında çağrılan fonksiyon
const handlePaywallClick = () => {
  console.log('Paywall clicked'); // Konsola tıklanıldığını yazdır
  setShowPaywall(false); // Paywall'u ekrandan kaldır
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

  
  const handleBackPress = () => {
    if (soundRef.current) {
      soundRef.current.stopAsync();  // Çalan sesi durdur
    }
    
    navigation.navigate('Dashboard');  // Kullanıcıyı Dashboard ekranına yönlendir
  };
  

  

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
   <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
      <CustomHeader isBotTyping={isBotTyping} onBackPress={handleBackPress} />
        <View style={{ flex: 1 }}>
        <FlatList
  ref={flatListRef}
  data={messages}
  renderItem={renderMessage}
  keyExtractor={item => item.id.toString()}
  style={styles.messageList}
  contentContainerStyle={{ paddingBottom: 80 }} // Alt kısma boşluk ekleyin
  onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
  onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
/>




         {showPaywall && (
  <TouchableOpacity 
    onPress={handlePaywallClick} 
    style={styles.paywallContainer}
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

