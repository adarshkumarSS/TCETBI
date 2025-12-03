import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Loader2, ArrowLeft, Lock, KeyRound, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DarkButton } from "@/components/ui/DarkButton";
import { OutlinedTextField } from "@/components/ui/OutlinedTextField";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "@/api/authService";

export const Settings = () => {
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, [navigate]);

  const handleChange = (prop: keyof typeof passwords) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [prop]: event.target.value });
  };

  const handleSubmit = async () => {
    if (!passwords.current_password || !passwords.new_password || !passwords.confirm_password) {
      toast.error("All fields are required");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(passwords);
      toast.success("Password updated successfully");
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
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
            Security Settings
          </Typography>
        </Box>

        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <ShieldCheck size={32} />
            </Box>
            <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <OutlinedTextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwords.current_password}
              onChange={handleChange('current_password')}
              InputProps={{
                startAdornment: <KeyRound size={18} className="mr-2 opacity-50" />,
              }}
            />
            
            <OutlinedTextField
              fullWidth
              label="New Password"
              type="password"
              value={passwords.new_password}
              onChange={handleChange('new_password')}
              InputProps={{
                startAdornment: <Lock size={18} className="mr-2 opacity-50" />,
              }}
            />
            
            <OutlinedTextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwords.confirm_password}
              onChange={handleChange('confirm_password')}
              InputProps={{
                startAdornment: <Lock size={18} className="mr-2 opacity-50" />,
              }}
            />

            <DarkButton 
              fullWidth 
              size="large" 
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mt: 2, height: 48 }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </DarkButton>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
