import React, { useState, useEffect, useRef } from "react";
import { X, Users, FileText, Loader, Calendar, Clock, Briefcase, Search, CheckCircle, Rocket, Type, PenTool } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { ALL_SKILLS } from "../../utils/skillsData";
import { ALL_ROLES } from "../../utils/rolesData";

export default function NewProjectForm({ onClose, onSubmit }) {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        memberEmails: "",
        deadline: "",
        category: "Web Development",
        priority: "Medium"
    });

    // Enhanced Features State
    const [roles, setRoles] = useState([]);
    const [roleSearch, setRoleSearch] = useState("");
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [duration, setDuration] = useState("");

    const filteredRoles = ALL_ROLES.filter(r =>
        r.name.toLowerCase().includes(roleSearch.toLowerCase()) &&
        !roles.includes(r.name)
    );

    // Skills State
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillSearch, setSkillSearch] = useState("");
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const roleDropdownRef = useRef(null);

    // Filter skills based on search
    const filteredSkills = ALL_SKILLS.filter(s =>
        s.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !selectedSkills.includes(s.name)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSkillDropdown(false);
            }
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
                setShowRoleDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- Role Handlers ---
    const handleRoleSelect = (roleName) => {
        if (!roles.includes(roleName)) {
            setRoles([...roles, roleName]);
            setRoleSearch("");
            setShowRoleDropdown(false);
        }
    };

    const handleRemoveRole = (roleName) => {
        setRoles(roles.filter(r => r !== roleName));
    };

    // --- Deadline & Duration ---
    const handleDeadlineChange = (e) => {
        const newDeadline = e.target.value;
        setFormData(prev => ({ ...prev, deadline: newDeadline }));

        if (newDeadline) {
            const start = new Date();
            const end = new Date(newDeadline);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let durationStr = "";
            if (diffDays < 30) durationStr = `${diffDays} Days`;
            else if (diffDays < 365) {
                const months = Math.round(diffDays / 30);
                durationStr = `${months} Month${months > 1 ? 's' : ''}`;
            } else {
                const years = (diffDays / 365).toFixed(1);
                durationStr = `${years} Year${years > 1 ? 's' : ''}`;
            }
            setDuration(durationStr);
        } else {
            setDuration("");
        }
    };

    // --- Skill Handlers ---
    const handleSkillSelect = (skillName) => {
        if (!selectedSkills.includes(skillName)) {
            setSelectedSkills([...selectedSkills, skillName]);
            setSkillSearch("");
        }
    };

    const handleRemoveSkill = (skillName) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skillName));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setLoading(true);
        try {
            // Parse member emails
            const emails = formData.memberEmails
                .split(",")
                .map(e => e.trim())
                .filter(e => e.length > 0);

            const projectData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                ownerUid: currentUser.uid,
                createdBy: currentUser.uid,
                memberIds: [currentUser.uid],
                members: [{
                    uid: currentUser.uid,
                    name: currentUser.displayName || currentUser.email,
                    photoURL: currentUser.photoURL || "",
                }],
                memberEmails: emails,

                // Enhanced Fields
                openRoles: roles,
                deadline: formData.deadline,
                duration: duration || "Ongoing", // fallback
                requiredSkills: selectedSkills,
                category: formData.category,
                priority: formData.priority,

                status: "active",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await onSubmit(projectData);
            onClose();
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-[#222] flex justify-between items-center bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-[#D94F04]" />
                        Create New Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">

                    {/* Project Title */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Type className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
                                placeholder="Enter project name"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Description
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400 resize-none"
                                placeholder="Brief description of project goals and scope..."
                            />
                        </div>
                    </div>

                    {/* CATEGORY & PRIORITY */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none appearance-none"
                                >
                                    <option>Web Development</option>
                                    <option>Mobile Development</option>
                                    <option>AI/ML</option>
                                    <option>DevOps</option>
                                    <option>Design</option>
                                    <option>Cyber Security</option>
                                    <option>Blockchain</option>
                                    <option>Other</option>
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                Priority
                            </label>
                            <div className="relative">
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none appearance-none"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ROLES (Multi-add) */}
                    <div ref={roleDropdownRef} className="group relative">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Open Roles
                        </label>

                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                            <input
                                value={roleSearch}
                                onFocus={() => setShowRoleDropdown(true)}
                                onChange={(e) => {
                                    setRoleSearch(e.target.value);
                                    setShowRoleDropdown(true);
                                }}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
                                placeholder="Search & add roles (e.g. Frontend Dev)..."
                            />

                            {/* Role Dropdown */}
                            {showRoleDropdown && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowRoleDropdown(false)}></div>
                                    <div className="absolute z-40 w-full mt-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar p-1">
                                        {filteredRoles.length > 0 ? (
                                            filteredRoles.map(role => (
                                                <button
                                                    key={role.slug}
                                                    type="button"
                                                    onClick={() => handleRoleSelect(role.name)}
                                                    className="w-full text-left px-4 py-2 text-sm text-[#2B2B2B] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] rounded-md"
                                                >
                                                    {role.name}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">No roles found</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Role Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {roles.map((role, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-[#D94F04] dark:text-orange-400 border border-orange-200 dark:border-orange-800/30">
                                    {role}
                                    <button onClick={() => handleRemoveRole(role)} className="hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* DEADLINE & DURATION */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                Deadline
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleDeadlineChange}
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none transition-all placeholder-gray-400"
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                Estimated Duration
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                <div className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-[#1A1A1A] border border-transparent dark:border-[#333] rounded-xl text-sm text-gray-600 dark:text-gray-400">
                                    {duration || "Select a deadline"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SKILLS (Searchable Multi-select) */}
                    <div className="group relative" ref={dropdownRef}>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Required Skills
                        </label>

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
                                placeholder="Search & add skills..."
                            />

                            {/* Dropdown */}
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

                        {/* Selected Skill Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedSkills.map(skill => (
                                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#222] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#333]">
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Member Emails */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                            Invite Members (optional)
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
                            <input
                                name="memberEmails"
                                value={formData.memberEmails}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
                                placeholder="email1@example.com, email2@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md flex justify-end gap-3 sticky bottom-0 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !formData.title.trim()}
                        onClick={handleSubmit} // Added onClick here to ensure form submission trigger
                        className="px-6 py-2.5 bg-[#D94F04] text-white rounded-xl hover:bg-[#c34603] shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Create Project
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
