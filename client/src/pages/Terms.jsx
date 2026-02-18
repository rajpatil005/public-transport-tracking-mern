// client/src/pages/Terms.jsx
import React from 'react';
import Card from '../components/ui/Card';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h1 className="text-3xl font-bold text-center">Terms & Conditions</h1>
          <p className="text-gray-600 text-center mt-2">Last updated: January 15, 2024</p>
        </Card.Header>

        <Card.Body className="p-6">
          <div className="prose max-w-none space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using the Kolhapur City Bus Transport System website and services, 
                you agree to be bound by these Terms and Conditions. If you do not agree with any 
                part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Booking and Payment</h2>
              <p className="text-gray-700">
                All ticket bookings are subject to availability. Payment must be made at the time 
                of booking. We accept various payment methods including credit/debit cards, UPI, 
                and digital wallets. Ticket prices are non-negotiable and subject to change without 
                prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Cancellation and Refund</h2>
              <p className="text-gray-700">
                Tickets can be cancelled up to 30 minutes before the scheduled departure time. 
                Refunds will be processed within 5-7 working days. Cancellation charges may apply 
                as per our refund policy. No refunds will be issued for no-shows.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Passenger Responsibilities</h2>
              <p className="text-gray-700">
                Passengers must carry a valid ticket or pass while traveling. Please arrive at the 
                bus stop at least 5 minutes before the scheduled departure. The management reserves 
                the right to refuse boarding to passengers who are unruly or under the influence of 
                alcohol/drugs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Luggage Policy</h2>
              <p className="text-gray-700">
                Each passenger is allowed to carry up to 15 kg of luggage. Excess luggage may be 
                charged extra. Dangerous or illegal items are strictly prohibited. The management 
                is not responsible for lost or stolen items.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Service Modifications</h2>
              <p className="text-gray-700">
                We reserve the right to modify or discontinue any service without prior notice. 
                We are not liable for any delays caused by traffic, weather conditions, or other 
                unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Privacy Policy</h2>
              <p className="text-gray-700">
                Your use of our services is also governed by our Privacy Policy. Please review our 
                Privacy Policy to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
              <p className="text-gray-700">
                For any questions regarding these Terms and Conditions, please contact us at:
                <br />
                Email: legal@kolhapur-bus.com
                <br />
                Phone: +91 231 1234567
                <br />
                Address: Central Bus Stand, Kolhapur - 416001
              </p>
            </section>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Terms;