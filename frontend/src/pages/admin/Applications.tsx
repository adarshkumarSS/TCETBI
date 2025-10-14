import { useState } from "react";
import { Box, Typography, Modal, Backdrop, Fade } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { Check, X } from "lucide-react";

interface Application {
  id: string;
  businessName: string;
  leadName: string;
  email: string;
  mobile: string;
  businessType: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

const mockApplications: Application[] = [
  {
    id: "1",
    businessName: "Tech Innovations Ltd",
    leadName: "John Doe",
    email: "john@techinno.com",
    mobile: "+91 98765 43210",
    businessType: "High Technology",
    status: "pending",
    appliedDate: "2025-09-15",
  },
  {
    id: "2",
    businessName: "Green Solutions",
    leadName: "Jane Smith",
    email: "jane@greensolutions.com",
    mobile: "+91 98765 43211",
    businessType: "Services",
    status: "pending",
    appliedDate: "2025-09-20",
  },
];

export const Applications = () => {
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
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            mb: 4,
          }}
        >
          Incubation Applications
        </Typography>

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
                width: { xs: "90%", sm: "600px" },
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
                    {selectedApp.businessName}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Lead Entrepreneur
                    </Typography>
                    <Typography variant="body1">{selectedApp.leadName}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Email
                    </Typography>
                    <Typography variant="body1">{selectedApp.email}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Mobile
                    </Typography>
                    <Typography variant="body1">{selectedApp.mobile}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: "hsl(var(--muted-foreground))" }}>
                      Business Type
                    </Typography>
                    <Typography variant="body1">{selectedApp.businessType}</Typography>
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
