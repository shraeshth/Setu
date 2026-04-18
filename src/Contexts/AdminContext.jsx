import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import {
  collection, getDocs, query, where, orderBy, limit,
  doc, getDoc, updateDoc, addDoc, serverTimestamp, onSnapshot
} from "firebase/firestore";

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

const ADMIN_ROLES = ["teacher", "placement_cell", "moderator", "super_admin", "admin"];

export function AdminProvider({ children }) {
  const { currentUser, userProfile } = useAuth();

  const role = userProfile?.role || "student";
  const isAdmin = ADMIN_ROLES.includes(role);
  const department = userProfile?.department || null;

  // ----- Platform Stats (overview) -----
  const [platformStats, setPlatformStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ----- Flags (for moderators) -----
  const [flags, setFlags] = useState([]);
  const [flagsLoading, setFlagsLoading] = useState(false);

  // ----- System Config (for super admin) -----
  const [systemConfig, setSystemConfig] = useState({
    weights: { technical: 0.35, communication: 0.25, reliability: 0.20, mentorship: 0.20 },
    thresholds: { collusion: 4.5, inactivityDays: 21, isolationDays: 14, negativeTrendDrop: 15 }
  });

  // =========================================
  // FETCH PLATFORM STATS
  // =========================================
  const fetchPlatformStats = useCallback(async () => {
    if (!isAdmin) return;
    setStatsLoading(true);
    try {
      const [usersSnap, collabsSnap, connectionsSnap, reviewsSnap, tasksSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "collaborations")),
        getDocs(query(collection(db, "connections"), where("status", "==", "accepted"))),
        getDocs(collection(db, "reviews")),
        getDocs(collection(db, "collab_tasks")),
      ]);

      const users = usersSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => !ADMIN_ROLES.includes(u.role));
      const collabs = collabsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const tasks = tasksSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const activeCollabs = collabs.filter(c => c.status !== "completed" && c.status !== "archived");
      const completedCollabs = collabs.filter(c => c.status === "completed");
      const completedTasks = tasks.filter(t => t.status === "completed");

      // Skill frequency map
      const skillMap = {};
      users.forEach(u => {
        (u.skills || []).forEach(s => {
          skillMap[s] = (skillMap[s] || 0) + 1;
        });
      });
      const topSkills = Object.entries(skillMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      // Active users (last 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const activeUsers = users.filter(u => {
        const last = u.lastActiveAt?.toDate?.() || (u.lastActiveAt ? new Date(u.lastActiveAt) : null);
        return last && last > sevenDaysAgo;
      });

      setPlatformStats({
        totalUsers: users.length,
        activeUsersLast7Days: activeUsers.length,
        totalCollaborations: collabs.length,
        activeCollaborations: activeCollabs.length,
        completedCollaborations: completedCollabs.length,
        totalConnections: connectionsSnap.size,
        totalReviews: reviewsSnap.size,
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        taskCompletionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
        topSkills,
        users // keep for student list
      });
    } catch (err) {
      console.error("Error fetching platform stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [isAdmin]);

  // =========================================
  // FETCH STUDENTS (with computed scores)
  // =========================================
  const fetchStudents = useCallback(async (filters = {}) => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let students = usersSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => !ADMIN_ROLES.includes(s.role));

      // Apply department filter for teachers
      if (role === "teacher" && department) {
        students = students.filter(s => s.department === department);
      }

      // Apply skill filter
      if (filters.skill) {
        students = students.filter(s =>
          (s.skills || []).some(sk => sk.toLowerCase().includes(filters.skill.toLowerCase()))
        );
      }

      // Apply department filter from query
      if (filters.department) {
        students = students.filter(s => s.department === filters.department);
      }

      // Apply search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        students = students.filter(s =>
          (s.displayName || "").toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q) ||
          (s.skills || []).some(sk => sk.toLowerCase().includes(q))
        );
      }

      // Enrich with additional stats
      const enriched = await Promise.all(students.map(async (s) => {
        const [connReq, connRec, collabs] = await Promise.all([
          getDocs(query(collection(db, "connections"), where("requesterId", "==", s.id), where("status", "==", "accepted"))),
          getDocs(query(collection(db, "connections"), where("receiverId", "==", s.id), where("status", "==", "accepted"))),
          getDocs(query(collection(db, "collaborations"), where("memberIds", "array-contains", s.id)))
        ]);

        return {
          ...s,
          connectionsCount: connReq.size + connRec.size,
          collaborationsCount: collabs.size,
          credibilityScore: s.credibilityScore || s.credibilityscore || 0
        };
      }));

      // Sort
      const sortBy = filters.sortBy || "credibilityScore";
      const sortOrder = filters.sortOrder || "desc";
      enriched.sort((a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      });

      return enriched;
    } catch (err) {
      console.error("Error fetching students:", err);
      return [];
    }
  }, [role, department]);

  // =========================================
  // FETCH SINGLE STUDENT ANALYTICS
  // =========================================
  const fetchStudentAnalytics = useCallback(async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return null;
      const userData = userDoc.data();
      
      // Don't show analytics for admin profiles
      if (ADMIN_ROLES.includes(userData.role)) return null;

      const profile = { id: userDoc.id, ...userData };

      const [connReq, connRec, collabs, tasks, reviewsGiven, reviewsReceived] = await Promise.all([
        getDocs(query(collection(db, "connections"), where("requesterId", "==", userId), where("status", "==", "accepted"))),
        getDocs(query(collection(db, "connections"), where("receiverId", "==", userId), where("status", "==", "accepted"))),
        getDocs(query(collection(db, "collaborations"), where("memberIds", "array-contains", userId))),
        getDocs(query(collection(db, "collab_tasks"), where("assigneeId", "==", userId))),
        getDocs(query(collection(db, "reviews"), where("reviewerId", "==", userId))),
        getDocs(query(collection(db, "reviews"), where("revieweeId", "==", userId)))
      ]);

      const allTasks = tasks.docs.map(d => ({ id: d.id, ...d.data() }));
      const completedTasks = allTasks.filter(t => t.status === "completed" || t.status === "Done" || t.status === "Completed");
      const collabList = collabs.docs.map(d => ({ id: d.id, ...d.data() }));
      const receivedReviews = reviewsReceived.docs.map(d => ({ id: d.id, ...d.data() }));

      // Compute credibility dimensions
      const techRatings = receivedReviews.filter(r => r.technicalRating).map(r => r.technicalRating);
      const commRatings = receivedReviews.filter(r => r.communicationRating).map(r => r.communicationRating);
      const avgTech = techRatings.length > 0 ? techRatings.reduce((a, b) => a + b, 0) / techRatings.length : 0;
      const avgComm = commRatings.length > 0 ? commRatings.reduce((a, b) => a + b, 0) / commRatings.length : 0;
      const reliability = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 5 : 0;

      // Unique mentees (reviewees of their reviews)
      const uniqueMentees = new Set(reviewsGiven.docs.map(d => d.data().revieweeId));
      const mentorshipImpact = Math.min(5, uniqueMentees.size * 0.5);

      const w = systemConfig.weights;
      const rawScore = (
        w.technical * (avgTech / 5) * 100 +
        w.communication * (avgComm / 5) * 100 +
        w.reliability * (reliability / 5) * 100 +
        w.mentorship * (mentorshipImpact / 5) * 100
      );
      const confidence = Math.min(1, receivedReviews.length / 10);
      const overallScore = Math.round(rawScore * confidence);

      return {
        profile,
        stats: {
          connections: connReq.size + connRec.size,
          collaborations: collabList.length,
          totalTasks: allTasks.length,
          completedTasks: completedTasks.length,
          reviewsGiven: reviewsGiven.size,
          reviewsReceived: receivedReviews.length,
        },
        credibility: {
          overallScore,
          confidence,
          dimensions: {
            technicalAccuracy: { score: Math.round((avgTech / 5) * 100), dataPoints: techRatings.length },
            communication: { score: Math.round((avgComm / 5) * 100), dataPoints: commRatings.length },
            reliability: { score: Math.round((reliability / 5) * 100), dataPoints: allTasks.length },
            mentorshipImpact: { score: Math.round((mentorshipImpact / 5) * 100), dataPoints: uniqueMentees.size },
          },
        },
        collaborations: collabList,
        recentReviews: receivedReviews.slice(0, 10),
      };
    } catch (err) {
      console.error("Error fetching student analytics:", err);
      return null;
    }
  }, [systemConfig]);

  // =========================================
  // FLAGS (Moderation)
  // =========================================
  const fetchFlags = useCallback(async (filters = {}) => {
    setFlagsLoading(true);
    try {
      let constraints = [];
      if (filters.status) {
        constraints.push(where("status", "==", filters.status));
      }
      const q = constraints.length > 0
        ? query(collection(db, "admin_flags"), ...constraints)
        : collection(db, "admin_flags");
      const snap = await getDocs(q);
      const result = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setFlags(result);
      return result;
    } catch (err) {
      console.error("Error fetching flags:", err);
      setFlags([]);
      return [];
    } finally {
      setFlagsLoading(false);
    }
  }, []);

  const createFlag = useCallback(async (flagData) => {
    try {
      const docRef = await addDoc(collection(db, "admin_flags"), {
        ...flagData,
        status: "open",
        createdBy: currentUser?.uid,
        createdAt: serverTimestamp(),
        auditTrail: []
      });

      // Log to audit
      await addDoc(collection(db, "admin_audit_log"), {
        actorId: currentUser?.uid,
        actorRole: role,
        action: "create_flag",
        targetCollection: "admin_flags",
        targetDocId: docRef.id,
        payload: flagData,
        timestamp: serverTimestamp()
      });

      return docRef.id;
    } catch (err) {
      console.error("Error creating flag:", err);
      throw err;
    }
  }, [currentUser, role]);

  const resolveFlag = useCallback(async (flagId, resolution) => {
    try {
      await updateDoc(doc(db, "admin_flags", flagId), {
        status: "resolved",
        resolution,
        resolvedBy: currentUser?.uid,
        resolvedAt: serverTimestamp()
      });

      // Audit log
      await addDoc(collection(db, "admin_audit_log"), {
        actorId: currentUser?.uid,
        actorRole: role,
        action: "resolve_flag",
        targetCollection: "admin_flags",
        targetDocId: flagId,
        payload: { resolution },
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Error resolving flag:", err);
      throw err;
    }
  }, [currentUser, role]);

  // =========================================
  // CSV EXPORT
  // =========================================
  const exportStudentsCSV = useCallback(async (students) => {
    const headers = ["Name", "Email", "Department", "Skills", "Credibility Score", "Connections", "Collaborations"];
    const rows = students.map(s => [
      s.displayName || "",
      s.email || "",
      s.department || "",
      (s.skills || []).join("; "),
      s.credibilityScore || 0,
      s.connectionsCount || 0,
      s.collaborationsCount || 0
    ]);

    const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `setu_students_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    // Audit log
    await addDoc(collection(db, "admin_audit_log"), {
      actorId: currentUser?.uid,
      actorRole: role,
      action: "export_csv",
      targetCollection: "users",
      targetDocId: null,
      payload: { studentCount: students.length },
      timestamp: serverTimestamp()
    });
  }, [currentUser, role]);

  // =========================================
  // Load config from Firestore
  // =========================================
  useEffect(() => {
    if (!isAdmin || (role !== "super_admin" && role !== "admin")) return;
    const unsub = onSnapshot(doc(db, "admin_system_config", "default"), (snap) => {
      if (snap.exists()) {
        setSystemConfig(snap.data());
      }
    });
    return () => unsub();
  }, [isAdmin, role]);

  const value = {
    role,
    isAdmin,
    department,
    platformStats,
    statsLoading,
    fetchPlatformStats,
    fetchStudents,
    fetchStudentAnalytics,
    flags,
    flagsLoading,
    fetchFlags,
    createFlag,
    resolveFlag,
    exportStudentsCSV,
    systemConfig,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
