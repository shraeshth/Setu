import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";

export default function CommentInput({ postId }) {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please log in to comment.");
    if (!text.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        userId: currentUser.uid,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-grow p-2 rounded bg-gray-800 text-white"
      />
      <button
        disabled={loading}
        className="bg-blue-600 px-3 rounded hover:bg-blue-500"
      >
        {loading ? "..." : "Post"}
      </button>
    </form>
  );
}
