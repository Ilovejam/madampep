import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Modal, View, ImageBackground, Text, TextInput, TouchableOpacity, FlatList, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform, Image, Alert, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CustomHeader from '@/components/CustomHeader';
import * as ImagePicker from 'expo-image-picker';
import UploadImage from './UploadImage';
import { BlurView } from 'expo-blur';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values'; 
import * as AV from 'expo-av';
import { decode as atob, encode as btoa } from 'base-64';
import { Audio } from 'expo-av';
import { Buffer } from 'buffer';

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
  const [showJobOptions, setShowJobOptions] = useState(false);
  const [userInputs, setUserInputs] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [isBotTyping, setIsBotTyping] = useState(true);
  const [showRelationshipOptions, setShowRelationshipOptions] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  const { width } = Dimensions.get('window');
  const [loading, setLoading] = useState(false);
  const [falSebebi, setFalSebebi] = useState('');
  const [showFalSebebiInput, setShowFalSebebiInput] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const isSpeaking = useRef(false);
  const soundRef = useRef(new Audio.Sound());
  const messageQueue = useRef([]); // Mesaj kuyruğu
  const isPlaying = useRef(false);
  const XI_API_KEY = 'f9dbeae10b73feaf8374ee06837c40c8';
  const VOICE_ID = 'OVZaeezkMlYaC2nWNJoy'; // Türkçe ses kimliğiniz
  const [sound, setSound] = useState();

  

  
  useEffect(() => {
    const getDeviceId = async () => {
      try {
        let id = await SecureStore.getItemAsync('deviceId');
        if (!id) {
          id = uuidv4();
          await SecureStore.setItemAsync('deviceId', id);
        }
        setDeviceId(id);
        console.log('Device ID:', id); // Device ID'yi konsolda görmek için
      } catch (error) {
        console.error('Error getting or setting device ID', error);
      }
    };

    getDeviceId();
  }, []);

  useEffect(() => {
    async function dd() {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/selam.mp3')
      );
      setTimeout(async () => {
        await sound.playAsync();
      }, 3000); // 2 saniye sonra sesi oynat
    }
  
    dd();
  }, []);
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
    navigation.setOptions({ headerShown: false });
  }, [navigation]);



  const sendMessage = (text) => {
    if (text.trim()) {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, { id: prevMessages.length + 1, text, sender: 'user' }];
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 0);
        return newMessages;
      });
      setInput('');
    }
  };
  

  const playHello = async () => {
    try {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/selam.mp3')
        );
        await sound.playAsync();
        await sound.unloadAsync();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
};

  
useEffect(() => {
  let timeout;
  const initialMessages = [
      { id: `msg-1-${Date.now()}`, text: "Hoş geldin yabancı! Sana hitap edebilmek için ismini öğrenebilir miyim? ", sender: "bot" },
  ];

  const addMessages = (index) => {
      if (index < initialMessages.length) {
          timeout = setTimeout(() => {
              setMessages((prevMessages) => [
                  ...prevMessages.slice(0, prevMessages.length - 1),
                  initialMessages[index],
                  { id: `loading-${index + 1}-${Date.now()}`, text: '...', sender: 'bot' },
              ]);
              if (initialMessages[index].text === "Hoş geldin yabancı! Sana hitap edebilmek için ismini öğrenebilir miyim? ") {
                  playHello(); // Mesaj gösterildiğinde sesi çal
              }
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
  
  const sendDelayedMessages = async (messages, callback) => {
    setIsBotTyping(true); // Set bot typing to true before sending messages
  
    // Eğer gönderilecek mesajlar yoksa typing animasyonunu göstermemek için kontrol ekliyoruz.
    if (messages.length === 0) {
      setIsBotTyping(false);
      return;
    }
    
    for (let index = 0; index < messages.length; index++) {
      const message = messages[index];
  
      // Typing animation eklemek için geçici bir loading mesajı ekliyoruz
      setMessages(prevMessages => [
        ...prevMessages,
        { id: `loading-${prevMessages.length + 1}-${Date.now()}`, text: '...', sender: 'bot' }
      ]);
      flatListRef.current.scrollToEnd({ animated: true }); // Her yeni mesajda listeyi en alta kaydır
  
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekletiyoruz (typing süresi)
  
      setMessages(prevMessages => [
        ...prevMessages.slice(0, prevMessages.length - 1), // Loading mesajını kaldırıyoruz
        { id: `msg-${prevMessages.length + 1}-${Date.now()}`, text: message.text, sender: message.sender }
      ]);
      flatListRef.current.scrollToEnd({ animated: true }); // Her yeni mesajda listeyi en alta kaydır
  
      messageQueue.current.push(message); // Mesajları kuyruğa ekleyin
      await processQueue(); // Kuyruğu işleme başlat ve bitene kadar bekle
  
      if (index === messages.length - 1) {
        setIsBotTyping(false); // Set bot typing to false after sending all messages
        if (callback) setTimeout(callback, 1000);
      }
    }
  };
  

const processQueue = async () => {
  if (messageQueue.current.length > 0 && !isPlaying.current) {
    isPlaying.current = true;
    const nextMessage = messageQueue.current.shift();

    const audioData = await convertTextToSpeech(nextMessage.text, XI_API_KEY, VOICE_ID);
    if (audioData) {
      await playSound(audioData);
    } else {
      isPlaying.current = false;
      processQueue();
    }
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

  
  

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.botMessage,
    item.isSpecial && styles.specialMessage
]}>
      {item.sender === "bot" && <View style={styles.circle} />}
      <View style={styles.messageBubble}>
        {item.text === '...' ? (
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
      {item.sender === "user" && <View style={styles.circle} />}
    </View>
  );
  
  

  const handleNameSubmit = () => {
    sendMessage(name, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Adınız", answer: name }]);
    setStep(2);
    sendDelayedMessages([
      { text: `Memnun oldum ${name}. Ben MadamPep`, sender: "bot" },
      { text: "Fincanın soğurken seni biraz daha yakından tanımama izin ver...", sender: "bot" },
      { text: "Kendini nasıl tanımlıyorsun?", sender: "bot" }

    ]);
  };

  const handleGenderSubmit = (selectedGender) => {
    setGender(selectedGender);
    setUserInputs(prevInputs => [...prevInputs, { question: "Cinsiyet", answer: selectedGender }]);
    setStep(3);
    const genderMessages = selectedGender === "Kadın"
      ? [
          { text: "Biz bizeyiz demek, yaşasın!", sender: "bot" },
          { text: "Gelelim burcuna… Ne zaman doğdun?", sender: "bot" }
        ]
      : selectedGender === "Erkek"
      ? [
          { text: "Tecrübelerime göre erkekler fala biraz daha şüpheci yaklaşıyor, senin için de durum buysa, bugün iş başa düştü demektir…", sender: "bot" },
          { text: "Gelelim burcuna… Ne zaman doğdun?", sender: "bot" }
        ]
      : [
          { text: "Ahahaah deme ya", sender: "bot" },
          { text: "Gelelim burcuna… Ne zaman doğdun?", sender: "bot" }
        ];
    sendMessage(selectedGender, "user");
    sendDelayedMessages(genderMessages, () => setShowDatePicker(true));
  };

  

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
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
      { text: getZodiacMessage(zodiac), sender: "bot" }, // Burç mesajını ekle
      { text: "Fincanın iyice soğumuştur artık... Eee.. Tanışma sorularından ne kaldı bir bakalım… Hah! Neyle meşgulsün?", sender: "bot" },

    ];
  
    sendDelayedMessages(zodiacMessages, () => setShowJobOptions(true));
  };

const getZodiacMessage = (zodiac) => {
  switch (zodiac) {
    case 'Koç':
      return "Bir koç burcu olarak merakla odaklandığını görebiliyorum. Bugün bütün iyi enerjiler senin için çalışacak.";
    case 'Boğa':
      return "Hmm… Boğa… Hayattan keyif almak senin için sanat. Şimdi bu kahve keyfini bir falla süsleyelim.";
    case 'İkizler':
      return "İkizler! Severim. Entelektüel ve esprili birini görmek harika.";
    case 'Yengeç':
      return "Sana ustam mı demeliyim sevgili yengeç? Aramızdaki en psişik kişinin sen olduğu bir gerçek.";
    case 'Aslan':
      return "Bir aslan olarak etrafına yaydığın ışık çok güçlü. Geleceğinin de kişiliğin kadar parlak olması dileğiyle.";
    case 'Başak':
      return "Canım başak burcu. Analitik zekân kadar sezgilerin de kuvvetli. Dilerim falında ilham veren detaylar bulursun.";
    case 'Terazi':
      return "Ooo, terazi… Her zaman bir denge ve uyum arıyorsun. Umarım fincanında da aradığını bulursun.";
    case 'Akrep':
      return "Bir akrep olarak gerçeği keşfetmek en büyük arzun. Bana soruların olacağını şimdiden hissediyorum.";
    case 'Yay':
      return "Yay! İşte her zaman kutunun dışında düşünen biri. Bakalım aynısı fincanın için de geçerli mi?";
    case 'Oğlak':
      return "Hayatta amaçların için ilerlemeyi seviyorsun sevgili oğlak. O zaman buradan falımıza geçelim mi?";
    case 'Kova':
      return "Vizyon sahibi bir kova burcuna fal bakmak heyecan verici. Geleceğini benimle keşfe hazır mısın?";
    case 'Balık':
      return "Canım balık. Büyüleyici bir düş dünyan var. Falında bir sürü fantastik şekil görürsem hiç şaşırmam.";
    default:
      return "";
  }
};

  
  const handleFalForm = () => {
    sendDelayedMessages([
      { text: "Kahve fincanını benimle paylaş ki, o karanlık telvelerden aydınlık bir yol bulabileyim.", sender: "bot" }
    ], () => setShowUploadButton(true));
  };
  
  const handleJobOptionSubmit = async (option) => {
    sendMessage(option, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Meslek", answer: option }]);
    setShowJobOptions(false);

    let jobMessage;
    switch (option) {
        case 'Okuyorum':
            jobMessage = "Umarım öğrencilik sana iyi davranıyordur.";
            break;
        case 'Çalışıyorum':
            jobMessage = "Kendi ayakları üstünde durabilen güçlü birisin demek…";
            break;
        case 'Hem çalışıyor hem okuyorum':
            jobMessage = "Zordan korkmayan biri var galiba karşımda.";
            break;
        case 'Çalışmıyorum':
            jobMessage = "Kendine vakit ayırmak gibisi yok.";
            break;
        default:
            jobMessage = "Bu durumda da bir mesajım var.";
            break;
    }

    sendDelayedMessages([
        { text: jobMessage, sender: "bot" }, // Job message eklendi
        { text: "Peki... Aşk hayatın ne alemde?", sender: "bot" }
    ], () => setShowRelationshipOptions(true));
};

  
const handleRelationshipOptionSubmit = async (option) => {
  sendMessage(option, "user");
  setUserInputs(prevInputs => [...prevInputs, { question: "İlişki Durumu", answer: option }]);
  setShowRelationshipOptions(false);

  let relationshipMessage;
  switch (option) {
      case 'Biri yok':
          relationshipMessage = "Bekarlık sultanlıktır.";
          break;
      case 'Aslında biri var ama...':
          relationshipMessage = "Bakalım falın bu konuda neler söyleyecek...";
          break;
      case 'Karışık':
          relationshipMessage = "Hayatta ne basit ki zaten…";
          break;
      case 'Nişanlıyım':
          relationshipMessage = "Nasıl derler? Allah tamamına erdirsin!";
          break;
      case 'Evliyim':
          relationshipMessage = "Musmutlusunuzdur umarım!";
          break;
      case 'Sevgilim var':
          relationshipMessage = "Harika...";
          break;    
      default:
          relationshipMessage = "Bu durumda da bir mesajım var.";
          break;
  }

  sendDelayedMessages([
    { text: "Peki, geleceğinle ilgili ne merak ediyorsun? Aşk, para, iş, aile, eğitim, sağlık veya başka bi’ şey?", sender: "bot" }
], () => setShowFalSebebiInput(true));

};

  
  const handleFalSebebiSubmit = () => {
    sendMessage(falSebebi, "user");
    setUserInputs(prevInputs => [...prevInputs, { question: "Fal Sebebi", answer: falSebebi }]);
    setShowFalSebebiInput(false);
    sendDelayedMessages([
      { text: "Kahveler içildi ise şimdi gelelim hoş muhabbete.", sender: "bot" },
      { text: "Kahve fincanını benimle paylaş ki, o karanlık telvelerden aydınlık bir yol bulabileyim.", sender: "bot" }
    ], () => setShowUploadButton(true));
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

  const handleUploadPhoto = async () => {
    if (photos.length < 1) {
      Alert.alert('Hata', 'En az bir fotoğraf yüklemelisin.');
      return;
    }
  
    setLoading(true); // Yükleme işlemi başladığında animasyonu göster
  
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
          'Accept': 'application/json',
        },
      timeout: 10000, // 10 saniye zaman aşımı süresi
      });
  
      console.log('Response:', response.data);
  
      const { predictions } = response.data;
      const allValid = predictions.every(prediction => prediction.isCoffeeCup);
  
      if (!allValid) {
        Alert.alert('Hata', 'Lütfen sadece kahve fincanınızın resimlerini yükleyin.');
      } else {
        await axios.post('https://madampep-backend.vercel.app/api/message', {
          deviceId, // Cihaz ID'sini gönder
          inputs: userInputs
        })
        .then(response => {
          console.log('Response:', response.data);
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
  
        setShowUploadButton(false);
        sendMessage("Yükledim", "user");
  
        // Mesajların doğru şekilde gönderildiğini ve gösterildiğini kontrol edin
        sendDelayedMessages([
          { text: "Hmm", sender: "bot" },
          { text: "Güzel bir fincan.", sender: "bot" },
          { text: "Şimdi bana biraz zaman tanı ki bu karanlık telveden aydınlık bir yol çıkartabileyim...", sender: "bot", isSpecial: true }
        ], () => {
          console.log('All messages sent.');
          setTimeout(() => {
            navigation.replace('Falla');
          }, 3000); // 3 saniye bekleme süresi eklendi
        });
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
    } finally {
      setLoading(false); // Yükleme işlemi bittiğinde animasyonu gizle
    }
  };
  
  
const today = new Date();
const fourteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 10));
const [date, setDate] = useState(fourteenYearsAgo);


  
  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader zodiacSign={zodiacSign} isBotTyping={isBotTyping} showFrame={true}  />
        <FlatList
  ref={flatListRef}
  data={messages}
  renderItem={renderMessage}
  keyExtractor={item => item.id.toString()}
  style={styles.messageList}
  contentContainerStyle={{ paddingBottom: 20 }}
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
        textColor="white"
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
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Biri yok")}>
                  <Text style={styles.buttonText}>Biri yok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Sevgilim var")}>
                  <Text style={styles.buttonText}>Sevgilim Var</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Aslında biri var ama...")}>
                  <Text style={styles.buttonText}>Aslında biri var ama...</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Karışık")}>
                  <Text style={styles.buttonText}>Karışık</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Nişanlıyım")}>
                  <Text style={styles.buttonText}>Nişanlıyım</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.relationshipOptionButton} onPress={() => handleRelationshipOptionSubmit("Evliyim")}>
                  <Text style={styles.buttonText}>Evliyim</Text>
                </TouchableOpacity>
              </View>
            )}
          {showFalSebebiInput && (
            <View style={[styles.inputContainer, keyboardVisible && styles.inputContainerShift]}>
              <TextInput
                style={styles.input}
                placeholder="Fal sebebin nedir?"
                placeholderTextColor="#888"
                value={falSebebi}
                onChangeText={setFalSebebi}
                onSubmitEditing={handleFalSebebiSubmit}
              />
              <TouchableOpacity
                style={[styles.sendButton, !falSebebi.trim() && styles.disabledButton]}
                onPress={handleFalSebebiSubmit}
                disabled={!falSebebi.trim()}
              >
                <Ionicons name="send" size={24} color="#FBEFD1" />
              </TouchableOpacity>
            </View>
        )}
         {showUploadButton && (
            <View style={styles.uploadContainer}>
              <Text style={styles.uploadtitle}>Fincan fotoğraflarını yükle.</Text>
              <View style={styles.photoContainer}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <View key={index} style={[styles.photoWrapper, photos[index] && styles.photoSelected]}>
                    <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                      {photos[index] ? (
                        <Image source={{ uri: photos[index].uri }} style={styles.photo} />
                      ) : (
                        <Ionicons name="camera-outline" size={30} color="#CDC3AB" />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <Text style={styles.subtitle}>En az bir fotoğraf yüklemelisin.</Text>
              <TouchableOpacity
                style={[styles.uploadButton, { backgroundColor: photos.length < 1 ? '#aaa' : '#7D3C98' }]}
                onPress={handleUploadPhoto}
                disabled={photos.length < 1}
              >
                <Text style={styles.buttonText}>Kahve Fotoğrafı Yükle</Text>
              </TouchableOpacity>
            </View>
          )}
          {loading && (
            <BlurView intensity={50} style={styles.loadingOverlay}>
              <LottieView
                source={require('../assets/loading.json')} // Loading animasyon dosyasının yolu
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
              <Text style={styles.loadingText}>Kahve fotoğrafların yükleniyor...</Text>
            </BlurView>
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
  },loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  specialMessage: {
    marginBottom: 30, // Özel mesafeyi burada ayarlayın
  },

  loadingText: {
    marginTop: 20,
    color: '#CDC3AB',
    fontSize: 16,
    textAlign: 'center',
    fontFamily:'DavidLibre'
  },
  typingAnimation: {
    width: 40,
    height: 40,
  },


  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(66, 66, 66, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  uploadtitle: {
    color: '#CDC3AB',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  photoWrapper: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 5,
  },
  photoButton: {
    backgroundColor: 'rgba(205, 195, 171, 0.05)',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.25)',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoSelected: {
    borderColor: 'yellow',
  },
  subtitle: {
    color: '#CDC3AB',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '80%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'DavidLibre',
  },

  messageList: {
    flex: 1,
    width: '100%',
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
    justifyContent: 'center', // Ortalamak için
    alignItems: 'center', // Ortalamak için
    minHeight: 40,
  },
  messageText: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre',
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
