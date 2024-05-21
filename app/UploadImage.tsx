import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/CustomHeader';
export default function UploadImage({ onSubmit, onClose }) {
  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: true,
    });

    if (!result.canceled) {
      setPhotos([...photos, ...result.assets]);
    }
  };

  const handleSubmit = () => {
    if (photos.length < 1) {
      Alert.alert('Hata', 'En az bir fotoğraf yüklemelisin.');
    } else {
      onSubmit();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
          <CustomHeader></CustomHeader>
        <Text style={styles.closeText} onPress={onClose}>Kapat</Text>
        <Text style={styles.title}>Fincan Fotoğraflarını Yükle</Text>
        <View style={styles.photosContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={[styles.photoWrapper, photos[index] && styles.photoSelected]}>
              {photos[index] ? (
                <Image source={{ uri: photos[index].uri }} style={styles.photo} />
              ) : (
                <Ionicons name="camera-outline" size={40} color="#fff" />
              )}
            </View>
          ))}
        </View>
        <Text style={styles.subtitle}>En az bir fotoğraf yüklemelisin.</Text>
        <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black', // Ekranınızın arka plan rengi
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  controlButton: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
