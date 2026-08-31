// client/src/services/smsService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class SMSService {
  // Send booking confirmation SMS
  async sendBookingConfirmationSMS(bookingData) {
    try {
      console.log('📱 Sending SMS to:', bookingData.phone);
      console.log('📱 API URL:', `${API_URL}/api/sms/send-booking-sms`);

      const response = await axios.post(
        `${API_URL}/api/sms/send-booking-sms`, // ✅ Updated URL
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('✅ SMS sent successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        details: error.response?.data
      };
    }
  }

  // Send bus arriving SMS
  async sendBusArrivingSMS(bookingData) {
    try {
      const response = await axios.post(
        `${API_URL}/api/sms/send-arriving-sms`, // ✅ Updated URL
        bookingData
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Arrival SMS failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send delay notification SMS
  async sendDelayNotificationSMS(bookingData) {
    try {
      const response = await axios.post(
        `${API_URL}/api/sms/send-delay-sms`, // ✅ Updated URL
        bookingData
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Delay SMS failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send trip completed SMS
  async sendTripCompletedSMS(bookingData) {
    try {
      const response = await axios.post(
        `${API_URL}/api/sms/send-completed-sms`, // ✅ Updated URL
        bookingData
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Trip completed SMS failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export const smsService = new SMSService();