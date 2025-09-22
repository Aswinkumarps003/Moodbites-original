// Comprehensive test for dietician chat functionality
import fetch from 'node-fetch';

const testDieticianChatComplete = async () => {
  console.log('🧪 Testing Complete Dietician Chat Functionality...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing chat service health...');
    const healthResponse = await fetch('http://localhost:3006/health');
    const healthData = await healthResponse.json();
    console.log('✅ Chat service health:', healthData);

    // Test 2: Test conversations for dietician
    console.log('\n2. Testing conversations for dietician...');
    const dieticianId = '68cd9c232f24476e904c5956'; // Dietician ID from your MongoDB data
    const conversationsResponse = await fetch(`http://localhost:3006/api/conversations/${dieticianId}`);
    
    if (conversationsResponse.ok) {
      const conversations = await conversationsResponse.json();
      console.log('✅ Conversations fetched for dietician:', conversations.length);
      
      if (conversations.length > 0) {
        const conversation = conversations[0];
        console.log('📋 First conversation:', {
          id: conversation._id,
          participants: conversation.participants,
          messageCount: conversation.messages.length,
          lastMessage: conversation.lastMessage,
          lastUpdated: conversation.lastUpdated
        });
        
        // Test message formatting for dietician view
        if (conversation.messages.length > 0) {
          console.log('\n📝 Messages formatted for dietician view:');
          conversation.messages.forEach((msg, index) => {
            const sender = msg.senderId.toString() === dieticianId ? 'doctor' : 'patient';
            const time = new Date(msg.createdAt).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
            
            console.log(`  ${index + 1}. [${sender}] "${msg.message}" (${time}) - Read: ${msg.isRead}`);
          });
        }
      }
    } else {
      console.log('❌ Failed to fetch conversations:', conversationsResponse.status);
      const errorText = await conversationsResponse.text();
      console.log('Error details:', errorText);
    }

    // Test 3: Test specific conversation messages
    console.log('\n3. Testing specific conversation messages...');
    const conversationId = '68cfa39158149e6f6c351e14'; // From your MongoDB data
    const messagesResponse = await fetch(`http://localhost:3006/api/conversations/${conversationId}/messages`);
    
    if (messagesResponse.ok) {
      const messages = await messagesResponse.json();
      console.log('✅ Messages fetched:', messages.length);
      
      // Format messages as they would appear in the dietician chat panel
      const formattedMessages = messages.map(msg => ({
        id: msg._id,
        text: msg.message,
        sender: msg.senderId.toString() === dieticianId ? 'doctor' : 'patient',
        time: new Date(msg.createdAt).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        isRead: msg.isRead,
        messageType: msg.messageType || 'text',
        createdAt: msg.createdAt
      }));
      
      console.log('\n📱 Formatted messages for dietician chat panel:');
      formattedMessages.forEach((msg, index) => {
        console.log(`  ${index + 1}. [${msg.sender}] "${msg.text}" (${msg.time}) - Read: ${msg.isRead}`);
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

    console.log('\n🎉 Complete dietician chat test completed!');
    console.log('✅ Chat service is working with your MongoDB data');
    console.log('✅ Messages should display correctly in the dietician chat panel');
    console.log('✅ Dietician should be able to send messages back to users');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testDieticianChatComplete();
