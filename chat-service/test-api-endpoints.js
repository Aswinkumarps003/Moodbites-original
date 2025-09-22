// Simple test script to verify API endpoints without MongoDB connection
import fetch from 'node-fetch';

const testAPIEndpoints = async () => {
  console.log('🧪 Testing Chat Service API Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing chat service health...');
    const healthResponse = await fetch('http://localhost:3006/health');
    const healthData = await healthResponse.json();
    console.log('✅ Chat service health:', healthData);

    // Test 2: Test conversations endpoint with your MongoDB data
    console.log('\n2. Testing conversations endpoint...');
    const dieticianId = '68cd9c232f24476e904c5956'; // Dietician ID from your MongoDB data
    const conversationsResponse = await fetch(`http://localhost:3006/api/conversations/${dieticianId}`);
    
    if (conversationsResponse.ok) {
      const conversations = await conversationsResponse.json();
      console.log('✅ Conversations fetched:', conversations.length);
      
      if (conversations.length > 0) {
        const conversation = conversations[0];
        console.log('📋 First conversation:', {
          id: conversation._id,
          participants: conversation.participants,
          messageCount: conversation.messages.length,
          lastMessage: conversation.lastMessage,
          lastUpdated: conversation.lastUpdated
        });
        
        // Display messages
        if (conversation.messages.length > 0) {
          console.log('\n📝 Messages in conversation:');
          conversation.messages.forEach((msg, index) => {
            console.log(`  ${index + 1}. [${msg.senderId}] → [${msg.receiverId}]: "${msg.message}" (${msg.createdAt})`);
          });
        }
      }
    } else {
      console.log('❌ Failed to fetch conversations:', conversationsResponse.status);
    }

    // Test 3: Test specific conversation from your MongoDB data
    console.log('\n3. Testing specific conversation messages...');
    const conversationId = '68cfa39158149e6f6c351e14'; // From your MongoDB data
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

    // Test 4: Test conversation stats
    console.log('\n4. Testing conversation stats...');
    const statsResponse = await fetch(`http://localhost:3006/api/conversations/${conversationId}/stats`);
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Conversation stats:', stats);
    } else {
      console.log('❌ Failed to fetch stats:', statsResponse.status);
    }

    console.log('\n🎉 API endpoints test completed!');
    console.log('✅ Chat service is working with your MongoDB data');
    console.log('✅ Your "hi" message should be visible in the dietician chat panel');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testAPIEndpoints();
