
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Upload,
  Loader2,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface StudioGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function StudioGalleryUploader({
  images,
  onChange,
}: StudioGalleryUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Keep track of temporary browser URLs without triggering renders.
  const previewUrlRef = useRef<string | null>(null);

  // Cleanup when component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreviewUrl(null);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    if (images.length >= MAX_IMAGES) {
      toast.error("Maximum 10 images allowed.");
      event.target.value = "";
      return;
    }

    // Release the previous preview URL.
    clearPreview();

    // Create a browser preview for the newly selected image.
    const objectUrl = URL.createObjectURL(file);

    previewUrlRef.current = objectUrl;

    setSelectedFile(file);
    setPreviewUrl(objectUrl);

    // Allow selecting the same file again.
    event.target.value = "";
  };

  const handleUpload = async () => {
    if (
      !selectedFile ||
      isUploading ||
      images.length >= MAX_IMAGES
    ) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      toast.error("API URL is not configured.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Image upload failed."
        );
      }

      const uploadedUrl = result.data?.imageUrl;

      if (
        typeof uploadedUrl !== "string" ||
        !uploadedUrl
      ) {
        throw new Error(
          "No image URL returned by server."
        );
      }

      // Update gallery with the uploaded image.
      onChange([...images, uploadedUrl]);

      // Remove the temporary selected-file preview.
      clearPreview();
      setSelectedFile(null);

      toast.success(
        "Gallery image uploaded successfully!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    if (isUploading) return;

    const updatedImages = images.filter(
      (_, imageIndex) => imageIndex !== index
    );

    onChange(updatedImages);

    toast.success("Image removed from gallery.");
  };

  return (
    <div className="space-y-5">
      {/* Gallery Heading */}
      <div>
        <h3 className="text-sm font-semibold text-[#22252A]">
          Studio Gallery
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Add up to 10 photos. The first photo will be
          your cover image.
        </p>
      </div>

      {/* Select Image */}
      <label
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#D4AD68] bg-[#F5F0E8] px-5 py-8 text-center transition ${
          isUploading || images.length >= MAX_IMAGES
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:bg-[#EFE7DA]"
        }`}
      >
        <ImagePlus
          size={30}
          className="text-[#B58B49]"
        />

        <span className="text-sm font-semibold text-[#22252A]">
          {selectedFile
            ? selectedFile.name
            : images.length >= MAX_IMAGES
              ? "Maximum 10 images uploaded"
              : "Choose a gallery image"}
        </span>

        <span className="text-xs text-gray-500">
          JPG, PNG or WebP — Max 5 MB each
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={
            isUploading ||
            images.length >= MAX_IMAGES
          }
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Selected Image Preview — BEFORE Upload */}
      {selectedFile && previewUrl && (
        <div className="overflow-hidden rounded-xl border border-[#D4AD68] bg-white p-3">
          <p className="mb-3 text-sm font-semibold text-[#22252A]">
            Selected Image Preview
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Selected studio image preview"
            className="h-48 w-full rounded-lg bg-[#F5F0E8] object-contain"
          />

          <p className="mt-2 truncate text-xs text-gray-500">
            {selectedFile.name}
          </p>

          <p className="mt-1 text-xs text-[#B58B49]">
            Not uploaded yet
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={
          !selectedFile ||
          isUploading ||
          images.length >= MAX_IMAGES
        }
        className="inline-flex items-center gap-2 rounded-lg bg-[#D4AD68] px-5 py-3 text-sm font-semibold text-[#22252A] transition hover:bg-[#C49A53] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload Image
          </>
        )}
      </button>

      {/* Uploaded Gallery */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle2 size={17} />
            {images.length} of {MAX_IMAGES} images uploaded
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="overflow-hidden rounded-xl border border-[#E8E0D4] bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Studio gallery image ${index + 1}`}
                  className="h-40 w-full object-cover"
                />

                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="text-xs font-semibold text-[#22252A]">
                    {index === 0
                      ? "Cover Image"
                      : `Photo ${index + 1}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    disabled={isUploading}
                    aria-label={`Remove photo ${index + 1}`}
                    className="rounded-md p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
