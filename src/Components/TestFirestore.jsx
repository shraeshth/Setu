import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export default function TestFirestore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  // ✅ Fetch posts from Firestore (ordered by latest)
  const getPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // ✅ Add a new post
  const addPost = async () => {
    if (!text.trim()) return alert("Write something before posting!");
    try {
      setLoading(true);
      await addDoc(collection(db, "posts"), {
        userId: "test-user",
        text,
        timestamp: serverTimestamp(),
      });
      setText("");
      await getPosts(); // refresh after adding
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-semibold mb-4">Firestore Test</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow p-2 rounded bg-gray-800 text-white outline-none border border-gray-600 focus:border-blue-500"
        />
        <button
          onClick={addPost}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Posting..." : "Add Post"}
        </button>
      </div>

      <ul className="space-y-3">
        {posts.length > 0 ? (
          posts.map((p) => (
            <li
              key={p.id}
              className="border border-gray-700 rounded p-3 bg-gray-900"
            >
              <p className="text-sm text-gray-400">{p.userId}</p>
              <p className="text-lg">{p.text}</p>
              <p className="text-xs text-gray-500">
                {p.timestamp?.toDate
                  ? p.timestamp.toDate().toLocaleString()
                  : "Pending..."}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No posts yet. Add one above.</p>
        )}
      </ul>
    </div>
  );
}
