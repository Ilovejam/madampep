import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Text, TextInput, TouchableOpacity, FlatList, Keyboard, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // axios'u import edin
import CustomHeader from '@/components/CustomHeader';

export default function ChatScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Vaay... Güzel fincan! Ama önce seni biraz tanımam gerek...", sender: "bot" },
    { id: 2, text: "Adını alabilir miyim? Geleceğini görmem için bana o harfler lazım...", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [userInputs, setUserInputs] = useState([]); // Kullanıcı girişlerini tutan dizi
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
          callback();
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

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleNameSubmit = () => {
    sendMessage(name, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Adınız", answer: name }]); // Kullanıcı girişini ekle
    setStep(2);
    sendDelayedMessages([
      { text: "Güzel isim...", sender: "bot" },
      { text: "Peki kendini nasıl tanımlıyorsun? Sana hitap edebilmem için bu bilgi önemli.", sender: "bot" }
    ]);
  };

  const handleGenderSubmit = (selectedGender) => {
    setGender(selectedGender);
    setUserInputs(prevInputs => [...prevInputs, { question: "Cinsiyet", answer: selectedGender }]); // Kullanıcı girişini ekle
    setStep(3);
    if (selectedGender === "Kadın") {
      sendMessage("Kadın", "user");
      sendDelayedMessages([
        { text: "İsmin kadar güzelsin...", sender: "bot" },
        { text: "Bu güzellik, ne zamandır bu Dünya’da yaşıyor?", sender: "bot" }
      ], () => setShowDatePicker(true));
    } else if (selectedGender === "Erkek") {
      sendMessage("Erkek", "user");
      sendDelayedMessages([
        { text: "İsmi gibi tam bir beyefendi..", sender: "bot" },
        { text: "Bu beyefendi kaç yıldır bu Dünya denen kürede yaşıyor?", sender: "bot" }
      ], () => setShowDatePicker(true));
    } else {
      sendMessage("Bunların dışında bir tanım", "user");
      sendDelayedMessages([
        { text: "Özgür ve güçlüyüm diyorsun yani...", sender: "bot" },
        { text: "Peki ne zamandır Dünya denen bu mavi küredesin?", sender: "bot" }
      ], () => setShowDatePicker(true));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleDateSubmit = () => {
    setShowDatePicker(false);
    const formattedDate = date.toLocaleDateString();
    sendMessage(`Doğum tarihi: ${formattedDate}`, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Doğum Tarihi", answer: formattedDate }]); // Kullanıcı girişini ekle
    setShowJobOptions(true);
    sendDelayedMessages([{ text: "Ne iş yapıyorsun?", sender: "bot" }]);
  };

  const handleJobOptionSubmit = (option) => {
    sendMessage(option, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Meslek", answer: option }]); // Kullanıcı girişini ekle
    sendDelayedMessages([
      { text: "Hazırız sanırım.", sender: "bot" },
      { text: "Bana biraz zaman ver. Fincanına odaklanmam lazım...", sender: "bot" }
    ], async () => {
      console.log(userInputs); // Tüm kullanıcı girişlerini konsola yazdır
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
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <CustomHeader></CustomHeader>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
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
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleNameSubmit}>
              <Ionicons name="send" size={24} color="#FBEFD1" />
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
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // %5 opaklık
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
  inputContainerShift: {
    marginBottom: 50, // Klavye açıldığında input alanını yukarı kaydır
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
    marginHorizontal: 5, // Butonlar arasındaki boşluk
  },
  fullWidthButton: {
    width: '80%', // Tam genişlikteki buton
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
