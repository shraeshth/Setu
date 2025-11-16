// TaskModal.jsx
import React, { useState } from "react";

export default function TaskModal({ task, onClose = () => {}, onSave = () => {}, onDelete = () => {} }) {
  const [form, setForm] = useState(task);

  const save = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B0B0B] rounded-lg p-6 border border-[#E2E1DB] dark:border-[#2B2B2B]">
        <h3 className="text-lg font-semibold mb-3">Edit Task</h3>
        <input className="w-full mb-3 p-2 border rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <textarea className="w-full mb-3 p-2 border rounded" rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <button onClick={save} className="px-3 py-2 bg-[#D94F04] text-white rounded">Save</button>
            <button onClick={() => { onDelete(task.id); onClose(); }} className="px-3 py-2 bg-red-100 text-red-700 rounded">Delete</button>
          </div>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
}
