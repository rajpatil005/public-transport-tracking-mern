import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

let transporter = null;

// Initialize transporter
export const initEmailTransporter = (transporterInstance) => {
  transporter = transporterInstance;
  console.log('✅ Email transporter initialized in routes');
  return transporter;
};

// Helper: Validate email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Create email HTML template
const createEmailTemplate = (type, data) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const year = new Date().getFullYear();

  switch(type) {
    case 'booking':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a56db; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .detail-row:last-child { border-bottom: none; }
            .status-badge { background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; display: inline-block; }
            .track-btn { background: #1a56db; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .highlight { background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚍 Booking Confirmed!</h1>
              <p>Your ticket has been booked successfully</p>
            </div>
            <div class="content">
              <h2>Hello ${data.name || 'Passenger'},</h2>
              <p>Your bus ticket has been confirmed. Please find the details below:</p>
              
              <div class="booking-details">
                <div class="detail-row"><strong>Booking ID:</strong> ${data.bookingId}</div>
                <div class="detail-row"><strong>Route:</strong> ${data.routeName}</div>
                <div class="detail-row"><strong>From:</strong> ${data.boardingPoint}</div>
                <div class="detail-row"><strong>To:</strong> ${data.droppingPoint}</div>
                <div class="detail-row"><strong>Date:</strong> ${data.travelDate}</div>
                <div class="detail-row"><strong>Time:</strong> ${data.departureTime}</div>
                <div class="detail-row"><strong>Seats:</strong> ${data.seats?.join(', ') || 'N/A'}</div>
                <div class="detail-row"><strong>Total Fare:</strong> ₹${data.totalFare}</div>
                <div class="detail-row"><strong>Status:</strong> <span class="status-badge">Confirmed</span></div>
              </div>

              <div style="text-align: center;">
                <a href="${baseUrl}/track-bus/${data.bookingId}" class="track-btn">
                  🚌 Track Your Bus
                </a>
              </div>

              <div class="highlight">
                <p style="margin: 0; color: #065f46;">
                  <strong>💡 Important:</strong> Please show this email to the conductor while boarding.
                </p>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for choosing Kolhapur City Bus Transport</p>
              <p>📞 For support: +91 98765 43210 | 📧 support@kolhapurcitybus.com</p>
              <p>&copy; ${year} Kolhapur City Bus. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'arriving':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .track-btn { background: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
            .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Bus Arriving Soon!</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.name || 'Passenger'},</h2>
              <div class="alert-box">
                <p style="font-size: 18px; font-weight: bold; color: #991b1b;">
                  🚍 Your bus is approximately 15 minutes away!
                </p>
              </div>
              <div class="details-box">
                <p><strong>Route:</strong> ${data.routeName}</p>
                <p><strong>Pickup Stop:</strong> ${data.boardingPoint}</p>
                <p><strong>Driver Contact:</strong> ${data.driverContact || 'Not available'}</p>
              </div>
              <div style="text-align: center;">
                <a href="${baseUrl}/track-bus/${data.bookingId}" class="track-btn">
                  📍 Track Live Location
                </a>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>⚠️ Please be ready:</strong> Your bus will arrive shortly.
                </p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${year} Kolhapur City Bus</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'delay':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .delay-box { background: #fffbeb; border: 1px solid #fcd34d; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .track-btn { background: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Bus Delayed</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.name || 'Passenger'},</h2>
              <p>We regret to inform you that your bus has been delayed.</p>
              <div class="delay-box">
                <p style="font-size: 18px;"><strong>⏱️ Delayed by:</strong> ${data.delayMinutes} minutes</p>
                <p style="font-size: 18px;"><strong>🕐 New ETA:</strong> ${data.newETA}</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Route:</strong> ${data.routeName}</p>
                <p><strong>Booking ID:</strong> ${data.bookingId}</p>
              </div>
              <div style="text-align: center;">
                <a href="${baseUrl}/track-bus/${data.bookingId}" class="track-btn">
                  📍 Track Your Bus
                </a>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>💡 We apologize for the inconvenience.</strong>
                </p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${year} Kolhapur City Bus</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'completed':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .rating-btn { background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; }
            .stars { text-align: center; font-size: 40px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Trip Completed!</h1>
              <p>Thank you for traveling with us</p>
            </div>
            <div class="content">
              <h2>Hello ${data.name || 'Passenger'},</h2>
              <p>Your trip has been successfully completed. We hope you had a comfortable journey!</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Route:</strong> ${data.routeName}</p>
                <p><strong>Booking ID:</strong> ${data.bookingId}</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 16px; font-weight: bold;">Rate Your Experience</p>
                <div class="stars">
                  <a href="${baseUrl}/rate-booking/${data.bookingId}?rating=5" style="text-decoration: none; color: #f59e0b;">★★★★★</a>
                </div>
                <a href="${baseUrl}/rate-booking/${data.bookingId}" class="rating-btn">
                  📝 Share Feedback
                </a>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #065f46;">
                  <strong>🌟 Thank you!</strong> Your feedback helps us improve our services.
                </p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${year} Kolhapur City Bus</p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `<p>Thank you for choosing Kolhapur City Bus.</p>`;
  }
};

// ============ EMAIL ENDPOINTS ============

// Send booking confirmation email
router.post('/send-booking-email', async (req, res) => {
  try {
    const {
      email,
      name,
      bookingId,
      routeName,
      travelDate,
      departureTime,
      seats,
      totalFare,
      boardingPoint,
      droppingPoint,
    } = req.body;

    console.log('📧 ===== SEND BOOKING EMAIL =====');
    console.log('📧 To:', email);
    console.log('📧 Booking ID:', bookingId);

    // 1. Check transporter
    if (!transporter) {
      console.error('❌ Transporter not configured');
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured. Please contact support.'
      });
    }

    // 2. Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format. Please enter a valid email address.'
      });
    }

    // 3. Validate required fields
    if (!bookingId || !routeName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking information'
      });
    }

    // 4. Create email HTML
    const htmlContent = createEmailTemplate('booking', {
      name,
      bookingId,
      routeName,
      travelDate,
      departureTime,
      seats,
      totalFare,
      boardingPoint,
      droppingPoint
    });

    const mailOptions = {
      from: `"Kolhapur City Bus" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Booking Confirmed - Kolhapur City Bus',
      html: htmlContent,
      replyTo: 'support@kolhapurcitybus.com'
    };

    // 5. Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully to:', email);
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);

    return res.json({
      success: true,
      message: 'Booking confirmation email sent successfully',
      messageId: info.messageId,
      to: email
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('❌ Error Code:', error.code);
    console.error('❌ Error Command:', error.command);

    // Handle specific email errors
    if (error.code === 'EAUTH') {
      return res.status(401).json({
        success: false,
        error: 'Email authentication failed. Please check your email credentials.'
      });
    }

    if (error.code === 'ECONNECTION') {
      return res.status(503).json({
        success: false,
        error: 'Cannot connect to email server. Please check your internet connection.'
      });
    }

    if (error.code === 'ESOCKET') {
      return res.status(503).json({
        success: false,
        error: 'Email service connection timeout. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
      code: error.code || 'UNKNOWN'
    });
  }
});

// Send bus arriving email
router.post('/send-arriving-email', async (req, res) => {
  try {
    const { email, name, bookingId, routeName, boardingPoint, driverContact } = req.body;

    console.log('📧 ===== SEND ARRIVING EMAIL =====');
    console.log('📧 To:', email);

    if (!transporter) {
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured'
      });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      });
    }

    const htmlContent = createEmailTemplate('arriving', {
      name,
      bookingId,
      routeName,
      boardingPoint,
      driverContact
    });

    const mailOptions = {
      from: `"Kolhapur City Bus" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '⏰ Your Bus is Arriving Soon!',
      html: htmlContent,
      replyTo: 'support@kolhapurcitybus.com'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Arrival email sent to:', email);
    console.log('📧 Message ID:', info.messageId);

    return res.json({
      success: true,
      message: 'Arrival email sent successfully',
      messageId: info.messageId,
      to: email
    });

  } catch (error) {
    console.error('❌ Arrival email failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send arrival email'
    });
  }
});

// Send delay notification email
router.post('/send-delay-email', async (req, res) => {
  try {
    const { email, name, bookingId, routeName, delayMinutes, newETA } = req.body;

    console.log('📧 ===== SEND DELAY EMAIL =====');
    console.log('📧 To:', email);

    if (!transporter) {
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured'
      });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      });
    }

    const htmlContent = createEmailTemplate('delay', {
      name,
      bookingId,
      routeName,
      delayMinutes,
      newETA
    });

    const mailOptions = {
      from: `"Kolhapur City Bus" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '⏰ Bus Delay Notification',
      html: htmlContent,
      replyTo: 'support@kolhapurcitybus.com'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Delay email sent to:', email);
    console.log('📧 Message ID:', info.messageId);

    return res.json({
      success: true,
      message: 'Delay email sent successfully',
      messageId: info.messageId,
      to: email
    });

  } catch (error) {
    console.error('❌ Delay email failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send delay email'
    });
  }
});

// Send trip completed email
router.post('/send-completed-email', async (req, res) => {
  try {
    const { email, name, bookingId, routeName } = req.body;

    console.log('📧 ===== SEND COMPLETED EMAIL =====');
    console.log('📧 To:', email);

    if (!transporter) {
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured'
      });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      });
    }

    const htmlContent = createEmailTemplate('completed', {
      name,
      bookingId,
      routeName
    });

    const mailOptions = {
      from: `"Kolhapur City Bus" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✨ Your Trip is Complete! Rate Your Experience',
      html: htmlContent,
      replyTo: 'feedback@kolhapurcitybus.com'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Completed email sent to:', email);
    console.log('📧 Message ID:', info.messageId);

    return res.json({
      success: true,
      message: 'Completed email sent successfully',
      messageId: info.messageId,
      to: email
    });

  } catch (error) {
    console.error('❌ Completed email failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send completed email'
    });
  }
});

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;

    if (!transporter) {
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured'
      });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      });
    }

    const mailOptions = {
      from: `"Kolhapur City Bus Test" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Email Service Test - Kolhapur City Bus',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
          <h1 style="color: #1a56db;">✅ Email Service Working!</h1>
          <p style="font-size: 16px; color: #333;">This is a test email from Kolhapur City Bus Transport.</p>
          <p style="font-size: 14px; color: #666;">If you received this email, your email service is configured correctly.</p>
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-top: 20px;">
            <p style="margin: 0; color: #065f46;">✅ Email configuration is working properly!</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">&copy; ${new Date().getFullYear()} Kolhapur City Bus. All rights reserved.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent to:', email);

    return res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
      to: email
    });

  } catch (error) {
    console.error('❌ Test email failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Test email failed'
    });
  }
});

// Email service health check
router.get('/health', (req, res) => {
  const isConfigured = !!transporter;
  const hasCredentials = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  res.json({
    status: 'OK',
    message: 'Email service is running',
    configured: isConfigured,
    hasCredentials: hasCredentials,
    emailUser: process.env.EMAIL_USER ? 
      `${process.env.EMAIL_USER.slice(0, 3)}...${process.env.EMAIL_USER.slice(-5)}` : 
      'Not configured',
    service: process.env.EMAIL_SERVICE || 'gmail'
  });
});

export default router;