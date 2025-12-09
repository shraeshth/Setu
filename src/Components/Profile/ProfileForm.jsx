import React, { useState, useEffect } from "react";
import { X, Save, Loader, User, Type, Clock, BookOpen, PenTool, Hash, Image as ImageIcon } from "lucide-react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { notifyUser } from "../../utils/notifyUser";
import { useAuth } from "../../Contexts/AuthContext.jsx";
import { ALL_ROLES } from "../../utils/rolesData";
import { ALL_SKILLS } from "../../utils/skillsData";

export default function ProfileForm({ existing, onClose, onSave, mandatory = false }) {
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
  // SUBMIT
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.headline.trim()) {
      setError("Role/Headline is required");
      return;
    }
    if (formData.skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }

    if (!currentUser) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, "users", currentUser.uid);

      const updatedProfile = {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        headline: formData.headline.trim(),
        role: formData.headline.trim(),
        availability: formData.availability.trim(),
        photoURL: formData.photoURL.trim(),
        skills: formData.skills,
        wantToLearn: formData.wantToLearn,
        updatedAt: new Date().toISOString(),
      };

      try {
        await updateDoc(userRef, updatedProfile);
      } catch (updateErr) {
        if (updateErr.code === 'not-found') {
          if (!existing) updatedProfile.createdAt = new Date().toISOString();
          await setDoc(userRef, updatedProfile, { merge: true });
        } else {
          throw updateErr;
        }
      }

      setSuccess(true);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={mandatory ? undefined : onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#222] flex justify-between items-center bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#D94F04]" />
            {mandatory ? "Complete Your Profile" : "Edit Profile"}
          </h2>
          {!mandatory && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* FORM CONTENT */}
        <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {(error || success) && (
            <div className={`text-sm p-3 rounded-xl border ${success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'}`}>
              {success ? "Profile updated successfully!" : error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
                <input
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Availability</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none appearance-none"
                >
                  <option value="Available">Available</option>
                  <option value="Open to Offers">Open to Offers</option>
                  <option value="Busy">Busy</option>
                  <option value="Offline">Offline</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Role / Headline */}
          <div className="group relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Role / Headline <span className="text-red-500">*</span></label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
              <input
                value={formData.headline}
                onClick={() => {
                  setShowRoleDropdown(true);
                  setRoleSearch("");
                }}
                readOnly
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm cursor-pointer focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none"
                placeholder="Select your primary role"
              />
              {showRoleDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowRoleDropdown(false)}></div>
                  <div className="absolute z-40 w-full mt-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100">
                    <input
                      autoFocus
                      value={roleSearch}
                      onChange={(e) => setRoleSearch(e.target.value)}
                      className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] text-sm focus:outline-none focus:border-[#D94F04]"
                      placeholder="Search roles..."
                    />
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredRoles.map(role => (
                        <button
                          key={role.slug}
                          type="button"
                          onClick={() => handleRoleSelect(role.name)}
                          className="w-full text-left px-3 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] rounded-md transition-colors"
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Photo URL */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Profile Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
              <input
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Bio</label>
            <div className="relative">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400 resize-none"
                placeholder="A short description about you..."
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="group relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Skills <span className="text-red-500">*</span></label>
            <div className="relative">
              <PenTool className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                value={skillSearch}
                onFocus={() => setShowSkillDropdown(true)}
                onChange={(e) => {
                  setSkillSearch(e.target.value);
                  setShowSkillDropdown(true);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
                placeholder="Search and add skills..."
              />

              {showSkillDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSkillDropdown(false)}></div>
                  <div className="absolute z-40 w-full mt-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map(skill => (
                        <button
                          key={skill.slug}
                          type="button"
                          onClick={() => handleSkillSelect(skill.name)}
                          className="w-full text-left px-4 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] rounded-md"
                        >
                          {skill.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No skills found</div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#222] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#333]">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Want to Learn Section */}
          <div className="group relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Want To Learn</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                value={learnSearch}
                onFocus={() => setShowLearnDropdown(true)}
                onChange={(e) => {
                  setLearnSearch(e.target.value);
                  setShowLearnDropdown(true);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
                placeholder="Search topics..."
              />

              {showLearnDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowLearnDropdown(false)}></div>
                  <div className="absolute z-40 w-full mt-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {filteredLearn.length > 0 ? (
                      filteredLearn.map(skill => (
                        <button
                          key={skill.slug}
                          type="button"
                          onClick={() => handleLearnSelect(skill.name)}
                          className="w-full text-left px-4 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] rounded-md"
                        >
                          {skill.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {formData.wantToLearn.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#222] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#333]">
                  {skill}
                  <button type="button" onClick={() => handleRemoveLearn(skill)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md flex justify-end gap-3 sticky bottom-0 z-10">
          {!mandatory && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-[#D94F04] text-white rounded-xl hover:bg-[#c34603] shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 flex items-center gap-2 font-bold"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
