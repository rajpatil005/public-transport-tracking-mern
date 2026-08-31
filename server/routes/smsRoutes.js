import express from 'express';
import twilio from 'twilio';

const router = express.Router();

let twilioClient = null;

const initTwilioClient = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio Client initialized');
    return true;
  }
  console.warn('⚠️ Twilio credentials not configured');
  return false;
};

// Helper: Format phone number for Twilio
const formatPhoneNumber = (phone) => {
  let clean = phone.replace(/\s/g, '');
  if (!clean.startsWith('+')) {
    clean = '+91' + clean;
  }
  return clean;
};

// Helper: Validate phone number (basic)
const validatePhoneNumber = (phone) => {
  const clean = phone.replace(/\s/g, '');
  const digits = clean.replace(/[^0-9]/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

// Helper: Create SMS message
const createSMSMessage = (type, data) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  
  switch(type) {
    case 'booking':
      return `
🚍 Booking Confirmed - Kolhapur City Bus

✓ Booking ID: ${data.bookingId}
✓ Passenger: ${data.name || 'Passenger'}
✓ Route: ${data.routeName}
✓ From: ${data.boardingPoint}
✓ To: ${data.droppingPoint}
✓ Date: ${data.travelDate}
✓ Time: ${data.departureTime}
✓ Seats: ${data.seats?.join(', ') || 'N/A'}

Track: ${baseUrl}/track-bus/${data.bookingId}

Thank you for choosing Kolhapur City Bus!`.trim();

    case 'arriving':
      return `
⏰ Bus Arriving Soon!

Your bus is approximately 15 minutes away.

📍 Pickup Stop: ${data.boardingPoint}
📱 Driver Contact: ${data.driverContact || 'Not available'}

Please be ready at your pickup stop.

- Kolhapur City Bus`.trim();

    case 'delay':
      return `
⏰ Bus Delay Notification

Route: ${data.routeName}
Delayed by: ${data.delayMinutes} minutes
New ETA: ${data.newETA}

We apologize for the inconvenience.
Your bus will arrive at the new ETA.

- Kolhapur City Bus`.trim();

    case 'completed':
      return `
✨ Trip Completed!

Thank you ${data.name || 'Passenger'} for traveling with Kolhapur City Bus.

Route: ${data.routeName}
Booking ID: ${data.bookingId}

Rate your experience:
${baseUrl}/rate-booking/${data.bookingId}

We look forward to serving you again!`.trim();

    default:
      return data.message || 'Thank you for choosing Kolhapur City Bus.';
  }
};

// ============ SMS ENDPOINTS ============

// Send booking confirmation SMS
router.post('/send-booking-sms', async (req, res) => {
  try {
    const { phone, name, bookingId, routeName, travelDate, departureTime, seats, boardingPoint, droppingPoint } = req.body;

    console.log('📱 ===== SEND BOOKING SMS =====');
    console.log('📱 To:', phone);
    console.log('📱 Booking ID:', bookingId);

    // 1. Validate phone
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Please enter a valid 10-digit number.'
      });
    }

    // 2. Check Twilio configuration
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.error('❌ Twilio credentials missing');
      return res.status(500).json({
        success: false,
        error: 'SMS service is not configured. Please contact support.'
      });
    }

    // 3. Initialize Twilio client
    if (!twilioClient) {
      const initialized = initTwilioClient();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'SMS service initialization failed.'
        });
      }
    }

    // 4. Format phone number
    const formattedPhone = formatPhoneNumber(phone);
    console.log('📱 Formatted:', formattedPhone);

    // 5. Create message
    const message = createSMSMessage('booking', {
      bookingId,
      name,
      routeName,
      travelDate,
      departureTime,
      seats,
      boardingPoint,
      droppingPoint
    });

    console.log('📱 Message length:', message.length);

    // 6. Send SMS via Twilio
    try {
      const smsResponse = await twilioClient.messages.create({
        body: message,
        to: formattedPhone,
        from: process.env.TWILIO_PHONE_NUMBER
      });

      console.log('✅ SMS sent successfully!');
      console.log('📱 SID:', smsResponse.sid);
      console.log('📱 Status:', smsResponse.status);
      console.log('📱 To:', smsResponse.to);
      console.log('📱 From:', smsResponse.from);

      // Log to database (optional)
      // await saveSMSLog({ ... });

      return res.json({
        success: true,
        message: 'Booking SMS sent successfully',
        sid: smsResponse.sid,
        status: smsResponse.status,
        to: formattedPhone
      });

    } catch (twilioError) {
      console.error('❌ Twilio API Error:', twilioError);
      console.error('❌ Error Code:', twilioError.code);
      console.error('❌ Error Message:', twilioError.message);
      console.error('❌ More Info:', twilioError.moreInfo);

      // Handle specific Twilio errors
      if (twilioError.code === 21608) {
        return res.status(400).json({
          success: false,
          error: 'Phone number is not verified in Twilio. Please use a verified number.'
        });
      }

      if (twilioError.code === 21606) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Twilio phone number. Please check your Twilio configuration.'
        });
      }

      if (twilioError.code === 21211) {
        return res.status(400).json({
          success: false,
          error: 'Invalid phone number format. Please check the number.'
        });
      }

      if (twilioError.code === 20003) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed. Please check your Twilio credentials.'
        });
      }

      return res.status(500).json({
        success: false,
        error: `SMS sending failed: ${twilioError.message}`,
        code: twilioError.code
      });
    }

  } catch (error) {
    console.error('❌ SMS route error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while sending SMS'
    });
  }
});

// Send bus arriving SMS
router.post('/send-arriving-sms', async (req, res) => {
  try {
    const { phone, name, bookingId, boardingPoint, driverContact } = req.body;

    console.log('📱 ===== SEND ARRIVING SMS =====');
    console.log('📱 To:', phone);

    if (!phone || !validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Valid phone number is required'
      });
    }

    if (!twilioClient) initTwilioClient();
    if (!twilioClient) {
      return res.status(500).json({
        success: false,
        error: 'SMS service not configured'
      });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const message = createSMSMessage('arriving', { bookingId, name, boardingPoint, driverContact });

    const smsResponse = await twilioClient.messages.create({
      body: message,
      to: formattedPhone,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('✅ Arrival SMS sent, SID:', smsResponse.sid);

    return res.json({
      success: true,
      message: 'Arrival SMS sent successfully',
      sid: smsResponse.sid,
      to: formattedPhone
    });

  } catch (error) {
    console.error('❌ Arrival SMS failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send arrival SMS'
    });
  }
});

// Send delay notification SMS
router.post('/send-delay-sms', async (req, res) => {
  try {
    const { phone, name, bookingId, routeName, delayMinutes, newETA } = req.body;

    console.log('📱 ===== SEND DELAY SMS =====');
    console.log('📱 To:', phone);

    if (!phone || !validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Valid phone number is required'
      });
    }

    if (!twilioClient) initTwilioClient();
    if (!twilioClient) {
      return res.status(500).json({
        success: false,
        error: 'SMS service not configured'
      });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const message = createSMSMessage('delay', { routeName, delayMinutes, newETA });

    const smsResponse = await twilioClient.messages.create({
      body: message,
      to: formattedPhone,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('✅ Delay SMS sent, SID:', smsResponse.sid);

    return res.json({
      success: true,
      message: 'Delay SMS sent successfully',
      sid: smsResponse.sid,
      to: formattedPhone
    });

  } catch (error) {
    console.error('❌ Delay SMS failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send delay SMS'
    });
  }
});

// Send trip completed SMS
router.post('/send-completed-sms', async (req, res) => {
  try {
    const { phone, name, bookingId, routeName } = req.body;

    console.log('📱 ===== SEND COMPLETED SMS =====');
    console.log('📱 To:', phone);

    if (!phone || !validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Valid phone number is required'
      });
    }

    if (!twilioClient) initTwilioClient();
    if (!twilioClient) {
      return res.status(500).json({
        success: false,
        error: 'SMS service not configured'
      });
    }

    const formattedPhone = formatPhoneNumber(phone);
    const message = createSMSMessage('completed', { name, bookingId, routeName });

    const smsResponse = await twilioClient.messages.create({
      body: message,
      to: formattedPhone,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('✅ Completed SMS sent, SID:', smsResponse.sid);

    return res.json({
      success: true,
      message: 'Completed SMS sent successfully',
      sid: smsResponse.sid,
      to: formattedPhone
    });

  } catch (error) {
    console.error('❌ Completed SMS failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send completed SMS'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  const isConfigured = !!(process.env.TWILIO_ACCOUNT_SID && 
                         process.env.TWILIO_AUTH_TOKEN && 
                         process.env.TWILIO_PHONE_NUMBER);

  res.json({
    status: 'OK',
    message: 'SMS service is running',
    configured: isConfigured,
    provider: isConfigured ? 'Twilio' : 'None',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER ? 
      `${process.env.TWILIO_PHONE_NUMBER.slice(0, 5)}...${process.env.TWILIO_PHONE_NUMBER.slice(-3)}` : 
      'Not configured'
  });
});

// Verify Twilio credentials (Admin only)
router.post('/verify', async (req, res) => {
  try {
    if (!twilioClient) initTwilioClient();
    
    if (!twilioClient) {
      return res.status(500).json({
        success: false,
        error: 'Twilio client not initialized'
      });
    }

    // Try to get account info to verify credentials
    const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    
    res.json({
      success: true,
      message: 'Twilio credentials verified',
      accountName: account.friendlyName,
      status: account.status
    });
  } catch (error) {
    console.error('❌ Verification failed:', error);
    res.status(401).json({
      success: false,
      error: 'Twilio verification failed',
      details: error.message
    });
  }
});

export default router;