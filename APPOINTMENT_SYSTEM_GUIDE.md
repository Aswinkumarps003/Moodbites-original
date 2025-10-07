# 📅 Appointment Booking System - Complete Guide

## 🎯 Overview

The appointment booking system allows users to book consultations with dieticians and enables dieticians to manage their appointments. The system supports both chat and video consultations with real-time updates.

## 🏗️ Architecture

### Backend (user-service)
- **Database**: MongoDB with Mongoose
- **API**: Express.js REST API
- **Authentication**: JWT-based authentication
- **Port**: 5000

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Port**: 3000

## 📊 Database Schema

### Appointment Model
```javascript
{
  // Patient information
  patientId: ObjectId (ref: User),
  patientName: String,
  patientEmail: String,
  
  // Dietician information
  dieticianId: ObjectId (ref: User),
  dieticianName: String,
  dieticianEmail: String,
  
  // Appointment details
  consultationType: String (enum: ['chat', 'video']),
  appointmentDate: Date,
  appointmentTime: String,
  
  // Status tracking
  status: String (enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']),
  
  // Additional details
  notes: String,
  duration: Number (default: 30 minutes),
  
  // Meeting details (for video calls)
  meetingRoomId: String,
  meetingUrl: String,
  
  // Timestamps
  scheduledAt: Date,
  confirmedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}
```

## 🔌 API Endpoints

### Create Appointment
```
POST /api/appointments
Authorization: Bearer <jwt-token>
Content-Type: application/json

Body:
{
  "dieticianId": "ObjectId",
  "consultationType": "chat|video",
  "appointmentDate": "2024-01-25",
  "appointmentTime": "2:00 PM",
  "notes": "Optional notes"
}
```

### Get Dietician Appointments
```
GET /api/appointments/dietician?status=scheduled&date=2024-01-25&page=1&limit=50
Authorization: Bearer <jwt-token>
```

### Get Patient Appointments
```
GET /api/appointments/patient?status=scheduled&page=1&limit=50
Authorization: Bearer <jwt-token>
```

### Get Specific Appointment
```
GET /api/appointments/:appointmentId
Authorization: Bearer <jwt-token>
```

### Update Appointment Status
```
PUT /api/appointments/:appointmentId/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

Body:
{
  "status": "confirmed|in-progress|completed|cancelled|no-show",
  "notes": "Optional notes",
  "cancellationReason": "Optional reason"
}
```

### Delete Appointment
```
DELETE /api/appointments/:appointmentId
Authorization: Bearer <jwt-token>
```

## 🎨 Frontend Components

### Consult.jsx (User Side)
- **Purpose**: Book appointments with dieticians
- **Features**:
  - Browse available dieticians
  - Select consultation type (chat/video)
  - Choose date and time
  - Real-time booking confirmation
  - Error handling and validation

### PatientsList.jsx (Dietician Side)
- **Purpose**: View and manage appointments
- **Features**:
  - Display all scheduled appointments
  - Show appointment details (patient, time, type)
  - Real-time updates when new appointments are booked
  - Quick action buttons for starting consultations
  - Appointment status tracking

## 🚀 Getting Started

### 1. Start Backend Services
```bash
# Start user-service
cd user-service
npm install
npm start
```

### 2. Start Frontend
```bash
# Start frontend
cd frontend
npm install
npm start
```

### 3. Test the System
1. **User Flow**:
   - Go to `/consult` page
   - Select a dietician
   - Choose consultation type
   - Pick date and time
   - Confirm booking

2. **Dietician Flow**:
   - Go to `/dietician` dashboard
   - View "Recent Patients" section
   - See all scheduled appointments
   - Use quick action buttons

## 🔧 Configuration

### Environment Variables
```env
# user-service/.env
MONGODB_URI=mongodb://localhost:27017/moodbites
JWT_SECRET=your-jwt-secret
SENDGRID_API_KEY=your-sendgrid-key
```

### Frontend Configuration
```javascript
// frontend/src/pages/Consult.jsx
const API_URL = 'http://localhost:5000/api';
```

## 📱 User Experience

### Booking Flow
1. **Browse Dieticians**: Users see a list of active dieticians
2. **Select Type**: Choose between live chat or video call
3. **Pick Time**: Select from available time slots
4. **Confirm**: Review and confirm appointment
5. **Success**: Receive confirmation and see appointment in dashboard

### Dietician Experience
1. **Dashboard View**: See all appointments in one place
2. **Patient Details**: View patient information and appointment history
3. **Quick Actions**: Start consultations directly from the dashboard
4. **Status Updates**: Track appointment progress and completion

## 🔄 Real-time Updates

The system uses custom events for real-time updates:
- When a user books an appointment, a custom event is dispatched
- The dietician dashboard listens for these events and refreshes automatically
- No page refresh required for new appointments to appear

## 🛡️ Security Features

- **JWT Authentication**: All API endpoints require valid JWT tokens
- **Role-based Access**: Patients can only book appointments, dieticians can manage them
- **Data Validation**: Server-side validation for all appointment data
- **Conflict Prevention**: Prevents double-booking of time slots
- **Permission Checks**: Users can only access their own appointments

## 🧪 Testing

### Manual Testing
1. **Book Appointment**: Use the frontend to book an appointment
2. **View Dashboard**: Check dietician dashboard for new appointment
3. **Update Status**: Change appointment status and verify updates
4. **Error Handling**: Test with invalid data and network errors

### API Testing
Use the provided test script:
```bash
node test-appointment-api.js
```

## 🐛 Troubleshooting

### Common Issues

1. **Appointments not showing**:
   - Check if user-service is running on port 5000
   - Verify JWT token is valid
   - Check browser console for API errors

2. **Booking fails**:
   - Ensure all required fields are provided
   - Check if time slot is already booked
   - Verify dietician ID is valid

3. **Real-time updates not working**:
   - Check if custom events are being dispatched
   - Verify event listeners are properly set up
   - Check browser console for errors

### Debug Mode
Enable debug logging by checking browser console for:
- `📅 Loaded appointments from API:`
- `✅ Appointment booked successfully:`
- `🔄 Appointment update event received:`

## 📈 Future Enhancements

- **Email Notifications**: Send confirmation emails
- **Calendar Integration**: Sync with Google Calendar
- **Video Call Integration**: Direct integration with video calling
- **Payment Processing**: Add payment for consultations
- **Recurring Appointments**: Support for regular consultations
- **Mobile App**: Native mobile application
- **Analytics**: Appointment statistics and insights

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify all services are running
4. Check API endpoints with Postman or similar tools

---

**🎉 The appointment booking system is now fully integrated and ready for use!**

