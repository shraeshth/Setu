import React, { useState, useEffect } from "react";
import { X, Calendar, User, Tag, AlertCircle, CheckCircle, Layers, AlignLeft, Type } from "lucide-react";

export default function NewTaskForm({
  initialStatus = "backlog",
  onClose,
  onCreate,
  members = []
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: initialStatus,
    priority: "medium",
    assignee: null,
    dueDate: "",
    category: ""
  });

  // Ensure status updates if initialStatus changes (though usually component remounts)
  useEffect(() => {
    setForm(prev => ({ ...prev, status: initialStatus }));
  }, [initialStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#222] flex justify-between items-center bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md sticky top-0 z-10">
          <h3 className="text-lg font-bold text-[#2B2B2B] dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D94F04]" />
            Create Task
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-5 custom-scrollbar">

          {/* Title */}
          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Task Title
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Design Home Page"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
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
              <AlignLeft className="absolute left-3 top-3 text-gray-400 w-4 h-4 group-focus-within:text-[#D94F04] transition-colors" />
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Add details about this task..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Grid for Selects */}
          <div className="grid grid-cols-2 gap-4">

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none appearance-none"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <AlertCircle className={`w-4 h-4 ${form.priority === 'high' ? 'text-red-500' : form.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                </div>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Frontend, Design, Marketing"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Assignee
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <select
                  value={form.assignee ? (form.assignee.uid || form.assignee.id) : ""}
                  onChange={e => {
                    const val = e.target.value;
                    const member = members.find(m => (m.uid || m.id) === val);
                    setForm({
                      ...form,
                      assignee: member
                        ? {
                          uid: member.uid || member.id,
                          name: member.name || member.displayName,
                          photoURL: member.photoURL || member.photo || ""
                        }
                        : null
                    });
                  }}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none appearance-none"
                >
                  <option value="">Unassigned</option>
                  {members.map((m, idx) => (
                    <option key={m.uid || m.id || idx} value={m.uid || m.id}>
                      {m.name || m.displayName || "Unknown"}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#D94F04] hover:bg-[#bf4404] shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
