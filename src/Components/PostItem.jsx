import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../Contexts/AuthContext";
import Comments from "./Comments";
import CommentInput from "./CommentInput";

export default function PostItem({ post }) {
  const { currentUser } = useAuth();
  const [processingLike, setProcessingLike] = useState(false);
  const liked =
    currentUser &&
    Array.isArray(post.likes) &&
    post.likes.includes(currentUser.uid);

  const toggleLike = async () => {
    if (!currentUser) return alert("Please log in to like posts.");
    setProcessingLike(true);
    try {
      const postRef = doc(db, "posts", post.id);

      if (liked) {
        await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
      }
    } catch (err) {
      console.error("Like toggle error:", err);
    } finally {
      setProcessingLike(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded p-3 bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-sm text-gray-300">
            {(post.userId || "U").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="text-sm font-semibold">
            {post.userName || post.userId || "Unknown User"}
          </div>
          <div className="text-xs text-gray-400">
            {post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleString()
              : "Just now"}
          </div>
        </div>
      </div>

      {/* Text content */}
      {post.text && (
        <div className="mb-2">
          <p className="whitespace-pre-wrap break-words text-gray-200">
            {post.text}
          </p>
        </div>
      )}

      {/* Optional image */}
      {post.imageUrl && (
        <div className="mb-2">
          <img
            src={post.imageUrl}
            alt="post"
            className="max-h-64 w-full object-cover rounded"
            loading="lazy"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={toggleLike}
          disabled={processingLike}
          className={`px-3 py-1 rounded transition-colors duration-150 ${liked
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-700 hover:bg-gray-600"
            }`}
        >
          {liked ? "Liked" : "Like"}{" "}
          {Array.isArray(post.likes) ? post.likes.length : 0}
        </button>

        <div className="text-sm text-gray-400">
          Comments: {post.commentsCount ?? 0}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-700 my-3" />

      {/* Comments thread */}
      <Comments postId={post.id} />
      <CommentInput postId={post.id} />
    </div>
  );
}
