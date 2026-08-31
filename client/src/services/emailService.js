// client/src/services/emailService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (bookingData) => {
  try {
    console.log('📧 Sending email to:', bookingData.email);
    console.log('📧 API URL:', `${API_URL}/api/email/send-booking-email`);

    const response = await axios.post(
      `${API_URL}/api/email/send-booking-email`, // ✅ Updated URL
      bookingData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('✅ Email sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('Error details:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      details: error.response?.data
    };
  }
};

// Send bus arriving email
export const sendBusArrivingEmail = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/email/send-arriving-email`, // ✅ Updated URL
      bookingData
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Arrival email failed:', error);
    return { success: false, error: error.message };
  }
};

// Send delay notification email
export const sendDelayNotificationEmail = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/email/send-delay-email`, // ✅ Updated URL
      bookingData
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Delay email failed:', error);
    return { success: false, error: error.message };
  }
};

// Send trip completed email
export const sendTripCompletedEmail = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/email/send-completed-email`, // ✅ Updated URL
      bookingData
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Trip completed email failed:', error);
    return { success: false, error: error.message };
  }
};