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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";
import ReplyInput from "./ReplyInput";
import ReplyList from "./ReplyList";

export default function CommentThread({ postId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);

  // Real-time comment listener
  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [postId]);

  // Add new comment
  const addComment = async (e) => {
    e.preventDefault();
    if (!currentUser || !newText.trim()) return;
    setLoading(true);
    try {
      const ref = collection(db, "posts", postId, "comments");
      await updateDoc(ref, {
        userId: currentUser.uid,
        text: newText.trim(),
        likes: [],
        parentId: null,
        createdAt: new Date(),
      });
      setNewText("");
    } catch (err) {
      console.error("Add comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle like on comment
  const toggleLike = async (id, liked) => {
    if (!currentUser) return;
    const ref = doc(db, "posts", postId, "comments", id);
    await updateDoc(ref, {
      likes: liked
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid),
    });
  };

  const deleteComment = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", id));
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  return (
    <div className="mt-3">
      <form onSubmit={addComment} className="flex gap-2 mb-3">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-grow p-2 bg-gray-800 text-white rounded"
        />
        <button
          disabled={loading}
          className="bg-blue-600 px-3 rounded hover:bg-blue-500"
        >
          {loading ? "..." : "Post"}
        </button>
      </form>

      <div className="space-y-2">
        {comments.map((c) => {
          const liked =
            currentUser && Array.isArray(c.likes)
              ? c.likes.includes(currentUser.uid)
              : false;
          return (
            <div
              key={c.id}
              className="bg-gray-900 p-2 rounded text-sm text-gray-200"
            >
              <div className="flex justify-between">
                <span>{c.text}</span>
                {c.userId === currentUser?.uid && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-xs text-red-400"
                  >
                    delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <button
                  onClick={() => toggleLike(c.id, liked)}
                  className={`${
                    liked ? "text-red-500" : "text-gray-400"
                  } hover:text-red-400`}
                >
                  ♥ {Array.isArray(c.likes) ? c.likes.length : 0}
                </button>
                <ReplyInput postId={postId} commentId={c.id} />
              </div>

              {/* Nested replies */}
              <ReplyList postId={postId} commentId={c.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
