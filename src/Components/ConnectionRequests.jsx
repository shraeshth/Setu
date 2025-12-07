import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore"
import { db } from "../firebase";

export default function ConnectionRequests({ userId }) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const inQ = query(
      collection(db, "connections"),
      where("receiverId", "==", userId)
    );
    const outQ = query(
      collection(db, "connections"),
      where("requesterId", "==", userId)
    );

    const unsubIn = onSnapshot(inQ, (snap) =>
      setIncoming(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubOut = onSnapshot(outQ, (snap) =>
      setOutgoing(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsubIn();
      unsubOut();
    };
  }, [userId]);

  const handleUpdate = async (id, status) => {
    try {
      await updateDoc(doc(db, "connections", id), { status });
    } catch (err) {
      console.error("Update connection error:", err);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Connection Requests</h2>
      {incoming.length === 0 && outgoing.length === 0 && (
        <p className="text-gray-400 text-sm mb-2">No requests yet.</p>
      )}

      {incoming.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm text-gray-300 mb-1">Incoming</h3>
          {incoming.map((r) => (
            <div
              key={r.id}
              className="bg-gray-900 border border-gray-700 p-2 rounded mb-1 flex justify-between text-sm"
            >
              <span>From: {r.requesterId}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(r.id, "accepted")}
                  className="bg-green-600 px-2 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdate(r.id, "rejected")}
                  className="bg-red-600 px-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {outgoing.length > 0 && (
        <div>
          <h3 className="text-sm text-gray-300 mb-1">Outgoing</h3>
          {outgoing.map((r) => (
            <div
              key={r.id}
              className="bg-gray-900 border border-gray-700 p-2 rounded mb-1 flex justify-between text-sm"
            >
              <span>To: {r.receiverId}</span>
              <span className="text-gray-400">{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
