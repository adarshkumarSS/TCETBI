import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Upload, Plus } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";

interface Startup {
  name: string;
  description: string;
  image: string;
  category: string;
}

export const PortfolioPage: React.FC = () => {
  const [currentStartups, setCurrentStartups] = useState<Startup[]>([
    { name: "Startup 1", description: "Description 1", image: "", category: "Tech" },
    { name: "Startup 2", description: "Description 2", image: "", category: "HealthTech" },
  ]);

  const [graduatedStartups, setGraduatedStartups] = useState<Startup[]>([
    { name: "Graduated 1", description: "Description 1", image: "", category: "FinTech" },
    { name: "Graduated 2", description: "Description 2", image: "", category: "EdTech" },
  ]);

  const textFieldStyles = {
    "& .MuiInputBase-input": { color: "hsl(var(--foreground))" },
    "& .MuiInputLabel-root": { color: "hsl(var(--muted-foreground))" },
    "& .MuiInputLabel-root.Mui-focused": { color: "hsl(0 84.2% 60.2%)" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "hsl(var(--border))" },
      "&:hover fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
      "&.Mui-focused fieldset": { borderColor: "hsl(0 84.2% 60.2%)" },
    },
  };

  const uploadButtonStyles = {
    backgroundColor: "hsl(0 84.2% 60.2%)",
    color: "white",
    borderColor: "hsl(0 84.2% 60.2%)",
    "&:hover": {
      backgroundColor: "hsl(0 84.2% 50.2%)",
      borderColor: "hsl(0 84.2% 50.2%)",
    },
  };

  const handleStartupImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "current" | "graduated"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const setterFunc = type === "current" ? setCurrentStartups : setGraduatedStartups;
        const array = type === "current" ? currentStartups : graduatedStartups;
        const updated = [...array];
        updated[index].image = reader.result as string;
        setterFunc(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartupChange = (
    index: number,
    field: string,
    value: string,
    type: "current" | "graduated"
  ) => {
    const setterFunc = type === "current" ? setCurrentStartups : setGraduatedStartups;
    const array = type === "current" ? currentStartups : graduatedStartups;
    const updated = [...array];
    updated[index] = { ...updated[index], [field]: value };
    setterFunc(updated);
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Current Startups */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Current Startups
      </Typography>

      {currentStartups.map((startup, index) => (
        <Box
          key={index}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        >
          <TextField
            fullWidth
            label="Name"
            value={startup.name}
            onChange={(e) =>
              handleStartupChange(index, "name", e.target.value, "current")
            }
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={startup.description}
            onChange={(e) =>
              handleStartupChange(index, "description", e.target.value, "current")
            }
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            value={startup.category}
            onChange={(e) =>
              handleStartupChange(index, "category", e.target.value, "current")
            }
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          {startup.image && (
            <img
              src={startup.image}
              alt={startup.name}
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            />
          )}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id={`current-startup-${index}`}
            type="file"
            onChange={(e) => handleStartupImageUpload(e, index, "current")}
          />
          <label htmlFor={`current-startup-${index}`}>
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<Upload size={16} />}
              sx={uploadButtonStyles}
            >
              Upload Image
            </Button>
          </label>
        </Box>
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() =>
          setCurrentStartups([
            ...currentStartups,
            { name: "", description: "", image: "", category: "" },
          ])
        }
        sx={{ ...uploadButtonStyles, mb: 4 }}
      >
        Add Startup
      </Button>

      {/* Graduated Startups */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
          mt: 4,
        }}
      >
        Graduated Startups
      </Typography>

      {graduatedStartups.map((startup, index) => (
        <Box
          key={index}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        >
          <TextField
            fullWidth
            label="Name"
            value={startup.name}
            onChange={(e) =>
              handleStartupChange(index, "name", e.target.value, "graduated")
            }
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={startup.description}
            onChange={(e) =>
              handleStartupChange(index, "description", e.target.value, "graduated")
            }
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            value={startup.category}
            onChange={(e) =>
              handleStartupChange(index, "category", e.target.value, "graduated")
            }
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          {startup.image && (
            <img
              src={startup.image}
              alt={startup.name}
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "12px",
              }}
            />
          )}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id={`graduated-startup-${index}`}
            type="file"
            onChange={(e) => handleStartupImageUpload(e, index, "graduated")}
          />
          <label htmlFor={`graduated-startup-${index}`}>
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<Upload size={16} />}
              sx={uploadButtonStyles}
            >
              Upload Image
            </Button>
          </label>
        </Box>
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() =>
          setGraduatedStartups([
            ...graduatedStartups,
            { name: "", description: "", image: "", category: "" },
          ])
        }
        sx={uploadButtonStyles}
      >
        Add Graduated Startup
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton>Save Changes</DarkButton>
      </Box>
    </Box>
  );
};