import { useEffect, useState } from "react";
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
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
  fetchPeopleData,
  updatePeopleData,
  PeopleData,
  Person,
} from "@/api/peopleService";
import { MessageModal } from "@/components/ui/MessageModal";
import { SquareResizeModal } from "@/components/SquareResizeModal"; // ✅ Crop modal
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteBoardMember } from "@/api/peopleService";

export const PeoplePage: React.FC = () => {
  const [data, setData] = useState<PeopleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    open: boolean;
    text: string;
    type: "success" | "error";
  }>({
    open: false,
    text: "",
    type: "success",
  });

  const [cropModal, setCropModal] = useState<{
    open: boolean;
    image: string;
    type: "founder" | "ceo" | "board" | null;
    index?: number;
  }>({
    open: false,
    image: "",
    type: null,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    index: number | null;
  }>({
    open: false,
    index: null,
  });

  useEffect(() => {
    fetchPeopleData()
      .then(setData)
      .catch(() => console.error("Failed to load people data"))
      .finally(() => setLoading(false));
  }, []);

  const uploadIfLocal = async (
    url: string,
    folder: string
  ): Promise<string> => {
    if (url?.startsWith("blob:") || url?.startsWith("data:")) {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      const uploaded = await uploadToCloudinary(file, folder);
      URL.revokeObjectURL(url);
      return uploaded;
    }
    return url;
  };

  const handleSave = async () => {
    if (!data) return;

    const invalidMembers = data.board_members.filter(
      (m) =>
        !m.name?.trim() ||
        !m.bio?.trim() ||
        !m.experience?.trim() ||
        !m.image?.trim()
    );

    if (invalidMembers.length > 0) {
      setMessage({
        open: true,
        text: "⚠️ Please fill in all required fields (name, bio, experience, image) for each Board Member before saving.",
        type: "error",
      });
      return;
    }

    setUploading(true);
    try {
      const founder = { ...data.founder };
      const ceo = { ...data.ceo };
      let board_members = [...data.board_members];

      board_members = board_members.filter(
        (m) => m.name?.trim() || m.bio?.trim() || m.image?.trim()
      );

      founder.image = await uploadIfLocal(
        founder.image,
        "TCETBI/People/Founder"
      );
      ceo.image = await uploadIfLocal(ceo.image, "TCETBI/People/CEO");
      for (const m of board_members) {
        m.image = await uploadIfLocal(m.image, "TCETBI/People/Board");
      }

      const res = await updatePeopleData({ founder, ceo, board_members });
      setMessage({
        open: true,
        text: res?.message || "✅ People data updated successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("❌ Update failed:", err);
      setMessage({
        open: true,
        text: "❌ Failed to update People data. Please check all inputs and try again.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "founder" | "ceo" | "board",
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = reader.result as string;
      setCropModal({ open: true, image: img, type, index });
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = (cropped: File | string) => {
    if (!cropModal.type) return;

    setData((prev) => {
      if (!prev) return prev;
      const type = cropModal.type;
      if (type === "founder")
        return {
          ...prev,
          founder: { ...prev.founder, image: cropped as string },
        };
      if (type === "ceo")
        return { ...prev, ceo: { ...prev.ceo, image: cropped as string } };
      if (type === "board" && cropModal.index !== undefined) {
        const updated = [...prev.board_members];
        updated[cropModal.index].image = cropped as string;
        return { ...prev, board_members: updated };
      }
      return prev;
    });

    setCropModal({ open: false, image: "", type: null });
  };

  const triggerUpload = (type: string, index?: number) => {
    const input = document.getElementById(
      `${type}-input-${index || 0}`
    ) as HTMLInputElement;
    if (input) input.click();
  };

  const handleDeleteClick = (index: number) => {
    setDeleteConfirm({ open: true, index });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm.index === null || !data) return;

    try {
      const member = data.board_members[deleteConfirm.index];
      if (member.id) {
        await deleteBoardMember(member.id);
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              board_members: prev.board_members.filter(
                (_, i) => i !== deleteConfirm.index
              ),
            }
          : prev
      );

      setMessage({
        open: true,
        text: "✅ Board member deleted successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("❌ Failed to delete board member:", err);
      setMessage({
        open: true,
        text: "❌ Failed to delete board member!",
        type: "error",
      });
    } finally {
      setDeleteConfirm({ open: false, index: null });
    }
  };

  const textFieldStyles = {
    "& .MuiInputBase-root": {
      backgroundColor: "hsl(var(--card)) !important",
      color: "hsl(var(--foreground)) !important",
      transition: "background-color 0.3s ease",
    },
    "& .MuiInputBase-input": {
      color: "hsl(var(--foreground)) !important",
      caretColor: "hsl(var(--foreground))",
      "&::selection": {
        backgroundColor: "hsl(0 84.2% 60.2% / 0.3)",
        color: "hsl(var(--foreground))",
      },
    },
    "& input, & textarea": {
      backgroundColor: "transparent !important",
      color: "hsl(var(--foreground)) !important",
    },
    "& .MuiInputLabel-root": {
      color: "hsl(var(--muted-foreground)) !important",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "hsl(0 84.2% 60.2%) !important",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "hsl(var(--border))",
      },
      "&:hover fieldset": {
        borderColor: "hsl(0 84.2% 60.2%)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "hsl(0 84.2% 60.2%)",
      },
    },
  };

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="error" />
      </Box>
    );

  if (!data) return <p>Failed to load People data.</p>;

  // ✅ Disable save if any member incomplete
  const hasEmptyMembers = data.board_members.some(
    (m) =>
      !m.name?.trim() ||
      !m.bio?.trim() ||
      !m.experience?.trim() ||
      !m.image?.trim()
  );

  const renderCard = (
    person: Person,
    type: "founder" | "ceo" | "board",
    index?: number
  ) => {
    const fields =
      type === "founder"
        ? ["name", "position", "bio", "experience"]
        : ["name", "position", "bio", "experience", "email", "linkedin"];

    return (
      <Card
        key={index}
        sx={{
          mb: 4,
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        {type === "board" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              borderBottom: "1px solid hsl(var(--border))",
              pb: 1,
              mb: 2,
            }}
          >
            <IconButton
              onClick={() => handleDeleteClick(index!)}
              sx={{
                color: "hsl(0 84.2% 60.2%)",
                "&:hover": { color: "hsl(0 84.2% 50.2%)" },
              }}
            >
              <Trash2 size={25} />
            </IconButton>
          </Box>
        )}

        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box sx={{ flex: "0 0 200px", textAlign: "center" }}>
              <img
                src={
                  person.image ||
                  "https://ui-avatars.com/api/?name=User&background=ccc&color=444"
                }
                alt={person.name}
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              />
              <input
                id={`${type}-input-${index || 0}`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, type, index)}
              />
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Upload size={16} />}
                sx={uploadButtonStyles}
                onClick={() => triggerUpload(type, index)}
              >
                Upload Image
              </Button>
            </Box>

            <Box sx={{ flex: 1, width: "100%" }}>
              {fields.map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(person as any)[field] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData((prev) => {
                      if (!prev) return prev;
                      if (type === "founder")
                        return {
                          ...prev,
                          founder: { ...prev.founder, [field]: val },
                        };
                      if (type === "ceo")
                        return { ...prev, ceo: { ...prev.ceo, [field]: val } };
                      if (type === "board" && index !== undefined) {
                        const updated = [...prev.board_members];
                        updated[index][field] = val;
                        return { ...prev, board_members: updated };
                      }
                      return prev;
                    });
                  }}
                  sx={{ ...textFieldStyles, mb: 2 }}
                  multiline={field === "bio"}
                  rows={field === "bio" ? 3 : 1}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 4,
        }}
      >
        People Management
      </Typography>

      <Typography variant="h5" sx={{ mb: 2, color: "hsl(var(--primary))" }}>
        Founder
      </Typography>
      {renderCard(data.founder, "founder")}

      <Typography variant="h5" sx={{ mb: 2, color: "hsl(var(--primary))" }}>
        CEO
      </Typography>
      {renderCard(data.ceo, "ceo")}

      <Typography variant="h5" sx={{ mb: 2, color: "hsl(var(--primary))" }}>
        Board Members
      </Typography>
      {data.board_members.map((m, i) => renderCard(m, "board", i))}

      <Button
        startIcon={<Plus />}
        onClick={() =>
          setData({
            ...data,
            board_members: [
              ...data.board_members,
              {
                name: "",
                position: "Board Member",
                bio: "",
                image: "",
                experience: "",
                email: "",
                linkedin: "",
              },
            ],
          })
        }
        sx={{
          ...uploadButtonStyles,
          mb: 4,
          px: 3,
          py: 1,
          borderRadius: "var(--radius)",
          fontWeight: 600,
        }}
      >
        Add Board Member
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton onClick={handleSave} disabled={uploading}>
          {uploading ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Box>

      <MessageModal
        open={message.open}
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ ...message, open: false })}
      />

      <SquareResizeModal
        open={cropModal.open}
        image={cropModal.image}
        onClose={() => setCropModal({ open: false, image: "", type: null })}
        onSave={handleCropSave}
        removeBg={false}
      />
      <ConfirmModal
        open={deleteConfirm.open}
        title="Delete Board Member"
        message={`Are you sure you want to delete "${
          data?.board_members[deleteConfirm.index ?? -1]?.name ||
          "this board member"
        }"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, index: null })}
      />
    </Box>
  );
};
