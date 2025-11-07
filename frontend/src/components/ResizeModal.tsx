import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
} from "@mui/material";
import { ZoomIn, ZoomOut, Crop as CropIcon, X } from "lucide-react";

interface ResizeModalProps {
  open: boolean;
  image: string;
  onClose: () => void;
  onSave: (croppedImage: File) => void;
}

export const ResizeModal: React.FC<ResizeModalProps> = ({
  open,
  image,
  onClose,
  onSave,
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (): Promise<File> => {
    const img = document.createElement("img");
    img.src = image;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob)
          resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    const cropped = await createCroppedImage();
    onSave(cropped);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.3)",
        },
      }}
    >
      {/* --- Header --- */}
      <DialogTitle
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CropIcon size={20} />
          Resize & Crop Image
        </Box>
        <IconButton onClick={onClose} sx={{ color: "hsl(var(--muted-foreground))" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* --- Crop Area --- */}
      <DialogContent
        sx={{
          position: "relative",
          height: 400,
          backgroundColor: "black",
          borderRadius: 2,
          overflow: "hidden",
          mt: 2,
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={true}
          style={{
            containerStyle: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
            cropAreaStyle: {
              border: "2px solid hsl(0 84.2% 60.2%)",
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>

      {/* --- Zoom Controls --- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <IconButton
          onClick={() => setZoom(Math.max(1, zoom - 0.1))}
          sx={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ZoomOut size={18} />
        </IconButton>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(_, v) => setZoom(v as number)}
          sx={{
            width: "40%",
            color: "hsl(0 84.2% 60.2%)",
          }}
        />
        <IconButton
          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
          sx={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ZoomIn size={18} />
        </IconButton>
      </Box>

      {/* --- Footer Buttons --- */}
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          px: 3,
          pb: 2,
          borderTop: "1px solid hsl(var(--border))",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "hsl(var(--muted-foreground))",
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: "hsl(0 84.2% 60.2%)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            "&:hover": {
              backgroundColor: "hsl(0 84.2% 50.2%)",
            },
          }}
        >
          Save Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
};
