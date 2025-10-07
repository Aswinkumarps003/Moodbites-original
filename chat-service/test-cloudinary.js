#!/usr/bin/env node

/**
 * Test script for Cloudinary integration in chat service
 * This script tests file uploads to Cloudinary
 */

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const CHAT_SERVICE_URL = 'http://localhost:3006';

// Test configuration
const TEST_CONFIG = {
  chatService: {
    baseUrl: CHAT_SERVICE_URL,
    endpoints: {
      health: '/health',
      uploadAudio: '/api/upload/audio',
      uploadFile: '/api/upload/file',
      deleteFile: '/api/upload/delete'
    }
  }
};

class CloudinaryTester {
  constructor() {
    this.testResults = [];
    this.uploadedFiles = [];
  }

  async runTests() {
    console.log('🌩️ Starting Cloudinary Integration Tests');
    console.log('=' .repeat(50));

    try {
      // Test 1: Health Check
      await this.testHealthCheck();

      // Test 2: Audio Upload to Cloudinary
      await this.testAudioUpload();

      // Test 3: Image Upload to Cloudinary
      await this.testImageUpload();

      // Test 4: File Upload to Cloudinary
      await this.testFileUpload();

      // Test 5: File Deletion from Cloudinary
      await this.testFileDeletion();

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

  async testAudioUpload() {
    console.log('\n🎤 Testing Audio Upload to Cloudinary...');
    
    try {
      // Create a dummy audio file
      const audioBuffer = Buffer.from('dummy audio data for testing');
      const formData = new FormData();
      formData.append('audio', audioBuffer, {
        filename: 'test-audio.webm',
        contentType: 'audio/webm'
      });

      const response = await fetch(`${CHAT_SERVICE_URL}/api/upload/audio`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.uploadedFiles.push({
          type: 'audio',
          publicId: data.publicId,
          url: data.audioUrl
        });
        this.addResult('Audio Upload', true, `Audio uploaded to Cloudinary: ${data.audioUrl}`);
      } else {
        const errorData = await response.json();
        this.addResult('Audio Upload', false, `Audio upload failed: ${errorData.error}`);
      }
    } catch (error) {
      this.addResult('Audio Upload', false, `Audio upload error: ${error.message}`);
    }
  }

  async testImageUpload() {
    console.log('\n🖼️ Testing Image Upload to Cloudinary...');
    
    try {
      // Create a dummy image file (1x1 pixel PNG)
      const imageBuffer = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: 'test-image.png',
        contentType: 'image/png'
      });
      formData.append('fileType', 'image');

      const response = await fetch(`${CHAT_SERVICE_URL}/api/upload/file`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.uploadedFiles.push({
          type: 'image',
          publicId: data.publicId,
          url: data.fileUrl
        });
        this.addResult('Image Upload', true, `Image uploaded to Cloudinary: ${data.fileUrl}`);
      } else {
        const errorData = await response.json();
        this.addResult('Image Upload', false, `Image upload failed: ${errorData.error}`);
      }
    } catch (error) {
      this.addResult('Image Upload', false, `Image upload error: ${error.message}`);
    }
  }

  async testFileUpload() {
    console.log('\n📁 Testing File Upload to Cloudinary...');
    
    try {
      // Create a dummy text file
      const fileBuffer = Buffer.from('This is a test document for Cloudinary upload');
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: 'test-document.txt',
        contentType: 'text/plain'
      });
      formData.append('fileType', 'document');

      const response = await fetch(`${CHAT_SERVICE_URL}/api/upload/file`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.uploadedFiles.push({
          type: 'document',
          publicId: data.publicId,
          url: data.fileUrl
        });
        this.addResult('File Upload', true, `File uploaded to Cloudinary: ${data.fileUrl}`);
      } else {
        const errorData = await response.json();
        this.addResult('File Upload', false, `File upload failed: ${errorData.error}`);
      }
    } catch (error) {
      this.addResult('File Upload', false, `File upload error: ${error.message}`);
    }
  }

  async testFileDeletion() {
    console.log('\n🗑️ Testing File Deletion from Cloudinary...');
    
    if (this.uploadedFiles.length === 0) {
      this.addResult('File Deletion', false, 'No files to delete');
      return;
    }

    try {
      const fileToDelete = this.uploadedFiles[0];
      const response = await fetch(`${CHAT_SERVICE_URL}/api/upload/delete/${fileToDelete.publicId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.addResult('File Deletion', true, `File deleted from Cloudinary: ${fileToDelete.publicId}`);
        } else {
          this.addResult('File Deletion', false, `File deletion failed: ${data.message}`);
        }
      } else {
        const errorData = await response.json();
        this.addResult('File Deletion', false, `File deletion failed: ${errorData.error}`);
      }
    } catch (error) {
      this.addResult('File Deletion', false, `File deletion error: ${error.message}`);
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
    console.log('📊 Cloudinary Integration Test Results');
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

    if (this.uploadedFiles.length > 0) {
      console.log('\n📁 Uploaded Files:');
      this.uploadedFiles.forEach(file => {
        console.log(`- ${file.type}: ${file.url}`);
        console.log(`  Public ID: ${file.publicId}`);
      });
    }

    if (successRate === '100.0') {
      console.log('\n🎉 All tests passed! Cloudinary integration is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }

    console.log('\n🚀 Next Steps:');
    console.log('1. Set up your Cloudinary credentials in .env file');
    console.log('2. Start the chat service: npm start');
    console.log('3. Test file uploads in the frontend chat interface');
    console.log('4. Check your Cloudinary dashboard for uploaded files');
  }
}

// Run the tests
const tester = new CloudinaryTester();
tester.runTests().catch(console.error);
