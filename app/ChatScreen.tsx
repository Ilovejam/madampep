import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Text, TextInput, TouchableOpacity, FlatList, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CustomHeader from '@/components/CustomHeader';

const zodiacSigns = {
  'Oğlak': 'capricorn',
  'Kova': 'aquarius',
  'Balık': 'pisces',
  'Koç': 'aries',
  'Boğa': 'taurus',
  'İkizler': 'gemini',
  'Yengeç': 'cancer',
  'Aslan': 'leo',
  'Başak': 'virgo',
  'Terazi': 'libra',
  'Akrep': 'scorpio',
  'Yay': 'sagittarius',
};

function getZodiacSign(day, month) {
  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) return 'Oğlak';
  if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) return 'Kova';
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Balık';
  if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) return 'Koç';
  if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) return 'Boğa';
  if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return 'İkizler';
  if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return 'Yengeç';
  if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) return 'Aslan';
  if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) return 'Başak';
  if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) return 'Terazi';
  if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) return 'Akrep';
  if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) return 'Yay';
  return 'Bilinmiyor';
}

export default function ChatScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [zodiacSign, setZodiacSign] = useState('Avatar');
  const [messages, setMessages] = useState([{ id: 'loading-0', text: '...', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [userInputs, setUserInputs] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [isBotTyping, setIsBotTyping] = useState(true);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    let timeout;
    const initialMessages = [
      { id: 1, text: "Vaay... Güzel fincan! Ama önce seni biraz tanımam gerek...", sender: "bot" },
      { id: 2, text: "Adını alabilir miyim? Geleceğini görmem için bana o harfler lazım...", sender: "bot" }
    ];

    const addMessages = (index) => {
      if (index < initialMessages.length) {
        timeout = setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, prevMessages.length - 1),
            initialMessages[index],
            { id: `loading-${index + 1}`, text: '...', sender: 'bot' },
          ]);
          addMessages(index + 1);
        }, 2000);
      } else {
        setMessages((prevMessages) => prevMessages.slice(0, prevMessages.length - 1));
        setIsBotTyping(false); // Set typing to false after initial messages
      }
    };

    addMessages(0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = (text, sender = "user") => {
    if (text.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text, sender }
      ]);
      setInput('');
    }
  };

  const sendDelayedMessages = (messages, callback) => {
    setIsBotTyping(true); // Set bot typing to true before sending messages

    setMessages(prevMessages => [
      ...prevMessages,
      { id: `loading-${prevMessages.length}`, text: '...', sender: 'bot' }
    ]);

    messages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages.slice(0, prevMessages.length - 1),
          { id: prevMessages.length + 1, text: message.text, sender: message.sender },
          { id: `loading-${index + 1}`, text: '...', sender: 'bot' }
        ]);
        if (index === messages.length - 1) {
          setTimeout(() => {
            setMessages(prevMessages => prevMessages.slice(0, prevMessages.length - 1));
            setIsBotTyping(false); // Set bot typing to false after sending all messages
            if (callback) setTimeout(callback, 1000);
          }, 2000);
        }
      }, 2000 * (index + 1));
    });
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
      {item.sender === "bot" && <View style={styles.circle} />}
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      {item.sender === "user" && <View style={styles.circle} />}
    </View>
  );

  const handleNameSubmit = () => {
    sendMessage(name, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Adınız", answer: name }]);
    setStep(2);
    sendDelayedMessages([
      { text: "Güzel isim...", sender: "bot" },
      { text: "Peki kendini nasıl tanımlıyorsun? Sana hitap edebilmem için bu bilgi önemli.", sender: "bot" }
    ]);
  };

  const handleGenderSubmit = (selectedGender) => {
    setGender(selectedGender);
    setUserInputs(prevInputs => [...prevInputs, { question: "Cinsiyet", answer: selectedGender }]);
    setStep(3);
    const genderMessages = selectedGender === "Kadın"
      ? [
          { text: "İsmin kadar güzelsin...", sender: "bot" },
          { text: "Bu güzellik, ne zamandır bu Dünya’da yaşıyor?", sender: "bot" }
        ]
      : selectedGender === "Erkek"
      ? [
          { text: "İsmi gibi tam bir beyefendi..", sender: "bot" },
          { text: "Bu beyefendi kaç yıldır bu Dünya denen kürede yaşıyor?", sender: "bot" }
        ]
      : [
          { text: "Özgür ve güçlüyüm diyorsun yani...", sender: "bot" },
          { text: "Peki ne zamandır Dünya denen bu mavi küredesin?", sender: "bot" }
        ];
    sendMessage(selectedGender, "user");
    sendDelayedMessages(genderMessages, () => setShowDatePicker(true));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleDateSubmit = () => {
    setShowDatePicker(false);
    const formattedDate = date.toLocaleDateString('tr-TR'); // Türkçe formatında tarih
    sendMessage(`Doğum tarihi: ${formattedDate}`, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Doğum Tarihi", answer: formattedDate }]);
  
    const [day, month] = formattedDate.split('.').map(Number);
    const zodiac = getZodiacSign(day, month);
    setZodiacSign(zodiacSigns[zodiac] || 'Avatar');
  
    let genderSpecificMessage;
    if (gender === "Kadın") {
      genderSpecificMessage = { text: `${zodiac} Burcu Kadını...`, sender: "bot" };
    } else if (gender === "Erkek") {
      genderSpecificMessage = { text: `${zodiac} Burcu Erkeği...`, sender: "bot" };
    } else {
      genderSpecificMessage = { text: `${zodiac} Burcu...`, sender: "bot" }; // Cinsiyet belirtilmemişse genel mesaj
    }
  
    const zodiacMessages = [
      genderSpecificMessage,
      { text: "Ne iş yapıyorsun?", sender: "bot" }
    ];
  
    sendDelayedMessages(zodiacMessages, () => setShowJobOptions(true));
  };
  
  const handleJobOptionSubmit = (option) => {
    sendMessage(option, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Meslek", answer: option }]);
    setShowJobOptions(false);
    sendDelayedMessages([
      { text: "Hazırız sanırım.", sender: "bot" },
      { text: "Bana biraz zaman ver. Fincanına odaklanmam lazım...", sender: "bot" }
    ], async () => {
      try {
        const response = await axios.post('https://madampep-backend.vercel.app/api/message', {
          inputs: userInputs
        });
        console.log('Response:', response.data);  // Burada response verisini konsola yazdırıyoruz
        // response.data'yı Falla ekranına geçirin
        navigation.replace('Falla', { response: response.data });
      } catch (error) {
        console.error('Error sending data:', error);
      }
    });
  };
  
  
  
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
        <CustomHeader zodiacSign={zodiacSign} isBotTyping={isBotTyping} />
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id.toString()}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          />
          {isBotTyping && <Text style={styles.typingIndicator}></Text>}
          <View style={styles.fixedContainer}>
            {step === 1 ? (
              <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerShift]}>
                <TextInput
                  style={styles.input}
                  placeholder="Adınızı yazın..."
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                  onSubmitEditing={handleNameSubmit}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleNameSubmit} disabled={!name.trim()}>
                  <Ionicons name="send" size={24} color={!name.trim() ? '#888' : '#FBEFD1'} />
                </TouchableOpacity>
              </View>
            ) : step === 2 && !isBotTyping ? (
              <View style={styles.genderContainer}>
                <TouchableOpacity style={styles.genderButton} onPress={() => handleGenderSubmit("Kadın")}>
                  <Text style={styles.buttonText}>Kadın</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.genderButton} onPress={() => handleGenderSubmit("Erkek")}>
                  <Text style={styles.buttonText}>Erkek</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.genderButton} onPress={() => handleGenderSubmit("Bunların dışında bir tanım")}>
                  <Text style={styles.buttonText}>Bunların dışında bir tanım</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {showDatePicker && (
              <>
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    textColor="white" // Yazı rengini beyaz yap
                    style={styles.datePicker}
                  />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleDateSubmit}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
            {showJobOptions && !isBotTyping && (
              <View style={styles.jobOptionsContainer}>
                <TouchableOpacity style={styles.jobOptionButton} onPress={() => handleJobOptionSubmit("Okuyorum")}>
                  <Text style={styles.buttonText}>Okuyorum</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.jobOptionButton} onPress={() => handleJobOptionSubmit("Hem çalışıyor hem okuyorum")}>
                  <Text style={styles.buttonText}>Hem çalışıyor hem okuyorum</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.jobOptionButton} onPress={() => handleJobOptionSubmit("Çalışıyorum")}>
                  <Text style={styles.buttonText}>Çalışıyorum</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.jobOptionButton} onPress={() => handleJobOptionSubmit("Çalışmıyorum")}>
                  <Text style={styles.buttonText}>Çalışmıyorum</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ImageBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  },
  messageText: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre'
  },
  fixedContainer: {
    width: '100%',
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: 'white',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#2e2e2e',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  genderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  genderButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '80%',
  },
  buttonText: {
    color: '#CDC3AB',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'DavidLibre',
  },
  datePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  datePicker: {
    width: '100%',
    height: 200,
    backgroundColor: 'transparent',
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'DavidLibre'
  },
  jobOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  jobOptionButton: {
    backgroundColor: '#444',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '100%',
  },
  typingIndicator: {
    color: '#FBEFD1',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'DavidLibre'
  },
});
