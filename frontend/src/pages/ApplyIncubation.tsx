import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { CloudUpload, ArrowBack } from "@mui/icons-material";
import { Link,useNavigate } from "react-router-dom";

const StyledBox = styled(Box)(() => ({
  minHeight: "100vh",
  background: "hsl(var(--background))",
  paddingTop: "80px",
  paddingBottom: "40px",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "hsl(var(--card))",
  borderRadius: "var(--radius)",
  padding: theme.spacing(3, 6),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },
  boxShadow: "0 20px 60px rgba(220, 20, 60, 0.15)",
  border: "1px solid hsl(var(--border))",
  margin: "0 auto",
}));

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    fontFamily: "Poppins, sans-serif",
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
  "& .MuiInputLabel-root": {
    fontFamily: "Poppins, sans-serif",
    color: "hsl(var(--muted-foreground))",
    "&.Mui-focused": {
      color: "hsl(var(--primary))",
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: "Poppins, sans-serif",
    color: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill:hover": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
  "& .MuiInputBase-input:-webkit-autofill:active": {
    WebkitBoxShadow: "0 0 0 1000px hsl(var(--background)) inset",
    WebkitTextFillColor: "hsl(var(--foreground))",
  },
});

const PrimaryButton = styled(Button)({
  backgroundColor: "hsl(var(--primary))",
  color: "#fff",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 600,
  padding: "14px 32px",
  borderRadius: "var(--radius)",
  textTransform: "none",
  fontSize: "16px",
  boxShadow: "0 4px 20px rgba(220, 20, 60, 0.3)",
  "&:hover": {
    backgroundColor: "hsl(var(--destructive))",
    boxShadow: "0 6px 30px rgba(220, 20, 60, 0.4)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
});

const UploadBox = styled(Box)({
  fontFamily: "Poppins, sans-serif",
  fontWeight: 500,
  padding: "12px 24px",
  borderRadius: "var(--radius)",
  textTransform: "none",
  border: "1px solid hsl(var(--border))",
  color: "hsl(var(--foreground))",
  backgroundColor: "transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  "&:hover": {
    backgroundColor: "hsl(var(--muted))",
    borderColor: "hsl(var(--primary))",
  },
  transition: "all 0.3s ease",
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Poppins, sans-serif",
  fontWeight: 700,
  fontSize: "24px",
  [theme.breakpoints.down("md")]: {
    fontSize: "20px",
  },
  color: "hsl(var(--primary))",
  marginBottom: "24px",
  marginTop: "40px",
  paddingBottom: "12px",
  borderBottom: "2px solid hsl(var(--border))",
}));

const BackButtonRoot = styled(IconButton)({
  color: "hsl(var(--primary))",
  marginBottom: "16px",
  "&:hover": {
    backgroundColor: "rgba(220, 20, 60, 0.1)",
  },
});

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1); // go back in history
    } else {
      navigate("/auth"); // fallback if no history
    }
  };
  return (
    <BackButtonRoot onClick={handleClick}>
      <ArrowBack />
    </BackButtonRoot>
  );
};

export const ApplyIncubation = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "",
    salutation: "Mr",
    fullName: "",
    fatherName: "",
    age: "",
    email: "",
    resMobile: "",
    offMobile: "",
    address: "",
    city: "",
    state: "",
    post: "",
    country: "India",
    businessType: "Services",
    businessDescription: "",
    legalEntity: "Proprietorship",
    numChairs: "",
    fullTimeEmployees: "",
    partTimeEmployees: "",
    consultants: "",
    reference1Name: "",
    reference1Mobile: "",
    reference1Email: "",
    reference1Address: "",
    reference2Name: "",
    reference2Mobile: "",
    reference2Email: "",
    reference2Address: "",
    services: {
      chair: false,
      table: false,
      monitor: false,
      telephone: false,
      fax: false,
      webAccess: false,
      conferenceRooms: false,
    },
    declaration: false,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <StyledBox>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          <BackButton />
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    color: "hsl(var(--primary))",
                    mb: 2,
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  Application for Incubation Services
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    color: "hsl(var(--muted-foreground))",
                    fontSize: { xs: "14px", md: "16px" },
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  TECHNOLOGY BUSINESS INCUBATOR (TCE-TBI)
                  <br />
                  THIAGARAJAR COLLEGE OF ENGINEERING
                  <br />
                  MADURAI – 625 015
                </Typography>
              </Box>

              <StyledPaper>
                <form onSubmit={handleSubmit}>
                  {/* Profile Picture */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 6 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        src={profileImage || ""}
                        sx={{
                          width: 120,
                          height: 120,
                          mb: 2,
                          border: "3px solid hsl(var(--primary))",
                          mx: "auto",
                        }}
                      />
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="profile-upload"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="profile-upload">
                        <UploadBox sx={{ width: "auto", px: 4 }}>
                          <CloudUpload />
                          Upload Photo
                        </UploadBox>
                      </label>
                    </Box>
                  </Box>

                  {/* Business Information */}
                  <SectionTitle>Business Information</SectionTitle>
                  <Grid container spacing={3} alignItems="flex-end">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <StyledTextField
                        fullWidth
                        label="Name of Business"
                        value={formData.businessName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessName: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <input
                        accept=".pdf,.doc,.docx"
                        style={{ display: "none" }}
                        id="resume-upload"
                        type="file"
                      />
                      <label htmlFor="resume-upload">
                        <UploadBox>
                          <CloudUpload />
                          Upload Entrepreneur Resume
                        </UploadBox>
                      </label>
                    </Grid>
                  </Grid>

                  {/* Personal Information */}
                  <SectionTitle>Lead Entrepreneur Details</SectionTitle>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 3, md: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))",
                            "&.Mui-focused": { color: "hsl(var(--primary))" },
                          }}
                        >
                          Salutation
                        </InputLabel>
                        <Select
                          value={formData.salutation}
                          label="Salutation"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              salutation: e.target.value,
                            })
                          }
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--foreground))",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--border))",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                          }}
                        >
                          <MenuItem
                            value="Mr"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Mr
                          </MenuItem>
                          <MenuItem
                            value="Mrs"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Mrs
                          </MenuItem>
                          <MenuItem
                            value="Dr"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Dr
                          </MenuItem>
                          <MenuItem
                            value="Prof"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Prof
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9, md: 10 }}>
                      <StyledTextField
                        fullWidth
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Father Name"
                        value={formData.fatherName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fatherName: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Residential Mobile"
                        value={formData.resMobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resMobile: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <StyledTextField
                        fullWidth
                        label="Office Mobile"
                        value={formData.offMobile}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            offMobile: e.target.value,
                          })
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <StyledTextField
                        fullWidth
                        label="Postal / Residential Address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="City"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="State"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="Post"
                        value={formData.post}
                        onChange={(e) =>
                          setFormData({ ...formData, post: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <StyledTextField
                        fullWidth
                        label="Country"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        required
                      />
                    </Grid>
                  </Grid>

                  {/* About Business */}
                  <SectionTitle>About Business</SectionTitle>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))",
                            "&.Mui-focused": { color: "hsl(var(--primary))" },
                          }}
                        >
                          Type of Business
                        </InputLabel>
                        <Select
                          value={formData.businessType}
                          label="Type of Business"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessType: e.target.value,
                            })
                          }
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--foreground))",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--border))",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                          }}
                        >
                          <MenuItem
                            value="Services"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Services
                          </MenuItem>
                          <MenuItem
                            value="High Technology"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            High Technology
                          </MenuItem>
                          <MenuItem
                            value="Other"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Other
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--muted-foreground))",
                            "&.Mui-focused": { color: "hsl(var(--primary))" },
                          }}
                        >
                          Legal Entity
                        </InputLabel>
                        <Select
                          value={formData.legalEntity}
                          label="Legal Entity"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              legalEntity: e.target.value,
                            })
                          }
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            color: "hsl(var(--foreground))",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--border))",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "hsl(var(--primary))",
                            },
                          }}
                        >
                          <MenuItem
                            value="Proprietorship"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Proprietorship
                          </MenuItem>
                          <MenuItem
                            value="Partnership"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Partnership
                          </MenuItem>
                          <MenuItem
                            value="Corporation"
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              color: "hsl(var(--foreground))",
                            }}
                          >
                            Corporation
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <StyledTextField
                        fullWidth
                        label="Briefly describe your business"
                        multiline
                        rows={4}
                        value={formData.businessDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessDescription: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                  </Grid>

                  {/* Services Expected */}
                  <SectionTitle>Services Expected from TCE-TBI</SectionTitle>
                  <FormGroup>
                    <Grid container spacing={2}>
                      {Object.keys(formData.services).map((service) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  formData.services[
                                    service as keyof typeof formData.services
                                  ]
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    services: {
                                      ...formData.services,
                                      [service]: e.target.checked,
                                    },
                                  })
                                }
                                sx={{
                                  color: "hsl(var(--border))",
                                  "&.Mui-checked": {
                                    color: "hsl(var(--primary))",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontFamily: "Poppins, sans-serif",
                                  color: "hsl(var(--foreground))",
                                }}
                              >
                                {service.charAt(0).toUpperCase() +
                                  service.slice(1).replace(/([A-Z])/g, " $1")}
                              </Typography>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>

                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Number of Chairs"
                        type="number"
                        value={formData.numChairs}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numChairs: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Full-time Employees"
                        type="number"
                        value={formData.fullTimeEmployees}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullTimeEmployees: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Part-time Employees"
                        type="number"
                        value={formData.partTimeEmployees}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            partTimeEmployees: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <StyledTextField
                        fullWidth
                        label="Consultants"
                        type="number"
                        value={formData.consultants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consultants: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* References */}
                  <SectionTitle>References</SectionTitle>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      color: "hsl(var(--muted-foreground))",
                      mb: 3,
                      fontSize: "14px",
                    }}
                  >
                    Give two references here, verification will be done after
                    completion of the selection process
                  </Typography>

                  {/* Reference 1 */}
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "hsl(var(--primary))",
                        mb: 3,
                        fontSize: "18px",
                      }}
                    >
                      Reference 01
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Name"
                          value={formData.reference1Name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference1Name: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Mobile"
                          value={formData.reference1Mobile}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference1Mobile: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={formData.reference1Email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference1Email: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Address"
                          value={formData.reference1Address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference1Address: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Reference 2 */}
                  <Box
                    sx={{
                      mb: 4,
                      p: 3,
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        color: "hsl(var(--primary))",
                        mb: 3,
                        fontSize: "18px",
                      }}
                    >
                      Reference 02
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Name"
                          value={formData.reference2Name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference2Name: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Mobile"
                          value={formData.reference2Mobile}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference2Mobile: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={formData.reference2Email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference2Email: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledTextField
                          fullWidth
                          label="Address"
                          value={formData.reference2Address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reference2Address: e.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Declaration */}
                  <SectionTitle>Declaration</SectionTitle>
                  <Box
                    sx={{
                      p: 3,
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.declaration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              declaration: e.target.checked,
                            })
                          }
                          sx={{
                            color: "hsl(var(--border))",
                            "&.Mui-checked": { color: "hsl(var(--primary))" },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.6,
                            color: "hsl(var(--foreground))",
                          }}
                        >
                          The information that I/we have provided is correct. I
                          further declare that the information that I have
                          provided here with are not proprietary in nature and
                          that I would not make any claim on same. I have also
                          read and understood and accepted the terms and
                          conditions set forth in the disclaimer in the
                          beginning of this application.
                        </Typography>
                      }
                    />
                  </Box>

                  <Box sx={{ mt: 6, textAlign: "center" }}>
                    <PrimaryButton
                      type="submit"
                      size="large"
                      sx={{ minWidth: "200px" }}
                    >
                      Submit Application
                    </PrimaryButton>
                  </Box>

                  <Box
                    sx={{
                      mt: 6,
                      p: 3,
                      background: "hsl(var(--muted))",
                      borderRadius: "var(--radius)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        color: "hsl(var(--muted-foreground))",
                        fontSize: "14px",
                        textAlign: "center",
                        lineHeight: 1.6,
                      }}
                    >
                      The completed application with all enclosure may be
                      emailed to <strong>ceotbi@tce.edu</strong> or{" "}
                      <strong>tbi@tce.edu</strong>
                      <br />
                      or printed and filled copy may be sent by courier or post
                      to
                      <br />
                      <strong>
                        Chief Executive Officer (CEO)
                        <br />
                        Technology Business Incubator (TBI)
                        <br />
                        Thiagarajar College of Engineering, Madurai-625015
                        Tamilnadu / India
                      </strong>
                    </Typography>
                  </Box>
                </form>
              </StyledPaper>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </StyledBox>
  );
};
