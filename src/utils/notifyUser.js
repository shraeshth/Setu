import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

/**
 * Helper to create a notification both in Firestore (persisted) and as a UI toast.
 * @param {string} uid - User UID to associate the notification with.
 * @param {object} options - Notification options.
 * @param {string} options.type - Type of notification (e.g., "info", "success", "error").
 * @param {string} options.title - Optional title for the notification.
 * @param {string} options.message - Message body.
 * @param {number} [options.duration=5000] - Auto‑dismiss duration in ms.
 */
export const notifyUser = async (uid, { type = "info", title = "", message = "", duration = 5000 }) => {
    try {
        await addDoc(collection(db, "notifications"), {
            userUid: uid,
            type,
            title,
            message,
            createdAt: serverTimestamp(),
            isRead: false,
        });
    } catch (e) {
        console.error("Failed to write notification to Firestore", e);
    }

    // Dispatch a custom event so the NotificationContext can show a toast instantly.
    const event = new CustomEvent("notification", {
        detail: { type, title, message, duration },
    });
    window.dispatchEvent(event);
};
