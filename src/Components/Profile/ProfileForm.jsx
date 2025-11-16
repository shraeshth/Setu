import React, { useState, useEffect } from "react";
import { X, Save, Upload, Loader } from "lucide-react";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "../../Contexts/AuthContext.jsx";

export default function ProfileForm({ existing, onClose, onSave }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    role: "",
    location: "",
    skills: "",
    photoURL: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (existing) {
      setFormData({
        displayName: existing.displayName || "",
        bio: existing.bio || "",
        role: existing.role || "",
        location: existing.location || "",
        skills: existing.skills ? existing.skills.join(", ") : "",
        photoURL: existing.photoURL || "",
        website: existing.website || "",
        twitter: existing.twitter || "",
        linkedin: existing.linkedin || "",
        github: existing.github || ""
      });
    }
  }, [existing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.displayName.trim()) {
      setError("Display name is required");
      return false;
    }
    if (formData.displayName.length < 2) {
      setError("Display name must be at least 2 characters");
      return false;
    }
    if (formData.bio.length > 500) {
      setError("Bio must be less than 500 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!currentUser) {
      setError("You must be logged in");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userRef = doc(db, "users", currentUser.uid);
      
      // Process skills
      const skillsArray = formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const profileData = {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        role: formData.role.trim(),
        location: formData.location.trim(),
        skills: skillsArray,
        photoURL: formData.photoURL.trim(),
        website: formData.website.trim(),
        twitter: formData.twitter.trim(),
        linkedin: formData.linkedin.trim(),
        github: formData.github.trim(),
        email: currentUser.email,
        updatedAt: new Date().toISOString()
      };

      // Add joinedDate if creating new profile
      if (!existing) {
        profileData.joinedDate = new Date().toISOString();
        profileData.verified = false;
      }

      // Use setDoc with merge for both create and update
      await setDoc(userRef, profileData, { merge: true });

      setSuccess(true);
      setTimeout(() => {
        if (onSave) onSave({ ...existing, ...profileData });
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1A1A1A] border-b border-[#E2E1DB] dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-gray-100">
            {existing ? "Edit Profile" : "Create Profile"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-lg hover:bg-[#F9F8F3] dark:hover:bg-[#0B0B0B] flex items-center justify-center transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#6B6B6B] dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 text-sm text-green-700 dark:text-green-400">
              Profile saved successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-[#2B2B2B] dark:text-gray-100 mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="John Doe"
              className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-4 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-[#2B2B2B] dark:text-gray-100 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              maxLength={500}
              placeholder="Tell us about yourself..."
              className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-4 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all resize-none"
            />
            <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Role and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[#2B2B2B] dark:text-gray-100 mb-2">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                placeholder="Product Designer"
                className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-4 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[#2B2B2B] dark:text-gray-100 mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
                placeholder="San Francisco, CA"
                className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-4 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-[#2B2B2B] dark:text-gray-100 mb-2">
              Skills
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              value={formData.skills}
              onChange={handleChange}
              disabled={loading}
              placeholder="React, TypeScript, Figma (comma separated)"
              className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-4 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
            />
            <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1">
              Separate skills with commas
            </p>
          </div>

          {/* Photo URL */}
          <div>
            <label htmlFor="photoURL" className="block text-sm font-medium text-[#2B2B2B] dark:text-gray-100 mb-2">
              Profile Photo URL
            </label>
            <div className="flex gap-2">
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                value={formData.photoURL}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-4 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
              />
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2.5 bg-[#F9F8F3] dark:bg-[#0B0B0B] border border-[#E2E1DB] dark:border-gray-700 rounded-lg hover:bg-[#D94F04] hover:text-white dark:hover:bg-[#E86C2E] transition-all disabled:opacity-50"
                title="Upload feature coming soon"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#2B2B2B] dark:text-gray-100">
              Social Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="block text-xs font-medium text-[#6B6B6B] dark:text-gray-400 mb-1.5">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="https://yoursite.com"
                  className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-3 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-xs font-medium text-[#6B6B6B] dark:text-gray-400 mb-1.5">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  value={formData.linkedin}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="username"
                  className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-3 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
                />
              </div>

              <div>
                <label htmlFor="twitter" className="block text-xs font-medium text-[#6B6B6B] dark:text-gray-400 mb-1.5">
                  Twitter/X
                </label>
                <input
                  id="twitter"
                  name="twitter"
                  type="text"
                  value={formData.twitter}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="@username"
                  className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-3 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
                />
              </div>

              <div>
                <label htmlFor="github" className="block text-xs font-medium text-[#6B6B6B] dark:text-gray-400 mb-1.5">
                  GitHub
                </label>
                <input
                  id="github"
                  name="github"
                  type="text"
                  value={formData.github}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="username"
                  className="w-full rounded-lg border border-[#E2E1DB] dark:border-gray-700 bg-[#FCFCF9] dark:bg-[#0B0B0B] px-3 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D94F04] disabled:opacity-50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#E2E1DB] dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#F9F8F3] dark:bg-[#0B0B0B] border border-[#E2E1DB] dark:border-gray-700 text-[#2B2B2B] dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04] text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}