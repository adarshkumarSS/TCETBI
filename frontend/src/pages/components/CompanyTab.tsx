import { Paper, Typography, Box, Button, Avatar, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Business, Add, Edit, Delete, Send, Lock, Language, Person, Description, Cancel, CloudUpload, Save } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userService from "../../api/userService";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export const CompanyTab = () => {
  const navigate = useNavigate();
  const [companyRequest, setCompanyRequest] = useState<any>(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isRequestingEdit, setIsRequestingEdit] = useState(false);
  const [editChangesSummary, setEditChangesSummary] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const [companyData, setCompanyData] = useState({
    name: "",
    logo: "",
    description: "",
    sector: "",
    founded: "",
    website: "",
    location: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    ceo_name: "",
    ceo_image: "",
    ceo_bio: "",
    products: []
  });

  // Image upload refs and states
  const logoInputRef = useRef<HTMLInputElement>(null);
  const ceoImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCeoImage, setIsUploadingCeoImage] = useState(false);

  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: "",
    onConfirm: () => {}
  });

  useEffect(() => {
    const fetchCompanyRequest = async () => {
      try {
        const response = await userService.getCompanyRequest();
        const companyData = response.company_request;
        setCompanyRequest(companyData);
        if (companyData) {
          setCompanyData({
            name: companyData.name || "",
            logo: companyData.logo || "",
            description: companyData.description || "",
            sector: companyData.sector || "",
            founded: companyData.founded || "",
            website: companyData.website || "",
            location: companyData.location || "",
            linkedin: companyData.linkedin || "",
            twitter: companyData.twitter || "",
            facebook: companyData.facebook || "",
            ceo_name: companyData.ceo_name || "",
            ceo_image: companyData.ceo_image || "",
            ceo_bio: companyData.ceo_bio || "",
            products: companyData.products || []
          });
        }
      } catch (error) {
        // Company request doesn't exist yet, that's fine
        setCompanyRequest(null);
      }
    };

    fetchCompanyRequest();
  }, []);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const imageUrl = await uploadToCloudinary(file, "TCETBI/CompanyLogos");
      setCompanyData({ ...companyData, logo: imageUrl });
      toast.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Logo upload failed:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleCeoImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCeoImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file, "TCETBI/CEOImages");
      setCompanyData({ ...companyData, ceo_image: imageUrl });
      toast.success("CEO image uploaded successfully!");
    } catch (error) {
      console.error("CEO image upload failed:", error);
      toast.error("Failed to upload CEO image");
    } finally {
      setIsUploadingCeoImage(false);
    }
  };

  const handleEditCompany = () => {
    setIsEditingCompany(true);
  };

  const handleCancelCompany = () => {
    setIsEditingCompany(false);
    setPreviewMode(false);
    if (companyRequest) {
      setCompanyData({
        name: companyRequest.name || "",
        logo: companyRequest.logo || "",
        description: companyRequest.description || "",
        sector: companyRequest.sector || "",
        founded: companyRequest.founded || "",
        website: companyRequest.website || "",
        location: companyRequest.location || "",
        linkedin: companyRequest.linkedin || "",
        twitter: companyRequest.twitter || "",
        facebook: companyRequest.facebook || "",
        ceo_name: companyRequest.ceo_name || "",
        ceo_image: companyRequest.ceo_image || "",
        ceo_bio: companyRequest.ceo_bio || "",
        products: companyRequest.products || []
      });
    } else {
      setCompanyData({
        name: "",
        logo: "",
        description: "",
        sector: "",
        founded: "",
        website: "",
        location: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        ceo_name: "",
        ceo_image: "",
        ceo_bio: "",
        products: []
      });
    }
  };

  const handleSaveCompany = async () => {
    try {
      const response = await userService.updateCompanyRequest(companyData);
      const updatedRequest = response.company_request;
      setCompanyRequest(updatedRequest);
      setCompanyData({
        name: updatedRequest.name || "",
        logo: updatedRequest.logo || "",
        description: updatedRequest.description || "",
        sector: updatedRequest.sector || "",
        founded: updatedRequest.founded || "",
        website: updatedRequest.website || "",
        location: updatedRequest.location || "",
        linkedin: updatedRequest.linkedin || "",
        twitter: updatedRequest.twitter || "",
        facebook: updatedRequest.facebook || "",
        ceo_name: updatedRequest.ceo_name || "",
        ceo_image: updatedRequest.ceo_image || "",
        ceo_bio: updatedRequest.ceo_bio || "",
        products: updatedRequest.products || []
      });
      setIsEditingCompany(false);
      setPreviewMode(false);
      toast.success("Company details saved!");
    } catch (error) {
      console.error("Failed to save company details:", error);
      toast.error("Failed to save company details");
    }
  };

  const handleSubmitCompany = () => {
    setConfirmDialog({
      open: true,
      title: "Submit Company Request",
      message: "Are you sure you want to submit this company request for admin review? You won't be able to edit it until the admin responds.",
      action: "Submit",
      onConfirm: async () => {
        try {
          const response = await userService.submitCompanyRequest();
          setCompanyRequest(response.company_request);
          toast.success("Company request submitted for review!");
        } catch (error: any) {
          console.error("Failed to submit company request:", error);
          toast.error(error?.response?.data?.error || "Failed to submit request");
        }
      }
    });
  };

  const handleDeleteCompany = () => {
    setConfirmDialog({
      open: true,
      title: "Delete Company Request",
      message: "Are you sure you want to delete this company request? This action cannot be undone.",
      action: "Delete",
      onConfirm: async () => {
        try {
          await userService.deleteCompanyRequest();
          setCompanyRequest(null);
          setCompanyData({
            name: "",
            logo: "",
            description: "",
            sector: "",
            founded: "",
            website: "",
            location: "",
            linkedin: "",
            twitter: "",
            facebook: "",
            ceo_name: "",
            ceo_image: "",
            ceo_bio: "",
            products: []
          });
          toast.success("Company request deleted!");
        } catch (error) {
          console.error("Failed to delete company request:", error);
          toast.error("Failed to delete request");
        }
      }
    });
  };

  const handleSubmitEditRequest = () => {
    setConfirmDialog({
      open: true,
      title: "Submit Edit Request",
      message: "Are you sure you want to submit this edit request for admin review? You will be notified once it's reviewed.",
      action: "Submit",
      onConfirm: async () => {
        try {
          const response = await userService.submitCompanyEditRequest({
            ...companyData,
            edit_changes_summary: editChangesSummary
          });
          setCompanyRequest(response.company_request);
          setIsRequestingEdit(false);
          setEditChangesSummary("");
          toast.success("Edit request submitted for review!");
        } catch (error: any) {
          console.error("Failed to submit edit request:", error);
          toast.error(error?.response?.data?.error || "Failed to submit edit request");
        }
      }
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Company Status Header Card */}
      <Paper
        sx={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          p: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "150px",
            height: "150px",
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.05) 100%)",
            borderRadius: "50%",
            transform: "translate(-50px, -50px)",
            zIndex: 0,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 4, position: "relative", zIndex: 1 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: companyRequest?.status === 'approved' ? "hsl(var(--success))" :
                       companyRequest?.status === 'submitted' ? "hsl(var(--warning))" :
                       companyRequest?.status === 'rejected' ? "hsl(var(--destructive))" :
                       "hsl(var(--muted))",
              fontSize: "3rem",
              border: "4px solid hsl(var(--background))",
              boxShadow: "0 8px 32px hsl(var(--primary) / 0.3)",
            }}
          >
            {companyRequest?.status === 'approved' ? '✓' :
             companyRequest?.status === 'submitted' ? '⏳' :
             companyRequest?.status === 'rejected' ? '✗' : <Business sx={{ fontSize: "4rem" }} />}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "hsl(var(--foreground))",
                mb: 1,
              }}
            >
              {companyRequest?.name || "Company Portfolio"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Chip
                label={`Status: ${companyRequest?.status || 'No Request'}`}
                color={
                  companyRequest?.status === 'approved' ? 'success' :
                  companyRequest?.status === 'rejected' ? 'error' :
                  companyRequest?.status === 'submitted' ? 'warning' : 'default'
                }
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                }}
              />
              {companyRequest?.status === 'submitted' && (
                <Chip
                  label="Under Review"
                  variant="outlined"
                  icon={<Lock />}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
              )}
            </Box>

            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "hsl(var(--muted-foreground))",
                fontSize: "16px",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {companyRequest?.status === 'approved'
                ? "Your company is live on the TCE-TBI portfolio. Request edits to keep information current."
                : companyRequest?.status === 'submitted'
                ? "Your portfolio request is being reviewed by our admin team. You'll be notified once processed."
                : companyRequest?.status === 'rejected'
                ? "Your request was not approved. Edit and resubmit for another review."
                : "Create a portfolio request to showcase your startup on the TCE-TBI website."
              }
            </Typography>

            {/* Admin Rejection Notice */}
            {companyRequest?.status === 'rejected' && companyRequest.admin_notes && (
              <Box sx={{
                p: 3,
                backgroundColor: "hsl(var(--destructive) / 0.1)",
                border: "1px solid hsl(var(--destructive) / 0.3)",
                borderRadius: "12px",
                mb: 3,
              }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "hsl(var(--destructive))",
                    mb: 1,
                  }}
                >
                  Rejection Reason:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    color: "hsl(var(--foreground))"
                  }}
                >
                  {companyRequest.admin_notes}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {companyRequest?.status === 'approved' && (
              <Button
                variant="outlined"
                startIcon={<Business />}
                onClick={() => navigate('/user/my-company')}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                }}
              >
                View My Company
              </Button>
            )}

            {!companyRequest && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleEditCompany}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                  '&:hover': {
                    boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                  }
                }}
              >
                Create Request
              </Button>
            )}

            {companyRequest?.status === 'approved' && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsRequestingEdit(true)}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                  '&:hover': {
                    boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                  }
                }}
              >
                Request Edit
              </Button>
            )}

            {companyRequest?.status === 'rejected' && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditCompany}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                  '&:hover': {
                    boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                  }
                }}
              >
                Edit & Resubmit
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Empty State */}
      {!companyRequest && !isEditingCompany && (
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 6,
            textAlign: "center",
          }}
        >
          <Business sx={{ fontSize: "5rem", color: "hsl(var(--muted-foreground))", mb: 3 }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
              mb: 2,
            }}
          >
            No Company Request Yet
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              mb: 4,
              maxWidth: "600px",
              mx: "auto",
              fontSize: "16px",
              lineHeight: 1.6,
            }}
          >
            Showcase your startup on the TCE-TBI portfolio page. Create a comprehensive company profile with your business details, products, and team information for potential investors and partners.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleEditCompany}
            size="large"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              px: 6,
              py: 2,
              borderRadius: "12px",
              fontSize: "16px",
              boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
              '&:hover': {
                boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
              }
            }}
          >
            Create Company Profile
          </Button>
        </Paper>
      )}

      {/* Company Information Display */}
      {companyRequest && !isEditingCompany && companyRequest.status !== 'draft' && (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 4 }}>
          {/* CEO Information Card */}
          {(companyRequest.ceo_name || companyRequest.ceo_image || companyRequest.ceo_bio) && (
            <Paper
              sx={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                p: 4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <Person sx={{ color: "hsl(var(--primary))", fontSize: "2rem" }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  CEO Information
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* CEO Image */}
                {companyRequest.ceo_image && (
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Avatar
                      src={companyRequest.ceo_image}
                      sx={{
                        width: 120,
                        height: 120,
                        border: "3px solid hsl(var(--primary))",
                        boxShadow: "0 4px 12px hsl(var(--primary) / 0.2)",
                      }}
                      variant="circular"
                    >
                      <Person sx={{ fontSize: "4rem" }} />
                    </Avatar>
                  </Box>
                )}

                {/* CEO Details */}
                {companyRequest.ceo_name && (
                  <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px", textAlign: "center" }}>
                    <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                      CEO Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                      {companyRequest.ceo_name}
                    </Typography>
                  </Box>
                )}

                {/* CEO Bio */}
                {companyRequest.ceo_bio && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                      CEO Bio
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--foreground))", lineHeight: 1.6 }}>
                      {companyRequest.ceo_bio}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          )}

          {/* Products Card */}
          {companyRequest.products && companyRequest.products.length > 0 && (
            <Paper
              sx={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                p: 4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <Description sx={{ color: "hsl(var(--primary))", fontSize: "2rem" }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Products & Services
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {companyRequest.products.map((product: any, index: number) => (
                  <Box key={index} sx={{ p: 3, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "12px", border: "1px solid hsl(var(--border))" }}>
                    <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))", mb: 2 }}>
                      {product.name || `Product ${index + 1}`}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--foreground))", lineHeight: 1.6 }}>
                      {product.description || "No description provided."}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
          {/* Company Overview Card */}
          <Paper
            sx={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              p: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Business sx={{ color: "hsl(var(--primary))", fontSize: "2rem" }} />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                }}
              >
                Company Overview
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Company Logo */}
              {companyRequest.logo && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Avatar
                    src={companyRequest.logo}
                    sx={{
                      width: 120,
                      height: 120,
                      border: "3px solid hsl(var(--primary))",
                      boxShadow: "0 4px 12px hsl(var(--primary) / 0.2)",
                    }}
                    variant="rounded"
                  >
                    <Business sx={{ fontSize: "4rem" }} />
                  </Avatar>
                </Box>
              )}

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px", textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                    Company Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                    {companyRequest.name || "Not specified"}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px", textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                    Sector
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                    {companyRequest.sector || "Not specified"}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px", textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                    Founded
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                    {companyRequest.founded || "Not specified"}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px", textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                    Location
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                    {companyRequest.location || "Not specified"}
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              {companyRequest.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--foreground))", lineHeight: 1.6 }}>
                    {companyRequest.description}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Contact Information Card */}
          <Paper
            sx={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              p: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Language sx={{ color: "hsl(var(--primary))", fontSize: "2rem" }} />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                }}
              >
                Contact Information
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {companyRequest.website && (
                <Box sx={{ p: 3, backgroundColor: "hsl(var(--primary) / 0.05)", borderRadius: "12px", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 1 }}>
                    Website
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      color: "hsl(var(--primary))",
                      wordBreak: "break-all"
                    }}
                  >
                    {companyRequest.website}
                  </Typography>
                </Box>
              )}

              {(companyRequest.linkedin || companyRequest.twitter || companyRequest.facebook) && (
                <Box>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", mb: 2 }}>
                    Social Media
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {companyRequest.linkedin && (
                      <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px" }}>
                        <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                          LinkedIn
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", wordBreak: "break-all" }}>
                          {companyRequest.linkedin}
                        </Typography>
                      </Box>
                    )}

                    {companyRequest.twitter && (
                      <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px" }}>
                        <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                          Twitter
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", wordBreak: "break-all" }}>
                          {companyRequest.twitter}
                        </Typography>
                      </Box>
                    )}

                    {companyRequest.facebook && (
                      <Box sx={{ p: 2, backgroundColor: "hsl(var(--muted) / 0.3)", borderRadius: "8px" }}>
                        <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "hsl(var(--foreground))" }}>
                          Facebook
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))", wordBreak: "break-all" }}>
                          {companyRequest.facebook}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {!companyRequest.website && !companyRequest.linkedin && !companyRequest.twitter && !companyRequest.facebook && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Language sx={{ fontSize: "3rem", color: "hsl(var(--muted-foreground))", mb: 2 }} />
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "hsl(var(--muted-foreground))" }}>
                    No contact information provided
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      )}

      {/* Company Editing Forms */}
      {isEditingCompany && !previewMode && (
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
              mb: 4,
            }}
          >
            Company Information
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
              <TextField
                fullWidth
                label="Company Name"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
              />
              <TextField
                fullWidth
                label="Sector"
                value={companyData.sector}
                onChange={(e) => setCompanyData({ ...companyData, sector: e.target.value })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingLogo}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  minWidth: "200px",
                  py: 1.5,
                  borderRadius: "12px",
                }}
              >
                {isUploadingLogo ? "Uploading Logo..." : "Upload Company Logo"}
              </Button>
              {companyData.logo && (
                <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
                  Logo uploaded successfully
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
              <TextField
                fullWidth
                label="Founded Year"
                value={companyData.founded}
                onChange={(e) => setCompanyData({ ...companyData, founded: e.target.value })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
              />
              <TextField
                fullWidth
                label="Location"
                value={companyData.location}
                onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Website"
              value={companyData.website}
              onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
              sx={{
                fontFamily: "Poppins, sans-serif",
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                }
              }}
            />

            <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
              <TextField
                fullWidth
                label="LinkedIn"
                value={companyData.linkedin}
                onChange={(e) => setCompanyData({ ...companyData, linkedin: e.target.value })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
              />
              <TextField
                fullWidth
                label="Twitter"
                value={companyData.twitter}
                onChange={(e) => setCompanyData({ ...companyData, twitter: e.target.value })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
              />
              <TextField
                fullWidth
                label="Facebook"
                value={companyData.facebook}
                onChange={(e) => setCompanyData({ ...companyData, facebook: e.target.value })}
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  '& .MuiOutlinedInput-root': {
                    borderRadius: "12px",
                  }
                }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Company Description"
              value={companyData.description}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              sx={{
                fontFamily: "Poppins, sans-serif",
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                }
              }}
              helperText="Describe your company, mission, and what makes you unique"
            />

            {/* CEO Information Section */}
            <Box sx={{ mt: 4, p: 3, backgroundColor: "hsl(var(--muted) / 0.2)", borderRadius: "12px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Person sx={{ color: "hsl(var(--primary))" }} />
                CEO Information
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="CEO Name"
                  value={companyData.ceo_name}
                  onChange={(e) => setCompanyData({ ...companyData, ceo_name: e.target.value })}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                    }
                  }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => ceoImageInputRef.current?.click()}
                    disabled={isUploadingCeoImage}
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      minWidth: "200px",
                      py: 1.5,
                      borderRadius: "12px",
                    }}
                  >
                    {isUploadingCeoImage ? "Uploading CEO Image..." : "Upload CEO Image"}
                  </Button>
                  {companyData.ceo_image && (
                    <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}>
                      CEO image uploaded successfully
                    </Typography>
                  )}
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="CEO Bio"
                  value={companyData.ceo_bio}
                  onChange={(e) => setCompanyData({ ...companyData, ceo_bio: e.target.value })}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: "12px",
                    }
                  }}
                  helperText="Brief biography of your CEO/founder"
                />
              </Box>
            </Box>

            {/* Products Section */}
            <Box sx={{ mt: 4, p: 3, backgroundColor: "hsl(var(--muted) / 0.2)", borderRadius: "12px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                <Description sx={{ color: "hsl(var(--primary))" }} />
                Products & Services
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  color: "hsl(var(--muted-foreground))",
                  mb: 3,
                }}
              >
                Add your key products or services. Each entry should include the product name and a brief description.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {companyData.products?.map((product: any, index: number) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <TextField
                      fullWidth
                      label={`Product/Service ${index + 1}`}
                      value={product.name || ""}
                      onChange={(e) => {
                        const newProducts = [...companyData.products];
                        newProducts[index] = { ...newProducts[index], name: e.target.value };
                        setCompanyData({ ...companyData, products: newProducts });
                      }}
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        '& .MuiOutlinedInput-root': {
                          borderRadius: "12px",
                        }
                      }}
                      placeholder="Product/Service name"
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      value={product.description || ""}
                      onChange={(e) => {
                        const newProducts = [...companyData.products];
                        newProducts[index] = { ...newProducts[index], description: e.target.value };
                        setCompanyData({ ...companyData, products: newProducts });
                      }}
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        '& .MuiOutlinedInput-root': {
                          borderRadius: "12px",
                        }
                      }}
                      placeholder="Brief description"
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        const newProducts = companyData.products.filter((_: any, i: number) => i !== index);
                        setCompanyData({ ...companyData, products: newProducts });
                      }}
                      sx={{
                        minWidth: "auto",
                        px: 2,
                        borderRadius: "12px",
                      }}
                    >
                      <Delete sx={{ fontSize: "1.2rem" }} />
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    const newProducts = [...(companyData.products || []), { name: "", description: "" }];
                    setCompanyData({ ...companyData, products: newProducts });
                  }}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    borderRadius: "12px",
                    alignSelf: "flex-start",
                    mt: 1,
                  }}
                >
                  Add Product/Service
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancelCompany}
              sx={{
                fontFamily: "Poppins, sans-serif",
                borderRadius: "12px",
                px: 4,
                py: 1.5,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveCompany}
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                '&:hover': {
                  boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                }
              }}
            >
              Save Draft
            </Button>
          </Box>
        </Paper>
      )}

      {/* Edit Request Form */}
      {isRequestingEdit && (
        <Paper
          sx={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "hsl(var(--foreground))",
              mb: 3,
            }}
          >
            Request Company Edit
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Poppins, sans-serif",
              color: "hsl(var(--muted-foreground))",
              mb: 3,
            }}
          >
            Your approved company information will be edited. Describe what changes you want to make for admin review.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Changes Summary"
            placeholder="Describe the changes you want to make (e.g., updated company description, new CEO information, added products, etc.)"
            value={editChangesSummary}
            onChange={(e) => setEditChangesSummary(e.target.value)}
            sx={{
              fontFamily: "Poppins, sans-serif",
              '& .MuiOutlinedInput-root': {
                borderRadius: "12px",
              }
            }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setIsRequestingEdit(false);
                setEditChangesSummary("");
              }}
              sx={{
                fontFamily: "Poppins, sans-serif",
                borderRadius: "12px",
                px: 4,
                py: 1.5,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitEditRequest}
              disabled={!editChangesSummary.trim()}
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                '&:hover': {
                  boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                }
              }}
            >
              Submit Edit Request
            </Button>
          </Box>
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
        {companyRequest && companyRequest.status === 'draft' && !isEditingCompany && (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteCompany}
              sx={{
                fontFamily: "Poppins, sans-serif",
                borderRadius: "12px",
                px: 4,
                py: 1.5,
              }}
            >
              Delete Draft
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditCompany}
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                boxShadow: "0 4px 12px hsl(var(--primary) / 0.3)",
                '&:hover': {
                  boxShadow: "0 6px 20px hsl(var(--primary) / 0.4)",
                }
              }}
            >
              Edit Draft
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Send />}
              onClick={handleSubmitCompany}
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                boxShadow: "0 4px 12px hsl(var(--success) / 0.3)",
                '&:hover': {
                  boxShadow: "0 6px 20px hsl(var(--success) / 0.4)",
                }
              }}
            >
              Submit for Review
            </Button>
          </>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        PaperProps={{
          sx: {
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            borderRadius: "var(--radius)",
            border: "1px solid hsl(var(--border))",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            color: confirmDialog.action === 'Delete' ? 'hsl(0 84.2% 60.2%)' : 'hsl(var(--primary))',
          }}
        >
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1, fontFamily: "Poppins, sans-serif" }}>
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            sx={{ color: "hsl(var(--muted-foreground))", fontFamily: "Poppins, sans-serif" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog({ ...confirmDialog, open: false });
            }}
            variant="contained"
            color={confirmDialog.action === 'Delete' ? 'error' : 'primary'}
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            {confirmDialog.action}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file inputs for image uploads */}
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={ceoImageInputRef}
        onChange={handleCeoImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </Box>
  );
};
