import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";

export default function ReplyList({ postId, commentId }) {
  const { currentUser } = useAuth();
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments", commentId, "replies"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [postId, commentId]);

  const toggleLike = async (id, liked) => {
    if (!currentUser) return;
    const ref = doc(db, "posts", postId, "comments", commentId, "replies", id);
    await updateDoc(ref, {
      likes: liked
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid),
    });
  };

  return (
    <div className="ml-6 mt-1 space-y-1">
      {replies.map((r) => {
        const liked =
          currentUser && Array.isArray(r.likes)
            ? r.likes.includes(currentUser.uid)
            : false;
        return (
          <div
            key={r.id}
            className="bg-gray-800 p-1 rounded text-xs text-gray-200 flex justify-between"
          >
            <span>{r.text}</span>
            <button
              onClick={() => toggleLike(r.id, liked)}
              className={`${
                liked ? "text-red-500" : "text-gray-400"
              } hover:text-red-400`}
            >
              ♥ {Array.isArray(r.likes) ? r.likes.length : 0}
            </button>
          </div>
        );
      })}
    </div>
  );
}
