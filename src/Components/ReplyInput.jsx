import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";

export default function ReplyInput({ postId, commentId }) {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");

  const addReply = async (e) => {
    e.preventDefault();
    if (!currentUser || !text.trim()) return;
    try {
      await addDoc(collection(db, "posts", postId, "comments", commentId, "replies"), {
        userId: currentUser.uid,
        text: text.trim(),
        likes: [],
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error("Add reply error:", err);
    }
  };

  return (
    <form onSubmit={addReply} className="flex gap-1">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Reply..."
        className="flex-grow p-1 text-xs bg-gray-800 rounded text-white"
      />
      <button className="text-xs bg-blue-600 px-2 rounded hover:bg-blue-500">
        ↩
      </button>
    </form>
  );
}
