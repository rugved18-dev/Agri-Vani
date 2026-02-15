import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert, 
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../constants/translations';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({ mobile: '', lang: 'en' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const t = translations[userData.lang] || translations.en;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const mobile = await AsyncStorage.getItem('userMobileNumber');
      const lang = await AsyncStorage.getItem('selectedLanguage') || 'en';
      setUserData({ mobile, lang });
    } catch (error) {
      console.error("Error loading profile", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{ name: 'LanguageSelection' }],
          });
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 1. Profile Header */}
      <View style={styles.header}>
        
        {/* --- NEW BACK BUTTON --- */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        {/* ----------------------- */}

        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>Kisan User</Text>
        <Text style={styles.mobile}>+91 {userData.mobile}</Text>
      </View>

      {/* 2. Settings Menu */}
      <View style={styles.menuContainer}>
        
        {/* Language Setting */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('LanguageSelection')}>
          <View style={styles.menuLeft}>
            <Ionicons name="language" size={22} color="#4CAF50" />
            <Text style={styles.menuText}>Change Language</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={styles.valueText}>
              {userData.lang === 'hi' ? 'हिंदी' : userData.lang === 'mr' ? 'मराठी' : 'English'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>

        {/* Notifications Toggle */}
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="notifications-outline" size={22} color="#FF9800" />
            <Text style={styles.menuText}>Notifications</Text>
          </View>
          <Switch 
            value={notificationsEnabled} 
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#767577", true: "#81C784" }}
            thumbColor={notificationsEnabled ? "#4CAF50" : "#f4f3f4"}
          />
        </View>

        {/* Help & Support */}
        <TouchableOpacity style={styles.menuItem} onPress={() => alert("Support: +91-1800-123-456")}>
          <View style={styles.menuLeft}>
            <MaterialIcons name="support-agent" size={22} color="#2196F3" />
            <Text style={styles.menuText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

      </View>

      {/* 3. Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Agri-Vani App v1.0.0</Text>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  // Header Styles
  header: { 
    alignItems: 'center', 
    padding: 30, 
    backgroundColor: 'white', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    elevation: 4,
    position: 'relative' // Important for absolute positioning the back button
  },
  
  // --- NEW STYLE FOR BACK BUTTON ---
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5' // Light gray circle background
  },
  // -------------------------------

  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#4CAF50' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4CAF50', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  mobile: { fontSize: 16, color: '#666', marginTop: 4 },

  // Menu Styles
  menuContainer: { marginTop: 20, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
  valueText: { fontSize: 14, color: '#666' },

  // Logout Styles
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFEBEE', marginTop: 30, marginHorizontal: 20, padding: 15, borderRadius: 12, gap: 10 },
  logoutText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 16 },
  versionText: { textAlign: 'center', color: '#999', marginTop: 20, fontSize: 12 }
});

export default ProfileScreen;