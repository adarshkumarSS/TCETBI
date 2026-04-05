import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Switch, Divider } from "@mui/material";
import { Loader2, ArrowLeft, Lock, KeyRound, ShieldCheck, Mail, Globe, ToggleLeft } from "lucide-react";
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

  // Feature flags
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [savingFlags, setSavingFlags] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSiteSettings();
    }
  }, [isAuthenticated]);

  const loadSiteSettings = async () => {
    try {
      const settings = await authService.getSiteSettings();
      setEmailEnabled(settings.email_enabled);
      setSsoEnabled(settings.google_sso_enabled);
    } catch (error) {
      console.error("Failed to load site settings:", error);
    } finally {
      setFlagsLoading(false);
    }
  };

  const handleToggleEmail = async (checked: boolean) => {
    setSavingFlags(true);
    try {
      await authService.updateSiteSettings({ email_enabled: checked });
      setEmailEnabled(checked);
      toast.success(checked ? "Email notifications enabled" : "Email notifications disabled");
    } catch (error) {
      toast.error("Failed to update setting");
    } finally {
      setSavingFlags(false);
    }
  };

  const handleToggleSSO = async (checked: boolean) => {
    setSavingFlags(true);
    try {
      await authService.updateSiteSettings({ google_sso_enabled: checked });
      setSsoEnabled(checked);
      toast.success(checked ? "Google SSO enabled" : "Google SSO disabled");
    } catch (error) {
      toast.error("Failed to update setting");
    } finally {
      setSavingFlags(false);
    }
  };

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
        pb: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "680px",
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
            Settings
          </Typography>
        </Box>

        {/* ========= FEATURE FLAGS ========= */}
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm mb-6">
          <CardHeader className="pb-2">
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ToggleLeft size={24} />
              </Box>
              <Box>
                <CardTitle className="text-xl font-bold">Feature Flags</CardTitle>
                <CardDescription>Toggle platform features on or off</CardDescription>
              </Box>
            </Box>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {flagsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <Loader2 size={24} className="animate-spin" />
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Email Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2.5,
                    px: 2,
                    borderRadius: "12px",
                    transition: "0.2s",
                    "&:hover": { bgcolor: "hsl(var(--muted) / 0.5)" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: emailEnabled ? "hsl(142 71% 45% / 0.1)" : "hsl(var(--muted))",
                        color: emailEnabled ? "#22c55e" : "hsl(var(--muted-foreground))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.3s",
                      }}
                    >
                      <Mail size={20} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        Email Notifications
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>
                        Send Gmail notifications for applications, approvals, and status updates
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={emailEnabled}
                    onChange={(_, checked) => handleToggleEmail(checked)}
                    disabled={savingFlags}
                    color="success"
                  />
                </Box>

                <Divider sx={{ opacity: 0.3 }} />

                {/* Google SSO Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2.5,
                    px: 2,
                    borderRadius: "12px",
                    transition: "0.2s",
                    "&:hover": { bgcolor: "hsl(var(--muted) / 0.5)" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: ssoEnabled ? "hsl(221 83% 53% / 0.1)" : "hsl(var(--muted))",
                        color: ssoEnabled ? "#3b82f6" : "hsl(var(--muted-foreground))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.3s",
                      }}
                    >
                      <Globe size={20} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        Google SSO
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>
                        Allow users to sign in with their Google account
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={ssoEnabled}
                    onChange={(_, checked) => handleToggleSSO(checked)}
                    disabled={savingFlags}
                    color="primary"
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* ========= PASSWORD CHANGE ========= */}
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
