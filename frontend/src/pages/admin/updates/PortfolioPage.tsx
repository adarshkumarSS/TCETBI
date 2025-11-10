import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";
import { MessageModal } from "@/components/ui/MessageModal";
import { AddPortfolioModal } from "@/components/AddPortfolioModal";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
  fetchPortfolioData,
  updatePortfolioData,
  deleteStartup,
  PortfolioData,
} from "@/api/portfolioService";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export const PortfolioPage: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [editModal, setEditModal] = useState<{
    open: boolean;
    startup: any | null;
  }>({
    open: false,
    startup: null,
  });
  const [addModal, setAddModal] = useState<{ open: boolean }>({ open: false });

  // 🗑️ Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: number | null;
    category: "current" | "graduated" | null;
  }>({ open: false, id: null, category: null });

  // ⚠️ Validation modal for empty form submission
  const [validationModal, setValidationModal] = useState(false);

  useEffect(() => {
    fetchPortfolioData()
      .then((res) => setData(res))
      .catch(() => console.error("Failed to load portfolio data"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Add new startup
  const handleAddNew = (newData: any) => {
    if (!newData.name?.trim() || !newData.sector?.trim() || !newData.logo) {
      setValidationModal(true);
      return;
    }

    if (!data) return;
    const type = newData.category === "current" ? "current" : "graduated";
    setData({
      ...data,
      [`${type}_startups`]: [...data[`${type}_startups`], newData],
    });
  };

  // ✅ Save all changes
  const handleSave = async () => {
    if (!data) return;

    try {
      setUploading(true);

      const uploadIfLocal = async (
        url: string,
        folder: string
      ): Promise<string> => {
        if (url?.startsWith("blob:") || url?.startsWith("data:")) {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });
          const uploaded = await uploadToCloudinary(file, folder);
          URL.revokeObjectURL(url); // ✅ clean up memory
          return uploaded;
        }
        return url;
      };

      const processStartup = async (s: any, category: string) => {
        const logo = s.logo
          ? await uploadIfLocal(s.logo, "TCETBI/Startups/Logos")
          : s.logo;

        // ✅ Handle multi-CEO uploads safely
        const ceos = Array.isArray(s.ceos)
          ? await Promise.all(
              s.ceos.map(async (ceo: any) => ({
                ...ceo,
                image: ceo.image
                  ? await uploadIfLocal(ceo.image, "TCETBI/Startups/CEOs")
                  : ceo.image,
              }))
            )
          : [];

        return { ...s, logo, ceos, category };
      };

      // ✅ Upload everything & prepare payload
      const updatedData = {
        current_startups: await Promise.all(
          data.current_startups.map((s) => processStartup(s, "current"))
        ),
        graduated_startups: await Promise.all(
          data.graduated_startups.map((s) => processStartup(s, "graduated"))
        ),
      };

      // ✅ Send update request to backend
      const res = await updatePortfolioData(updatedData);

      // 🔁 Only re-fetch if backend confirms success
      if (res.message?.toLowerCase().trim().includes("success")) {
        const refreshedData = await fetchPortfolioData();
        setData(refreshedData);
      }

      setMessageText(res.message || "✅ Portfolio updated successfully!");
      setMessageType("success");
    } catch (err) {
      console.error("❌ Failed to update portfolio:", err);
      setMessageText("❌ Failed to update portfolio data!");
      setMessageType("error");
    } finally {
      setUploading(false);
      setMessageOpen(true);
    }
  };

  // ✅ Open edit modal
  const openEditModal = (startup: any) => {
    setEditModal({ open: true, startup });
  };

  // ✅ Update edited startup in state
  const handleUpdate = (updatedStartup: any) => {
    if (!data || !editModal.startup) return;

    const prevCategory = editModal.startup.category;
    const newCategory = updatedStartup.category;

    // If category changed → move it to new list
    if (prevCategory !== newCategory) {
      const oldList = data[`${prevCategory}_startups`].filter(
        (s) => s.id !== updatedStartup.id
      );
      const newList = [...data[`${newCategory}_startups`], updatedStartup];

      setData({
        ...data,
        [`${prevCategory}_startups`]: oldList,
        [`${newCategory}_startups`]: newList,
      });
    } else {
      // If category didn’t change → just update it in place
      const updatedList = data[`${newCategory}_startups`].map((s) =>
        s.id === updatedStartup.id ? updatedStartup : s
      );

      setData({
        ...data,
        [`${newCategory}_startups`]: updatedList,
      });
    }

    setEditModal({ open: false, startup: null });
  };

  // 🗑️ Open confirmation modal
  const confirmDelete = (id: number, category: "current" | "graduated") => {
    setDeleteModal({ open: true, id, category });
  };

  // 🗑️ Delete confirmed
  const handleDeleteConfirm = async () => {
    if (!deleteModal.id || !deleteModal.category || !data) return;

    try {
      await deleteStartup(deleteModal.id);

      setData((prev) =>
        prev
          ? {
              ...prev,
              [`${deleteModal.category}_startups`]: prev[
                `${deleteModal.category}_startups`
              ].filter((s) => s.id !== deleteModal.id),
            }
          : prev
      );

      setMessageText("✅ Startup deleted successfully!");
      setMessageType("success");
    } catch (err) {
      console.error("❌ Failed to delete startup:", err);
      setMessageText("❌ Failed to delete startup!");
      setMessageType("error");
    } finally {
      setDeleteModal({ open: false, id: null, category: null });
      setMessageOpen(true);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress color="error" />
      </Box>
    );

  if (!data) return <p>Failed to load portfolio data.</p>;

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "hsl(var(--foreground))",
          }}
        >
          Portfolio Management
        </Typography>
        <Button
          startIcon={<Plus size={18} />}
          onClick={() => setAddModal({ open: true })}
          sx={{
            backgroundColor: "hsl(0 84.2% 60.2%)",
            color: "white",
            fontWeight: 600,
            "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
          }}
        >
          Add Startup
        </Button>
      </Box>

      {/* Render Startups */}
      {["current", "graduated"].map((type) => (
        <Box key={type} sx={{ mb: 6 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontFamily: "Poppins",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
            }}
          >
            {type === "current" ? "Current Startups" : "Graduated Startups"}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {data[`${type}_startups`].map((startup, index) => (
              <Card
                key={startup.id ?? `${type}-${index}`}
                sx={{
                  flex: "1 1 calc(25% - 24px)",
                  minWidth: 250,
                  cursor: "pointer",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  transition: "0.2s",
                  "&:hover": { boxShadow: "0 0 10px rgba(0,0,0,0.2)" },
                  position: "relative",
                }}
              >
                {/* 🗑️ Delete Button */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(startup.id, type as "current" | "graduated");
                  }}
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "hsl(0 84.2% 60.2%)",
                    "&:hover": { backgroundColor: "rgba(255,0,0,0.2)" },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>

                <CardContent
                  onClick={() => openEditModal({ ...startup, category: type })}
                  sx={{ textAlign: "center" }}
                >
                  <img
                    src={startup.logo}
                    alt={startup.name}
                    style={{
                      width: "100%",
                      height: 100,
                      objectFit: "contain",
                      marginBottom: "12px",
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: "hsl(var(--foreground))", // 👈 Theme-aware fix
                    }}
                  >
                    {startup.name || "Untitled"}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {startup.sector || "—"}
                  </Typography>
                  <Edit3
                    size={18}
                    style={{ marginTop: 6, color: "hsl(0 84.2% 60.2%)" }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ))}

      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton
          onClick={handleSave}
          disabled={uploading}
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: "hsl(0 84.2% 60.2%)",
            color: "white",
            "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            "&.Mui-disabled": {
              backgroundColor: "hsl(0 84.2% 60.2% / 0.5)",
              color: "white",
            },
          }}
        >
          {uploading ? "Saving..." : "Save Changes"}
        </DarkButton>
      </Box>

      <ConfirmModal
        open={deleteModal.open}
        title="Delete Startup"
        message="Are you sure you want to delete this startup? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteModal({ open: false, id: null, category: null })
        }
      />

      {/* ⚠️ Validation Modal */}
      <Dialog open={validationModal} onClose={() => setValidationModal(false)}>
        <DialogTitle sx={{ fontWeight: 600, color: "hsl(0 84.2% 60.2%)" }}>
          Missing Information
        </DialogTitle>
        <DialogContent>
          <Typography>
            ⚠️ Please fill out <b>Name</b>, <b>Sector</b>, and upload a{" "}
            <b>Logo</b> before saving.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setValidationModal(false)}
            sx={{
              color: "white",
              backgroundColor: "hsl(0 84.2% 60.2%)",
              "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modals */}
      <AddPortfolioModal
        open={addModal.open}
        onClose={() => setAddModal({ open: false })}
        onSave={handleAddNew}
      />
      {editModal.open && (
        <AddPortfolioModal
          open={editModal.open}
          onClose={() => setEditModal({ open: false, startup: null })}
          onSave={handleUpdate}
          initialData={editModal.startup}
        />
      )}
      <MessageModal
        open={messageOpen}
        message={messageText}
        type={messageType}
        onClose={() => setMessageOpen(false)}
      />
    </Box>
  );
};
