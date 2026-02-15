import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      icon: '🇮🇳',
    },
    {
      code: 'hi',
      name: 'हिंदी',
      nativeName: 'Hindi',
      icon: '🇮🇳',
    },
    {
      code: 'mr',
      name: 'मराठी',
      nativeName: 'Marathi',
      icon: '🇮🇳',
    },
  ];

  const handleLanguageSelect = async (languageCode) => {
    try {
      setLoading(true);
      setSelectedLanguage(languageCode);

      // Save selected language to AsyncStorage
      await AsyncStorage.setItem('selectedLanguage', languageCode);
      console.log(`✅ Language saved: ${languageCode}`);

      // Optional: Also save a flag indicating user has completed onboarding
      await AsyncStorage.setItem('hasCompletedLanguageSelection', 'true');

      // Navigate to Login screen after a brief delay
      setTimeout(() => {
        navigation.replace('Login');
      }, 500);
    } catch (error) {
      console.error('❌ Error saving language:', error);
      alert('Failed to save language preference. Please try again.');
      setLoading(false);
      setSelectedLanguage(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🌾 Agri-Vani</Text>
          <Text style={styles.subtitle}>
            Select Your Preferred Language
          </Text>
          <Text style={styles.description}>
            आपकी पसंदीदा भाषा चुनें • तुमची पसंतीची भाषा निवडा
          </Text>
        </View>

        {/* Language Cards */}
        <View style={styles.cardsContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                selectedLanguage === language.code && styles.selectedCard,
              ]}
              onPress={() => handleLanguageSelect(language.code)}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.languageIcon}>{language.icon}</Text>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNativeName}>
                {language.nativeName}
              </Text>

              {/* Selection Indicator */}
              {selectedLanguage === language.code && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change this language anytime in Settings
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  languageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    minHeight: 140,
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
    borderWidth: 3,
  },
  languageIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  languageName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d5016',
    marginBottom: 4,
    textAlign: 'center',
  },
  languageNativeName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  checkmarkText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    marginTop: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default LanguageSelectionScreen;
