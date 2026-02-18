// client/src/data/kolhapurData.js

// Kolhapur Landmarks Data
export const kolhapurLandmarks = [
  { 
    name: "Mahalaxmi Temple", 
    type: "Temple", 
    description: "Famous temple of Goddess Mahalaxmi, one of the Shakti Peethas",
    icon: "Landmark",
    lat: 16.6913,
    lng: 74.2245,
    image: "/assets/images/mahalaxmi-temple.jpg"
  },
  { 
    name: "New Palace", 
    type: "Historical", 
    description: "Royal palace built in 1877, now a museum showcasing Kolhapur's history",
    icon: "Landmark",
    lat: 16.7031,
    lng: 74.2586,
    image: "/assets/images/kolhapur-palace.jpg"
  },
  { 
    name: "Rankala Lake", 
    type: "Lake", 
    description: "Scenic lake with evening views, boating facilities and walking track",
    icon: "Landmark",
    lat: 16.6878,
    lng: 74.2167,
    image: "/assets/images/rankala-lake.jpg"
  },
  { 
    name: "Shivaji University", 
    type: "Education", 
    description: "Premier educational institution established in 1962",
    icon: "Landmark",
    lat: 16.7222,
    lng: 74.2481,
    image: null
  },
  { 
    name: "Panhala Fort", 
    type: "Historical", 
    description: "Historic fort 20 km from Kolhapur, significant in Maratha history",
    icon: "Landmark",
    lat: 16.8094,
    lng: 74.1103,
    image: null
  },
  { 
    name: "Jyotiba Temple", 
    type: "Temple", 
    description: "Important temple on a hill near Kolhapur",
    icon: "Landmark",
    lat: 16.8861,
    lng: 74.2750,
    image: null
  },
  { 
    name: "DYP City Mall", 
    type: "Shopping", 
    description: "Modern shopping complex with multiplex and food court",
    icon: "ShoppingBag",
    lat: 16.7125,
    lng: 74.2253,
    image: null
  },
  { 
    name: "Khasbag Maidan", 
    type: "Sports", 
    description: "Traditional wrestling ground and sports complex",
    icon: "Landmark",
    lat: 16.6947,
    lng: 74.2408,
    image: null
  }
];

// Kolhapur Local Tips
export const localTips = [
  "Best time to visit Mahalaxmi Temple is early morning (5:00 AM - 7:00 AM) to avoid crowds",
  "Try authentic Kolhapuri Misal and Tambda Pandhara Rassa at local stalls near Mahadwar Road",
  "Evening boat ride at Rankala Lake is a must-do experience, especially during sunset",
  "Visit Khasbag Maidan during wrestling competitions (typically in winter months)",
  "Buy genuine Kolhapuri chappals from Shahupuri market, not tourist shops",
  "The New Palace museum is closed on Mondays, plan accordingly",
  "Take a day trip to Panhala Fort for historical sites and scenic views",
  "Try local sweet 'Kandya Pedhe' from famous sweet shops in the city",
  "The city is famous for its wrestling culture - try to catch a match if possible",
  "During Ganesh festival, the city comes alive with decorations and celebrations"
];

// Kolhapur Cuisine Data
export const kolhapurCuisine = [
  {
    name: "Kolhapuri Misal",
    description: "Spicy curry with sprouts, topped with farsan and onions",
    restaurant: "Joshi Mishal Bhandar, Shivaji Chowk"
  },
  {
    name: "Tambda Rassa",
    description: "Red spicy mutton curry made with special Kolhapuri spices",
    restaurant: "Hotel Shahu, Shahupuri"
  },
  {
    name: "Pandhara Rassa",
    description: "White coconut-based mutton gravy, mild and flavorful",
    restaurant: "Hotel Shahu, Shahupuri"
  },
  {
    name: "Kolhapuri Chicken",
    description: "Authentic spicy chicken preparation",
    restaurant: "Devi Das Ji, Station Road"
  },
  {
    name: "Kandya Pedhe",
    description: "Local sweet made from khoa and sugar",
    restaurant: "Bhausaheb Kandya Pedhe, Mahadwar Road"
  }
];

// Kolhapur Festivals
export const kolhapurFestivals = [
  {
    name: "Mahalaxmi Festival",
    month: "September-October",
    description: "10-day festival at Mahalaxmi Temple with special prayers and cultural events"
  },
  {
    name: "Ganesh Festival",
    month: "August-September",
    description: "Grand celebrations with elaborate pandals across the city"
  },
  {
    name: "Shivaji Maharaj Jayanti",
    month: "February",
    description: "Celebration of Chhatrapati Shivaji Maharaj's birth anniversary"
  },
  {
    name: "Khasbag Wrestling Competition",
    month: "December-January",
    description: "Traditional wrestling tournament attracting wrestlers from across India"
  }
];

// Transportation Hubs
export const transportHubs = [
  {
    name: "Central Bus Stand (CBS)",
    type: "Bus Station",
    location: "Station Road",
    facilities: ["Ticket Counters", "Waiting Room", "Canteen", "Toilets", "Parking"],
    routes: ["All city buses", "Intercity buses"]
  },
  {
    name: "Kolhapur Railway Station",
    type: "Railway Station",
    location: "Station Road",
    facilities: ["Ticket Counters", "Waiting Room", "Food Stalls", "ATM", "Parking"],
    routes: ["Mumbai", "Pune", "Bangalore", "Delhi", "Chennai"]
  },
  {
    name: "Kolhapur Airport",
    type: "Airport",
    location: "Ujlaiwadi",
    facilities: ["Check-in counters", "Waiting lounge", "Cafe", "Parking"],
    routes: ["Mumbai", "Hyderabad", "Bangalore"]
  }
];

// Emergency Contacts
export const emergencyContacts = [
  { service: "Police", number: "100" },
  { service: "Ambulance", number: "108" },
  { service: "Fire Brigade", number: "101" },
  { service: "Women Helpline", number: "1091" },
  { service: "Child Helpline", number: "1098" },
  { service: "Bus Enquiry", number: "0231-2521234" },
  { service: "Railway Enquiry", number: "139" },
  { service: "Airport Enquiry", number: "0231-2521234" }
];

// Export all data
export default {
  kolhapurLandmarks,
  localTips,
  kolhapurCuisine,
  kolhapurFestivals,
  transportHubs,
  emergencyContacts
};