import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLanguage, setIsCheckingLanguage] = useState(true);

  const languageNames = {
    en: 'English', hi: 'हिंदी', mr: 'मराठी', bn: 'বাংলা',
    te: 'తెలుగు', ta: 'தமிழ்', gu: 'ગુજરાતી', kn: 'ಕನ್ನಡ',
    ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ'
  };

  useEffect(() => {
    const getLanguage = async () => {
      try {
        const language = await AsyncStorage.getItem('selectedLanguage');
        if (language) setSelectedLanguage(language);
      } catch (error) {
        console.error('Error getting language:', error);
      } finally {
        setIsCheckingLanguage(false);
      }
    };
    getLanguage();
  }, []);

  const isValidMobileNumber = (number) => /^[6-9]\d{9}$/.test(number);

  const handleLogin = async () => {
    try {
      if (!mobileNumber.trim()) {
        Alert.alert('Error', 'Please enter your mobile number');
        return;
      }
      if (!isValidMobileNumber(mobileNumber)) {
        Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian mobile number');
        return;
      }

      setIsLoading(true);

      // ✅ Uses env-configured API URL (port 5001, correct /api/auth route)
      const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.155.222.31:5001/api';
      console.log('🔐 API Base:', API_BASE);

      // Step 1: Try to register (creates account if user is new)
      const registerRes = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber,
          language: selectedLanguage,
          name: `Farmer_${mobileNumber.slice(-4)}`,
          password: mobileNumber, // phone number = password for simplicity
        }),
      });

      const registerData = await registerRes.json();
      console.log('📩 Register response:', JSON.stringify(registerData));

      let userId, token;

      if (registerRes.ok && registerData.success) {
        // ✅ New user registered — shape: { success, token, user: { id, name, ... } }
        userId = registerData.user?.id;
        token = registerData.token;

      } else if (registerData.message === 'User already exists') {
        // ✅ Existing user — log them in
        console.log('ℹ️ User exists, logging in...');

        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber, password: mobileNumber }),
        });
        const loginData = await loginRes.json();
        console.log('📩 Login response:', JSON.stringify(loginData));

        if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
        userId = loginData.user?.id;
        token = loginData.token;

      } else {
        throw new Error(registerData.message || 'Authentication failed');
      }

      // Step 2: Save session to local storage
      await AsyncStorage.multiSet([
        ['userMobileNumber', mobileNumber],
        ['userId', userId || ''],
        ['isLoggedIn', 'true'],
        ['token', token || ''],
      ]);

      setIsLoading(false);
      navigation.replace('Home');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Connection Failed', `Could not connect to server.\n\nError: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleChangeLanguage = () => {
    navigation.navigate('Language');
  };

  if (isCheckingLanguage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your mobile number to continue</Text>
          </View>

          <View style={styles.languageSection}>
            <Text style={styles.languageLabel}>Selected Language:</Text>
            <TouchableOpacity style={styles.languageButton} onPress={handleChangeLanguage}>
              <Text style={styles.languageButtonText}>
                {languageNames[selectedLanguage] || 'English'} ✎
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCode}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.mobileInput}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#999"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!isLoading}
              />
            </View>
            {mobileNumber.length > 0 && !isValidMobileNumber(mobileNumber) && (
              <Text style={styles.errorText}>⚠️ Invalid mobile number format</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoText}>📞 Enter your mobile number to login or register</Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>By continuing, you agree to our Terms &amp; Conditions</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  keyboardAvoid: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666' },
  languageSection: { marginBottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8 },
  languageLabel: { fontSize: 14, color: '#333', fontWeight: '500' },
  languageButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#4CAF50' },
  languageButtonText: { fontSize: 14, color: '#2E7D32', fontWeight: '600' },
  formSection: { marginBottom: 30 },
  inputRow: { flexDirection: 'row', gap: 12 },
  countryCodeBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', height: 50 },
  countryCode: { fontSize: 16, fontWeight: '600', color: '#333' },
  mobileInput: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, color: '#333', height: 50 },
  errorText: { color: '#D32F2F', fontSize: 12, marginTop: 8, marginLeft: 4 },
  loginButton: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 25, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  loginButtonDisabled: { opacity: 0.7, backgroundColor: '#A5D6A7' },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  infoSection: { marginTop: 20, alignItems: 'center' },
  infoText: { fontSize: 12, color: '#666' },
  footer: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  footerText: { fontSize: 11, color: '#999', textAlign: 'center' },
});

export default LoginScreen;