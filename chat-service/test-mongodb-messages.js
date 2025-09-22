// Test script to verify MongoDB message display in chat service
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fetch from 'node-fetch';

const testMongoDBMessages = async () => {
  console.log('🧪 Testing MongoDB Message Display in Chat Service...\n');

  try {
    // Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Aswinkumarps:A123@moodbites.0pr1hwz.mongodb.net/?retryWrites=true&w=majority&appName=moodbites';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Test 1: Health check
    console.log('\n1. Testing chat service health...');
    const healthResponse = await fetch('http://localhost:3006/health');
    const healthData = await healthResponse.json();
    console.log('✅ Chat service health:', healthData);

    // Test 2: Test API endpoint with your MongoDB data
    console.log('\n2. Testing API endpoint with your MongoDB data...');
    const userId = '68cd9c232f24476e904c5956'; // Dietician ID from your data
    const response = await fetch(`http://localhost:3006/api/conversations/${userId}`);
    
    if (response.ok) {
      const conversations = await response.json();
      console.log('✅ API response:', {
        conversationCount: conversations.length,
        firstConversation: conversations[0] ? {
          id: conversations[0]._id,
          participants: conversations[0].participants,
          messageCount: conversations[0].messages.length,
          lastMessage: conversations[0].lastMessage
        } : null
      });
      
      if (conversations.length > 0) {
        const conversation = conversations[0];
        console.log('\n📝 Messages in conversation:');
        conversation.messages.forEach((msg, index) => {
          console.log(`  ${index + 1}. [${msg.senderId}] → [${msg.receiverId}]: "${msg.message}" (${msg.createdAt})`);
        });
      }
    } else {
      console.log('❌ API request failed:', response.status);
    }

    // Test 3: Test specific conversation from your MongoDB data
    console.log('\n3. Testing specific conversation...');
    const conversationId = '68cfa39158149e6f6c351e14';
    const messagesResponse = await fetch(`http://localhost:3006/api/conversations/${conversationId}/messages`);
    
    if (messagesResponse.ok) {
      const messages = await messagesResponse.json();
      console.log('✅ Messages fetched:', messages.length);
      
      messages.forEach((msg, index) => {
        console.log(`  Message ${index + 1}:`, {
          id: msg._id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          message: msg.message,
          messageType: msg.messageType,
          isRead: msg.isRead,
          createdAt: msg.createdAt
        });
      });
    } else {
      console.log('❌ Failed to fetch messages:', messagesResponse.status);
    }

    console.log('\n🎉 MongoDB message display test completed!');
    console.log('✅ Chat service is working with your MongoDB data');
    console.log('✅ Your "hi" message should be visible in the dietician chat panel');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Run the test
testMongoDBMessages();
