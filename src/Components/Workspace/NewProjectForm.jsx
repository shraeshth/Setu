import React, { useState, useEffect, useRef } from "react";
import { X, Users, FileText, Loader, Plus, Calendar, Clock, Briefcase, Search, Check } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import { ALL_SKILLS } from "../../utils/skillsData";

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
    const [roleInput, setRoleInput] = useState("");
    const [duration, setDuration] = useState("");

    // Skills State
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillSearch, setSkillSearch] = useState("");
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);
    const dropdownRef = useRef(null);

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
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- Role Handlers ---
    const handleAddRole = (e) => {
        e.preventDefault();
        if (roleInput.trim()) {
            setRoles([...roles, roleInput.trim()]);
            setRoleInput("");
        }
    };

    const handleRemoveRole = (index) => {
        setRoles(roles.filter((_, i) => i !== index));
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-[#333] w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide">

                {/* Header */}
                <div className="p-5 border-b border-[#E2E1DB] dark:border-[#333] flex justify-between items-center sticky top-0 bg-white dark:bg-[#1A1A1A] z-10">
                    <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-white">
                        Create New Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F2EE] dark:hover:bg-[#222]"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">

                    {/* Project Title */}
                    <div>
                        <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Project Title *
                        </label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                         bg-[#FCFCF9] dark:bg-[#111] text-sm text-[#2B2B2B] dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
                            placeholder="Enter project name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                         bg-[#FCFCF9] dark:bg-[#111] text-sm text-[#2B2B2B] dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
                            placeholder="Brief description of the project"
                        />
                    </div>

                    {/* CATEGORY & PRIORITY */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                             bg-[#FCFCF9] dark:bg-[#111] text-sm text-[#2B2B2B] dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
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
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                             bg-[#FCFCF9] dark:bg-[#111] text-sm text-[#2B2B2B] dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    {/* ROLES (Multi-add) */}
                    <div>
                        <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                            <Briefcase className="w-4 h-4 inline mr-1" />
                            Open Roles
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={roleInput}
                                onChange={(e) => setRoleInput(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                             bg-[#FCFCF9] dark:bg-[#111] text-sm text-[#2B2B2B] dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
                                placeholder="e.g. Frontend Dev, Designer"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddRole(e)}
                            />
                            <button
                                type="button"
                                onClick={handleAddRole}
                                className="px-3 py-2 bg-[#F3F2EE] dark:bg-[#333] rounded-lg hover:bg-[#E8E7E0] dark:hover:bg-[#444] transition-colors"
                            >
                                <Plus className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
                            </button>
                        </div>
                        {/* Role Tags */}
                        <div className="flex flex-wrap gap-2">
                            {roles.map((role, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF4EC] text-[#D94F04] border border-[#D94F04]/20">
                                    {role}
                                    <button onClick={() => handleRemoveRole(idx)} className="hover:text-[#bf4404]">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* DEADLINE & DURATION */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Deadline
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleDeadlineChange}
                                className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                             bg-[#FCFCF9] dark:bg-[#111] text-sm text-[#2B2B2B] dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Estimated Duration
                            </label>
                            <div className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                                          bg-[#F3F2EE] dark:bg-[#1A1A1A] text-sm text-[#8A877C] dark:text-gray-500">
                                {duration || "Select a deadline"}
                            </div>
                        </div>
                    </div>

                    {/* SKILLS (Searchable Multi-select) */}
                    <div className="relative" ref={dropdownRef}>
                        <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                            <Search className="w-4 h-4 inline mr-1" />
                            Required Skills
                        </label>

                        <div
                            className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
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
                                placeholder="Search & add skills..."
                            />
                        </div>

                        {/* Dropdown */}
                        {showSkillDropdown && (
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
                        )}

                        {/* Selected Skill Tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSkills.map(skill => (
                                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8E7E0] dark:bg-[#333] text-[#2B2B2B] dark:text-white">
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Member Emails */}
                    <div>
                        <label className="text-sm font-medium mb-1 block text-[#2B2B2B] dark:text-gray-200">
                            <Users className="w-4 h-4 inline mr-1" />
                            Invite Members (optional)
                        </label>
                        <input
                            name="memberEmails"
                            value={formData.memberEmails}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-[#E2E1DB] dark:border-[#333] 
                         bg-[#FCFCF9] dark:bg-[#111] text-sm text-[#2B2B2B] dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-[#D94F04]"
                            placeholder="email1@example.com, email2@example.com"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border rounded-lg bg-[#F3F2EE] dark:bg-[#111] 
                         border-[#E2E1DB] dark:border-[#333] text-[#2B2B2B] dark:text-gray-200
                         hover:bg-[#E8E7E0] dark:hover:bg-[#222]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim()}
                            className="flex-1 py-2 bg-[#D94F04] text-white rounded-lg hover:bg-[#c34603] 
                         flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
