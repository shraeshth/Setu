import React, { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useFirestore } from "../Hooks/useFirestore";
import UserCard from "../Components/UserCard";
import ConnectionRequests from "../Components/ConnectionRequests";
import { Loader } from "lucide-react";

export default function Connections() {
  const { currentUser } = useAuth();
  const { getCollection, addDocument, loading: firestoreLoading } = useFirestore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Fetch all users
        // TODO: In a real app with many users, we would paginate this or use Algolia for search.
        // We also need to filter out users who are already connected or have pending requests.
        // For now, we fetch all and filter client-side for the MVP.
        const allUsers = await getCollection("users");

        setUsers(
          allUsers.filter((u) => u.id !== currentUser.uid)
        );
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, getCollection]);

  const sendRequest = async (targetId) => {
    try {
      await addDocument("connections", {
        requesterId: currentUser.uid,
        receiverId: targetId,
        status: "pending",
      });
      alert("Request sent!");
      // Optionally remove the user from the list or update UI state
    } catch (err) {
      console.error("Send connection error:", err);
      alert("Failed to send request.");
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Find Peers</h1>
      <ConnectionRequests userId={currentUser?.uid} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          users.map((u) => (
            <UserCard key={u.id} user={u} onConnect={() => sendRequest(u.id)} />
          ))
        )}
      </div>
    </div>
  );
}
