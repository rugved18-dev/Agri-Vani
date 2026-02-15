import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api'; 

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [loading, setLoading] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20, color: 'white' }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setPhoto(result.assets[0]);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
        setPhoto(photoData);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const analyzePlant = async () => {
    if (!photo) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        name: 'scan.jpg',
        type: 'image/jpeg',
      });

      // 1. Upload
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const cloudUrl = uploadRes.data.imageUrl;

      // 2. Scan
      const scanRes = await api.post('/scans', {
        imageUrl: cloudUrl,
        cropName: 'Tomato' 
      });

      const result = scanRes.data.data;

      Alert.alert(
        "Diagnosis Complete 🌿",
        `Disease: ${result.diseaseName}\nConfidence: ${result.confidence}%\nSolution: ${result.solution}`,
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error("AI Error:", error);
      Alert.alert("Connection Error", "Check your Wi-Fi and IP Address.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={{color: 'white', marginTop: 10}}>Diagnosing...</Text>
          </View>
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => setPhoto(null)} style={styles.retakeBtn} disabled={loading}>
            <Text style={styles.btnText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={analyzePlant} style={styles.analyzeBtn} disabled={loading}>
            <Text style={styles.btnText}>{loading ? "Wait..." : "Analyze"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. THE CAMERA LAYER (Background) */}
      <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />
      
      {/* 2. THE UI LAYER (Foreground) - Now Outside the Camera Tag */}
      <SafeAreaView style={styles.uiContainer}>
        
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={pickImage} style={styles.galleryBtn}>
            <Ionicons name="images" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture} style={styles.captureBtn}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          
          <View style={{ width: 50 }} /> 
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  uiContainer: { flex: 1, justifyContent: 'space-between' }, // Pushes Top and Bottom apart
  permissionBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8 },
  permissionText: { color: 'white', fontWeight: 'bold' },
  topControls: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  bottomControls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 30 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
  galleryBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'white' },
  preview: { flex: 1, resizeMode: 'contain' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: 'black' },
  retakeBtn: { padding: 15, backgroundColor: '#FF5252', borderRadius: 8, width: '40%', alignItems: 'center' },
  analyzeBtn: { padding: 15, backgroundColor: '#4CAF50', borderRadius: 8, width: '40%', alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }
});