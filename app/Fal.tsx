import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, TextInput, TouchableOpacity, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '@/components/CustomHeader';
import axios from 'axios';

export default function Fal() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // AI yanıtını almak için API çağrısı yapın
    axios.get('https://madampep-backend.vercel.app/api/ai-response')
      .then(response => {
        const aiMessage = response.data.message;
        setMessages(prevMessages => [...prevMessages, { id: (prevMessages.length + 1).toString(), text: aiMessage, sender: 'bot' }]);
      })
      .catch(error => {
        console.error('Error fetching AI response:', error);
      });
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const sendMessage = async (text) => {
    if (text.trim()) {
      setMessages(prevMessages => [...prevMessages, { id: (prevMessages.length + 1).toString(), text, sender: 'user' }]);
      setInput('');

      try {
        const response = await axios.post('https://madampep-backend.vercel.app/api/message', {
          inputs: [
            { question: 'Kullanıcı Mesajı', answer: text }
          ]
        });
        const aiMessage = response.data.message;
        setMessages(prevMessages => [...prevMessages, { id: (prevMessages.length + 2).toString(), text: aiMessage, sender: 'bot' }]);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
          <CustomHeader />
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
          />
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
        </ImageBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginVertical: 5,
  },
  userMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // %5 opacity ile beyaz renk
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    color: '#CDC3AB',
    fontSize: 16,
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
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

