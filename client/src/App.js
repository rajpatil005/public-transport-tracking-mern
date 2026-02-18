// client/src/App.js
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

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";

// Passenger Components
import HomePage from "./components/passenger/HomePage";
import BookTicket from "./components/passenger/BookTicket";
import TrackBus from "./components/passenger/TrackBus";
import KolhapurInfo from "./components/passenger/KolhapurInfo";
import SearchRoute from "./components/passenger/SearchRoute";
import MyBookings from "./components/passenger/MyBookings";
import FareCalculator from "./components/passenger/FareCalculator";
import NearestBusStop from "./components/passenger/NearestBusStop";
import BusSchedule from "./components/passenger/BusSchedule";

// Admin Components
import Dashboard from "./components/admin/Dashboard";
import ManageBuses from "./components/admin/ManageBuses";
import ManageRoutes from "./components/admin/ManageRoutes";
import ManageDrivers from "./components/admin/ManageDrivers";
import Analytics from "./components/admin/Analytics";
import Reports from "./components/admin/Reports";

// Driver Components
import DriverDashboard from "./components/driver/DriverDashboard";
import UpdateLocation from "./components/driver/UpdateLocation";
import MySchedule from "./components/driver/MySchedule";

// Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";


// Layout Wrapper
const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideLayoutPaths = ["/login", "/register"];
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideLayout && <Navbar />}
      <main className={`flex-grow ${!shouldHideLayout ? "pt-16" : ""}`}>
        {children}
      </main>
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

              {/* Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Passenger */}
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

              {/* Public Info Pages */}
              <Route path="/kolhapur-info" element={<KolhapurInfo />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Admin */}
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

              {/* Driver */}
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
