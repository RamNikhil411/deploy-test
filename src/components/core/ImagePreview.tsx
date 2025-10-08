import React, { useState, useRef, useCallback } from "react";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "../ui/button";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

const ImagePreview = ({
  src,
  setSrc,
  setPreviewSrc,
  setFile,
}: {
  src: string | undefined;
  setSrc: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPreviewSrc: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Default crop values
  const defaultCrop: Crop = {
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  };

  // Function to draw to canvas (extracted for reuse)
  const drawToCanvas = useCallback((c: Crop) => {
    if (
      imgRef.current &&
      previewCanvasRef.current &&
      c.width &&
      c.height &&
      imgRef.current.complete
    ) {
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = c.width;
      canvas.height = c.height;

      ctx.drawImage(
        image,
        c.x * scaleX,
        c.y * scaleY,
        c.width * scaleX,
        c.height * scaleY,
        0,
        0,
        c.width,
        c.height
      );
    }
  }, []);

  // Callback to set initial crop and draw after image loads
  const handleImageLoad = useCallback(() => {
    if (imgRef.current) {
      setCrop(defaultCrop);
      // Immediately "complete" the default crop to populate canvas
      setCompletedCrop(defaultCrop);
      drawToCanvas(defaultCrop);
    }
  }, [drawToCanvas]);

  const onCropComplete = useCallback(
    (c: Crop) => {
      setCompletedCrop(c);
      drawToCanvas(c);
    },
    [drawToCanvas]
  );

  return (
    <AlertDialog open={!!src}>
      <AlertDialogContent>
        <AlertDialogTitle>Edit Profile Image</AlertDialogTitle>
        {src && (
          <>
            <div className="flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={onCropComplete}
                aspect={1}
                circularCrop
                className="w-fit"
              >
                <img
                  ref={imgRef}
                  src={src}
                  alt="Preview"
                  onLoad={handleImageLoad}
                  style={{
                    maxHeight: "400px",
                    width: "auto",
                    maxWidth: "100%",
                    display: "block",
                  }}
                />
              </ReactCrop>
            </div>
            <canvas ref={previewCanvasRef} style={{ display: "none" }} />
          </>
        )}
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setSrc(undefined)}
            className="bg-transparent hover:bg-transparent text-gray-600 border border-gray-600"
          >
            Cancel
          </Button>
          <Button
            className="bg-lime-600 text-white hover:bg-lime-600"
            onClick={() => {
              if (!completedCrop || !previewCanvasRef.current) {
                // Fallback: if still no crop (e.g., load failed), use full image
                if (imgRef.current) {
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    canvas.width = imgRef.current.naturalWidth;
                    canvas.height = imgRef.current.naturalHeight;
                    ctx.drawImage(imgRef.current, 0, 0);
                    canvas.toBlob((blob) => {
                      if (!blob) return;
                      const file = new File([blob], "image.png", {
                        type: "image/png",
                      });
                      setFile(file);
                      const previewUrl = URL.createObjectURL(file);
                      setPreviewSrc(previewUrl);
                      setSrc(undefined);
                    }, "image/png");
                  }
                }
                return;
              }
              const canvas = previewCanvasRef.current;
              canvas?.toBlob((blob) => {
                if (!blob) return;
                const file = new File([blob], "cropped-image.png", {
                  type: "image/png",
                });
                setFile(file);
                const previewUrl = URL.createObjectURL(file);
                setPreviewSrc(previewUrl);
                setSrc(undefined);
              }, "image/png");
            }}
          >
            Save
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImagePreview;
