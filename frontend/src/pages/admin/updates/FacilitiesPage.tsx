// src/pages/FacilitiesAdmin.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Plus, Upload, Trash2 } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";
import { SquareResizeModal } from "@/components/SquareResizeModal";
import { MessageModal } from "@/components/ui/MessageModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
  fetchFacilitiesData,
  updateFacilitiesData,
  deleteFacilityItem,
  Facility,
  FacilityVideo,
} from "@/api/facilityService";
import { extractYouTubeID, youtubeThumbnailFromUrl } from "@/utils/youtube";

/**
 * Ultra-polished Facilities admin page.
 * Matches PeoplePage exactly — dark theme friendly,
 * rounded corners, no Grid inside Grid.
 */

const textFieldStyles = {
  "& .MuiInputBase-root": {
    backgroundColor: "hsl(var(--card)) !important",
    color: "hsl(var(--foreground)) !important",
  },
  "& .MuiInputBase-input": {
    color: "hsl(var(--foreground)) !important",
  },
  "& .MuiInputLabel-root": {
    color: "hsl(var(--muted-foreground)) !important",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "hsl(var(--border))",
    },
    "&:hover fieldset": {
      borderColor: "hsl(var(--primary))",
    },
    "&.Mui-focused fieldset": {
      borderColor: "hsl(var(--primary))",
    },
  },
};

type LocalFacility = Facility & { _isNew?: boolean };
type LocalVideo = FacilityVideo & { _isNew?: boolean };

export const FacilitiesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [facilities, setFacilities] = useState<LocalFacility[]>([]);
  const [videos, setVideos] = useState<LocalVideo[]>([]);

  const [message, setMessage] = useState({
    open: false,
    text: "",
    type: "success" as "success" | "error",
  });

  const [cropModal, setCropModal] = useState({
    open: false,
    image: "",
    target: null as null | { type: "facility"; index: number },
  });

  const [confirm, setConfirm] = useState({
    open: false,
    id: undefined as number | undefined,
    type: undefined as "facility" | "video" | undefined,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFacilitiesData();

        const facilitiesNormalized = (data.facilities || []).map((f: any) => ({
          ...f,
          category: f.category ? String(f.category).toUpperCase() : "SHARED",
        }));

        setFacilities(facilitiesNormalized);
        setVideos(data.videos || []);
      } catch (err) {
        console.error(err);
        setMessage({
          open: true,
          text: "Failed to load facilities",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFacilityChange = (index: number, patch: Partial<LocalFacility>) =>
    setFacilities((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });

  const handleVideoChange = (index: number, patch: Partial<LocalVideo>) =>
    setVideos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });

  const addFacility = (category: Facility["category"]) => {
    const newId = Date.now() * -1;
    setFacilities((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        description: "",
        image: "",
        features: [],
        category,
        _isNew: true,
      },
    ]);
  };

  const addVideo = () =>
    setVideos((prev) => [
  ...prev,
  { id: Date.now() * -1, title: "", description: "", url: "", thumbnail: "", _isNew: true },
]);

  const removeLocalFacility = (index: number) => {
    const item = facilities[index];
    if (item.id && typeof item.id === "number" && item.id > 0) {
      setConfirm({ open: true, id: item.id, type: "facility" });
    } else {
      setFacilities((p) => p.filter((_, i) => i !== index));
    }
  };

  const removeLocalVideo = (index: number) => {
    const item = videos[index];
    if (item.id && typeof item.id === "number" && item.id > 0) {
      setConfirm({ open: true, id: item.id, type: "video" });
    } else {
      setVideos((p) => p.filter((_, i) => i !== index));
    }
  };

  // file input triggers
  const triggerUpload = (index: number) => {
    const input = document.getElementById(
      `facility-image-${index}`
    ) as HTMLInputElement | null;
    input?.click();
  };

  const onFileSelectedForFacility = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropModal({
        open: true,
        image: reader.result as string,
        target: { type: "facility", index },
      });
    };
    reader.readAsDataURL(file);
  };

  const onCropSave = (cropped: File | string) => {
    if (!cropModal.target) return;
    const { index } = cropModal.target;

    if (typeof cropped === "string") {
      handleFacilityChange(index, { image: cropped });
    } else {
      const tmp = URL.createObjectURL(cropped);
      handleFacilityChange(index, { image: tmp as unknown as string });
    }

    setCropModal({ open: false, image: "", target: null });
  };

  const confirmDeleteRemote = async () => {
    if (!confirm.id || !confirm.type) return;
    try {
      await deleteFacilityItem(confirm.id);
      setMessage({
        open: true,
        text:
          confirm.type === "facility" ? "Facility deleted" : "Video deleted",
        type: "success",
      });

      if (confirm.type === "facility")
        setFacilities((p) => p.filter((f) => f.id !== confirm.id));
      else setVideos((p) => p.filter((v) => v.id !== confirm.id));
    } catch (err) {
      console.error(err);
      setMessage({ open: true, text: "Failed deleting item", type: "error" });
    } finally {
      setConfirm({ open: false, id: undefined, type: undefined });
    }
  };

  // Validate before saving
  const validateBeforeSave = (): { ok: boolean; message?: string } => {
    for (const f of facilities) {
      if (!f.name?.trim())
        return { ok: false, message: "Please fill name for all facilities" };
      if (!f.image?.trim())
        return { ok: false, message: "Please upload image for all facilities" };
    }
    for (const v of videos) {
      if (!v.title?.trim())
        return { ok: false, message: "Please fill title for all videos" };
      if (!v.url?.trim())
        return {
          ok: false,
          message: "Please paste full YouTube link for all videos",
        };
    }
    return { ok: true };
  };

  // Save flow
  const handleSave = async () => {
    const valid = validateBeforeSave();
    if (!valid.ok) {
      setMessage({
        open: true,
        text: valid.message || "Validation failed",
        type: "error",
      });
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      // Facilities image uploads
      const updatedFacilities: Facility[] = [];
      for (const f of facilities) {
        let imgUrl = f.image;
        if (
          imgUrl &&
          (imgUrl.startsWith("data:") ||
            imgUrl.startsWith("blob:") ||
            imgUrl.startsWith("file:"))
        ) {
          const res = await fetch(imgUrl);
          const blob = await res.blob();
          const file = new File([blob], `facility-${Date.now()}.jpg`, {
            type: blob.type,
          });
          const uploaded = await uploadToCloudinary(file, `TCETBI/Facilities`);
          imgUrl = uploaded;
        }

        updatedFacilities.push({
          id: f.id,
          name: f.name,
          description: f.description,
          image: imgUrl,
          features: f.features || [],
          category: f.category,
        });
      }

      // videos normalization
      const updatedVideos: FacilityVideo[] = [];
      for (const v of videos) {
        let vidUrl = v.url || "";
        const idFromUrl = extractYouTubeID(vidUrl);
        if (idFromUrl && !vidUrl.includes("youtube")) {
          vidUrl = `https://www.youtube.com/watch?v=${idFromUrl}`;
        }

        const thumbnailCandidate = youtubeThumbnailFromUrl(vidUrl);

        updatedVideos.push({
          id: v.id,
          title: v.title,
          description: v.description,
          url: vidUrl,
          thumbnail: v.thumbnail || thumbnailCandidate || "",
        });
      }

      await updateFacilitiesData({
        facilities: updatedFacilities,
        videos: updatedVideos,
      });

      setMessage({
        open: true,
        text: "✅ Facilities updated!",
        type: "success",
      });

      const fresh = await fetchFacilitiesData();
      setFacilities(fresh.facilities || []);
      setVideos(fresh.videos || []);
    } catch (err) {
      console.error("Save failed:", err);
      setMessage({
        open: true,
        text: "❌ Save failed. Check console.",
        type: "error",
      });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  const cardSx = {
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
    backgroundColor: "hsl(var(--card))",
    color: "hsl(var(--foreground))",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  };
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 700,
          mb: 3,
          color: "hsl(var(--foreground))",
        }}
      >
        Facilities Management
      </Typography>

      {/* ========= Videos ========= */}
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: "hsl(var(--primary))",
        }}
      >
        Facility Showcase Videos
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {videos.map((v, i) => (
          <Card key={`video-${v.id || "new"}-${i}`} sx={{ ...cardSx }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                }}
              >
                {/* LEFT (inputs) */}
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={v.title}
                    onChange={(e) =>
                      handleVideoChange(i, { title: e.target.value })
                    }
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                      "& .MuiInputBase-input": {
                        color: "hsl(var(--foreground))",
                      },
                      "& .MuiInputLabel-root": {
                        color: "hsl(var(--muted-foreground))",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Full YouTube Link (or ID)"
                    value={v.url}
                    onChange={(e) => {
                      const val = e.target.value;
                      const thumb = youtubeThumbnailFromUrl(val);
                      handleVideoChange(i, {
                        url: val,
                        thumbnail: thumb || v.thumbnail,
                      });
                    }}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                      "& .MuiInputBase-input": {
                        color: "hsl(var(--foreground))",
                      },
                      "& .MuiInputLabel-root": {
                        color: "hsl(var(--muted-foreground))",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={v.description}
                    onChange={(e) =>
                      handleVideoChange(i, { description: e.target.value })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                      "& .MuiInputBase-input": {
                        color: "hsl(var(--foreground))",
                      },
                      "& .MuiInputLabel-root": {
                        color: "hsl(var(--muted-foreground))",
                      },
                    }}
                  />
                </Box>

                {/* RIGHT (thumbnail + delete) */}
                <Box
                  sx={{
                    width: { xs: "100%", md: 260 },
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  <Box sx={{ mb: 1, borderRadius: 2, overflow: "hidden" }}>
                    <img
                      src={
                        v.thumbnail ||
                        "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
                      }
                      alt="thumb"
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 10,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Plus />}
                      onClick={() =>
                        handleVideoChange(i, {
                          thumbnail:
                            youtubeThumbnailFromUrl(v.url) || v.thumbnail,
                        })
                      }
                    >
                      Fetch Thumb
                    </Button>

                    <IconButton
                      onClick={() => removeLocalVideo(i)}
                      sx={{ color: "hsl(0 84.2% 60.2%)" }}
                    >
                      <Trash2 />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Button
          startIcon={<Plus />}
          onClick={() => addVideo()}
          sx={{
            mt: 1,
            color: "hsl(var(--foreground))",
            borderColor: "hsl(var(--border))",
          }}
        >
          Add Video
        </Button>
      </Box>

      {/* ========= SHARED FACILITIES ========= */}
      <Typography
        variant="h5"
        sx={{ mt: 4, mb: 2, color: "hsl(var(--primary))" }}
      >
        Shared Infrastructure
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {facilities
          .filter((f) => f.category === "SHARED")
          .map((f) => {
            const index = facilities.findIndex((x) => x === f);
            return (
              <Card key={f.id ?? `shared-${index}`} sx={{ ...cardSx }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                    }}
                  >
                    {/* LEFT: image */}
                    <Box sx={{ flex: "0 0 240px", textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 200,
                          height: 140,
                          borderRadius: 2,
                          overflow: "hidden",
                          mx: "auto",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                        }}
                      >
                        <img
                          src={
                            f.image ||
                            "https://ui-avatars.com/api/?name=Facility&background=eee&color=333"
                          }
                          alt={f.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      <input
                        id={`facility-image-${index}`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => onFileSelectedForFacility(e, index)}
                      />

                      <Box sx={{ mt: 1 }}>
                        <Button
                          startIcon={<Upload />}
                          variant="outlined"
                          onClick={() => triggerUpload(index)}
                          sx={{
                            color: "hsl(var(--foreground))",
                            borderColor: "hsl(var(--border))",
                          }}
                        >
                          Upload
                        </Button>
                      </Box>
                    </Box>
                    {/* RIGHT: inputs */}
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={f.name}
                        onChange={(e) =>
                          handleFacilityChange(index, {
                            name: e.target.value,
                          })
                        }
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                          "& .MuiInputBase-input": {
                            color: "hsl(var(--foreground))",
                          },
                          "& .MuiInputLabel-root": {
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        value={f.description}
                        onChange={(e) =>
                          handleFacilityChange(index, {
                            description: e.target.value,
                          })
                        }
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                          "& .MuiInputBase-input": {
                            color: "hsl(var(--foreground))",
                          },
                          "& .MuiInputLabel-root": {
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Features (comma separated)"
                        value={(f.features || []).join(", ")}
                        onChange={(e) =>
                          handleFacilityChange(index, {
                            features: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                          "& .MuiInputBase-input": {
                            color: "hsl(var(--foreground))",
                          },
                          "& .MuiInputLabel-root": {
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => removeLocalFacility(index)}
                          sx={{ color: "hsl(0 84.2% 60.2%)" }}
                        >
                          <Trash2 />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
      </Box>

      <Button
        startIcon={<Plus />}
        onClick={() => addFacility("SHARED")}
        sx={{
          mt: 2,
          color: "hsl(var(--foreground))",
          borderColor: "hsl(var(--border))",
        }}
      >
        Add Shared Facility
      </Button>

      {/* ========= TCETBI FACILITIES ========= */}
      <Typography
        variant="h5"
        sx={{ mt: 4, mb: 2, color: "hsl(var(--primary))" }}
      >
        TCETBI Infrastructure
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {facilities
          .filter((f) => f.category === "TCETBI")
          .map((f) => {
            const index = facilities.findIndex((x) => x === f);
            return (
              <Card key={f.id ?? `tcetbi-${index}`} sx={{ ...cardSx }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 2,
                    }}
                  >
                    {/* LEFT: image */}
                    <Box sx={{ flex: "0 0 240px", textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 200,
                          height: 140,
                          borderRadius: 2,
                          overflow: "hidden",
                          mx: "auto",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                        }}
                      >
                        <img
                          src={
                            f.image ||
                            "https://ui-avatars.com/api/?name=Facility&background=eee&color=333"
                          }
                          alt={f.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      <input
                        id={`facility-image-${index}`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => onFileSelectedForFacility(e, index)}
                      />

                      <Box sx={{ mt: 1 }}>
                        <Button
                          startIcon={<Upload />}
                          variant="outlined"
                          onClick={() => triggerUpload(index)}
                          sx={{
                            color: "hsl(var(--foreground))",
                            borderColor: "hsl(var(--border))",
                          }}
                        >
                          Upload
                        </Button>
                      </Box>
                    </Box>

                    {/* RIGHT: inputs */}
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={f.name}
                        onChange={(e) =>
                          handleFacilityChange(index, {
                            name: e.target.value,
                          })
                        }
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                          "& .MuiInputBase-input": {
                            color: "hsl(var(--foreground))",
                          },
                          "& .MuiInputLabel-root": {
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        value={f.description}
                        onChange={(e) =>
                          handleFacilityChange(index, {
                            description: e.target.value,
                          })
                        }
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                          "& .MuiInputBase-input": {
                            color: "hsl(var(--foreground))",
                          },
                          "& .MuiInputLabel-root": {
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Features (comma separated)"
                        value={(f.features || []).join(", ")}
                        onChange={(e) =>
                          handleFacilityChange(index, {
                            features: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        sx={{
                          mb: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                          "& .MuiInputBase-input": {
                            color: "hsl(var(--foreground))",
                          },
                          "& .MuiInputLabel-root": {
                            color: "hsl(var(--muted-foreground))",
                          },
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => removeLocalFacility(index)}
                          sx={{ color: "hsl(0 84.2% 60.2%)" }}
                        >
                          <Trash2 />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
      </Box>

      <Button
        startIcon={<Plus />}
        onClick={() => addFacility("TCETBI")}
        sx={{
          mt: 2,
          mb: 4,
          color: "hsl(var(--foreground))",
          borderColor: "hsl(var(--border))",
        }}
      >
        Add TCETBI Facility
      </Button>

      {/* SAVE BUTTON */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <DarkButton onClick={handleSave} disabled={saving || uploading}>
          {saving ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Box>

      {/* MODALS */}
      <MessageModal
        open={message.open}
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ ...message, open: false })}
      />

      <SquareResizeModal
        open={cropModal.open}
        image={cropModal.image}
        onClose={() =>
          setCropModal({
            open: false,
            image: "",
            target: null,
          })
        }
        onSave={onCropSave}
        removeBg={false}
      />

      <ConfirmModal
        open={confirm.open}
        title="Delete Item"
        message="Are you sure? This will permanently remove the item from DB and Cloudinary."
        onConfirm={confirmDeleteRemote}
        onCancel={() =>
          setConfirm({ open: false, id: undefined, type: undefined })
        }
      />
    </Box>
  );
};

export default FacilitiesPage;
