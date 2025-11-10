import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Slider,
  IconButton,
} from "@mui/material";
import { ZoomIn, ZoomOut, Crop as CropIcon, X } from "lucide-react";
import { removeImageBackground } from "@/utils/removeBackground";

interface SquareResizeModalProps {
  open: boolean;
  image: string;
  onClose: () => void;
  onSave: (croppedImage: File | string) => void;
  removeBg?: boolean; // ✅ NEW FLAG
}

export const SquareResizeModal: React.FC<SquareResizeModalProps> = ({
  open,
  image,
  onClose,
  onSave,
  removeBg = true, // ✅ Default to true
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (): Promise<File> => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
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
          resolve(new File([blob], "cropped_logo.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    try {
      setProcessing(true);
      const croppedFile = await createCroppedImage();

      if (removeBg) {
        // ✅ background removal only if enabled
        try {
          const bgRemoved = await removeImageBackground(croppedFile);
          if (bgRemoved) {
            onSave(bgRemoved);
          } else {
            onSave(URL.createObjectURL(croppedFile));
          }
        } catch {
          console.warn("⚠️ Background removal failed, using original image");
          onSave(URL.createObjectURL(croppedFile));
        }
      } else {
        // ✅ skip background removal (for people page)
        onSave(URL.createObjectURL(croppedFile));
      }
    } finally {
      setProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid hsl(var(--border))",
          fontWeight: 600,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CropIcon size={18} />
          Crop Image
        </Box>
        <IconButton onClick={onClose} sx={{ color: "hsl(var(--muted-foreground))" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          position: "relative",
          height: 350,
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
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={false}
          style={{
            containerStyle: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
            cropAreaStyle: {
              border: "2px solid hsl(0 84.2% 60.2%)",
              borderRadius: "8px",
            },
          }}
        />
      </DialogContent>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
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
          sx={{ width: "40%", color: "hsl(0 84.2% 60.2%)" }}
        />
        <IconButton
          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
          sx={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ZoomIn size={18} />
        </IconButton>
      </Box>

      <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "hsl(var(--muted-foreground))" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={processing}
          sx={{
            backgroundColor: "hsl(0 84.2% 60.2%)",
            fontWeight: 600,
            "&:hover": { backgroundColor: "hsl(0 84.2% 50.2%)" },
          }}
        >
          {processing ? "Processing..." : "Save Crop"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};