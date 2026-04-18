import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { NotificationProvider } from "./Contexts/NotificationContext";
import { AuthProvider } from "./Contexts/AuthContext";
import { AdminProvider } from "./Contexts/AdminContext";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Connections from "./Pages/Connections";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/Admin/AdminRoute";
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";
import Explore from "./Pages/Explore";
import Notifications from "./Pages/Notification";
import Workspace from "./Pages/Workshpace";
import Help from "./Pages/Help";
import ProfileForm from "./Components/Profile/ProfileForm";

import GlobalProfile from "./Pages/GlobalProfile";

// Admin Pages
import AdminOverview from "./Pages/Admin/AdminOverview";
import AdminStudents from "./Pages/Admin/AdminStudents";
import AdminStudentDetail from "./Pages/Admin/AdminStudentDetail";
import AdminSkillTrends from "./Pages/Admin/AdminSkillTrends";
import AdminFlags from "./Pages/Admin/AdminFlags";
import AdminReports from "./Pages/Admin/AdminReports";
import AdminSettings from "./Pages/Admin/AdminSettings";

export default function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <AdminProvider>
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
                <Route path="/profile/:userId" element={<GlobalProfile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/workspace/:projectId" element={<Workspace />} />
                <Route path="/help" element={<Help />} />
              </Route>

              {/* Admin Layout */}
              <Route
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/students" element={<AdminStudents />} />
                <Route path="/admin/students/:userId" element={<AdminStudentDetail />} />
                <Route path="/admin/skills" element={<AdminSkillTrends />} />
                <Route path="/admin/flags" element={
                  <AdminRoute allowedRoles={["moderator", "super_admin", "admin"]}>
                    <AdminFlags />
                  </AdminRoute>
                } />
                <Route path="/admin/reports" element={
                  <AdminRoute allowedRoles={["placement_cell", "super_admin", "admin"]}>
                    <AdminReports />
                  </AdminRoute>
                } />
                <Route path="/admin/settings" element={
                  <AdminRoute allowedRoles={["super_admin", "admin"]}>
                    <AdminSettings />
                  </AdminRoute>
                } />
              </Route>
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}
