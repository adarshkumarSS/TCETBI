import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (
  file: File,
  folder: string = "TCETBI/Startups"
): Promise<string> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("❌ Cloudinary environment variables not configured.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder); // ✅ ensures organized storage

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          console.log(`⬆️ Uploading... ${percentCompleted}%`);
        },
      }
    );

    console.log("✅ Cloudinary upload successful:", response.data.secure_url);
    return response.data.secure_url;
  } catch (error: any) {
    console.error("❌ Cloudinary upload failed:", error.response?.data || error.message);
    throw new Error("Image upload failed. Please try again.");
  }
};
