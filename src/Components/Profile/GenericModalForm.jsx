import React, { useState } from "react";
import { X, CheckCircle, Edit3 } from "lucide-react";

export default function GenericModalForm({
  title,
  fields,
  initialData = {},
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(initialData);

  const update = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col transform transition-all animate-in fade-in zoom-in-95">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#222] flex justify-between items-center bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md">
          <h2 className="text-lg font-bold text-[#2B2B2B] dark:text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#D94F04]" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="group">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                {f.placeholder || f.name}
              </label>
              <input
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name] || ""}
                onChange={update}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-xl text-sm focus:ring-2 focus:ring-[#D94F04]/50 focus:border-[#D94F04] outline-none transition-all placeholder-gray-400"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#1A1A1A]/50 backdrop-blur-md flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#D94F04] hover:bg-[#bf4404] shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
