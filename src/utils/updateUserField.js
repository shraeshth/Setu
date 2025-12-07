import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const ALLOWED_FIELDS = [
  "education",
  "experience",
  "certifications",
  "skills",
  "bio",
  "displayName",
  "wantToLearn",
  "projects",
  "connections",
  "completion",
  "photoURL",
];

export async function updateUserField(uid, field, value) {
  if (!ALLOWED_FIELDS.includes(field)) {
    throw new Error(`Invalid field update attempted: ${field}`);
  }

  if (value === undefined) {
    throw new Error(`Value for ${field} is undefined. Refusing to overwrite.`);
  }

  // If field must always be an array (your schema)
  const ARRAY_FIELDS = ["education", "experience", "certifications", "skills", "wantToLearn"];

  if (ARRAY_FIELDS.includes(field) && !Array.isArray(value)) {
    throw new Error(`Expected array for ${field}, got ${typeof value}`);
  }

  const ref = doc(db, "users", uid);
  await updateDoc(ref, { [field]: value });
}
