import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Text, TextInput, TouchableOpacity, FlatList, Keyboard, Animated, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
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
  const [messages, setMessages] = useState([
    { id: 1, text: "Vaay... Güzel fincan! Ama önce seni biraz tanımam gerek...", sender: "bot" },
    { id: 2, text: "Adını alabilir miyim? Geleceğini görmem için bana o harfler lazım...", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [userInputs, setUserInputs] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

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
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = (text, sender = "user") => {
    if (text.trim()) {
      setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text, sender }]);
      setInput('');
    }
  };

  const sendDelayedMessages = (messages, callback) => {
    messages.forEach((message, index) => {
      setTimeout(() => {
        sendMessage(message.text, message.sender);
        if (index === messages.length - 1 && callback) {
          setTimeout(callback, 1000);
        }
      }, 1000 * (index + 1));
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
    
    // Tarih formatına göre ayrıştırma işlemi, gün ve ayın doğru şekilde alındığından emin olun
    const [day, month, year] = formattedDate.split('.').map(Number);
    console.log('Parsed Date:', { day, month, year }); // Debugging

    const zodiac = getZodiacSign(day, month);
    console.log('Calculated Zodiac:', zodiac); // Debugging
    console.log('Zodiac Image Key:', zodiacSigns[zodiac]); // Debugging
    
    // setZodiacSign'i kullanarak güncelle
    setZodiacSign(zodiacSigns[zodiac] || 'Avatar'); // Eğer bilinmeyen bir burçsa Avatar olarak ayarla
    setShowJobOptions(true);
    sendDelayedMessages([{ text: "Ne iş yapıyorsun?", sender: "bot" }]);
};




  const handleJobOptionSubmit = (option) => {
    sendMessage(option, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Meslek", answer: option }]);
    setShowJobOptions(false);
    sendDelayedMessages([
      { text: "Hazırız sanırım.", sender: "bot" },
      { text: "Bana biraz zaman ver. Fincanına odaklanmam lazım...", sender: "bot" }
    ], async () => {
      console.log(userInputs);
      try {
        const response = await axios.post('https://madampep-backend.vercel.app/api/message', {
          inputs: userInputs
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error sending data:', error);
      }
      navigation.replace('Falla');
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
          <CustomHeader zodiacSign={zodiacSign} />
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
            ) : step === 2 ? (
              <View style={styles.genderContainer}>
                <Animated.View style={styles.genderRow}>
                  <TouchableOpacity style={styles.genderButton} onPress={() => handleGenderSubmit("Kadın")}>
                    <Text style={styles.buttonText}>Kadın</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.genderButton} onPress={() => handleGenderSubmit("Erkek")}>
                    <Text style={styles.buttonText}>Erkek</Text>
                  </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity style={[styles.genderButton, styles.fullWidthButton]} onPress={() => handleGenderSubmit("Bunların dışında bir tanım")}>
                  <Text style={styles.buttonText}>Bunların dışında bir tanım</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {showDatePicker && (
              <>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  style={styles.datePicker}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleDateSubmit}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
            {showJobOptions && (
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
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
    fontSize: 16,
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
    marginBottom: 20,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderButton: {
    backgroundColor: '#444',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  fullWidthButton: {
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  datePicker: {
    backgroundColor: '#2e2e2e',
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 20,
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
  },
  jobOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  jobOptionButton: {
    backgroundColor: '#444',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
});
