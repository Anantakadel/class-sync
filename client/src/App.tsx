import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CssBaseline} from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AssignmentsPage from './pages/AssignmentsPage';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import NewAssignmentPage from './pages/NewAssignmentPage';
import AssignmentDetailsPage from './pages/AssignmentDetailsPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import SubmissionsPage from './pages/SubmissionsPage';
import SubmitAssignmentPage from './pages/SubmitAssignmentPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ProfilePage from './pages/ProfilePage';
function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <CssBaseline />
      <Routes>
        {/* Landing page for unauthenticated users at root */}
        <Route
          path="/"
          element={
            !user ? (
              <>
                <Navbar user={user} onLogout={handleLogout} />
                <Hero />
                <Footer />
              </>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        {/* Auth pages as popups, but keep routes for direct access */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/assignments/new" element={<NewAssignmentPage />} />
          <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
          <Route path="/assignments/:id/submit" element={<SubmitAssignmentPage />} />
          <Route path="/assignments/:id/submissions" element={<SubmissionsPage />} />
          <Route path="/notifications" element={<NotificationCenterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
