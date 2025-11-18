import React, { useState } from "react";

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
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-6 z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-[#FCFCF9] dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full border border-[#E2E1DB] dark:border-[#3A3A3A]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-sm text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white mb-4"
        >
          Close ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          {fields.map((f) => (
            <input
              key={f.name}
              name={f.name}
              placeholder={f.placeholder}
              value={form[f.name] || ""}
              onChange={update}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#0B0B0B]
                         border border-gray-300 dark:border-[#2B2B2B]"
            />
          ))}
        </div>

        <button
          onClick={() => onSave(form)}
          className="mt-4 bg-[#D94F04] text-white px-4 py-2 rounded-lg w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
}
