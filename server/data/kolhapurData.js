// ================= KOLHAPUR CITY ROUTES =================

export const kolhapurRoutes = [
  {
    routeNumber: "101",
    name: "Central Bus Stand → Mahalaxmi Temple → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Shivaji Chowk", latitude: 16.6983, longitude: 74.2389 },
      { name: "Mahadwar Road", latitude: 16.6942, longitude: 74.2347 },
      { name: "Mahalaxmi Temple", latitude: 16.6913, longitude: 74.2245 },
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
    ],
    path: [
      { lat: 16.7017, lng: 74.2431 },
      { lat: 16.6983, lng: 74.2389 },
      { lat: 16.6942, lng: 74.2347 },
      { lat: 16.6913, lng: 74.2245 },
      { lat: 16.6878, lng: 74.2167 },
    ],
  },

  {
    routeNumber: "102",
    name: "Central Bus Stand → New Palace → DYP City Mall",
    source: "Central Bus Stand",
    destination: "DYP City Mall",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Shivaji Chowk", latitude: 16.6983, longitude: 74.2389 },
      { name: "New Palace", latitude: 16.7031, longitude: 74.2586 },
      { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481 },
      { name: "DYP City Mall", latitude: 16.7125, longitude: 74.2253 },
    ],
    path: [
      { lat: 16.7017, lng: 74.2431 },
      { lat: 16.6983, lng: 74.2389 },
      { lat: 16.7031, lng: 74.2586 },
      { lat: 16.7222, lng: 74.2481 },
      { lat: 16.7125, lng: 74.2253 },
    ],
  },

  {
    routeNumber: "103",
    name: "Rankala Lake → CPR Hospital → Khasbag Maidan",
    source: "Rankala Lake",
    destination: "Khasbag Maidan",
    stops: [
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
      { name: "Mahadwar Road", latitude: 16.6942, longitude: 74.2347 },
      { name: "Shivaji Chowk", latitude: 16.6983, longitude: 74.2389 },
      { name: "CPR Hospital", latitude: 16.7083, longitude: 74.2356 },
      { name: "Khasbag Maidan", latitude: 16.6947, longitude: 74.2408 },
    ],
    path: [
      { lat: 16.6878, lng: 74.2167 },
      { lat: 16.6942, lng: 74.2347 },
      { lat: 16.6983, lng: 74.2389 },
      { lat: 16.7083, lng: 74.2356 },
      { lat: 16.6947, lng: 74.2408 },
    ],
  },

  {
    routeNumber: "104",
    name: "Shivaji University → Central Bus Stand",
    source: "Shivaji University",
    destination: "Central Bus Stand",
    stops: [
      { name: "Shivaji University", latitude: 16.7222, longitude: 74.2481 },
      { name: "New Palace", latitude: 16.7031, longitude: 74.2586 },
      { name: "Shivaji Chowk", latitude: 16.6983, longitude: 74.2389 },
      { name: "Mahadwar Road", latitude: 16.6942, longitude: 74.2347 },
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
    ],
    path: [
      { lat: 16.7222, lng: 74.2481 },
      { lat: 16.7031, lng: 74.2586 },
      { lat: 16.6983, lng: 74.2389 },
      { lat: 16.6942, lng: 74.2347 },
      { lat: 16.7017, lng: 74.2431 },
    ],
  },

  {
    routeNumber: "105",
    name: "Central Bus Stand → DYP City Mall → Rankala Lake",
    source: "Central Bus Stand",
    destination: "Rankala Lake",
    stops: [
      { name: "Central Bus Stand", latitude: 16.7017, longitude: 74.2431 },
      { name: "Shivaji Chowk", latitude: 16.6983, longitude: 74.2389 },
      { name: "New Palace", latitude: 16.7031, longitude: 74.2586 },
      { name: "DYP City Mall", latitude: 16.7125, longitude: 74.2253 },
      { name: "Rankala Lake", latitude: 16.6878, longitude: 74.2167 },
    ],
    path: [
      { lat: 16.7017, lng: 74.2431 },
      { lat: 16.6983, lng: 74.2389 },
      { lat: 16.7031, lng: 74.2586 },
      { lat: 16.7125, lng: 74.2253 },
      { lat: 16.6878, lng: 74.2167 },
    ],
  },
];

// ================= BUSES =================

export const kolhapurBuses = [
  {
    busNumber: "MH09-1234",
    capacity: 52,
    routeNumber: "101",
    driverName: "Rajendra Patil",
    status: "ACTIVE",
  },
  {
    busNumber: "MH09-5678",
    capacity: 45,
    routeNumber: "102",
    driverName: "Sanjay Deshmukh",
    status: "ACTIVE",
  },
  {
    busNumber: "MH09-9101",
    capacity: 60,
    routeNumber: "103",
    driverName: "Prakash Jadhav",
    status: "ACTIVE",
  },
  {
    busNumber: "MH09-1121",
    capacity: 52,
    routeNumber: "104",
    driverName: "Vijay More",
    status: "ACTIVE",
  },
  {
    busNumber: "MH09-3141",
    capacity: 45,
    routeNumber: "105",
    driverName: "Dattatray Kambale",
    status: "ACTIVE",
  },
];

export default {
  kolhapurRoutes,
  kolhapurBuses,
};
