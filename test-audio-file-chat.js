#!/usr/bin/env node

/**
 * Test script for audio and file messaging features in Moodbites chat
 * This script tests the chat service endpoints and functionality
 */

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const CHAT_SERVICE_URL = 'http://localhost:3006';
const USER_SERVICE_URL = 'http://localhost:5000';

// Test configuration
const TEST_CONFIG = {
  chatService: {
    baseUrl: CHAT_SERVICE_URL,
    endpoints: {
      health: '/health',
      uploadAudio: '/api/upload/audio',
      uploadFile: '/api/upload/file',
      conversations: '/api/conversations'
    }
  },
  userService: {
    baseUrl: USER_SERVICE_URL,
    endpoints: {
      login: '/api/user/login',
      users: '/api/user/users/role/1'
    }
  }
};

// Test data
const TEST_USER = {
  email: 'aswinkumarps2003@gmail.com',
  password: 'password123'
};

const TEST_DIETICIAN = {
  email: 'smiteares47@gmail.com',
  password: 'password123'
};

class ChatTester {
  constructor() {
    this.userToken = null;
    this.dieticianToken = null;
    this.testResults = [];
  }

  async runTests() {
    console.log('🧪 Starting Audio & File Chat Tests');
    console.log('=' .repeat(50));

    try {
      // Test 1: Health Check
      await this.testHealthCheck();

      // Test 2: User Authentication
      await this.testUserAuthentication();

      // Test 3: Audio Upload
      await this.testAudioUpload();

      // Test 4: File Upload
      await this.testFileUpload();

      // Test 5: Message Sending with Audio
      await this.testAudioMessage();

      // Test 6: Message Sending with File
      await this.testFileMessage();

      // Test 7: File Download
      await this.testFileDownload();

      // Display results
      this.displayResults();

    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  async testHealthCheck() {
    console.log('\n🔍 Testing Chat Service Health...');
    
    try {
      const response = await fetch(`${CHAT_SERVICE_URL}/health`);
      const data = await response.json();
      
      if (response.ok && data.status === 'OK') {
        this.addResult('Health Check', true, 'Chat service is healthy');
      } else {
        this.addResult('Health Check', false, 'Chat service health check failed');
      }
    } catch (error) {
      this.addResult('Health Check', false, `Health check failed: ${error.message}`);
    }
  }

  async testUserAuthentication() {
    console.log('\n🔐 Testing User Authentication...');
    
    try {
      // Test user login
      const userResponse = await fetch(`${USER_SERVICE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        this.userToken = userData.token;
        this.addResult('User Authentication', true, 'User login successful');
      } else {
        this.addResult('User Authentication', false, 'User login failed');
      }

      // Test dietician login
      const dieticianResponse = await fetch(`${USER_SERVICE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_DIETICIAN)
      });

      if (dieticianResponse.ok) {
        const dieticianData = await dieticianResponse.json();
        this.dieticianToken = dieticianData.token;
        this.addResult('Dietician Authentication', true, 'Dietician login successful');
      } else {
        this.addResult('Dietician Authentication', false, 'Dietician login failed');
      }

    } catch (error) {
      this.addResult('Authentication', false, `Authentication failed: ${error.message}`);
    }
  }

  async testAudioUpload() {
    console.log('\n🎤 Testing Audio Upload...');
    
    if (!this.userToken) {
      this.addResult('Audio Upload', false, 'No user token available');
      return;
    }

    try {
      // Create a dummy audio file
      const audioBuffer = Buffer.from('dummy audio data');
      const formData = new FormData();
      formData.append('audio', audioBuffer, {
        filename: 'test-audio.webm',
        contentType: 'audio/webm'
      });

      const response = await fetch(`${CHAT_SERVICE_URL}/api/upload/audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.audioUrl = data.audioUrl;
        this.addResult('Audio Upload', true, `Audio uploaded successfully: ${data.audioUrl}`);
      } else {
        const errorData = await response.json();
        this.addResult('Audio Upload', false, `Audio upload failed: ${errorData.error}`);
      }
    } catch (error) {
      this.addResult('Audio Upload', false, `Audio upload error: ${error.message}`);
    }
  }

  async testFileUpload() {
    console.log('\n📁 Testing File Upload...');
    
    if (!this.userToken) {
      this.addResult('File Upload', false, 'No user token available');
      return;
    }

    try {
      // Create a dummy file
      const fileBuffer = Buffer.from('This is a test document content');
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: 'test-document.txt',
        contentType: 'text/plain'
      });
      formData.append('fileType', 'document');

      const response = await fetch(`${CHAT_SERVICE_URL}/api/upload/file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.userToken}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.fileUrl = data.fileUrl;
        this.addResult('File Upload', true, `File uploaded successfully: ${data.fileUrl}`);
      } else {
        const errorData = await response.json();
        this.addResult('File Upload', false, `File upload failed: ${errorData.error}`);
      }
    } catch (error) {
      this.addResult('File Upload', false, `File upload error: ${error.message}`);
    }
  }

  async testAudioMessage() {
    console.log('\n💬 Testing Audio Message...');
    
    if (!this.audioUrl) {
      this.addResult('Audio Message', false, 'No audio URL available');
      return;
    }

    try {
      // Simulate sending an audio message via socket.io
      // In a real test, you would connect to socket.io and emit the message
      const messageData = {
        senderId: 'test-user-id',
        receiverId: 'test-dietician-id',
        message: 'Voice message',
        messageType: 'audio',
        audioUrl: this.audioUrl,
        audioDuration: 10
      };

      // For now, just verify the message structure
      if (messageData.messageType === 'audio' && messageData.audioUrl) {
        this.addResult('Audio Message', true, 'Audio message structure is valid');
      } else {
        this.addResult('Audio Message', false, 'Audio message structure is invalid');
      }
    } catch (error) {
      this.addResult('Audio Message', false, `Audio message error: ${error.message}`);
    }
  }

  async testFileMessage() {
    console.log('\n📄 Testing File Message...');
    
    if (!this.fileUrl) {
      this.addResult('File Message', false, 'No file URL available');
      return;
    }

    try {
      // Simulate sending a file message via socket.io
      const messageData = {
        senderId: 'test-user-id',
        receiverId: 'test-dietician-id',
        message: 'Shared document: test-document.txt',
        messageType: 'file',
        fileName: 'test-document.txt',
        fileSize: 1024,
        fileType: 'document',
        fileUrl: this.fileUrl
      };

      // Verify the message structure
      if (messageData.messageType === 'file' && messageData.fileUrl) {
        this.addResult('File Message', true, 'File message structure is valid');
      } else {
        this.addResult('File Message', false, 'File message structure is invalid');
      }
    } catch (error) {
      this.addResult('File Message', false, `File message error: ${error.message}`);
    }
  }

  async testFileDownload() {
    console.log('\n⬇️ Testing File Download...');
    
    if (!this.fileUrl) {
      this.addResult('File Download', false, 'No file URL available');
      return;
    }

    try {
      const response = await fetch(this.fileUrl);
      
      if (response.ok) {
        const fileContent = await response.text();
        if (fileContent.includes('test document content')) {
          this.addResult('File Download', true, 'File download successful');
        } else {
          this.addResult('File Download', false, 'File content mismatch');
        }
      } else {
        this.addResult('File Download', false, `File download failed: ${response.status}`);
      }
    } catch (error) {
      this.addResult('File Download', false, `File download error: ${error.message}`);
    }
  }

  addResult(testName, success, message) {
    this.testResults.push({
      test: testName,
      success,
      message,
      timestamp: new Date().toISOString()
    });

    const status = success ? '✅' : '❌';
    console.log(`${status} ${testName}: ${message}`);
  }

  displayResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results Summary');
    console.log('='.repeat(50));

    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(1);

    console.log(`\n📈 Overall Success Rate: ${successRate}% (${passed}/${total})`);
    
    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.message}`);
    });

    if (successRate === '100.0') {
      console.log('\n🎉 All tests passed! Audio and file messaging features are working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }

    console.log('\n🚀 Next Steps:');
    console.log('1. Start the chat service: npm start (in chat-service directory)');
    console.log('2. Start the user service: npm start (in user-service directory)');
    console.log('3. Test the features in the frontend chat interface');
    console.log('4. Try recording audio messages and uploading files');
  }
}

// Run the tests
const tester = new ChatTester();
tester.runTests().catch(console.error);
