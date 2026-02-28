import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
  Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import api from '../api';

const GREETING = "🙏 Namaste! I'm Agri-Vani, your farming assistant.\n\nAsk me about:\n• 🌾 Crop tips & planting\n• 💰 Market prices & MSP\n• 🦠 Disease & pest control\n• 🏛️ Government schemes\n\nType your question or tap the mic on your keyboard!";

const QUICK_QUESTIONS = [
  { label: '🍅 Tomato', query: 'tomato farming tips' },
  { label: '💰 Prices', query: 'market prices today' },
  { label: '🌧️ Monsoon', query: 'monsoon crops' },
  { label: '🏛️ PM-KISAN', query: 'PM KISAN scheme' },
  { label: '🌱 Fertilizer', query: 'fertilizer guide' },
  { label: '🦠 Disease', query: 'crop disease treatment' },
];

export default function VoiceScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '1', text: GREETING, sender: 'bot', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  // Dot animation for typing indicator
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      const animate = (dot, delay) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true, easing: Easing.ease }),
            Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true, easing: Easing.ease }),
          ])
        ).start();
      animate(dot1, 0);
      animate(dot2, 150);
      animate(dot3, 300);
    }
  }, [isLoading]);

  // Speak bot response
  const speak = (text) => {
    // Strip emojis for cleaner speech
    const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').replace(/•/g, '').trim();
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(cleanText, {
      language: 'en-IN',
      rate: 0.88,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const addBotMessage = (text) => {
    const msg = { id: Date.now().toString(), text, sender: 'bot', time: new Date() };
    setMessages(prev => [...prev, msg]);
    speak(text);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendMessage = async (overrideText) => {
    const question = (overrideText || inputText).trim();
    if (!question || isLoading) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), text: question, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const res = await api.post('/chat', { question });
      addBotMessage(res.data.answer || "Sorry, I don't have info on that yet.");
    } catch (error) {
      console.error('Chat error:', error);
      const isNetworkError = !error.response;
      addBotMessage(
        isNetworkError
          ? "⚠️ Cannot reach server.\n\nMake sure the Node.js server is running on port 5001."
          : `❌ Error: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) =>
    date?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) || '';

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.row, isUser ? styles.userRow : styles.botRow]}>
        {!isUser && (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🌱</Text>
          </View>
        )}
        <View style={[styles.bubbleWrapper, isUser ? styles.userBubbleWrapper : {}]}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.msgText, isUser ? styles.userText : styles.botText]}>
              {item.text}
            </Text>
          </View>
          <Text style={[styles.timeText, isUser ? styles.timeRight : styles.timeLeft]}>
            {formatTime(item.time)}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={styles.botRow}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarEmoji}>🌱</Text>
      </View>
      <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🌾 Agri-Voice</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Live</Text>
          </View>
        </View>
        <TouchableOpacity onPress={isSpeaking ? stopSpeaking : undefined} style={styles.headerBtn}>
          <Ionicons
            name={isSpeaking ? 'volume-high' : 'volume-mute-outline'}
            size={22}
            color={isSpeaking ? '#FFD700' : 'rgba(255,255,255,0.6)'}
          />
        </TouchableOpacity>
      </View>

      {/* ── Quick Question Chips ── */}
      <View style={styles.chipsRow}>
        <FlatList
          data={QUICK_QUESTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => sendMessage(item.query)}
              disabled={isLoading}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ── Chat Messages ── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={isLoading ? renderTypingIndicator() : null}
      />

      {/* ── Input Bar ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          {/* Mic hint button */}
          <TouchableOpacity
            style={styles.micHintBtn}
            onPress={() => {
              inputRef.current?.focus();
              addBotMessage("💡 Tip: Tap the 🎤 microphone icon on your keyboard to speak your question!");
            }}
          >
            <Ionicons name="mic" size={20} color="#fff" />
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Ask anything about farming..."
            placeholderTextColor="#9E9E9E"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
            multiline
            maxLength={500}
            blurOnSubmit={false}
          />

          <TouchableOpacity
            style={[styles.sendBtn, (isLoading || !inputText.trim()) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Mic usage hint */}
        <View style={styles.hintBar}>
          <Ionicons name="information-circle-outline" size={13} color="#9E9E9E" />
          <Text style={styles.hintText}>  Tap 🎤 on keyboard for voice input • Answers are spoken aloud</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECEFF1' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1B5E20', paddingHorizontal: 12, paddingVertical: 14,
    elevation: 8, shadowColor: '#1B5E20', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 6,
  },
  headerBtn: { padding: 6, borderRadius: 20 },
  headerCenter: { alignItems: 'center', gap: 4 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#69F0AE' },
  onlineText: { color: '#69F0AE', fontSize: 11, fontWeight: '600' },

  // Chips
  chipsRow: { backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  chip: {
    backgroundColor: '#E8F5E9', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1.5, borderColor: '#A5D6A7',
  },
  chipText: { fontSize: 12, color: '#2E7D32', fontWeight: '700' },

  // Chat
  chatContainer: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 8 },
  row: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  avatarCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 18,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  avatarEmoji: { fontSize: 19 },
  bubbleWrapper: { maxWidth: '78%' },
  userBubbleWrapper: { alignItems: 'flex-end' },
  bubble: {
    borderRadius: 20, paddingHorizontal: 15, paddingVertical: 11,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3,
  },
  userBubble: { backgroundColor: '#2E7D32', borderBottomRightRadius: 5 },
  botBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 5 },
  msgText: { fontSize: 15, lineHeight: 23 },
  userText: { color: '#fff' },
  botText: { color: '#212121' },
  timeText: { fontSize: 10, color: '#BDBDBD', marginTop: 4 },
  timeRight: { textAlign: 'right' },
  timeLeft: { textAlign: 'left', marginLeft: 4 },

  // Typing dots
  typingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },

  // Input
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 10,
    paddingTop: 10, paddingBottom: 6, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E0E0E0', gap: 8,
  },
  micHintBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#FF9800',
    justifyContent: 'center', alignItems: 'center',
  },
  input: {
    flex: 1, backgroundColor: '#F5F5F5', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 15,
    color: '#212121', maxHeight: 120, minHeight: 42,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#2E7D32',
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#A5D6A7' },

  // Hint bar
  hintBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', paddingBottom: 8, paddingHorizontal: 16,
  },
  hintText: { fontSize: 11, color: '#9E9E9E' },
});