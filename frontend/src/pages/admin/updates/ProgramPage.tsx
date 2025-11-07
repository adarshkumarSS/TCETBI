import { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Upload, Plus, Trash2 } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";

interface Program {
  title: string;
  description: string;
  image: string;
  duration: string;
  category: string;
  startDate: string;
  endDate: string;
  participants: string;
  status: string;
}

export const ProgramPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([
    {
      title: "Startup Accelerator Program",
      description:
        "Intensive 6-month program for early-stage startups with mentorship, funding, and market access.",
      image: "/api/placeholder/400/200",
      duration: "6 months",
      category: "live",
      startDate: "Jan 2024",
      endDate: "Jun 2024",
      participants: "25",
      status: "Live",
    },
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
    "&:hover": {
      backgroundColor: "hsl(0 84.2% 50.2%)",
    },
  };

  const handleProgramChange = (index: number, field: string, value: string) => {
    const updated = [...programs];
    updated[index] = { ...updated[index], [field]: value };
    setPrograms(updated);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...programs];
        updated[index].image = reader.result as string;
        setPrograms(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Programs
      </Typography>

      {programs.map((program, index) => (
        <Box
          key={index}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
          }}
        >
          {programs.length > 1 && (
            <IconButton
              onClick={() => setPrograms(programs.filter((_, i) => i !== index))}
              sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
            >
              <Trash2 size={20} />
            </IconButton>
          )}

          <TextField
            fullWidth
            label="Title"
            value={program.title}
            onChange={(e) => handleProgramChange(index, "title", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={program.description}
            onChange={(e) => handleProgramChange(index, "description", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Duration"
              value={program.duration}
              onChange={(e) => handleProgramChange(index, "duration", e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Category"
              value={program.category}
              onChange={(e) => handleProgramChange(index, "category", e.target.value)}
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Start Date"
              value={program.startDate}
              onChange={(e) => handleProgramChange(index, "startDate", e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="End Date"
              value={program.endDate}
              onChange={(e) => handleProgramChange(index, "endDate", e.target.value)}
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Participants"
              type="number"
              value={program.participants}
              onChange={(e) => handleProgramChange(index, "participants", e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Status"
              value={program.status}
              onChange={(e) => handleProgramChange(index, "status", e.target.value)}
              sx={textFieldStyles}
            />
          </Box>

          <TextField
            fullWidth
            label="Image URL"
            value={program.image}
            onChange={(e) => handleProgramChange(index, "image", e.target.value)}
            sx={{ ...textFieldStyles, mb: 2 }}
          />

          <input
            accept="image/*"
            style={{ display: "none" }}
            id={`program-image-${index}`}
            type="file"
            onChange={(e) => handleImageUpload(e, index)}
          />
          <label htmlFor={`program-image-${index}`}>
            <Button
              component="span"
              variant="outlined"
              fullWidth
              startIcon={<Upload size={16} />}
              sx={uploadButtonStyles}
            >
              Upload Program Image
            </Button>
          </label>
        </Box>
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() =>
          setPrograms([
            ...programs,
            {
              title: "",
              description: "",
              image: "",
              duration: "",
              category: "",
              startDate: "",
              endDate: "",
              participants: "",
              status: "",
            },
          ])
        }
        sx={uploadButtonStyles}
      >
        Add Program
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton>Save Changes</DarkButton>
      </Box>
    </Box>
  );
};