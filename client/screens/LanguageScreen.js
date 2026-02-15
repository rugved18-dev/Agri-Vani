import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageScreen = ({ navigation }) => {
  
  // The "Mega List" of 10 Indian Languages
  const languages = [
    { code: 'en', name: 'English', sub: 'Welcome', color: '#E8F5E9', border: '#4CAF50' },
    { code: 'hi', name: 'हिंदी', sub: 'नमस्ते', color: '#FFF3E0', border: '#FF9800' },
    { code: 'mr', name: 'मराठी', sub: 'नमस्कार', color: '#E3F2FD', border: '#2196F3' },
    { code: 'gu', name: 'ગુજરાતી', sub: 'નમસ્તે', color: '#FBE9E7', border: '#FF5722' },
    { code: 'bn', name: 'বাংলা', sub: 'নমস্কার', color: '#F3E5F5', border: '#9C27B0' },
    { code: 'te', name: 'తెలుగు', sub: 'నమస్కారం', color: '#FFEBEE', border: '#F44336' },
    { code: 'ta', name: 'தமிழ்', sub: 'வணக்கம்', color: '#E0F2F1', border: '#009688' },
    { code: 'kn', name: 'ಕನ್ನಡ', sub: 'ನಮಸ್ಕಾರ', color: '#FFF8E1', border: '#FFC107' },
    { code: 'ml', name: 'മലയാളം', sub: 'നമസ്കാരം', color: '#E1F5FE', border: '#03A9F4' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', sub: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', color: '#F9FBE7', border: '#CDDC39' },
  ];

  const handleLanguageSelect = async (langCode) => {
    try {
      // 1. Save the new language
      await AsyncStorage.setItem('selectedLanguage', langCode);
      await AsyncStorage.setItem('hasCompletedLanguageSelection', 'true');

      // 2. Check if user is already logged in
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      // 3. Navigate accordingly
      if (isLoggedIn === 'true') {
        // If already logged in, go back to Home (Dashboard)
        // We use 'reset' to clear the stack so back button doesn't act weird
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // If first time, go to Login
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };
  const renderLanguageCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { borderColor: item.border, backgroundColor: item.color }]}
      onPress={() => handleLanguageSelect(item.code)}
      activeOpacity={0.7}
    >
      <Text style={[styles.langName, { color: item.border }]}>{item.name}</Text>
      <Text style={styles.subText}>{item.sub}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header Section */}
      <View style={styles.header}>
        {/* FIX: Using a Web URL instead of a local file */}
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/188/188333.png' }} 
          style={styles.logo} 
        />
        <Text style={styles.title}>Agri-Vani</Text>
        <Text style={styles.subtitle}>Choose your language / भाषा चुनें</Text>
      </View>

      {/* Scrollable Grid List */}
      <FlatList
        data={languages}
        renderItem={renderLanguageCard}
        keyExtractor={(item) => item.code}
        numColumns={2} // Grid Layout
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40, 
  },
  row: {
    justifyContent: 'space-between', 
  },
  card: {
    width: '48%', 
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  langName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
});

export default LanguageScreen;