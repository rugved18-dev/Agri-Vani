import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. IMPORT YOUR SCREENS
import LanguageScreen from './screens/LanguageScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen'; 
import MandiScreen from './screens/MandiScreen'; 
import CameraScreen from './screens/CameraScreen';
import ProfileScreen from './screens/ProfileScreen';
import VoiceScreen from './screens/VoiceScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('LanguageSelection');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const hasSelectedLanguage = await AsyncStorage.getItem('selectedLanguage');

      if (isLoggedIn === 'true') {
        setInitialRoute('Home');
      } else if (hasSelectedLanguage) {
        setInitialRoute('Login');
      } else {
        setInitialRoute('LanguageSelection');
      }
    } catch (error) {
      console.error('Error checking initial route:', error);
      setInitialRoute('LanguageSelection');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, 
          animation: 'slide_from_right',
        }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen} 
        />
        {/* ADD THIS LINE BELOW */}
        <Stack.Screen
          name="Mandi"
          component={MandiScreen} 
        />
        <Stack.Screen
          name="Camera" 
          component={CameraScreen} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
        />
        <Stack.Screen
          name="Voice" 
          component={VoiceScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}