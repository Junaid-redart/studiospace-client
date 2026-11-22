
"use client";

import { useState } from "react";
import { ImagePlus, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({
  value,
  onChange,
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    // A newly selected image must be uploaded before submitting.
    onChange("");
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsUploading(true);

    try {
      const response = await fetch(
        `/api/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Image upload failed.");
      }

      const imageUrl = result.data?.imageUrl;

      if (typeof imageUrl !== "string" || !imageUrl) {
        throw new Error("Image URL missing from server response.");
      }

      onChange(imageUrl);
      setSelectedFile(null);

      toast.success("Studio image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-[#22252A]">
        Upload Studio Image
      </label>

      {/* Select Image */}
      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#D4AD68] bg-[#F5F0E8] px-5 py-8 text-center transition hover:bg-[#EFE7DA]">
        <ImagePlus size={32} className="text-[#B58B49]" />

        <span className="text-sm font-semibold text-[#22252A]">
          {selectedFile ? selectedFile.name : "Choose an image"}
        </span>

        <span className="text-xs text-gray-500">
          JPG, PNG or WebP — Maximum 5 MB
        </span>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AD68] px-6 py-3 text-sm font-bold text-[#22252A] transition hover:bg-[#C49A53] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload Image
          </>
        )}
      </button>

      {/* Uploaded Image Preview */}
      {value && (
        <div className="rounded-xl border border-[#E8E0D4] bg-[#FFFCF7] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700">
            <CheckCircle2 size={18} />
            Image Uploaded
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded studio preview"
            className="h-52 w-full rounded-lg object-cover"
          />

          <p className="mt-3 break-all text-xs text-gray-500">
            {value}
          </p>
        </div>
      )}
    </div>
  );
}
