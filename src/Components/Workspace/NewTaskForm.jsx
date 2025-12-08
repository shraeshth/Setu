// NewTaskForm.jsx
import React, { useState } from "react";

export default function NewTaskForm({ defaultStatus = "backlog", onClose = () => { }, onSubmit = () => { }, projectMembers = [] }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: defaultStatus,
    priority: "medium",
    assignee: null,
    dueDate: "",
    category: ""
  });

  const submit = () => {
    if (!form.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0B0B0B] rounded-lg p-6 border border-[#E2E1DB] dark:border-[#2B2B2B]">
        <h3 className="text-lg font-semibold mb-3">Create Task</h3>

        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Task title *"
          className="w-full p-2 mb-2 border border-[#E2E1DB] dark:border-[#333] rounded bg-white dark:bg-[#111] text-[#2B2B2B] dark:text-gray-200"
          required
        />
        <textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows={4}
          placeholder="Description"
          className="w-full p-2 mb-2 border border-[#E2E1DB] dark:border-[#333] rounded bg-white dark:bg-[#111] text-[#2B2B2B] dark:text-gray-200"
        />
        <div className="flex gap-2 flex-wrap">
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            className="p-2 border border-[#E2E1DB] dark:border-[#333] rounded bg-white dark:bg-[#111] text-[#2B2B2B] dark:text-gray-200">
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>

          <input
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            placeholder="Category (e.g. Design)"
            className="p-2 border border-[#E2E1DB] dark:border-[#333] rounded bg-white dark:bg-[#111] text-[#2B2B2B] dark:text-gray-200"
          />

          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
            className="p-2 border border-[#E2E1DB] dark:border-[#333] rounded bg-white dark:bg-[#111] text-[#2B2B2B] dark:text-gray-200">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={form.assignee ? (form.assignee.uid || form.assignee.id) : ""}
            onChange={e => {
              const val = e.target.value;
              const member = projectMembers.find(m => (m.uid || m.id) === val);
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
            className="p-2 border border-[#E2E1DB] dark:border-[#333] rounded bg-white dark:bg-[#111] text-[#2B2B2B] dark:text-gray-200"
          >
            <option value="">Unassigned</option>
            {projectMembers.map((m, idx) => (
              <option key={m.uid || m.id || idx} value={m.uid || m.id}>
                {m.name || m.displayName || "Unknown"}
              </option>
            ))}
          </select>
          <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
            className="p-2 border border-[#E2E1DB] dark:border-[#333] rounded bg-white dark:bg-[#111] text-[#2B2B2B] dark:text-gray-200" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button onClick={submit} className="px-4 py-2 bg-[#D94F04] text-white rounded">Create</button>
          <button onClick={onClose} className="text-sm text-gray-500">Cancel</button>
        </div>
      </div>
    </div>
  );
}
