import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { NotificationProvider } from "./Contexts/NotificationContext";
import { AuthProvider } from "./Contexts/AuthContext";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Connections from "./Pages/Connections";
import ProtectedRoute from "./Components/ProtectedRoute";
import MainLayout from "./Layout/MainLayout";
import Explore from "./Pages/Explore";
import Notifications from "./Pages/Notification";
import Workspace from "./Pages/Workshpace";
import Help from "./Pages/Help";
import ProfileForm from "./Components/Profile/ProfileForm";

export default function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <Routes>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/workspace/:projectId" element={<Workspace />} />
              <Route path="/help" element={<Help />} />
            </Route>
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}
