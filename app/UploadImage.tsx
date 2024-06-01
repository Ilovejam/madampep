import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView, Modal, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { height } = Dimensions.get('window');

export default function UploadImage({ onSubmit, onClose, visible }) {
  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 3, // En fazla 3 resim seçilmesini sağlıyor
        base64: true,
      });

      if (!result.canceled) {
        setPhotos(result.assets.slice(0, 3)); // En fazla 3 resmi seç
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Hata', 'Resim seçerken bir hata oluştu.');
    }
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
        onSubmit();
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
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.closeText} onPress={onClose}>Kapat</Text>
          <Text style={styles.title}>Fincan Fotoğraflarını Yükle</Text>
          <View style={styles.photosContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={[styles.photoWrapper, photos[index] && styles.photoSelected]}>
                {photos[index] ? (
                  <Image source={{ uri: photos[index].uri }} style={styles.photo} />
                ) : (
                  <Ionicons name="camera-outline" size={40} color="#555" />
                )}
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Kahve Fotoğrafı Yükle</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Modal arka planını yarı saydam yapar
  },
  container: {
    width: '90%',
    height: height / 2, // Ekranın yarısı kadar yükseklik
    backgroundColor: 'rgba(66, 66, 66, 0.05)', // %5 opacity
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(205, 195, 171, 0.15)', // %15 opacity
    borderRadius: 20,
    padding: 20,
  },
  closeText: {
    color: 'purple',
    fontSize: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
    borderColor: '#555',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
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
  submitButton: {
    backgroundColor: 'purple',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
