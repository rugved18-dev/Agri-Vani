import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { translations } from '../constants/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MandiScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [data, setData] = useState([]);

  // Mock Data (We will replace this with Real API later)
  const mockPrices = [
    { id: '1', name: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' }, price: '₹2,400', unit: 'Qt', trend: 'up' },
    { id: '2', name: { en: 'Onion', hi: 'प्याज', mr: 'कांदा' }, price: '₹1,800', unit: 'Qt', trend: 'down' },
    { id: '3', name: { en: 'Potato', hi: 'आलू', mr: 'बटाटा' }, price: '₹1,200', unit: 'Qt', trend: 'stable' },
    { id: '4', name: { en: 'Wheat', hi: 'गेहूं', mr: 'गहू' }, price: '₹2,100', unit: 'Qt', trend: 'up' },
    { id: '5', name: { en: 'Rice', hi: 'चावल', mr: 'तांदूळ' }, price: '₹3,500', unit: 'Qt', trend: 'stable' },
    { id: '6', name: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' }, price: '₹4,200', unit: 'Qt', trend: 'down' },
  ];

  useEffect(() => {
    const loadSettings = async () => {
      const storedLang = await AsyncStorage.getItem('selectedLanguage') || 'en';
      setLang(storedLang);
      
      // Simulate API Call delay
      setTimeout(() => {
        setData(mockPrices);
        setLoading(false);
      }, 1000);
    };
    loadSettings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="seedling" size={20} color="#2E7D32" />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.cropName}>{item.name[lang] || item.name.en}</Text>
        <Text style={styles.marketName}>Pune APMC</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.trendContainer}>
          {item.trend === 'up' && <Ionicons name="arrow-up" size={14} color="green" />}
          {item.trend === 'down' && <Ionicons name="arrow-down" size={14} color="red" />}
          {item.trend === 'stable' && <Ionicons name="remove" size={14} color="gray" />}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {lang === 'hi' ? 'मंडी भाव' : lang === 'mr' ? 'बाजार भाव' : 'Mandi Prices'}
        </Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Date Bar */}
      <View style={styles.dateBar}>
        <Text style={styles.dateText}>📅 {new Date().toDateString()}</Text>
        <Text style={styles.locationText}>📍 Pune, MH</Text>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: 'white', elevation: 2 },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  
  dateBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#E8F5E9', marginBottom: 10 },
  dateText: { color: '#2E7D32', fontWeight: '600' },
  locationText: { color: '#2E7D32', fontWeight: '600' },

  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', elevation: 2 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F8E9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoContainer: { flex: 1 },
  cropName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  marketName: { fontSize: 12, color: '#666' },
  priceContainer: { alignItems: 'flex-end' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  trendContainer: { marginTop: 4 },
});

export default MandiScreen;