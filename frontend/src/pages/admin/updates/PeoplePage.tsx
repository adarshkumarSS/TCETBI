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
  Fab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { Plus, Upload, Trash2, Save, Edit2, FolderPlus, X, GripVertical } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
  fetchPeopleData,
  updatePeopleData,
  PeopleData,
  Person,
} from "@/api/peopleService";
import { toast } from "sonner";
import { SquareResizeModal } from "@/components/SquareResizeModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { deleteBoardMember } from "@/api/peopleService";
import { Reorder } from "framer-motion";

interface CustomSection {
  id: string;
  title: string;
  members: Person[];
}

export const PeoplePage: React.FC = () => {
  const [data, setData] = useState<PeopleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [sectionTitles, setSectionTitles] = useState({
    founder: "Founder",
    ceo: "CEO",
    board: "Board Members",
  });
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newSectionDialog, setNewSectionDialog] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  const [cropModal, setCropModal] = useState<{
    open: boolean;
    image: string;
    type: "founder" | "ceo" | "board" | "custom" | null;
    index?: number;
    sectionId?: string;
  }>({
    open: false,
    image: "",
    type: null,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    index: number | null;
    sectionId?: string;
  }>({
    open: false,
    index: null,
  });

  useEffect(() => {
    fetchPeopleData()
      .then(setData)
      .catch(() => toast.error("Failed to load people data"))
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
      toast.error("⚠️ Please fill in all required fields for each member");
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

      await updatePeopleData({ founder, ceo, board_members });
      toast.success("✅ People data updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("❌ Failed to update People data");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "founder" | "ceo" | "board" | "custom",
    index?: number,
    sectionId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = reader.result as string;
      setCropModal({ open: true, image: img, type, index, sectionId });
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = (cropped: File | string) => {
    if (!cropModal.type) return;

    if (cropModal.type === "custom" && cropModal.sectionId) {
      setCustomSections((prev) =>
        prev.map((section) =>
          section.id === cropModal.sectionId && cropModal.index !== undefined
            ? {
                ...section,
                members: section.members.map((m, i) =>
                  i === cropModal.index ? { ...m, image: cropped as string } : m
                ),
              }
            : section
        )
      );
    } else {
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
    }

    setCropModal({ open: false, image: "", type: null });
  };

  const triggerUpload = (type: string, index?: number, sectionId?: string) => {
    const input = document.getElementById(
      `${type}-input-${sectionId || ""}-${index || 0}`
    ) as HTMLInputElement;
    if (input) input.click();
  };

  const handleDeleteClick = (index: number, sectionId?: string) => {
    setDeleteConfirm({ open: true, index, sectionId });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm.index === null) return;

    try {
      if (deleteConfirm.sectionId) {
        // Delete from custom section
        setCustomSections((prev) =>
          prev.map((section) =>
            section.id === deleteConfirm.sectionId
              ? {
                  ...section,
                  members: section.members.filter(
                    (_, i) => i !== deleteConfirm.index
                  ),
                }
              : section
          )
        );
        toast.success("✅ Member deleted successfully!");
      } else if (data) {
        // Delete from board members
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
        toast.success("✅ Board member deleted successfully!");
      }
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      toast.error("❌ Failed to delete member!");
    } finally {
      setDeleteConfirm({ open: false, index: null });
    }
  };

  const handleCreateSection = () => {
    if (!newSectionName.trim()) {
      toast.error("Please enter a section name");
      return;
    }

    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title: newSectionName,
      members: [],
    };

    setCustomSections([...customSections, newSection]);
    setNewSectionDialog(false);
    setNewSectionName("");
    toast.success(`✅ Section "${newSectionName}" created!`);
  };

  const handleDeleteSection = (sectionId: string) => {
    const section = customSections.find((s) => s.id === sectionId);
    if (
      section &&
      window.confirm(`Delete entire "${section.title}" section?`)
    ) {
      setCustomSections(customSections.filter((s) => s.id !== sectionId));
      toast.success("✅ Section deleted!");
    }
  };

  const handleSectionReorder = (newOrder: CustomSection[]) => {
    setCustomSections(newOrder);
    toast.success("✅ Sections reordered! Don't forget to save.");
  };

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

  const renderCard = (
    person: Person,
    type: "founder" | "ceo" | "board" | "custom",
    index?: number,
    sectionId?: string
  ) => {
    const fields =
      type === "founder"
        ? ["name", "position", "bio", "experience"]
        : ["name", "position", "bio", "experience", "email", "linkedin"];

    return (
      <Card
        key={`${type}-${sectionId}-${index}`}
        sx={{
          mb: 2,
          border: "1px solid hsl(var(--border))",
          borderRadius: "12px",
          backgroundColor: "hsl(var(--card))",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        {(type === "board" || type === "custom") && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton
              onClick={() => handleDeleteClick(index!, sectionId)}
              size="small"
              sx={{ color: "error.main" }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        )}

        <CardContent sx={{ p: 2, pt: type === "board" || type === "custom" ? 0 : 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: "0 0 140px", textAlign: "center" }}>
              <img
                src={
                  person.image ||
                  "https://ui-avatars.com/api/?name=User&background=ccc&color=444"
                }
                alt={person.name}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              />
              <input
                id={`${type}-input-${sectionId || ""}-${index || 0}`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, type, index, sectionId)}
              />
              <Button
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<Upload size={12} />}
                sx={{ ...uploadButtonStyles, fontSize: "0.75rem", py: 0.5 }}
                onClick={() => triggerUpload(type, index, sectionId)}
              >
                Upload
              </Button>
            </Box>

            <Box sx={{ flex: 1 }}>
              {fields.map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  size="small"
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(person as any)[field] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (type === "custom" && sectionId) {
                      setCustomSections((prev) =>
                        prev.map((section) =>
                          section.id === sectionId && index !== undefined
                            ? {
                                ...section,
                                members: section.members.map((m, i) =>
                                  i === index ? { ...m, [field]: val } : m
                                ),
                              }
                            : section
                        )
                      );
                    } else {
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
                    }
                  }}
                  sx={{ ...textFieldStyles, mb: 1 }}
                  multiline={field === "bio"}
                  rows={field === "bio" ? 2 : 1}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (
    title: string,
    sectionKey: "founder" | "ceo" | "board"
  ) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        {editingTitle === sectionKey ? (
          <TextField
            value={sectionTitles[sectionKey]}
            onChange={(e) =>
              setSectionTitles({ ...sectionTitles, [sectionKey]: e.target.value })
            }
            onBlur={() => setEditingTitle(null)}
            onKeyPress={(e) => e.key === "Enter" && setEditingTitle(null)}
            autoFocus
            size="small"
            sx={{ ...textFieldStyles, maxWidth: 300 }}
          />
        ) : (
          <>
            <Typography variant="h6" sx={{ color: "hsl(var(--primary))", fontWeight: 600 }}>
              {sectionTitles[sectionKey]}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setEditingTitle(sectionKey)}
              sx={{ color: "hsl(var(--muted-foreground))" }}
            >
              <Edit2 size={14} />
            </IconButton>
          </>
        )}
      </Box>
      {sectionKey === "founder" && renderCard(data.founder, "founder")}
      {sectionKey === "ceo" && renderCard(data.ceo, "ceo")}
      {sectionKey === "board" && data.board_members.map((m, i) => renderCard(m, "board", i))}
      {sectionKey === "board" && (
        <Button
          startIcon={<Plus size={16} />}
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
          size="small"
          sx={{ ...uploadButtonStyles, mt: 1 }}
        >
          Add Member
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ pb: 10 }}>
      {/* Sticky Header */}
      <Paper
        elevation={4}
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 100,
          p: 2.5,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "hsl(var(--card))",
          borderBottom: "2px solid hsl(var(--primary))",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
          People Management
        </Typography>
        <DarkButton 
          onClick={handleSave} 
          disabled={uploading} 
          startIcon={<Save size={18} />}
          sx={{
            px: 3,
            py: 1.2,
            fontSize: "0.95rem",
            boxShadow: 3,
            "&:hover": {
              boxShadow: 5,
            },
          }}
        >
          {uploading ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Paper>

      {/* Hint for custom sections */}
      {customSections.length > 1 && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))", fontStyle: "italic" }}>
            💡 Tip: Drag the grip icon to reorder custom sections
          </Typography>
        </Box>
      )}

      {renderSection("Founder", "founder")}
      {renderSection("CEO", "ceo")}
      {renderSection("Board Members", "board")}

      {/* Custom Sections - Draggable */}
      <Reorder.Group
        axis="y"
        values={customSections}
        onReorder={handleSectionReorder}
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {customSections.map((section) => (
          <Reorder.Item
            key={section.id}
            value={section}
            style={{ marginBottom: "24px" }}
            whileDrag={{
              scale: 1.02,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              cursor: "grabbing",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: "8px",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "hsl(var(--accent))",
                    borderColor: "hsl(var(--primary))",
                  },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    cursor: "grab",
                    color: "hsl(var(--muted-foreground))",
                    transition: "color 0.2s",
                    "&:hover": {
                      color: "hsl(var(--primary))",
                    },
                    "&:active": { 
                      cursor: "grabbing",
                      color: "hsl(var(--primary))",
                    },
                  }}
                >
                  <GripVertical size={20} />
                </IconButton>
                <Typography variant="h6" sx={{ color: "hsl(var(--primary))", fontWeight: 600, flex: 1 }}>
                  {section.title}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteSection(section.id)}
                  sx={{ 
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Box>
              {section.members.map((m, i) => renderCard(m, "custom", i, section.id))}
              <Button
                startIcon={<Plus size={16} />}
                onClick={() =>
                  setCustomSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id
                        ? {
                            ...s,
                            members: [
                              ...s.members,
                              {
                                name: "",
                                position: "",
                                bio: "",
                                image: "",
                                experience: "",
                                email: "",
                                linkedin: "",
                              },
                            ],
                          }
                        : s
                    )
                  )
                }
                size="small"
                sx={{ ...uploadButtonStyles, mt: 1 }}
              >
                Add Member
              </Button>
            </Box>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "hsl(0 84.2% 60.2%)",
          "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
        }}
        onClick={() => setNewSectionDialog(true)}
      >
        <FolderPlus />
      </Fab>

      {/* New Section Dialog */}
      <Dialog open={newSectionDialog} onClose={() => setNewSectionDialog(false)}>
        <DialogTitle>Create New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Section Name"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateSection()}
            sx={{ ...textFieldStyles, mt: 2 }}
            placeholder="e.g., Advisory Board, Mentors, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSectionDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateSection} variant="contained" sx={uploadButtonStyles}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <SquareResizeModal
        open={cropModal.open}
        image={cropModal.image}
        onClose={() => setCropModal({ open: false, image: "", type: null })}
        onSave={handleCropSave}
        removeBg={false}
      />
      <ConfirmModal
        open={deleteConfirm.open}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, index: null })}
      />
    </Box>
  );
};
