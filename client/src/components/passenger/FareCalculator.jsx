// client/src/components/passenger/FareCalculator.jsx
import React, { useState } from 'react';
import { MapPin, Calculator, IndianRupee, Bus } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const FareCalculator = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateFare = () => {
    setLoading(true);
    // Mock calculation - in real app, this would call an API
    setTimeout(() => {
      const baseFare = 10;
      const perKmRate = 2;
      const randomDistance = Math.floor(Math.random() * 20) + 5;
      const calculatedFare = baseFare + (randomDistance * perKmRate);
      setDistance(randomDistance);
      setFare(calculatedFare);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-blue-600" />
            Fare Calculator
          </h2>
          <p className="text-gray-600 mt-2">Calculate your bus fare between any two stops in Kolhapur</p>
        </Card.Header>
        
        <Card.Body className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Stop</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select source stop</option>
                <option value="CBS">Central Bus Stand (CBS)</option>
                <option value="Mahalaxmi">Mahalaxmi Temple</option>
                <option value="Rankala">Rankala Lake</option>
                <option value="Shahupuri">Shahupuri</option>
                <option value="Tarabai">Tarabai Park</option>
                <option value="Kagal">Kagal Naka</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination Stop</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select destination stop</option>
                <option value="CBS">Central Bus Stand (CBS)</option>
                <option value="Mahalaxmi">Mahalaxmi Temple</option>
                <option value="Rankala">Rankala Lake</option>
                <option value="Shahupuri">Shahupuri</option>
                <option value="Tarabai">Tarabai Park</option>
                <option value="Kagal">Kagal Naka</option>
              </select>
            </div>

            <Button 
              onClick={calculateFare} 
              disabled={!source || !destination || loading}
              fullWidth
            >
              {loading ? 'Calculating...' : 'Calculate Fare'}
            </Button>

            {fare > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="text-2xl font-bold text-blue-600">{distance} km</p>
                </div>
                <div className="text-center mt-3">
                  <p className="text-sm text-gray-600">Estimated Fare</p>
                  <p className="text-3xl font-bold text-green-600">₹{fare}</p>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  *Fare includes base fare + distance charges. Actual fare may vary.
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FareCalculator;