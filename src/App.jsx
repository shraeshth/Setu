import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ProfileForm from "./Components/Profile/ProfileForm";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/edit" element={<ProfileForm />} />

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
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
