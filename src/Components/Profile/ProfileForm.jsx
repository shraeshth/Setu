import React, { useState, useEffect } from "react";
import { X, Save, Loader } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "../../Contexts/AuthContext.jsx";

export default function ProfileForm({ existing, onClose, onSave }) {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    photoURL: "",
    skills: "",
    learn: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ===========================
  // PREFILL FORM
  // ===========================
  useEffect(() => {
    if (existing) {
      setFormData({
        displayName: existing.displayName || "",
        bio: existing.bio || "",
        photoURL: existing.photoURL || "",
        skills: existing.skills ? existing.skills.join(", ") : "",
        learn: existing.learn ? existing.learn.join(", ") : "",
      });
    }
  }, [existing]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // ===========================
  // VALIDATE
  // ===========================
  const validate = () => {
    if (!formData.displayName.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.displayName.length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }
    if (formData.bio.length > 300) {
      setError("Bio must be under 300 characters");
      return false;
    }
    return true;
  };

  // ===========================
  // SUBMIT / SAVE
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!currentUser) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, "users", currentUser.uid);

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const learnArray = formData.learn
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const updatedProfile = {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        photoURL: formData.photoURL.trim(),
        skills: skillsArray,
        learn: learnArray,
        email: currentUser.email,
        updatedAt: new Date().toISOString(),
      };

      // If profile is new, add joinedDate
      if (!existing) {
        updatedProfile.joinedDate = new Date().toISOString();
      }

      await setDoc(userRef, updatedProfile, { merge: true });

      setSuccess(true);

      setTimeout(() => {
        if (onSave) onSave(updatedProfile);
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-[#333] w-full max-w-lg shadow-xl overflow-hidden">
        
        {/* HEADER */}
        <div className="p-5 border-b border-[#E2E1DB] dark:border-[#333] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-white">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F2EE] dark:hover:bg-[#222]"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {error && (
            <div className="text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm p-2 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm p-2 rounded-lg">
              Profile updated!
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] bg-[#FCFCF9] dark:bg-[#111] text-sm"
              placeholder="Your full name"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] bg-[#FCFCF9] dark:bg-[#111] text-sm"
              placeholder="A short description about you..."
            />
          </div>

          {/* PHOTO URL */}
          <div>
            <label className="text-sm font-medium mb-1 block">Profile Image URL</label>
            <input
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] bg-[#FCFCF9] dark:bg-[#111] text-sm"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* SKILLS */}
          <div>
            <label className="text-sm font-medium mb-1 block">Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] bg-[#FCFCF9] dark:bg-[#111] text-sm"
              placeholder="React, Node.js, Design..."
            />
          </div>

          {/* WANT TO LEARN */}
          <div>
            <label className="text-sm font-medium mb-1 block">Want to Learn</label>
            <input
              name="learn"
              value={formData.learn}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] bg-[#FCFCF9] dark:bg-[#111] text-sm"
              placeholder="Rust, ML, 3D design..."
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg bg-[#F3F2EE] dark:bg-[#111] border-[#E2E1DB] dark:border-[#333]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-[#D94F04] text-white rounded-lg hover:bg-[#c34603] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
