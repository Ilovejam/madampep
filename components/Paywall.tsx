import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';

export default function Paywall() {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { id: 1, label: '1 Lokum', price: '₺9,99' },
    { id: 2, label: '5 Lokum', price: '₺7,99 / Adet', total: '₺39,99', discount: '%20 KAZANÇ' },
    { id: 3, label: '25 Lokum', price: '₺4,99 / Adet', total: '₺149,99', discount: '%60 KAZANÇ' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>MadamPep</Text>
          <Text style={styles.subtitle}>LOKUM DÜKKANI</Text>

          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedOption === option.id && styles.selectedOptionButton,
                ]}
                onPress={() => setSelectedOption(option.id)}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionPrice}>{option.price}</Text>
                {option.total && <Text style={styles.optionTotal}>{option.total}</Text>}
                {option.discount && <Text style={styles.optionDiscount}>{option.discount}</Text>}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.purchaseButton}>
            <Text style={styles.purchaseButtonText}>10 Lokum Satın Al</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerLink}>Kullanım Şartları</Text>
            <Text style={styles.footerLink}>Gizlilik Politikası</Text>
            <Text style={styles.footerLink}>Geri Yükle</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(66, 66, 66, 0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOptionButton: {
    borderColor: '#E5D8B2',
  },
  optionLabel: {
    fontSize: 18,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
    marginBottom: 5,
  },
  optionPrice: {
    fontSize: 16,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
  },
  optionTotal: {
    fontSize: 14,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
  },
  optionDiscount: {
    fontSize: 14,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
    marginTop: 5,
  },
  purchaseButton: {
    backgroundColor: '#7F4FF1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  purchaseButtonText: {
    fontSize: 20,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  footerLink: {
    fontSize: 14,
    color: '#E5D8B2',
    fontFamily: 'DavidLibre',
  },
});
