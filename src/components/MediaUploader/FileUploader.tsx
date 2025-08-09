import { useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  disabled?: boolean;
}

export function FileUploader({ onUploadSuccess, disabled }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const BASE_URL = `https://crm-server-tsnj.onrender.com/api`;

    setUploading(true);
    try {
      const response = await axios.post(`${BASE_URL}/file/upload`, formData);
      const url = response.data?.data.file_url;
      setPreviewUrl(url);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-dashed border-gray-400 p-4 rounded-md text-center relative">
      <label className="cursor-pointer block">
        <UploadCloud size={20} className="mx-auto mb-2" />
        <span className="text-sm">Click to upload file</span>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
        />
      </label>
      {previewUrl && (
        <div className="mt-2 text-xs text-green-500 break-all">Uploaded ✔</div>
      )}
    </div>
  );
}
