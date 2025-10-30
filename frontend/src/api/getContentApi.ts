export const getLandingContent = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/content/");
    if (!res.ok) throw new Error("Failed to fetch content");
    const data = await res.json();
    return data[0]; // since you’re returning a list with one object
  } catch (err) {
    console.error("Error fetching content:", err);
    return null;
  }
};
