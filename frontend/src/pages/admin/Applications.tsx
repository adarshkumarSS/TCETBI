import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Modal, Backdrop, Fade, IconButton, Avatar, TextField, InputAdornment, Tabs, Tab } from "@mui/material";
import { Search as SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { Check, X, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  getIncubationApplications, 
  updateApplicationStatus, 
  markApplicationAsRead, 
  deleteIncubationApplication,
  bulkDeleteIncubationApplications
} from "@/api/incubationService";
import { toast } from "sonner";
import { Checkbox } from "@mui/material";

interface FieldValue {
  id: number;
  field_label: string;
  field_type: string;
  field_name: string;
  value: string;
  file_url: string | null;
  is_main_title?: boolean;
}

interface Application {
  id: number;
  form_name: string;
  form_type: string;
  status: "pending" | "approved" | "rejected";
  is_read: boolean;
  created_at: string;
  field_values: FieldValue[];
  user_details?: any;
  main_title?: string;
}

export const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, [navigate]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getIncubationApplications();
      console.log("Loaded applications data:", data);
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("isAuthenticated change:", isAuthenticated);
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  const getVal = (app: Application, fieldName: string) => {
    return app.field_values.find(fv => fv.field_name === fieldName)?.value || "";
  };

  const getHeading = (app: Application | null) => {
    if (!app) return 'Unnamed Venture';
    return app.main_title || 'Unnamed Venture';
  };

  useEffect(() => {
    const filtered = applications.filter(app => {
      const search = searchTerm.toLowerCase();
      
      // Filter by status
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        // Check all field values
        const hasSearchInFields = app.field_values.some(fv => 
          fv.value?.toLowerCase().includes(search) || 
          fv.field_label?.toLowerCase().includes(search)
        );

        // Also check status and user details if available
        const hasSearchInMeta = 
          app.status.toLowerCase().includes(search) ||
          app.main_title?.toLowerCase().includes(search) ||
          app.form_name?.toLowerCase().includes(search);

        return hasSearchInFields || hasSearchInMeta;
      }

      return true;
    });
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => ({
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  }), [applications]);

  const handleOpen = async (app: Application) => {
    setSelectedApp(app);
    setOpen(true);
    if (!app.is_read) {
      try {
        await markApplicationAsRead(app.id);
        // Update local state to show it's read immediately
        setApplications(prev => prev.map(item => 
          item.id === app.id ? { ...item, is_read: true } : item
        ));
      } catch (err) {
        console.error("Mark read failed:", err);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApp(null);
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    try {
      setUpdating(true);
      await updateApplicationStatus(selectedApp.id, "approved");
      await loadApplications();
      handleClose();
    } catch (error) {
      console.error("Failed to approve application:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    try {
      setUpdating(true);
      await updateApplicationStatus(selectedApp.id, "rejected");
      await loadApplications();
      handleClose();
    } catch (error) {
      console.error("Failed to reject application:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Avoid opening the modal
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    
    try {
      setLoading(true);
      await deleteIncubationApplication(id);
      setApplications(prev => prev.filter(app => app.id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Failed to delete application:", error);
      toast.error("Failed to delete application");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} applications? This action cannot be undone.`)) return;

    try {
      setLoading(true);
      await bulkDeleteIncubationApplications(selectedIds);
      setApplications(prev => prev.filter(app => !selectedIds.includes(app.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} applications deleted successfully`);
    } catch (error) {
      console.error("Failed to bulk delete applications:", error);
      toast.error("Failed to bulk delete applications");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map(app => app.id));
    }
  };

  const toggleSelect = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isAuthLoading) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Loader2 size={32} className="animate-spin" />
          <Typography variant="body1">Checking authentication...</Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "hsl(var(--background))", pt: 12, px: 4 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/admin")} sx={{ color: "hsl(var(--foreground))", "&:hover": { backgroundColor: "hsl(var(--muted))" } }}>
              <ArrowLeft size={24} />
            </IconButton>
            <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "hsl(var(--foreground))" }}>
              Incubation Applications
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {selectedIds.length > 0 && (
              <DarkButton 
                onClick={handleBulkDelete}
                sx={{ bgcolor: 'hsl(var(--destructive))', color: 'white', '&:hover': { bgcolor: 'hsl(var(--destructive) / 0.9)' } }}
              >
                Delete Selected ({selectedIds.length})
              </DarkButton>
            )}
            <Box sx={{ position: "relative" }}>
              <SearchIcon size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))" }} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "10px 12px 10px 40px",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--foreground))"
                }}
              />
            </Box>
          </Box>
        </Box>

        {filteredApplications.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox 
              checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
              indeterminate={selectedIds.length > 0 && selectedIds.length < filteredApplications.length}
              onChange={toggleSelectAll}
              sx={{ color: 'hsl(var(--primary))', '&.Mui-checked': { color: 'hsl(var(--primary))' }, '&.MuiCheckbox-indeterminate': { color: 'hsl(var(--primary))' } }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
              Select All Applications
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon size={20} /></InputAdornment>) }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'hsl(var(--card))',
                '& fieldset': { borderColor: 'hsl(var(--border))' },
                '&:hover fieldset': { borderColor: 'hsl(var(--ring))' },
                '&.Mui-focused fieldset': { borderColor: 'hsl(var(--ring))' },
              },
              '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Tabs value={statusFilter} onChange={(_, newValue) => setStatusFilter(newValue)} sx={{ '& .MuiTab-root': { color: 'hsl(var(--muted-foreground))', '&.Mui-selected': { color: 'hsl(var(--primary))' }, minHeight: 48, textTransform: 'none' }, '& .MuiTabs-indicator': { backgroundColor: 'hsl(var(--primary))' } }}>
            <Tab value="all" label={`All (${statusCounts.all})`} />
            <Tab value="pending" label={`Pending (${statusCounts.pending})`} />
            <Tab value="approved" label={`Approved (${statusCounts.approved})`} />
            <Tab value="rejected" label={`Rejected (${statusCounts.rejected})`} />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Loader2 size={32} className="animate-spin" />
            <Typography variant="body1" sx={{ ml: 2 }}>Loading...</Typography>
          </Box>
        ) : filteredApplications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6">No applications found</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>
            {filteredApplications.map((app) => (
              <Card key={app.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${!app.is_read ? 'border-primary/50' : ''}`} onClick={() => handleOpen(app)}>
                <CardHeader>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Checkbox 
                        checked={selectedIds.includes(app.id)}
                        onClick={(e) => toggleSelect(e, app.id)}
                        sx={{ mt: -0.5, p: 0.5, color: 'hsl(var(--primary))', '&.Mui-checked': { color: 'hsl(var(--primary))' } }}
                      />
                      <Box>
                        <CardTitle className={!app.is_read ? 'font-bold text-primary' : 'font-semibold'}>
                          {getHeading(app)}
                        </CardTitle>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!app.is_read && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ px: 1, py: 0.25, bgcolor: 'hsl(var(--primary))', color: 'white', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>NEW</Box>
                          <Box sx={{ width: 8, height: 8, bgcolor: 'hsl(var(--primary))', borderRadius: '50%' }} />
                        </Box>
                      )}
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleDelete(e, app.id)}
                        sx={{ 
                          color: 'hsl(var(--muted-foreground))', 
                          '&:hover': { color: 'hsl(var(--destructive))', bgcolor: 'hsl(var(--destructive) / 0.1)' } 
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardHeader>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: !app.is_read ? 600 : 400 }}>Lead: {getVal(app, 'fullName') || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>Type: {getVal(app, 'businessType') || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ mb: 1, textTransform: "capitalize" }}>Status: {app.status}</Typography>
                  <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>Applied: {new Date(app.created_at).toLocaleDateString()}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Modal open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }}>
          <Fade in={open}>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "95%", sm: "850px" }, maxHeight: "90vh", overflow: "auto", bgcolor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "16px", boxShadow: 24, p: { xs: 2, md: 4 } }}>
              {selectedApp && (
                <>
                  <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid hsl(var(--border))' }}>
                    <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, mb: 1 }}>{getHeading(selectedApp)}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ px: 1.5, py: 0.5, borderRadius: 'full', bgcolor: selectedApp.status === 'approved' ? '#dcfce7' : selectedApp.status === 'rejected' ? '#fee2e2' : '#f3f4f6', color: selectedApp.status === 'approved' ? '#166534' : selectedApp.status === 'rejected' ? '#991b1b' : '#374151', textTransform: 'capitalize', fontWeight: 600 }}>
                        {selectedApp.status}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>Submitted on {new Date(selectedApp.created_at).toLocaleString()}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {selectedApp.field_values.filter(fv => fv.field_type !== 'file' && fv.field_type !== 'textarea').map(fv => (
                      <Box key={fv.id}>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))", mb: 0.5 }}>{fv.field_label}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{fv.value || 'N/A'}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {selectedApp.field_values.filter(fv => fv.field_type === 'textarea').map(fv => (
                    <Box key={fv.id} sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))", mb: 0.5 }}>{fv.field_label}</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{fv.value || 'N/A'}</Typography>
                    </Box>
                  ))}

                  {selectedApp.field_values.filter(fv => fv.field_type === 'file' && fv.file_url).length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "hsl(var(--primary))" }}>Attachments</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {selectedApp.field_values.filter(fv => fv.field_type === 'file' && fv.file_url).map(fv => (
                          <Box key={fv.id} sx={{ p: 2, border: '1px solid hsl(var(--border))', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2, minWidth: '200px' }}>
                            {fv.file_url && (fv.file_url.endsWith('.png') || fv.file_url.endsWith('.jpg') || fv.file_url.endsWith('.jpeg')) ? (
                              <Avatar src={fv.file_url} variant="rounded" sx={{ width: 40, height: 40 }} />
                            ) : (
                              <Box sx={{ width: 40, height: 40, bgcolor: 'hsl(var(--muted))', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</Box>
                            )}
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{fv.field_label}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>
                                <a href={fv.file_url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--primary))', textDecoration: 'underline' }}>View File</a>
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 6, pt: 3, borderTop: '1px solid hsl(var(--border))' }}>
                    <DarkButton startIcon={<X />} onClick={handleReject} disabled={selectedApp.status !== "pending" || updating} sx={{ backgroundColor: "hsl(var(--destructive))", "&:hover": { backgroundColor: "hsl(var(--destructive) / 0.9)" } }}>Reject</DarkButton>
                    <DarkButton startIcon={updating ? <Loader2 className="animate-spin" /> : <Check />} onClick={handleApprove} disabled={selectedApp.status !== "pending" || updating} sx={{ backgroundColor: "#22c55e", "&:hover": { backgroundColor: "#16a34a" } }}>{updating ? 'Processing...' : 'Approve'}</DarkButton>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
};
