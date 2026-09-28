import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./admin/contexts/AdminContext";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// Admin Management Pages
import BlogsManagement from "./admin/pages/BlogsManagement";
import ProgramsManagement from "./admin/pages/ProgramsManagement";
import EventsManagement from "./admin/pages/EventsManagement";
import GalleryManagement from "./admin/pages/GalleryManagement";
import GetInvolvedManagement from "./admin/pages/GetInvolvedManagement";
import ContactsManagement from "./admin/pages/ContactsManagement";
import DonationsManagement from "./admin/pages/DonationsManagement";
import TestimonialsManagement from "./admin/pages/TestimonialsManagement";
import Settings from "./admin/pages/Settings";

// Public Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Getinvolved from "./pages/Getinvolved";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";

function App() {
  return (
    <Router>
      <AdminProvider>
        <Routes>
          {/* ============================================
              ADMIN ROUTES (Protected)
          ============================================ */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="blogs" element={<BlogsManagement />} />
            <Route path="programs" element={<ProgramsManagement />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="getinvolved" element={<GetInvolvedManagement />} />
            <Route path="contacts" element={<ContactsManagement />} />
            <Route path="donations" element={<DonationsManagement />} />
            <Route path="testimonials" element={<TestimonialsManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ============================================
              PUBLIC ROUTES
          ============================================ */}
          
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* About Route */}
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <About />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Programs Route */}
          <Route
            path="/programs"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Programs />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Blog Route */}
          <Route
            path="/blog"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Blog />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Blog Post Detail Route */}
          <Route
            path="/blog/:slug"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Blog />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Gallery Route */}
          <Route
            path="/gallery"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Gallery />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Get Involved Route */}
          <Route
            path="/getinvolved"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Getinvolved />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Contact Route */}
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Contact />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Donate Route */}
          <Route
            path="/donate"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Donate />
                </main>
                <Footer />
              </>
            }
          />

          {/* ============================================
              404 - Catch all unmatched routes
          ============================================ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default App;