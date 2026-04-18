import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const ADMIN_ROLES = ["teacher", "placement_cell", "moderator", "super_admin", "admin"];

/**
 * AdminRoute – Protects admin routes based on user role.
 * Optionally accepts `allowedRoles` to restrict to specific admin roles.
 */
export default function AdminRoute({ children, allowedRoles }) {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const role = userProfile?.role || "student";
  const isAdmin = ADMIN_ROLES.includes(role);

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // If specific roles are required for this route, check them
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
