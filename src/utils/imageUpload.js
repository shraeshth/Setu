// Cloudinary unsigned upload + fallback to ImgBB
export async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "YOUR_UNSIGNED_PRESET"); // create unsigned preset in Cloudinary
  const res = await fetch(url, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Cloudinary upload failed");
  return { url: data.secure_url, public_id: data.public_id };
}

export async function uploadToImgBB(file) {
  const apiKey = import.meta.env.VITE_IMGBB_KEY || "YOUR_IMGBB_KEY";
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: form
  });
  const data = await res.json();
  if (!res.ok) throw new Error("ImgBB upload failed");
  return { url: data.data.url };
}

export async function uploadImageWithFallback(file) {
  try {
    return await uploadToCloudinary(file);
  } catch (err) {
    console.warn("Cloudinary failed, falling back to ImgBB:", err);
    return await uploadToImgBB(file);
  }
}
