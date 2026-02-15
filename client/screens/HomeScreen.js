import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    BackHandler,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../constants/translations'; // Import the dictionary

const HomeScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('Kisan');
    const [lang, setLang] = useState('en'); // Default to English
    const t = translations[lang] || translations.en; // Helper to get text

    useEffect(() => {
        // 1. Load User Data & Language
        const loadData = async () => {
            try {
                const mobile = await AsyncStorage.getItem('userMobileNumber');
                const storedLang = await AsyncStorage.getItem('selectedLanguage');

                if (mobile) setUserName(mobile);
                if (storedLang) setLang(storedLang);
            } catch (error) {
                console.error("Failed to load data", error);
            }
        };
        loadData();

        // 2. Handle Hardware Back Button (Android)
        // Prevents accidental exit. Asks for confirmation.
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit Agri-Vani?", [
                { text: "Cancel", onPress: () => null, style: "cancel" },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "Logout",
                onPress: async () => {
                    await AsyncStorage.clear();
                    navigation.replace('LanguageSelection');
                }
            }
        ]);
    };

    // Dynamic Features List (Updates based on language)
    const features = [
        {
            id: 1,
            title: t.features.doctor,
            subtitle: t.features.doctorSub,
            icon: 'camera',
            library: Ionicons,
            color: '#E8F5E9',
            iconColor: '#2E7D32',
            action: () => navigation.navigate('Camera')
        },
        {
            id: 2,
            title: t.features.voice,
            subtitle: t.features.voiceSub,
            icon: 'microphone',
            library: FontAwesome5,
            color: '#FFF3E0',
            iconColor: '#EF6C00',
            action: () => navigation.navigate('Voice')
        },
        {
            id: 3,
            title: t.features.mandi,
            subtitle: t.features.mandiSub,
            icon: 'store',
            library: MaterialCommunityIcons,
            color: '#E3F2FD',
            iconColor: '#1565C0',
            action: () => navigation.navigate('Mandi')
        },
        {
            id: 4,
            title: t.features.farm,
            subtitle: t.features.farmSub,
            icon: 'tractor',
            library: MaterialCommunityIcons,
            color: '#F3E5F5',
            iconColor: '#7B1FA2',
            action: () => navigation.navigate('Profile')
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{t.greeting},</Text>
                    <Text style={styles.userName}>+91 {userName}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* WEATHER WIDGET */}
                <View style={styles.weatherCard}>
                    <View>
                        <Text style={styles.weatherTemp}>28°C</Text>
                        <Text style={styles.weatherCity}>{t.weather}</Text>
                    </View>
                    <Ionicons name="partly-sunny" size={48} color="#FFB300" />
                </View>

                {/* ALERTS */}
                <View style={styles.alertBox}>
                    <Ionicons name="notifications" size={20} color="#E65100" />
                    <Text style={styles.alertText}>{t.alert}</Text>
                </View>

                {/* GRID BUTTONS */}
                <View style={styles.gridContainer}>
                    {features.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.card, { backgroundColor: item.color }]}
                            onPress={item.action}
                        >
                            <item.library name={item.icon} size={32} color={item.iconColor} />
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

            {/* BOTTOM NAVIGATION BAR */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={24} color="#4CAF50" />
                    <Text style={[styles.navText, { color: '#4CAF50' }]}>{t.nav.home}</Text>
                </TouchableOpacity>

                {/* Big Middle Scan Button */}
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Ionicons name="scan" size={30} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Profile')} // <--- Added this line
                >
                    <Ionicons name="person-outline" size={24} color="#999" />
                    <Text style={styles.navText}>{t.nav.profile}</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { padding: 20, paddingBottom: 100 }, // Extra padding for bottom bar

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    greeting: { fontSize: 16, color: '#666' },
    userName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    logoutBtn: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 8 },

    // Weather
    weatherCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#4CAF50', padding: 20, borderRadius: 16, marginBottom: 15, elevation: 4 },
    weatherTemp: { fontSize: 32, fontWeight: 'bold', color: 'white' },
    weatherCity: { fontSize: 14, color: '#E8F5E9' },

    // Alert
    alertBox: { flexDirection: 'row', backgroundColor: '#FFF3E0', padding: 15, borderRadius: 12, marginBottom: 25, alignItems: 'center', gap: 10 },
    alertText: { fontSize: 13, color: '#E65100', flex: 1, lineHeight: 18 },

    // Grid
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: '48%', padding: 20, borderRadius: 16, marginBottom: 15, alignItems: 'center', elevation: 2 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#333', textAlign: 'center' },
    cardSubtitle: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },

    // Bottom Bar
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    navItem: { alignItems: 'center' },
    navText: { fontSize: 12, color: '#999', marginTop: 4 },
    scanButton: {
        backgroundColor: '#4CAF50',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        elevation: 5,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    }
});

export default HomeScreen;