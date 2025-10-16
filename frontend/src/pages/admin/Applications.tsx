import { useState } from "react";
import { Box, Typography, Modal, Backdrop, Fade, IconButton } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Application {
  id: string;
  profilePicture?: string;
  businessName: string;
  entrepreneurResume?: string;
  salutation: string;
  leadName: string;
  fatherName: string;
  age: number;
  email: string;
  residentialMobile: string;
  officeMobile?: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  businessType: string;
  legalEntity: string;
  businessDescription: string;
  servicesExpected: {
    chair: boolean;
    table: boolean;
    monitor: boolean;
    telephone: boolean;
    fax: boolean;
    webAccess: boolean;
    conferenceRooms: boolean;
  };
  numberOfChairs?: number;
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
  declarationAccepted: boolean;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

const mockApplications: Application[] = [
  {
    id: "1",
    businessName: "Tech Innovations Ltd",
    salutation: "Mr",
    leadName: "John Doe",
    fatherName: "Richard Doe",
    age: 35,
    email: "john@techinno.com",
    residentialMobile: "+91 98765 43210",
    address: "123 Innovation Street",
    city: "Chennai",
    state: "Tamil Nadu",
    postcode: "600001",
    country: "India",
    businessType: "High Technology",
    legalEntity: "Corporation",
    businessDescription: "We develop cutting-edge technology solutions for businesses.",
    servicesExpected: {
      chair: true,
      table: true,
      monitor: true,
      telephone: false,
      fax: false,
      webAccess: true,
      conferenceRooms: true,
    },
    numberOfChairs: 5,
    fullTimeEmployees: 3,
    partTimeEmployees: 2,
    consultants: 1,
    reference1: {
      name: "Dr. Smith",
      mobile: "+91 98765 11111",
      email: "smith@example.com",
      address: "456 Tech Park"
    },
    reference2: {
      name: "Prof. Johnson",
      mobile: "+91 98765 22222",
      email: "johnson@example.com",
      address: "789 Research Center"
    },
    declarationAccepted: true,
    status: "pending",
    appliedDate: "2025-09-15",
  },
  {
    id: "2",
    businessName: "Green Solutions",
    salutation: "Mrs",
    leadName: "Jane Smith",
    fatherName: "Robert Smith",
    age: 32,
    email: "jane@greensolutions.com",
    residentialMobile: "+91 98765 43211",
    address: "456 Eco Street",
    city: "Bangalore",
    state: "Karnataka",
    postcode: "560001",
    country: "India",
    businessType: "Services",
    legalEntity: "Partnership",
    businessDescription: "Sustainable environmental solutions for businesses and communities.",
    servicesExpected: {
      chair: true,
      table: true,
      monitor: false,
      telephone: true,
      fax: false,
      webAccess: true,
      conferenceRooms: false,
    },
    fullTimeEmployees: 2,
    reference1: {
      name: "Dr. Kumar",
      mobile: "+91 98765 33333",
      email: "kumar@example.com",
      address: "321 Green Avenue"
    },
    reference2: {
      name: "Ms. Patel",
      mobile: "+91 98765 44444",
      email: "patel@example.com",
      address: "654 Eco Park"
    },
    declarationAccepted: true,
    status: "pending",
    appliedDate: "2025-09-20",
  },
];

export const Applications = () => {
  const navigate = useNavigate();
  const [applications] = useState<Application[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (app: Application) => {
    setSelectedApp(app);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApp(null);
  };

  const handleApprove = () => {
    console.log("Approved:", selectedApp);
    handleClose();
  };

  const handleReject = () => {
    console.log("Rejected:", selectedApp);
    handleClose();
  };

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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {applications.map((app) => (
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
                  Lead: {app.leadName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Type: {app.businessType}
                </Typography>
                <Typography variant="body2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                  Applied: {app.appliedDate}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

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
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      color: "hsl(var(--foreground))",
                      mb: 3,
                    }}
                  >
                    Application Details
                  </Typography>

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
                      <Typography variant="body1">{selectedApp.salutation} {selectedApp.leadName}</Typography>
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
                      <Typography variant="body1">{selectedApp.residentialMobile}</Typography>
                    </Box>
                    {selectedApp.officeMobile && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                          Office Mobile
                        </Typography>
                        <Typography variant="body1">{selectedApp.officeMobile}</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Address
                    </Typography>
                    <Typography variant="body1">{selectedApp.address}, {selectedApp.city}, {selectedApp.state} - {selectedApp.postcode}, {selectedApp.country}</Typography>
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
                      {Object.entries(selectedApp.servicesExpected)
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
                      <Typography variant="body2"><strong>Name:</strong> {selectedApp.reference1.name}</Typography>
                      <Typography variant="body2"><strong>Mobile:</strong> {selectedApp.reference1.mobile}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedApp.reference1.email}</Typography>
                      <Typography variant="body2"><strong>Address:</strong> {selectedApp.reference1.address}</Typography>
                    </Box>
                    <Box sx={{ p: 2, border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Reference 2</Typography>
                      <Typography variant="body2"><strong>Name:</strong> {selectedApp.reference2.name}</Typography>
                      <Typography variant="body2"><strong>Mobile:</strong> {selectedApp.reference2.mobile}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedApp.reference2.email}</Typography>
                      <Typography variant="body2"><strong>Address:</strong> {selectedApp.reference2.address}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Applied Date
                    </Typography>
                    <Typography variant="body1">{selectedApp.appliedDate}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <DarkButton
                      startIcon={<X />}
                      onClick={handleReject}
                      sx={{
                        backgroundColor: "hsl(var(--destructive))",
                        "&:hover": { backgroundColor: "hsl(var(--destructive) / 0.9)" },
                      }}
                    >
                      Reject
                    </DarkButton>
                    <DarkButton
                      startIcon={<Check />}
                      onClick={handleApprove}
                      sx={{ backgroundColor: "#22c55e", "&:hover": { backgroundColor: "#16a34a" } }}
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
