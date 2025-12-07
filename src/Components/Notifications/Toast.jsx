import React from "react";
import { useNotification } from "../../Contexts/NotificationContext";

export default function Toast() {
    const { notifications } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`max-w-xs w-full shadow-lg rounded-lg p-3 text-sm text-white flex items-center justify-between
            ${n.type === "error" ? "bg-red-600" : n.type === "warning" ? "bg-yellow-600" : "bg-green-600"}`}
                >
                    <span>{n.message}</span>
                    <button
                        onClick={() => {
                            // remove manually if needed
                            // NotificationContext provides removeNotification via context
                        }}
                        className="ml-2 text-white hover:opacity-80"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
