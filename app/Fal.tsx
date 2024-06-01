import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, TextInput, TouchableOpacity, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '@/components/CustomHeader';
import axios from 'axios';

export default function Fal() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [zodiacSign, setZodiacSign] = useState('Avatar');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true); // Yeni durum ekleyin

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    axios.get('https://madampep-backend.vercel.app/api/ai-response')
      .then(response => {
        const aiMessage = response.data.message;
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
  }, []);
  
  
  
  const showMessagesSequentially = (messages) => {
    setIsBotTyping(true);
    messages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, { ...message, isTyping: true }];
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
          return updatedMessages;
        });
        setTimeout(() => {
          setMessages(prevMessages => {
            const updatedMessages = prevMessages.map(m => m.id === message.id ? { ...m, isTyping: false } : m);
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
            return updatedMessages;
          });
          if (index === messages.length - 1) {
            setIsBotTyping(false);
            setIsLoadingMessages(false); // Mesajlar yüklendiğinde güncelleyin
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
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
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
      setIsBotTyping(true);
  
      try {
        const response = await axios.post('https://madampep-backend.vercel.app/api/short-message', {
          inputs: [{ question: 'Kullanıcı Mesajı', answer: text }]
        });
        const aiMessage = response.data.message;
        const messageParagraphs = aiMessage.split('\n').filter(paragraph => paragraph.trim() !== '');
        const formattedMessages = messageParagraphs.map((paragraph, index) => ({
          id: `ai-${index + userMessage.id}-${Date.now()}`,
          text: paragraph,
          sender: 'bot'
        }));
        showMessagesSequentially(formattedMessages);
      } catch (error) {
        console.error('Error sending data:', error);
        setIsBotTyping(false);
      }
    }
  };
  
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer, 
      item.sender === "user" ? styles.userMessage : styles.botMessage,
      item.isSpecial && styles.specialMessage
    ]}>
      {item.sender === "bot" && <View style={styles.circle} />}
      <View style={[styles.messageBubble, item.text === '...' && styles.typingAnimation]}>
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
    keyExtractor={item => item.id.toString()}
    style={styles.messageList}
    contentContainerStyle={{ paddingBottom: keyboardHeight + 20 }}
    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
    onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
  />
  {!showInput && (
    <TouchableOpacity 
      onPress={() => setShowInput(true)}  // `true` olarak değiştirildi
      style={styles.paywallContainer}
      disabled={isLoadingMessages} // Mesajlar yüklenirken buton devre dışı
    >
      <Image source={require('../assets/images/lokumikramet.png')} style={styles.paywallImage} />
    </TouchableOpacity>
  )}
  {showInput && (
    <View style={[styles.inputContainer, { marginBottom: keyboardHeight }]}>
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
    fontFamily: 'DavidLibre',
  },
  paywallImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paywallImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

