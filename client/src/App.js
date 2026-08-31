import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketProvider";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";

import LandingPage from "./components/passenger/LandingPage";
import HomePage from "./components/passenger/HomePage";
import BookTicket from "./components/passenger/BookTicket";
import TrackBus from "./components/passenger/TrackBus";
import KolhapurInfo from "./components/passenger/KolhapurInfo";
import SearchRoute from "./components/passenger/SearchRoute";
import MyBookings from "./components/passenger/MyBookings";
import FareCalculator from "./components/passenger/FareCalculator";
import NearestBusStop from "./components/passenger/NearestBusStop";
import BusSchedule from "./components/passenger/BusSchedule";
import ChatBox from "./components/passenger/ChatBox";

import Dashboard from "./components/admin/Dashboard";
import ManageBuses from "./components/admin/ManageBuses";
import ManageRoutes from "./components/admin/ManageRoutes";
import ManageDrivers from "./components/admin/ManageDrivers";
import Analytics from "./components/admin/Analytics";
import Reports from "./components/admin/Reports";

import DriverDashboard from "./components/driver/DriverDashboard";
import UpdateLocation from "./components/driver/UpdateLocation";
import MySchedule from "./components/driver/MySchedule";


import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

import UserProfile from './components/user/UserProfile';
import Settings from './components/user/Settings';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideLayoutPaths = ["/", "/login", "/register"];
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!shouldHideLayout && <Navbar />}
      <main className={`flex-grow ${!shouldHideLayout ? "pt-16" : ""}`}>
        {children}
      </main>
      {!shouldHideLayout && <ChatBox />}
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Landing Page - First page visitors see */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Passenger Routes */}
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/track-bus/:busId"
                element={
                  <PrivateRoute>
                    <TrackBus />
                  </PrivateRoute>
                }
              />

              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <SearchRoute />
                  </PrivateRoute>
                }
              />

              <Route
                path="/book-ticket/:routeId"
                element={
                  <PrivateRoute>
                    <BookTicket />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-bookings"
                element={
                  <PrivateRoute>
                    <MyBookings />
                  </PrivateRoute>
                }
              />

              <Route
                path="/fare-calculator"
                element={
                  <PrivateRoute>
                    <FareCalculator />
                  </PrivateRoute>
                }
              />

              <Route
                path="/nearby-stops"
                element={
                  <PrivateRoute>
                    <NearestBusStop />
                  </PrivateRoute>
                }
              />
           

              <Route
                path="/schedule"
                element={
                  <PrivateRoute>
                    <BusSchedule />
                  </PrivateRoute>
                }
              />

              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />

              {/* Public Info Pages */}
              <Route path="/kolhapur-info" element={<KolhapurInfo />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute role="admin">
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/buses"
                element={
                  <PrivateRoute role="admin">
                    <ManageBuses />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/routes"
                element={
                  <PrivateRoute role="admin">
                    <ManageRoutes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/drivers"
                element={
                  <PrivateRoute role="admin">
                    <ManageDrivers />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <PrivateRoute role="admin">
                    <Analytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <PrivateRoute role="admin">
                    <Reports />
                  </PrivateRoute>
                }
              />

              {/* Driver Routes */}
              <Route
                path="/driver"
                element={
                  <PrivateRoute role="driver">
                    <DriverDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/driver/update-location"
                element={
                  <PrivateRoute role="driver">
                    <UpdateLocation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/driver/schedule"
                element={
                  <PrivateRoute role="driver">
                    <MySchedule />
                  </PrivateRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;