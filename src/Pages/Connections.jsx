import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where, serverTimestamp } from "firebase/firestore/dist/firestore";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";
import UserCard from "../Components/UserCard";
import ConnectionRequests from "../Components/ConnectionRequests";

export default function Connections() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u) => u.uid !== currentUser.uid)
      );
    };
    fetchUsers();
  }, [currentUser]);

  const sendRequest = async (targetId) => {
    try {
      await addDoc(collection(db, "connections"), {
        requesterId: currentUser.uid,
        receiverId: targetId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("Request sent!");
    } catch (err) {
      console.error("Send connection error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-semibold mb-4">Find Peers</h1>
      <ConnectionRequests userId={currentUser?.uid} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          users.map((u) => (
            <UserCard key={u.uid} user={u} onConnect={() => sendRequest(u.uid)} />
          ))
        )}
      </div>
    </div>
  );
}
