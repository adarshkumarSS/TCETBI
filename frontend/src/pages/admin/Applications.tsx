import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Modal, Backdrop, Fade, IconButton, Avatar, TextField, InputAdornment, Tabs, Tab } from "@mui/material";
import { Search as SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { Check, X, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getIncubationApplications, updateApplicationStatus } from "@/api/incubationService";

interface Application {
  id: number;
  profile_image?: string;
  resume_pdf?: string;
  businessName: string;
  salutation: string;
  fullName: string;
  fatherName: string;
  age: number;
  email: string;
  resMobile: string;
  offMobile?: string;
  address: string;
  city: string;
  state: string;
  post: string;
  country: string;
  businessType: string;
  legalEntity: string;
  businessDescription: string;
  services: { [key: string]: boolean };
  numChairs?: number;
  fullTimeEmployees?: number;
  partTimeEmployees?: number;
  consultants?: number;
  reference1: {
    name: string;
    mobile: string;
    email: string;
    address: string;
  };
  reference2: {
    name: string;
    mobile: string;
    email: string;
    address: string;
  };
  declaration: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
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
      setApplications(data.applications);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Filter applications based on search term and status
    const filtered = applications.filter(app => {
      // Status filter
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        return (
          app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return true;
    });
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  // Memoize status counts to prevent recalculation on every render
  const statusCounts = useMemo(() => ({
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  }), [applications]);

  const handleOpen = (app: Application) => {
    setSelectedApp(app);
    setOpen(true);
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
      await loadApplications(); // Refresh list
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
      await loadApplications(); // Refresh list
      handleClose();
    } catch (error) {
      console.error("Failed to reject application:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (isAuthLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Loader2 size={32} className="animate-spin" />
          <Typography variant="body1">Checking authentication...</Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        pt: 12,
        px: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate("/admin")}
            sx={{
              color: "hsl(var(--foreground))",
              "&:hover": { backgroundColor: "hsl(var(--muted))" },
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "hsl(var(--foreground))",
            }}
          >
            Incubation Applications
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search applications by name, email, business type, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'hsl(var(--card))',
                '& fieldset': {
                  borderColor: 'hsl(var(--border))',
                },
                '&:hover fieldset': {
                  borderColor: 'hsl(var(--ring))',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'hsl(var(--ring))',
                },
              },
              '& .MuiInputBase-input': {
                color: 'hsl(var(--foreground))',
                '&::placeholder': {
                  color: 'hsl(var(--muted-foreground))',
                },
              },
            }}
          />
        </Box>

        {/* Status Filter Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={statusFilter}
            onChange={(_, newValue) => setStatusFilter(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'hsl(var(--muted-foreground))',
                '&.Mui-selected': {
                  color: 'hsl(var(--primary))',
                },
                minHeight: 48,
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'hsl(var(--primary))',
              },
            }}
          >
            <Tab
              value="all"
              label={`All Applications (${statusCounts.all})`}
            />
            <Tab
              value="pending"
              label={`Pending (${statusCounts.pending})`}
            />
            <Tab
              value="approved"
              label={`Approved (${statusCounts.approved})`}
            />
            <Tab
              value="rejected"
              label={`Rejected (${statusCounts.rejected})`}
            />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Loader2 size={32} className="animate-spin" />
            <Typography variant="body1" sx={{ ml: 2 }}>Loading applications...</Typography>
          </Box>
        ) : applications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6">No applications found</Typography>
          </Box>
        ) : filteredApplications.length === 0 && searchTerm ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6">No applications match your search</Typography>
            <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", mt: 1 }}>
              Try adjusting your search terms
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {filteredApplications.map((app) => (
              <Card
                key={app.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOpen(app)}
              >
                <CardHeader>
                  <CardTitle>{app.businessName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Lead: {app.fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Type: {app.businessType}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, textTransform: "capitalize" }}>
                    Status: {app.status}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: "800px" },
                maxHeight: "90vh",
                overflow: "auto",
                bgcolor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: 24,
                p: 4,
              }}
            >
              {selectedApp && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      Application #{selectedApp.id}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "hsl(var(--muted-foreground))",
                        fontWeight: 500,
                      }}
                    >
                      {selectedApp.businessName}
                    </Typography>
                  </Box>

                  {/* Uploaded Files */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "hsl(var(--primary))" }}>
                    Attachments
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    {selectedApp.profile_image ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={selectedApp.profile_image}
                          sx={{ width: 56, height: 56 }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Profile Image
                          </Typography>
                          <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>
                            <a href={selectedApp.profile_image} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                              View Full Size
                            </a>
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        No profile image uploaded
                      </Typography>
                    )}

                    {selectedApp.resume_pdf && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Resume PDF
                          </Typography>
                          <Typography variant="caption" sx={{ color: "hsl(var(--muted-foreground))" }}>
                            <a href={selectedApp.resume_pdf} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                              View PDF (Size: less than 2MB)
                            </a>
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Status */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Status
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 600,
                        color: selectedApp.status === "approved"
                          ? "#16a34a"
                          : selectedApp.status === "rejected"
                          ? "#dc2626"
                          : "#6b7280"
                      }}
                    >
                      {selectedApp.status}
                    </Typography>
                  </Box>

                  {/* Business Information */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "hsl(var(--primary))" }}>
                    Business Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Business Name
                    </Typography>
                    <Typography variant="body1">{selectedApp.businessName}</Typography>
                  </Box>

                  {/* Lead Entrepreneur Details */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    Lead Entrepreneur Details
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Salutation & Name
                      </Typography>
                      <Typography variant="body1">{selectedApp.salutation} {selectedApp.fullName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Father's Name
                      </Typography>
                      <Typography variant="body1">{selectedApp.fatherName}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Age
                      </Typography>
                      <Typography variant="body1">{selectedApp.age}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Email
                      </Typography>
                      <Typography variant="body1">{selectedApp.email}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Residential Mobile
                      </Typography>
                      <Typography variant="body1">{selectedApp.resMobile}</Typography>
                    </Box>
                    {selectedApp.offMobile && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Office Mobile
                        </Typography>
                        <Typography variant="body1">{selectedApp.offMobile}</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Address
                    </Typography>
                    <Typography variant="body1">{selectedApp.address}, {selectedApp.city}, {selectedApp.state} - {selectedApp.post}, {selectedApp.country}</Typography>
                  </Box>

                  {/* Business Details */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    About Business
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Type of Business
                      </Typography>
                      <Typography variant="body1">{selectedApp.businessType}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                        Legal Entity
                      </Typography>
                      <Typography variant="body1">{selectedApp.legalEntity}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Business Description
                    </Typography>
                    <Typography variant="body1">{selectedApp.businessDescription}</Typography>
                  </Box>

                  {/* Services Expected */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    Services Expected
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {Object.entries(selectedApp.services)
                        .filter(([_, value]) => value)
                        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))
                        .join(", ") || "None"}
                    </Typography>
                  </Box>

                  {/* Team Details */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    Team Details
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
                    {selectedApp.fullTimeEmployees !== undefined && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Full-time Employees
                        </Typography>
                        <Typography variant="body1">{selectedApp.fullTimeEmployees}</Typography>
                      </Box>
                    )}
                    {selectedApp.partTimeEmployees !== undefined && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Part-time Employees
                        </Typography>
                        <Typography variant="body1">{selectedApp.partTimeEmployees}</Typography>
                      </Box>
                    )}
                    {selectedApp.consultants !== undefined && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Consultants
                        </Typography>
                        <Typography variant="body1">{selectedApp.consultants}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* References */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, color: "hsl(var(--primary))" }}>
                    References
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                    <Box sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Reference 1</Typography>
                      <Typography variant="body2"><strong>Name:</strong> {selectedApp.reference1?.name || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Mobile:</strong> {selectedApp.reference1?.mobile || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedApp.reference1?.email || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Address:</strong> {selectedApp.reference1?.address || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Reference 2</Typography>
                      <Typography variant="body2"><strong>Name:</strong> {selectedApp.reference2?.name || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Mobile:</strong> {selectedApp.reference2?.mobile || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedApp.reference2?.email || 'N/A'}</Typography>
                      <Typography variant="body2"><strong>Address:</strong> {selectedApp.reference2?.address || 'N/A'}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Applied Date
                    </Typography>
                    <Typography variant="body1">{new Date(selectedApp.created_at).toLocaleString()}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <DarkButton
                      startIcon={<X />}
                      onClick={handleReject}
                      disabled={selectedApp.status !== "pending"}
                      sx={{
                        backgroundColor: "hsl(var(--destructive))",
                        "&:hover": { backgroundColor: "hsl(var(--destructive) / 0.9)" },
                        "&.Mui-disabled": {
                          backgroundColor: "hsl(var(--muted))",
                          color: "hsl(var(--muted-foreground))",
                        },
                      }}
                    >
                      Reject
                    </DarkButton>
                    <DarkButton
                      startIcon={<Check />}
                      onClick={handleApprove}
                      disabled={selectedApp.status !== "pending"}
                      sx={{
                        backgroundColor: "#22c55e",
                        "&:hover": { backgroundColor: "#16a34a" },
                        "&.Mui-disabled": {
                          backgroundColor: "hsl(var(--muted))",
                          color: "hsl(var(--muted-foreground))",
                        },
                      }}
                    >
                      Approve
                    </DarkButton>
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
