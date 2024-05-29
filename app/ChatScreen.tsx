import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Modal, View, ImageBackground, Text, TextInput, TouchableOpacity, FlatList, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CustomHeader from '@/components/CustomHeader';
import * as ImagePicker from 'expo-image-picker';
import UploadImage from './UploadImage';


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
  const [showRelationshipOptions, setShowRelationshipOptions] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photos, setPhotos] = useState([]);

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
      { id: `msg-1-${Date.now()}`, text: "Selam Yabancı ", sender: "bot" },
      { id: `msg-2-${Date.now()}`, text: "Kahveler içildi ise, şimdi gelelim hoş muhabbete.", sender: "bot" },
      { id: `msg-3-${Date.now()}`, text: "Adını bana bahşeder misin?.", sender: "bot" },
      { id: `msg-4-${Date.now()}`, text: "Geleceğini görmem için o harfler bana lazım...", sender: "bot" }
    ];    

    const addMessages = (index) => {
      if (index < initialMessages.length) {
        timeout = setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, prevMessages.length - 1),
            initialMessages[index],
            { id: `loading-${index + 1}-${Date.now()}`, text: '...', sender: 'bot' },
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
      { id: `loading-${prevMessages.length}-${Date.now()}`, text: '...', sender: 'bot' }
    ]);
  
    messages.forEach((message, index) => {
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages.slice(0, prevMessages.length - 1),
          { id: `msg-${prevMessages.length + 1}-${Date.now()}`, text: message.text, sender: message.sender },
          { id: `loading-${index + 1}-${Date.now()}`, text: '...', sender: 'bot' }
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
      { text: `Güzel isim ${name}...`, sender: "bot" },
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
  
  // const handleJobOptionSubmit = (option) => {
  //   sendMessage(option, "user");
  //   setUserInputs(prevInputs => [...prevInputs, { question: "Meslek", answer: option }]);
  //   setShowJobOptions(false);
  //   sendDelayedMessages([
  //     { text: "Hazırız sanırım.", sender: "bot" },
  //     { text: "Bana biraz zaman ver. Fincanına odaklanmam lazım...", sender: "bot" }
  //   ], async () => {
  //     try {
  //       const response = await axios.post('https://madampep-backend.vercel.app/api/message', {
  //         inputs: userInputs
  //       });
  //       console.log('Response:', response.data);  // Burada response verisini konsola yazdırıyoruz
  //       // response.data'yı Falla ekranına geçirin
  //       navigation.replace('Falla', { response: response.data });
  //     } catch (error) {
  //       console.error('Error sending data:', error);
  //     }
  //   });
  // };
  const handleFalForm = () => {
    sendDelayedMessages([
      { text: "Kahveler içildi ise şimdi gelelim hoş muhabbete.", sender: "bot" },
      { text: "Kahve fincanını benimle paylaş ki, o karanlık telvelerden aydınlık bir yol bulabileyim.", sender: "bot" }
    ], () => setShowUploadButton(true));
  };
  
  const handleJobOptionSubmit = async (option) => {
    sendMessage(option, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Meslek", answer: option }]);
    setShowJobOptions(false);
    sendDelayedMessages([
      { text: "Tamamdır...", sender: "bot" },
      { text: "Peki...", sender: "bot" },
      { text: "Aşk hayatının şu an hangi aşamasındasın?", sender: "bot" }
    ], () => setShowRelationshipOptions(true));
  };
  
  const handleRelationshipOptionSubmit = async (option) => {
    sendMessage(option, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "İlişki Durumu", answer: option }]);
    setShowRelationshipOptions(false);
    sendDelayedMessages([
      { text: "Ne Güzel..", sender: "bot" },
      { text: "En güzel zamanlarındasın.", sender: "bot" },
      { text: "Aşk hayatı senin için mutluluk dolu olsun.", sender: "bot" },
      { text: "Tanışma faslımızın sonuna geldik.", sender: "bot" }
    ], () => {
      sendDelayedMessages([
        { text: "Kahveler içildi ise şimdi gelelim hoş muhabbete.", sender: "bot" },
        { text: "Kahve fincanını benimle paylaş ki, o karanlık telvelerden aydınlık bir yol bulabileyim.", sender: "bot" }
      ], () => setShowUploadButton(true));
    });
  };
  
  const handleUploadPhoto = async () => {
    // Arka planda post işlemi başlat
    axios.post('https://madampep-backend.vercel.app/api/message', {
      inputs: userInputs
    })
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error sending data:', error);
    });
  
    // Popup olarak modal'ı aç
    setShowUploadModal(true);
  };
  
  
  
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 3,
        base64: true,
      });
  
      if (!result.canceled) {
        setPhotos(result.assets.slice(0, 3));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Hata', 'Resim seçerken bir hata oluştu.');
    }
  };

  const handleUploadImageSubmit = () => {
    setShowUploadModal(false);
    setShowUploadButton(false); // Fotoğraf yüklendiğinde butonu gizle
    sendMessage("Yükledim", "user");
    sendDelayedMessages([
      { text: "Hmm", sender: "bot" },
      { text: "Güzel bir fincan.", sender: "bot" },
      { text: "Şimdi bana biraz zaman tanı ki bu karanlık telveden aydınlık bir yol çıkartabileyim...", sender: "bot" }
    ], () => {
      setTimeout(() => {
        navigation.replace('Falla');
      }, 2000);
    });
  };
  
  const handleSubmit = async () => {
    if (photos.length < 1) {
      Alert.alert('Hata', 'En az bir fotoğraf yüklemelisin.');
      return;
    }
  
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append('images', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: `photo_${index}.jpg`,
        });
      });
  
      console.log('Uploading images:', formData);
  
      const response = await axios.post('http://35.228.6.241/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response:', response);
  
      const { predictions } = response.data;
      const allValid = predictions.every(prediction => prediction.isCoffeeCup);
  
      if (!allValid) {
        Alert.alert('Hata', 'Lütfen düzgün resimler yükleyin. Tüm resimler kahve fincanı değil.');
      } else {
        setShowUploadModal(false);
        sendMessage("Yükledim", "user");
        sendDelayedMessages([{ text: "Tamamdır", sender: "bot" }]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      Alert.alert('Hata', `Resimleri yüklerken bir hata oluştu: ${error.message}`);
    }
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
          keyExtractor={item => item.id.toString()} // Benzersiz key değerini kullanın
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
                <TouchableOpacity
      style={[
        styles.sendButton,
        !name.trim() && styles.disabledButton, // Name boşsa disabledButton stilini uygula
      ]}
      onPress={handleNameSubmit}
      disabled={!name.trim()}
    >
      <Ionicons name="send" size={24} color="#FBEFD1" />
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
            {showRelationshipOptions && !isBotTyping && (
              <View style={styles.relationshipOptionsContainer}>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Evliyim")}>
                  <Text style={styles.buttonText}>Evliyim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Nişanlıyım")}>
                  <Text style={styles.buttonText}>Nişanlıyım</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Yok")}>
                  <Text style={styles.buttonText}>Yok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Sevgilim var")}>
                  <Text style={styles.buttonText}>Sevgilim var</Text>
                </TouchableOpacity>
              </View>
            )}
           {showUploadButton && (
              <View style={styles.genderContainer}>
                <TouchableOpacity style={styles.genderButton} onPress={handleUploadPhoto}>
                  <Text style={styles.buttonText}>Kahve Fotoğrafı Yükle</Text>
                </TouchableOpacity>
              </View>
          )}
         <Modal
  animationType="slide"
  transparent={true}
  visible={showUploadModal}
  onRequestClose={() => setShowUploadModal(false)}
>
  <View style={styles.centeredView}>
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <View style={[styles.modalView, { width: '90%', height: '80%' }]}>
        <UploadImage
          onSubmit={handleUploadImageSubmit}
          onClose={() => setShowUploadModal(false)}
        />
      </View>
    </ImageBackground>
  </View>
</Modal>

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
    backgroundColor: '#883AC5',
    borderRadius: 20,
  },
  genderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(66, 66, 66, 0.05)', 
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)', 
    alignSelf: 'center' // Ekranda ortalandı

  },
  genderButton: {
    backgroundColor: 'rgba(205, 195, 171, 0.05)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '80%',
  },
  buttonText: {
    color: '#CDC3AB',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'DavidLibre',
  },
  datePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center' // Ekranda ortalandı

  },
  datePicker: {
    width: '100%',
    height: 200,
    backgroundColor: 'transparent',
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#883AC5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'DavidLibre'
  },
  jobOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(66, 66, 66, 0.05)', 
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)', 
    alignSelf: 'center' // Ekranda ortalandı

  },
  jobOptionButton: {
    backgroundColor: 'rgba(205, 195, 171, 0.05)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '90%',
  },
  relationshipOptionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(66, 66, 66, 0.05)', 
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)', 
    alignSelf: 'center' // Ekranda ortalandı
  },  
  relationshipOptionButton: {
    backgroundColor: 'rgba(205, 195, 171, 0.05)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '90%',
  },  
  typingIndicator: {
    color: '#FBEFD1',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'DavidLibre'
  },
  uploadButton: {
    backgroundColor: '#883AC5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'DavidLibre'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeText: {
    color: 'purple',
    fontSize: 16,
    textAlign: 'left',
    margin: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  photoWrapper: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSelected: {
    borderColor: 'yellow',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  controlButton: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  submitImageButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitImageButtonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },


});
