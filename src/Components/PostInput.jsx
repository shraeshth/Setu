import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";
import { compressFile } from "../utils/compress";
import { uploadImageWithFallback } from "../utils/imageUpload";

export default function PostInput({ onPosted }) {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const createPost = async () => {
    if (!currentUser) {
      alert("Please log in to post.");
      return;
    }
    if (!text.trim() && !file) return alert("Write something or attach an image.");

    setLoading(true);
    try {
      let imageUrl = null;
      if (file) {
        const compressed = await compressFile(file);
        const uploaded = await uploadImageWithFallback(compressed);
        imageUrl = uploaded.url;
      }

      const postRef = await addDoc(collection(db, "posts"), {
        userId: currentUser.uid,
        text: text.trim(),
        imageUrl: imageUrl || null,
        likes: [],
        createdAt: serverTimestamp()
      });

      // optimistic callback to parent
      onPosted && onPosted();
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Error adding post:", err);
      alert("Failed to add post. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded mb-4">
      <textarea
        rows={3}
        placeholder="Share something with your peers..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2"
      />
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={handleFile} />
        <button
          onClick={createPost}
          disabled={loading}
          className={`px-4 py-2 rounded ${loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"}`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
        {file && <span className="text-sm text-gray-400"> {file.name} </span>}
      </div>
    </div>
  );
}
