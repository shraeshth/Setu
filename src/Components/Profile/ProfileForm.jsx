import React, { useState, useEffect } from "react";
import { X, Save, Loader } from "lucide-react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { notifyUser } from "../../utils/notifyUser";
import { useAuth } from "../../Contexts/AuthContext.jsx";
import { ALL_ROLES } from "../../utils/rolesData";
import { ALL_SKILLS } from "../../utils/skillsData";

export default function ProfileForm({ existing, onClose, onSave }) {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    headline: "",
    availability: "",
    photoURL: "",
    skills: [],
    wantToLearn: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // UI State for Custom Dropdowns
  const [roleSearch, setRoleSearch] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const [learnSearch, setLearnSearch] = useState("");
  const [showLearnDropdown, setShowLearnDropdown] = useState(false);

  // ===========================
  // PREFILL FORM
  // ===========================
  useEffect(() => {
    if (existing) {
      setFormData({
        displayName: existing.displayName || "",
        bio: existing.bio || "",
        headline: existing.headline || "",
        availability: existing.availability || "Available",
        photoURL: existing.photoURL || "",
        skills: Array.isArray(existing.skills) ? existing.skills : [],
        wantToLearn: Array.isArray(existing.wantToLearn) ? existing.wantToLearn : [],
      });
    }
  }, [existing]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // --- FILTERS ---
  const filteredRoles = ALL_ROLES.filter(r =>
    r.name.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const filteredSkills = ALL_SKILLS.filter(s =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !formData.skills.includes(s.name)
  );

  const filteredLearn = ALL_SKILLS.filter(s =>
    s.name.toLowerCase().includes(learnSearch.toLowerCase()) &&
    !formData.wantToLearn.includes(s.name)
  );

  // --- HANDLERS ---
  const handleRoleSelect = (roleName) => {
    setFormData(prev => ({ ...prev, headline: roleName }));
    setRoleSearch("");
    setShowRoleDropdown(false);
  };

  const handleSkillSelect = (skillName) => {
    if (!formData.skills.includes(skillName)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillName] }));
      setSkillSearch("");
      setShowSkillDropdown(false);
    }
  };
  const handleRemoveSkill = (skillName) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillName) }));
  };

  const handleLearnSelect = (skillName) => {
    if (!formData.wantToLearn.includes(skillName)) {
      setFormData(prev => ({ ...prev, wantToLearn: [...prev.wantToLearn, skillName] }));
      setLearnSearch("");
      setShowLearnDropdown(false);
    }
  };
  const handleRemoveLearn = (skillName) => {
    setFormData(prev => ({ ...prev, wantToLearn: prev.wantToLearn.filter(s => s !== skillName) }));
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
  // SUBMIT
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

      const skillsArray = formData.skills;
      const learnArray = formData.wantToLearn;

      const updatedProfile = {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        headline: formData.headline.trim(),
        role: formData.headline.trim(),
        availability: formData.availability.trim(),
        photoURL: formData.photoURL.trim(),

        skills: skillsArray,
        wantToLearn: learnArray,

        updatedAt: new Date().toISOString(),
      };

      // Try to update first (more restrictive permissions often allow this)
      try {
        await updateDoc(userRef, updatedProfile);
      } catch (updateErr) {
        // If doc doesn't exist, try setDoc (create)
        if (updateErr.code === 'not-found') {
          if (!existing) {
            updatedProfile.createdAt = new Date().toISOString();
          }
          await setDoc(userRef, updatedProfile, { merge: true });
        } else {
          throw updateErr;
        }
      }

      setSuccess(true);
      // Trigger a toast notification and persist to Firestore
      notifyUser(currentUser.uid, {
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been saved successfully.",
        duration: 5000,
      });

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

          {/* ROLE / HEADLINE */}
          <div className="relative">
            <label className="text-sm font-medium mb-1 block">Role / Headline</label>
            <div className="relative">
              <input
                value={formData.headline}
                onClick={() => {
                  setShowRoleDropdown(true);
                  setRoleSearch("");
                }}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] bg-[#FCFCF9] dark:bg-[#111] text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
                placeholder="Select your primary role"
              />
              {showRoleDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleDropdown(false)}></div>
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1A1A1A] border border-[#E2E1DB] dark:border-[#333] rounded-lg shadow-xl p-2">
                    <input
                      autoFocus
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      className="w-full px-3 py-2 mb-2 rounded border border-[#E2E1DB] dark:border-[#333] bg-[#F9F9F9] dark:bg-[#222] text-sm focus:outline-none"
                      placeholder="Search roles..."
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map(role => (
                          <div
                            key={role.slug}
                            onClick={() => handleRoleSelect(role.name)}
                            className="px-3 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 hover:bg-[#F3F2EE] dark:hover:bg-[#333] cursor-pointer rounded"
                          >
                            {role.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">No roles found</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AVAILABILITY */}
          <div>
            <label className="text-sm font-medium mb-1 block">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] bg-[#FCFCF9] dark:bg-[#111] text-sm focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
            >
              <option value="Available">Available</option>
              <option value="Open to Offers">Open to Offers</option>
              <option value="Busy">Busy</option>
              <option value="Offline">Offline</option>
            </select>
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
          <div className="relative">
            <label className="text-sm font-medium mb-1 block">Skills</label>
            <div className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                      bg-[#FCFCF9] dark:bg-[#111] flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#D94F04]"
              onClick={() => setShowSkillDropdown(true)}
            >
              <input
                value={skillSearch}
                onChange={(e) => {
                  setSkillSearch(e.target.value);
                  setShowSkillDropdown(true);
                }}
                className="flex-1 bg-transparent text-sm text-[#2B2B2B] dark:text-gray-200 focus:outline-none placeholder-gray-400"
                placeholder="Search skills..."
              />
            </div>

            {showSkillDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSkillDropdown(false)}></div>
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1A1A1A] border border-[#E2E1DB] dark:border-[#333] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map(skill => (
                      <div
                        key={skill.slug}
                        onClick={() => handleSkillSelect(skill.name)}
                        className="px-4 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 hover:bg-[#F3F2EE] dark:hover:bg-[#222] cursor-pointer"
                      >
                        {skill.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No skills found</div>
                  )}
                </div>
              </>
            )}

            {/* Selected Skill Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8E7E0] dark:bg-[#333] text-[#2B2B2B] dark:text-white">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* WANT TO LEARN */}
          <div className="relative">
            <label className="text-sm font-medium mb-1 block">Want to Learn</label>
            <div className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                      bg-[#FCFCF9] dark:bg-[#111] flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#D94F04]"
              onClick={() => setShowLearnDropdown(true)}
            >
              <input
                value={learnSearch}
                onChange={(e) => {
                  setLearnSearch(e.target.value);
                  setShowLearnDropdown(true);
                }}
                className="flex-1 bg-transparent text-sm text-[#2B2B2B] dark:text-gray-200 focus:outline-none placeholder-gray-400"
                placeholder="Search topics..."
              />
            </div>

            {showLearnDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLearnDropdown(false)}></div>
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1A1A1A] border border-[#E2E1DB] dark:border-[#333] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {filteredLearn.length > 0 ? (
                    filteredLearn.map(skill => (
                      <div
                        key={skill.slug}
                        onClick={() => handleLearnSelect(skill.name)}
                        className="px-4 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 hover:bg-[#F3F2EE] dark:hover:bg-[#222] cursor-pointer"
                      >
                        {skill.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
                  )}
                </div>
              </>
            )}

            {/* Selected Learn Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.wantToLearn.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8E7E0] dark:bg-[#333] text-[#2B2B2B] dark:text-white">
                  {skill}
                  <button type="button" onClick={() => handleRemoveLearn(skill)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
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
