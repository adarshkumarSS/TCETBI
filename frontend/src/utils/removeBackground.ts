export const removeImageBackground = async (file: File): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_REMOVEBG_API_KEY; // store key in .env
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  try {
    // 🔗 Try remove.bg API first
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      console.warn("remove.bg API failed, using fallback");
      return await fallbackTransparent(file);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("❌ remove.bg error:", err);
    return await fallbackTransparent(file);
  }
};

/**
 * 🧠 Fallback background remover:
 * Uses Canvas to convert white/bright backgrounds to transparent.
 */
const fallbackTransparent = async (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple background removal — turns white/near-white pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        if (brightness > 240) data[i + 3] = 0; // remove near-white
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    reader.readAsDataURL(file);
  });
};
