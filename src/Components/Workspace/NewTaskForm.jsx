// NewTaskForm.jsx
import React, { useState } from "react";

export default function NewTaskForm({ defaultStatus = "backlog", onClose = () => {}, onSubmit = () => {} }) {
  const [form, setForm] = useState({ title: "", description: "", status: defaultStatus, priority: "medium", assignee: null, dueDate: "" });

  const submit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0B0B0B] rounded-lg p-6 border border-[#E2E1DB] dark:border-[#2B2B2B]">
        <h3 className="text-lg font-semibold mb-3">Create Task</h3>

        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full p-2 mb-2 border rounded" />
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} placeholder="Description" className="w-full p-2 mb-2 border rounded" />
        <div className="flex gap-2">
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="p-2 border rounded">
            <option value="backlog">Backlog</option>
            <option value="in-progress">To Do</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
          <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="p-2 border rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="p-2 border rounded" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button onClick={submit} className="px-4 py-2 bg-[#D94F04] text-white rounded">Create</button>
          <button onClick={onClose} className="text-sm text-gray-500">Cancel</button>
        </div>
      </div>
    </div>
  );
}
