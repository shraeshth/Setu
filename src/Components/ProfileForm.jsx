import React, { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";

export default function ProfileForm({ existing }) {
  const { currentUser } = useAuth();

  const [displayName, setDisplayName] = useState(existing?.displayName || "");
  const [bio, setBio] = useState(existing?.bio || "");
  const [skills, setSkills] = useState(existing?.skills?.join(", ") || "");
  const [wantToLearn, setWantToLearn] = useState(
    existing?.wantToLearn?.join(", ") || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      const ref = doc(db, "users", currentUser.uid);
      await setDoc(
        ref,
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: displayName.trim(),
          bio: bio.trim(),
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          wantToLearn: wantToLearn.split(",").map((s) => s.trim()).filter(Boolean),
          photoURL: currentUser.photoURL || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      alert("Profile saved!");
    } catch (err) {
      console.error("Profile save error:", err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-3 text-white">
      <div>
        <label className="block text-sm mb-1 text-gray-400">Display Name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-400">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-400">Skills (comma separated)</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-400">Want To Learn (comma separated)</label>
        <input
          value={wantToLearn}
          onChange={(e) => setWantToLearn(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        />
      </div>

      <button
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
