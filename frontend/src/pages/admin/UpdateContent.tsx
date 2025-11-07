import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LeaveReminderModal } from "@/components/LeaveReminderModal";

// pages
import { HomePage } from "./updates/HomePage";
import { PortfolioPage } from "./updates/PortfolioPage";
import { PeoplePage } from "./updates/PeoplePage";
import { FacilitiesPage } from "./updates/FacilitiesPage";
import { ProgramPage } from "./updates/ProgramPage";
import { MediaPage } from "./updates/MediaPage";
import { BlogPage } from "./updates/BlogPage";
import { ContactPage } from "./updates/ContactPage";

const pages = [
  "Home",
  "Portfolio",
  "People",
  "Facilities",
  "Program",
  "Media",
  "Blogs",
  "Contact",
];

export const UpdateContent = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Home");
  const [showReminder, setShowReminder] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    console.log("✅ Changes saved");
    setIsSaved(true);
  };

  // When user tries to navigate away
  const handleBack = () => {
    if (!isSaved) {
      setShowReminder(true);
      setPendingNav("/admin");
    } else {
      navigate("/admin");
    }
  };

  const handlePageChange = (value: string) => {
    if (!isSaved) {
      setShowReminder(true);
      setPendingNav(value);
    } else {
      setSelectedPage(value);
    }
  };

  const confirmLeave = () => {
    setShowReminder(false);
    if (pendingNav === "/admin") navigate("/admin");
    else if (pendingNav) setSelectedPage(pendingNav);
  };

  const stayHere = () => {
    setShowReminder(false);
    setPendingNav(null);
  };

  const renderPageContent = () => {
    switch (selectedPage) {
      case "Home":
        return <HomePage />;
      case "Portfolio":
        return <PortfolioPage />;
      case "People":
        return <PeoplePage />;
      case "Facilities":
        return <FacilitiesPage />;
      case "Program":
        return <ProgramPage />;
      case "Media":
        return <MediaPage />;
      case "Blogs":
        return <BlogPage />;
      case "Contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "hsl(var(--background))",
          pt: 12,
          px: 4,
        }}
      >
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={handleBack}
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
                Update Page Content
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: "var(--radius)",
              p: 4,
              border: "1px solid hsl(var(--border))",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                mb: 3,
              }}
            >
              Select Page to Edit
            </Typography>

            <Select value={selectedPage} onValueChange={handlePageChange}>
              <SelectTrigger className="w-full max-w-xs text-foreground">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page} value={page}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Render Selected Page */}
            {renderPageContent()}
          </Box>
        </Box>
      </Box>

      {/* 👇 The Reminder Modal */}
      <LeaveReminderModal
        open={showReminder}
        onStay={stayHere}
        onLeave={confirmLeave}
      />
    </>
  );
};
