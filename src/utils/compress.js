import imageCompression from "browser-image-compression";

export async function compressFile(file, maxSizeMB = 0.25, maxWH = 1600) {
  // returns a File-like object
  const options = {
    maxSizeMB,
    maxWidthOrHeight: maxWH,
    useWebWorker: true
  };
  return await imageCompression(file, options);
}
