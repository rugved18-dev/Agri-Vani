import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function VoiceScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '1', text: "Namaste! I am Agri-Vani. How can I help you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    // 1. Add User Message
    const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // 2. Simulate Bot Response (Fake AI for now)
    setTimeout(() => {
      let botReply = "I am still learning. Please try 'Weather' or 'Price'.";
      
      if (userMsg.text.toLowerCase().includes('weather')) {
        botReply = "Today's weather in Pune is Sunny, 28°C.";
      } else if (userMsg.text.toLowerCase().includes('price')) {
        botReply = "Onion price is ₹1,800/Qt at Pune APMC.";
      } else if (userMsg.text.toLowerCase().includes('tomato')) {
        botReply = "Tomato prices are rising. Current: ₹2,400/Qt.";
      }

      const botMsg = { id: (Date.now() + 1).toString(), text: botReply, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.sender === 'user' ? styles.userBubble : styles.botBubble
    ]}>
      <Text style={[
        styles.messageText, 
        item.sender === 'user' ? styles.userText : styles.botText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agri-Voice Assistant</Text>
        <Ionicons name="volume-high" size={24} color="#4CAF50" />
      </View>

      {/* Chat Area */}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Ask about weather, crops..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.micButton} onPress={() => alert("Listening...")}>
          <Ionicons name="mic" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifySelf: 'space-between', padding: 15, backgroundColor: 'white', elevation: 4, justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  chatContainer: { padding: 15, paddingBottom: 80 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#4CAF50', borderBottomRightRadius: 2 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: 'white', borderBottomLeftRadius: 2, elevation: 1 },
  
  messageText: { fontSize: 16 },
  userText: { color: 'white' },
  botText: { color: '#333' },

  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  micButton: { backgroundColor: '#FF9800', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  sendButton: { backgroundColor: '#4CAF50', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});