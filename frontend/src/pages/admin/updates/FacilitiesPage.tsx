import { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";

interface Video {
  link: string;
  description: string;
  details: string;
}

interface Facility {
  id: number;
  name: string;
  description: string;
  image: string;
  features: string[];
}

export const FacilitiesPage: React.FC = () => {
  const [facilityVideos, setFacilityVideos] = useState<Video[]>([
    {
      link: "https://example.com/video1",
      description: "State-of-the-art facilities",
      details: "Our facilities include modern labs and workspaces",
    },
  ]);

  const [sharedInfra, setSharedInfra] = useState<Facility[]>([
    {
      id: 1,
      name: "Co-working Spaces",
      description: "Flexible workspaces with modern amenities for startups at different stages.",
      image: "/api/placeholder/300/200",
      features: ["24/7 Access", "High-Speed Internet", "Meeting Rooms", "Coffee Station"],
    },
    {
      id: 2,
      name: "Innovation Labs",
      description: "Fully equipped laboratories for research, development, and testing.",
      image: "/api/placeholder/300/200",
      features: ["Latest Equipment", "Testing Facilities", "Research Support", "Safety Protocols"],
    },
  ]);

  const [tcetbiInfra, setTcetbiInfra] = useState<Facility[]>([
    {
      id: 4,
      name: "Auditorium",
      description: "State-of-the-art auditorium for events, presentations, and workshops.",
      image: "/api/placeholder/300/200",
      features: ["200 Seating", "AV Equipment", "Stage Lighting", "Recording Setup"],
    },
    {
      id: 5,
      name: "Conference Halls",
      description: "Professional conference facilities for meetings and networking events.",
      image: "/api/placeholder/300/200",
      features: ["Video Conferencing", "Presentation Setup", "Comfortable Seating", "Catering Services"],
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

  return (
    <Box sx={{ mt: 4 }}>
      {/* Facility Videos */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Facility Showcase Videos
      </Typography>

      {facilityVideos.map((video, index) => (
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
          {facilityVideos.length > 1 && (
            <IconButton
              onClick={() => setFacilityVideos(facilityVideos.filter((_, i) => i !== index))}
              sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
            >
              <Trash2 size={20} />
            </IconButton>
          )}
          <TextField
            fullWidth
            label="Video Link"
            value={video.link}
            onChange={(e) => {
              const updated = [...facilityVideos];
              updated[index].link = e.target.value;
              setFacilityVideos(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={video.description}
            onChange={(e) => {
              const updated = [...facilityVideos];
              updated[index].description = e.target.value;
              setFacilityVideos(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Details"
            value={video.details}
            onChange={(e) => {
              const updated = [...facilityVideos];
              updated[index].details = e.target.value;
              setFacilityVideos(updated);
            }}
            sx={textFieldStyles}
          />
        </Box>
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() =>
          setFacilityVideos([...facilityVideos, { link: "", description: "", details: "" }])
        }
        sx={{ ...uploadButtonStyles, mb: 4 }}
      >
        Add Video
      </Button>

      {/* Shared Infrastructure */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Shared Infrastructure
      </Typography>

      {sharedInfra.map((facility, index) => (
        <Box
          key={facility.id}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
          }}
        >
          {sharedInfra.length > 1 && (
            <IconButton
              onClick={() => setSharedInfra(sharedInfra.filter((_, i) => i !== index))}
              sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
            >
              <Trash2 size={20} />
            </IconButton>
          )}
          <TextField
            fullWidth
            label="Name"
            value={facility.name}
            onChange={(e) => {
              const updated = [...sharedInfra];
              updated[index].name = e.target.value;
              setSharedInfra(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={facility.description}
            onChange={(e) => {
              const updated = [...sharedInfra];
              updated[index].description = e.target.value;
              setSharedInfra(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            value={facility.image}
            onChange={(e) => {
              const updated = [...sharedInfra];
              updated[index].image = e.target.value;
              setSharedInfra(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Features (comma-separated)"
            value={facility.features.join(", ")}
            onChange={(e) => {
              const updated = [...sharedInfra];
              updated[index].features = e.target.value.split(",").map((f) => f.trim());
              setSharedInfra(updated);
            }}
            sx={textFieldStyles}
          />
        </Box>
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() => {
          const newId = Math.max(...sharedInfra.map((f) => f.id), 0) + 1;
          setSharedInfra([
            ...sharedInfra,
            { id: newId, name: "", description: "", image: "", features: [] },
          ]);
        }}
        sx={{ ...uploadButtonStyles, mb: 4 }}
      >
        Add Shared Infrastructure
      </Button>

      {/* TCETBI Infrastructure */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        TCETBI Infrastructure
      </Typography>

      {tcetbiInfra.map((facility, index) => (
        <Box
          key={facility.id}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            position: "relative",
          }}
        >
          {tcetbiInfra.length > 1 && (
            <IconButton
              onClick={() => setTcetbiInfra(tcetbiInfra.filter((_, i) => i !== index))}
              sx={{ position: "absolute", top: 8, right: 8, color: "hsl(0 84.2% 60.2%)" }}
            >
              <Trash2 size={20} />
            </IconButton>
          )}
          <TextField
            fullWidth
            label="Name"
            value={facility.name}
            onChange={(e) => {
              const updated = [...tcetbiInfra];
              updated[index].name = e.target.value;
              setTcetbiInfra(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={facility.description}
            onChange={(e) => {
              const updated = [...tcetbiInfra];
              updated[index].description = e.target.value;
              setTcetbiInfra(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            value={facility.image}
            onChange={(e) => {
              const updated = [...tcetbiInfra];
              updated[index].image = e.target.value;
              setTcetbiInfra(updated);
            }}
            sx={{ ...textFieldStyles, mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Features (comma-separated)"
            value={facility.features.join(", ")}
            onChange={(e) => {
              const updated = [...tcetbiInfra];
              updated[index].features = e.target.value.split(",").map((f) => f.trim());
              setTcetbiInfra(updated);
            }}
            sx={textFieldStyles}
          />
        </Box>
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() => {
          const newId = Math.max(...tcetbiInfra.map((f) => f.id), 0) + 1;
          setTcetbiInfra([
            ...tcetbiInfra,
            { id: newId, name: "", description: "", image: "", features: [] },
          ]);
        }}
        sx={uploadButtonStyles}
      >
        Add TCETBI Infrastructure
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton>Save Changes</DarkButton>
      </Box>
    </Box>
  );
};