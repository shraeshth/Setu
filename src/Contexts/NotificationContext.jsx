import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import Toast from "../Components/Notifications/Toast";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, ...notification }]);
        // Auto‑remove after specified duration (default 5 s)
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, notification.duration || 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    // Listen for global custom events dispatched by the notifyUser utility
    useEffect(() => {
        const handler = (e) => {
            const { type = "info", title = "", message = "", duration = 5000 } = e.detail || {};
            addNotification({ type, title, message, duration });
        };
        window.addEventListener("notification", handler);
        return () => window.removeEventListener("notification", handler);
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
            {children}
            <Toast />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
