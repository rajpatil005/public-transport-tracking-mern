// client/src/pages/FAQ.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../components/ui/Card';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I book a bus ticket?",
      answer: "You can book tickets through our website, mobile app, or directly at any bus stop counter. Online booking requires registration on our platform."
    },
    {
      question: "What are the bus timings?",
      answer: "Buses operate from 5:45 AM to 10:30 PM daily. Frequency varies by route, typically 15-30 minutes during peak hours and 30-45 minutes during off-peak hours."
    },
    {
      question: "Can I cancel my ticket?",
      answer: "Yes, tickets can be cancelled up to 30 minutes before departure. Cancellation charges may apply based on the time of cancellation."
    },
    {
      question: "How do I track my bus in real-time?",
      answer: "Use our Live Bus Tracking feature on the website or mobile app. Enter your bus number or route to see its current location and estimated arrival time."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept cash, credit/debit cards, UPI (Google Pay, PhonePe, Paytm), and digital wallets. Online payments are securely processed."
    },
    {
      question: "Is there a student concession?",
      answer: "Yes, students with valid ID cards get 50% concession on bus fares. Special passes are available for college students."
    },
    {
      question: "How do I report a lost item?",
      answer: "Contact our lost and found department at 0231-1234567 or visit the Central Bus Stand office. Please provide your bus details and journey information."
    },
    {
      question: "Are the buses wheelchair accessible?",
      answer: "Yes, most of our new buses are equipped with wheelchair ramps and designated spaces for differently-abled passengers."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h1 className="text-3xl font-bold text-center">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-center mt-2">Find answers to common questions about our services</p>
        </Card.Header>

        <Card.Body className="p-6">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 py-3 bg-gray-50 border-t">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-700">
              Still have questions?{' '}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FAQ;