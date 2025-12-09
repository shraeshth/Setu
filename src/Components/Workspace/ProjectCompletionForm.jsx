import React, { useState } from "react";
import { X, Github, Globe, Video, CheckCircle, Loader } from "lucide-react";

export default function ProjectCompletionForm({ onClose, onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        githubLink: "",
        liveLink: "",
        videoLink: "",
        notes: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-white/10 transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 p-6 border-b border-gray-100 dark:border-[#222] flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#2B2B2B] dark:text-white">Project Completed!</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Congratulations on finishing. Add your project links to showcase your work.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* GitHub Link */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            GitHub Repository
                        </label>
                        <div className="relative">
                            <Github className="absolute left-3 top-3 text-gray-400 w-5 h-5 group-focus-within:text-[#D94F04] transition-colors" />
                            <input
                                type="url"
                                placeholder="https://github.com/username/project"
                                value={formData.githubLink}
                                onChange={e => setFormData({ ...formData, githubLink: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Live Demo Link */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Live Demo Link
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-3 text-gray-400 w-5 h-5 group-focus-within:text-[#D94F04] transition-colors" />
                            <input
                                type="url"
                                placeholder="https://my-awesome-project.web.app"
                                value={formData.liveLink}
                                onChange={e => setFormData({ ...formData, liveLink: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Video Demo Link */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Video / Presentation (Optional)
                        </label>
                        <div className="relative">
                            <Video className="absolute left-3 top-3 text-gray-400 w-5 h-5 group-focus-within:text-[#D94F04] transition-colors" />
                            <input
                                type="url"
                                placeholder="https://youtube.com/watch?v=..."
                                value={formData.videoLink}
                                onChange={e => setFormData({ ...formData, videoLink: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Closing Remarks
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Any key learnings or acknowledgments?"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-[#222]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/20 transition-all transform active:scale-95 flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Completing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Complete Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
