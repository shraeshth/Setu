import React from "react";
import { Navigate } from "react-router-dom/dist/index.d.mts";
import { useAuth } from "../Contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    // Not logged in — redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
}
