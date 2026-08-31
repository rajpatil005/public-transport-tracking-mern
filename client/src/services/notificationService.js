import { sendBusArrivingEmail, sendDelayNotificationEmail, sendTripCompletedEmail } from './emailService';
import { smsService } from './smsService';

class NotificationService {
  constructor() {
    this.interval = null;
    this.isRunning = false;
  }

  // Start monitoring notifications
  startMonitoring() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.interval = setInterval(() => {
      this.checkAndSendNotifications();
    }, 60000); // Check every minute

    console.log('Notification monitoring started');
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Notification monitoring stopped');
  }

  // Check and send notifications
  async checkAndSendNotifications() {
    try {
      const bookings = JSON.parse(localStorage.getItem('kolhapurBusBookings') || '[]');
      const currentTime = new Date();

      for (const booking of bookings) {
        if (booking.status !== 'confirmed') continue;

        const travelDate = new Date(booking.travelDate);
        const departureTime = this.parseTime(booking.departureTime);
        travelDate.setHours(departureTime.hours, departureTime.minutes, 0, 0);

        const timeDiff = (travelDate - currentTime) / 60000; // Difference in minutes

        // 🚌 Bus Arriving Notification (15 minutes before)
        if (timeDiff <= 15 && timeDiff > 14 && !booking.arrivalEmailSent) {
          await this.sendArrivingNotifications(booking);
        }

        // ⏰ Delay Notification (if delayed by more than 5 minutes)
        if (timeDiff < -5 && !booking.delayNotificationSent) {
          const delayMinutes = Math.abs(Math.round(timeDiff));
          if (delayMinutes > 5) {
            await this.sendDelayNotifications(booking, delayMinutes);
          }
        }

        // ✨ Trip Completed (after departure time + 1 hour)
        if (timeDiff < -60 && !booking.tripCompletedEmailSent) {
          await this.sendTripCompletedNotifications(booking);
        }
      }
    } catch (error) {
      console.error('Notification check failed:', error);
    }
  }

  // Send arriving notifications
  async sendArrivingNotifications(booking) {
    try {
      // Send Email
      await sendBusArrivingEmail({
        email: booking.email,
        name: booking.passengerName || 'Passenger',
        bookingId: booking.bookingId,
        routeName: booking.routeName,
        boardingPoint: booking.boardingPoint,
        driverContact: booking.driverContact || 'Not available'
      });

      // Send SMS
      await smsService.sendBusArrivingSMS({
        phone: booking.phoneNumber,
        name: booking.passengerName || 'Passenger',
        bookingId: booking.bookingId,
        boardingPoint: booking.boardingPoint,
        driverContact: booking.driverContact || 'Not available'
      });

      // Update booking
      const bookings = JSON.parse(localStorage.getItem('kolhapurBusBookings') || '[]');
      const updatedBooking = bookings.find(b => b.bookingId === booking.bookingId);
      if (updatedBooking) {
        updatedBooking.arrivalEmailSent = true;
        updatedBooking.arrivalSmsSent = true;
        localStorage.setItem('kolhapurBusBookings', JSON.stringify(bookings));
      }

      console.log('Arrival notifications sent for:', booking.bookingId);
    } catch (error) {
      console.error('Failed to send arrival notifications:', error);
    }
  }

  // Send delay notifications
  async sendDelayNotifications(booking, delayMinutes) {
    try {
      const newETA = this.getNewETA(booking.departureTime, delayMinutes);

      // Send Email
      await sendDelayNotificationEmail({
        email: booking.email,
        name: booking.passengerName || 'Passenger',
        bookingId: booking.bookingId,
        routeName: booking.routeName,
        delayMinutes: delayMinutes,
        newETA: newETA
      });

      // Send SMS
      await smsService.sendDelayNotificationSMS({
        phone: booking.phoneNumber,
        name: booking.passengerName || 'Passenger',
        bookingId: booking.bookingId,
        routeName: booking.routeName,
        delayMinutes: delayMinutes,
        newETA: newETA
      });

      // Update booking
      const bookings = JSON.parse(localStorage.getItem('kolhapurBusBookings') || '[]');
      const updatedBooking = bookings.find(b => b.bookingId === booking.bookingId);
      if (updatedBooking) {
        updatedBooking.delayNotificationSent = true;
        localStorage.setItem('kolhapurBusBookings', JSON.stringify(bookings));
      }

      console.log('Delay notifications sent for:', booking.bookingId);
    } catch (error) {
      console.error('Failed to send delay notifications:', error);
    }
  }

  // Send trip completed notifications
  async sendTripCompletedNotifications(booking) {
    try {
      // Send Email
      await sendTripCompletedEmail({
        email: booking.email,
        name: booking.passengerName || 'Passenger',
        bookingId: booking.bookingId,
        routeName: booking.routeName
      });

      // Send SMS
      await smsService.sendTripCompletedSMS({
        phone: booking.phoneNumber,
        name: booking.passengerName || 'Passenger',
        bookingId: booking.bookingId,
        routeName: booking.routeName
      });

      // Update booking
      const bookings = JSON.parse(localStorage.getItem('kolhapurBusBookings') || '[]');
      const updatedBooking = bookings.find(b => b.bookingId === booking.bookingId);
      if (updatedBooking) {
        updatedBooking.tripCompletedEmailSent = true;
        localStorage.setItem('kolhapurBusBookings', JSON.stringify(bookings));
      }

      console.log('Trip completed notifications sent for:', booking.bookingId);
    } catch (error) {
      console.error('Failed to send trip completed notifications:', error);
    }
  }

  // Helper: Parse time string
  parseTime(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }

  // Helper: Get new ETA
  getNewETA(departureTime, delayMinutes) {
    const [time, period] = departureTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes + delayMinutes, 0, 0);

    const newHours = date.getHours();
    const newMinutes = date.getMinutes();
    const newPeriod = newHours >= 12 ? 'PM' : 'AM';
    const displayHours = newHours > 12 ? newHours - 12 : (newHours === 0 ? 12 : newHours);
    const displayMinutes = String(newMinutes).padStart(2, '0');

    return `${displayHours}:${displayMinutes} ${newPeriod}`;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();