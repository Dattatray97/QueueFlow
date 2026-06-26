import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context & Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import IndustrySelection from './pages/IndustrySelection';
import UserDashboard from './pages/user/UserDashboard';
import BookAppointment from './pages/user/BookAppointment';
import QueueStatus from './pages/user/QueueStatus';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import QueueManagement from './pages/admin/QueueManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import Analytics from './pages/admin/Analytics';
import UserManagement from './pages/admin/UserManagement';

// Layout wrapper component
const AppLayout = ({ children, requireAuth = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <Navbar onToggleSidebar={toggleSidebar} />
      {requireAuth && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}
      
      <main 
        className={requireAuth ? "main-content" : "main-content-full"} 
        onClick={closeSidebar}
      >
        {children}
      </main>
      
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Industry Selection Route */}
          <Route path="/industry-selection" element={
            <ProtectedRoute requireIndustry={false}>
              <IndustrySelection />
            </ProtectedRoute>
          } />

          {/* User Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <UserDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/book-appointment" element={
            <ProtectedRoute>
              <AppLayout>
                <BookAppointment />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/queue-status" element={
            <ProtectedRoute>
              <AppLayout>
                <QueueStatus />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/queue" element={
            <ProtectedRoute adminOnly={true}>
              <AppLayout>
                <QueueManagement />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/services" element={
            <ProtectedRoute adminOnly={true}>
              <AppLayout>
                <ServiceManagement />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/analytics" element={
            <ProtectedRoute adminOnly={true}>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}>
              <AppLayout>
                <UserManagement />
              </AppLayout>
            </ProtectedRoute>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
