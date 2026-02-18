// client/src/components/passenger/SearchRoute.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Bus, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SearchRoute = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Mock search results
    setSearchResults([
      { id: 1, routeNumber: '101', name: 'CBS → Rankala', source: 'CBS', destination: 'Rankala', fare: 15 },
      { id: 2, routeNumber: '102', name: 'Shahupuri → JN', source: 'Shahupuri', destination: 'Jawahar Nagar', fare: 12 },
      { id: 3, routeNumber: '103', name: 'Tarabai Park → Kagal', source: 'Tarabai Park', destination: 'Kagal', fare: 25 },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Bus Routes</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter route number, source, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      <div className="space-y-4">
        {searchResults.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/book-ticket/${route.id}`)}
          >
            <Card.Body className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Route {route.routeNumber}</h3>
                  <p className="text-gray-600">{route.name}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {route.source} → {route.destination}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">₹{route.fare}</p>
                  <Button size="sm" className="mt-2">
                    Book <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchRoute;