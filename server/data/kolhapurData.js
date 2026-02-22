// Kolhapur City Bus Routes Data
export const kolhapurRoutes = [
  {
    routeNumber: "101",
    name: "Central Bus Stand → Mahalaxmi Temple → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    distance: 8.5,
    duration: 35,
    fare: 15,
    stops: [
      {
        name: "Central Bus Stand",
        latitude: 16.7017,
        longitude: 74.2431,
        stopOrder: 1,
      },
      {
        name: "Shivaji Chowk",
        latitude: 16.6983,
        longitude: 74.2389,
        stopOrder: 2,
      },
      {
        name: "Mahadwar Road",
        latitude: 16.6942,
        longitude: 74.2347,
        stopOrder: 3,
      },
      {
        name: "Mahalaxmi Temple",
        latitude: 16.6913,
        longitude: 74.2245,
        stopOrder: 4,
      },
      {
        name: "Rankala Lake",
        latitude: 16.6878,
        longitude: 74.2167,
        stopOrder: 5,
      },
    ],
    path: [
      { lat: 16.7017, lng: 74.2431 },
      { lat: 16.6983, lng: 74.2389 },
      { lat: 16.6942, lng: 74.2347 },
      { lat: 16.6913, lng: 74.2245 },
      { lat: 16.6878, lng: 74.2167 },
    ],
  },
];

// Kolhapur Buses Data (✅ FIXED ENUM VALUES)
export const kolhapurBuses = [
  {
    busNumber: "MH09-1234",
    registrationNumber: "MH09AB1234",
    capacity: 52,
    routeNumber: "101",
    driverName: "Rajendra Patil",
    status: "ACTIVE",
  },
  {
    busNumber: "MH09-5678",
    registrationNumber: "MH09CD5678",
    capacity: 45,
    routeNumber: "102",
    driverName: "Sanjay Deshmukh",
    status: "ACTIVE",
  },
  {
    busNumber: "MH09-9101",
    registrationNumber: "MH09EF9101",
    capacity: 60,
    routeNumber: "103",
    driverName: "Prakash Jadhav",
    status: "ACTIVE",
  },
  {
    busNumber: "MH09-1121",
    registrationNumber: "MH09GH1121",
    capacity: 52,
    routeNumber: "104",
    driverName: "Vijay More",
    status: "INACTIVE",
  },
  {
    busNumber: "MH09-3141",
    registrationNumber: "MH09IJ3141",
    capacity: 45,
    routeNumber: "105",
    driverName: "Dattatray Kambale",
    status: "ACTIVE",
  },
];

// Important Kolhapur Locations
export const kolhapurLandmarks = [
  { name: "Mahalaxmi Temple", lat: 16.6913, lng: 74.2245, type: "temple" },
  { name: "New Palace", lat: 16.7031, lng: 74.2586, type: "historical" },
  { name: "Rankala Lake", lat: 16.6878, lng: 74.2167, type: "lake" },
  { name: "Shivaji University", lat: 16.7222, lng: 74.2481, type: "education" },
  { name: "Central Bus Stand", lat: 16.7017, lng: 74.2431, type: "transport" },
  { name: "CPR Hospital", lat: 16.7083, lng: 74.2356, type: "hospital" },
  { name: "DYP City Mall", lat: 16.7125, lng: 74.2253, type: "shopping" },
  { name: "Khasbag Maidan", lat: 16.6947, lng: 74.2408, type: "sports" },
];

export default {
  kolhapurRoutes,
  kolhapurBuses,
  kolhapurLandmarks,
};
