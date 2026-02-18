// client/src/pages/Privacy.jsx
import React from 'react';
import Card from '../components/ui/Card';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
          <p className="text-gray-600 text-center mt-2">Last updated: January 15, 2024</p>
        </Card.Header>

        <Card.Body className="p-6">
          <div className="prose max-w-none space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information you provide directly to us, such as when you create an account, 
                make a booking, or contact us for support. This may include your name, email address, 
                phone number, and payment information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Process your bookings and payments</li>
                <li>Send you booking confirmations and updates</li>
                <li>Provide customer support</li>
                <li>Improve our services and user experience</li>
                <li>Send you promotional offers (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
              <p className="text-gray-700">
                We do not sell, trade, or rent your personal information to third parties. We may 
                share your information with:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Payment processors to complete transactions</li>
                <li>Law enforcement when required by law</li>
                <li>Service providers who assist in our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or 
                destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Cookies and Tracking</h2>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to enhance your browsing experience, 
                analyze site traffic, and understand where our visitors come from. You can control 
                cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <p className="text-gray-700">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not directed to individuals under the age of 13. We do not knowingly 
                collect personal information from children. If you become aware that a child has 
                provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@kolhapur-bus.com
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

export default Privacy;