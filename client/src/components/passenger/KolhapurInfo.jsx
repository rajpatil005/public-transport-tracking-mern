// client/src/components/KolhapurInfo.jsx

import React, { useState } from 'react';
import { 
  MapPin, Bus, Clock, Info, Star, Landmark, Coffee, 
  ShoppingBag, Phone, Calendar, Camera, Award, Music, 
  Shield, Warehouse, Utensils, Gift, Navigation, 
  TrendingUp, Users, Filter, Heart, Share2, Cloud,
  Languages, Thermometer, Navigation2, DollarSign,
  Sunrise, Sunset, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import Card from '../ui/Card';
import { 
  kolhapurLandmarks, 
  localTips, 
  kolhapurCuisine, 
  kolhapurFestivals, 
  transportHubs, 
  emergencyContacts,
  historicalFacts,
  nearbyDestinations,
  kolhapuriProducts,
  weatherInfo,
  languageInfo
} from '../../data/kolhapurData';

const KolhapurInfo = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterSpiceLevel, setFilterSpiceLevel] = useState('all');
  const [showWeather, setShowWeather] = useState(false);

  // Filter landmarks based on category
  const filteredLandmarks = selectedCategory === 'all' 
    ? kolhapurLandmarks 
    : kolhapurLandmarks.filter(l => l.type.toLowerCase() === selectedCategory.toLowerCase());

  // Filter cuisine based on spice level
  const filteredCuisine = filterSpiceLevel === 'all'
    ? kolhapurCuisine
    : kolhapurCuisine.filter(c => c.spiceLevel === filterSpiceLevel);

  // Get unique categories
  const categories = ['all', ...new Set(kolhapurLandmarks.map(l => l.type.toLowerCase()))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Weather Widget */}
      <div className="relative h-[60vh] bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/images/kolhapur-city.jpg" 
            alt="Kolhapur City"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Weather Widget */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg z-10">
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Current Weather</p>
              <p className="text-2xl font-bold">28°C</p>
              <p className="text-xs text-gray-500">Pleasant, Light Breeze</p>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Welcome to Kolhapur
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              The City of Goddess Mahalaxmi • Land of Warriors • Spice Capital
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
                <Camera className="h-5 w-5" />
                Explore Gallery
              </button>
              <button 
                onClick={() => setShowWeather(!showWeather)}
                className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Thermometer className="h-5 w-5" />
                Best Time to Visit
              </button>
            </div>

            {/* Weather Info Dropdown */}
            {showWeather && (
              <div className="mt-4 bg-white/20 backdrop-blur rounded-lg p-4 max-w-md mx-auto">
                <h3 className="font-semibold mb-2">Best Time: {weatherInfo.bestTime}</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-white/10 p-2 rounded">
                    <Sunrise className="h-4 w-4 mx-auto mb-1" />
                    <p>Summer</p>
                    <p>{weatherInfo.summer.temp}</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded">
                    <Cloud className="h-4 w-4 mx-auto mb-1" />
                    <p>Monsoon</p>
                    <p>{weatherInfo.monsoon.temp}</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded">
                    <Sunset className="h-4 w-4 mx-auto mb-1" />
                    <p>Winter</p>
                    <p>{weatherInfo.winter.temp}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Bar */}
        <div className="bg-white rounded-lg shadow-lg -mt-16 relative z-20 mb-8 p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{kolhapurLandmarks.length}+</div>
              <div className="text-sm text-gray-600">Attractions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{kolhapurCuisine.length}+</div>
              <div className="text-sm text-gray-600">Local Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">1000+</div>
              <div className="text-sm text-gray-600">Years Old</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">1M+</div>
              <div className="text-sm text-gray-600">Visitors/Year</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{transportHubs.length}</div>
              <div className="text-sm text-gray-600">Transport Hubs</div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {['overview', 'attractions', 'cuisine', 'culture', 'travel'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-medium transition ${
                activeTab === tab 
                  ? 'text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* City Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card>
                <Card.Header>
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Info className="h-6 w-6 mr-2 text-blue-600" />
                    About Kolhapur
                  </h2>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-700 leading-relaxed">
                    Kolhapur is a historic city on the banks of the Panchganga River in the 
                    western Indian state of Maharashtra. Known for its rich cultural heritage, 
                    Kolhapur is famous for the Mahalaxmi Temple, Kolhapuri chappals (footwear), 
                    and spicy Kolhapuri cuisine. The city served as the capital of the Bhosale 
                    dynasty and is known as the 'Dakshin Kashi' (Varanasi of the South).
                  </p>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Languages className="h-6 w-6 mr-2 text-green-600" />
                    Language & Culture
                  </h2>
                </Card.Header>
                <Card.Body>
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Primary:</span> {languageInfo.primary}
                  </p>
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Also Spoken:</span> {languageInfo.secondary.join(', ')}
                  </p>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="font-semibold mb-2">Common Phrases:</p>
                    {languageInfo.commonPhrases.map((phrase, idx) => (
                      <div key={idx} className="flex justify-between text-sm mb-1">
                        <span>{phrase.marathi}</span>
                        <span className="text-gray-500">({phrase.pronunciation})</span>
                        <span className="text-gray-600">- {phrase.english}</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Historical Timeline */}
            <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50">
              <Card.Header>
                <h2 className="text-2xl font-semibold flex items-center">
                  <Award className="h-6 w-6 mr-2 text-amber-600" />
                  Historical Timeline
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-amber-300"></div>
                  {historicalFacts.map((fact, index) => (
                    <div key={index} className="ml-12 mb-6 relative">
                      <div className="absolute -left-8 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-lg">{fact.year}</h3>
                      <p className="text-gray-700">{fact.event}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </>
        )}

        {/* Attractions Tab */}
        {activeTab === 'attractions' && (
          <>
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full capitalize ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Landmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredLandmarks.map((landmark, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedLandmark(landmark)}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {landmark.image ? (
                      <img
                        src={landmark.image}
                        alt={landmark.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
                        <Landmark className="h-16 w-16 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {landmark.mustSee && (
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                          Must See
                        </span>
                      )}
                      <button className="bg-white rounded-full p-2 shadow-lg hover:bg-red-50">
                        <Heart className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{landmark.name}</h3>
                        <p className="text-sm text-blue-600 mb-2">{landmark.type}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{landmark.description}</p>
                        
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {landmark.timing?.split(' ')[0]}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                            {landmark.rating}
                          </span>
                        </div>

                        {landmark.entryFee && landmark.entryFee !== 'Free' && (
                          <div className="mt-2 text-xs text-gray-500">
                            <DollarSign className="h-3 w-3 inline mr-1" />
                            {landmark.entryFee}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Nearby Destinations */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Attractions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {nearbyDestinations.map((destination, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center shadow hover:shadow-lg transition">
                  <Landmark className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">{destination.name}</h3>
                  <p className="text-xs text-gray-500">{destination.distance}</p>
                  <p className="text-xs text-gray-400 mt-1">{destination.time}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Cuisine Tab */}
        {activeTab === 'cuisine' && (
          <>
            {/* Spice Level Filter */}
            <div className="mb-6 flex gap-2">
              {['all', 'Mild', 'Medium', 'Spicy', 'Very Spicy', 'Extremely Spicy'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterSpiceLevel(level)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterSpiceLevel === level
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredCuisine.map((item, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-40 md:h-auto bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
                      <Utensils className="h-12 w-12 text-white" />
                    </div>
                    <div className="md:w-2/3 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-xs text-orange-600 mb-1">{item.type}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.vegetarian ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.vegetarian ? 'Veg' : 'Non-veg'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-xs text-gray-500 mb-1">📍 {item.restaurant}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold">{item.price}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs ml-1">{item.rating}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          {item.spiceLevel}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {item.famousFor}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Famous Products */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Famous Kolhapuri Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {kolhapuriProducts.map((product, index) => (
                <Card key={index}>
                  <Card.Body>
                    <div className="flex items-start">
                      <div className="p-2 bg-purple-100 rounded-lg mr-4">
                        <ShoppingBag className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-purple-600 mb-2">{product.type}</p>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <p className="text-xs text-gray-500 mb-1">📍 Best at: {product.bestPlace}</p>
                        <p className="text-xs text-gray-500 mb-1">💰 {product.priceRange}</p>
                        <p className="text-xs bg-blue-50 text-blue-700 p-1 rounded mt-2">
                          ℹ️ {product.authenticity}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Culture Tab */}
        {activeTab === 'culture' && (
          <>
            {/* Festivals */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Festivals & Celebrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {kolhapurFestivals.map((festival, index) => (
                <Card key={index}>
                  <Card.Body>
                    <div className="flex items-start">
                      <div className="p-2 bg-purple-100 rounded-lg mr-4">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{festival.name}</h3>
                        <p className="text-sm text-purple-600 mb-2">{festival.month} ({festival.duration})</p>
                        <p className="text-sm text-gray-600 mb-3">{festival.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {festival.highlights.map((highlight, idx) => (
                            <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Local Tips */}
            <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50">
              <Card.Header>
                <h2 className="text-2xl font-semibold flex items-center">
                  <Star className="h-6 w-6 mr-2 text-yellow-500" />
                  Insider Tips from Locals
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localTips.slice(0, 8).map((tip, index) => (
                    <div key={index} className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </>
        )}

        {/* Travel Tab */}
        {activeTab === 'travel' && (
          <>
            {/* Transport Hubs */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Around</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {transportHubs.map((hub, index) => (
                <Card key={index} className="hover:border-green-500 transition">
                  <Card.Body>
                    <div className="flex items-center mb-3">
                      <Bus className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-lg">{hub.name}</h3>
                    </div>
                    <p className="text-sm text-green-600 mb-2">{hub.type}</p>
                    <p className="text-xs text-gray-500 mb-3 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {hub.location}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {hub.operatingHours}
                    </p>
                    {hub.contact && (
                      <p className="text-xs text-gray-600 mb-2">
                        <Phone className="h-3 w-3 inline mr-1" />
                        {hub.contact}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hub.facilities.slice(0, 4).map((facility, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {facility}
                        </span>
                      ))}
                    </div>
                    <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
                      <Navigation className="h-3 w-3 mr-1" />
                      Get Directions
                    </button>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Emergency Contacts */}
            <Card className="mb-8 border-red-200">
              <Card.Header>
                <h2 className="text-2xl font-semibold flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-red-600" />
                  Emergency Contacts
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {emergencyContacts.slice(0, 8).map((contact, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition">
                      <Phone className="h-5 w-5 text-red-600 mx-auto mb-2" />
                      <p className="font-semibold text-sm">{contact.service}</p>
                      <p className="text-lg font-bold text-red-600">{contact.number}</p>
                      <p className="text-xs text-gray-500 mt-1">{contact.category}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </>
        )}
      </div>

      {/* Landmark Detail Modal */}
      {selectedLandmark && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedLandmark.name}</h2>
                <button 
                  onClick={() => setSelectedLandmark(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4 h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                <Landmark className="h-16 w-16 text-white" />
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">{selectedLandmark.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-2 rounded">
                    <Clock className="h-4 w-4 text-blue-600 mb-1" />
                    <p className="text-xs text-gray-500">Timing</p>
                    <p className="text-sm font-semibold">{selectedLandmark.timing}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <DollarSign className="h-4 w-4 text-green-600 mb-1" />
                    <p className="text-xs text-gray-500">Entry Fee</p>
                    <p className="text-sm font-semibold">{selectedLandmark.entryFee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{selectedLandmark.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({selectedLandmark.reviews} reviews)</span>
                  </div>
                </div>

                <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors z-40">
        <Navigation2 className="h-6 w-6" />
      </button>
    </div>
  );
};

export default KolhapurInfo;