import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Upload, Plus } from "lucide-react";
import { DarkButton } from "@/components/ui/DarkButton";

interface Person {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const PeoplePage: React.FC = () => {
  const [founder, setFounder] = useState<Person>({
    name: "Dr. John Doe",
    role: "Founder",
    bio: "Visionary leader with 20 years of experience",
    image: "",
  });

  const [ceo, setCeo] = useState<Person>({
    name: "Jane Smith",
    role: "CEO",
    bio: "Strategic thinker driving innovation",
    image: "",
  });

  const [boardMembers, setBoardMembers] = useState<Person[]>([
    { name: "Member 1", role: "Board Member", bio: "Expert in technology", image: "" },
    { name: "Member 2", role: "Board Member", bio: "Finance specialist", image: "" },
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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "founder" | "ceo" | "member",
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (type === "founder") {
          setFounder({ ...founder, image: imageUrl });
        } else if (type === "ceo") {
          setCeo({ ...ceo, image: imageUrl });
        } else if (type === "member" && index !== undefined) {
          const updated = [...boardMembers];
          updated[index].image = imageUrl;
          setBoardMembers(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updated = [...boardMembers];
    updated[index] = { ...updated[index], [field]: value };
    setBoardMembers(updated);
  };

  const PersonCard = ({
    person,
    type,
    onImageUpload,
    onUpdate,
    index,
  }: {
    person: Person;
    type: string;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpdate: (field: string, value: string) => void;
    index?: number;
  }) => (
    <Box
      sx={{
        p: 3,
        mb: 4,
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
      }}
    >
      <TextField
        fullWidth
        label="Name"
        value={person.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        sx={{ ...textFieldStyles, mb: 2 }}
      />
      <TextField
        fullWidth
        label="Role"
        value={person.role}
        onChange={(e) => onUpdate("role", e.target.value)}
        sx={{ ...textFieldStyles, mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Bio"
        value={person.bio}
        onChange={(e) => onUpdate("bio", e.target.value)}
        sx={{ ...textFieldStyles, mb: 2 }}
      />
      {person.image && (
        <img
          src={person.image}
          alt={person.name}
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
        id={`${type}-image-${index || ""}`}
        type="file"
        onChange={onImageUpload}
      />
      <label htmlFor={`${type}-image-${index || ""}`}>
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
  );

  return (
    <Box sx={{ mt: 4 }}>
      {/* Founder */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Founder
      </Typography>

      <PersonCard
        person={founder}
        type="founder"
        onImageUpload={(e) => handleImageUpload(e, "founder")}
        onUpdate={(field, value) => setFounder({ ...founder, [field]: value })}
      />

      {/* CEO */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        CEO
      </Typography>

      <PersonCard
        person={ceo}
        type="ceo"
        onImageUpload={(e) => handleImageUpload(e, "ceo")}
        onUpdate={(field, value) => setCeo({ ...ceo, [field]: value })}
      />

      {/* Board Members */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          color: "hsl(var(--foreground))",
          mb: 3,
        }}
      >
        Board Members
      </Typography>

      {boardMembers.map((member, index) => (
        <PersonCard
          key={index}
          person={member}
          type="member"
          index={index}
          onImageUpload={(e) => handleImageUpload(e, "member", index)}
          onUpdate={(field, value) => handleMemberChange(index, field, value)}
        />
      ))}

      <Button
        startIcon={<Plus />}
        onClick={() =>
          setBoardMembers([
            ...boardMembers,
            { name: "", role: "", bio: "", image: "" },
          ])
        }
        sx={{
          backgroundColor: "hsl(0 84.2% 60.2%)",
          color: "white",
          "&:hover": {
            backgroundColor: "hsl(0 84.2% 50.2%)",
          },
          mb: 4,
        }}
      >
        Add Board Member
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <DarkButton>Save Changes</DarkButton>
      </Box>
    </Box>
  );
};