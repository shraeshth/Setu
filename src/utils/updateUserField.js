import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function updateUserField(uid, field, value) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    [field]: value,
  });
}
