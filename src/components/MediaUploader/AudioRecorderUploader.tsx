// AudioRecorderUploader.tsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Mic, MicOff, UploadCloud, CheckCircle } from "lucide-react";

interface AudioUploaderProps {
  onUploadSuccess: (url: string) => void;
  disabled?: boolean;
}

export function AudioRecorderUploader({
  onUploadSuccess,
  disabled,
}: AudioUploaderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const BASE_URL = `https://crm-server-tsnj.onrender.com/api`;
  useEffect(() => {
    if (!recording) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setAudioBlob(blob);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
      })
      .catch((err) => {
        console.error("Microphone permission denied", err);
        setRecording(false);
      });
  }, [recording]);

  const toggleRecording = () => {
    if (recording && mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(!recording);
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    setUploading(true);
    try {
      const response = await axios.post(`${BASE_URL}/file/upload`, formData);
      const url = response.data?.data.file_url;
      setPreviewUrl(url);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Audio upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-dashed border-gray-400 p-3 rounded-md text-center space-y-2">
      <button
        onClick={toggleRecording}
        disabled={disabled}
        className={`flex items-center gap-2 mx-auto px-4 py-2 rounded ${
          recording ? "bg-red-600" : "bg-blue-600"
        } text-white`}
      >
        {recording ? <MicOff size={16} /> : <Mic size={16} />}
        {recording ? "Stop Recording" : "Record Audio"}
      </button>

      {audioBlob && (
        <div className="space-y-2">
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="mx-auto w-full"
          />
          {!previewUrl && (
            <button
              onClick={uploadAudio}
              disabled={uploading}
              className="flex items-center gap-2 mx-auto bg-green-600 text-white px-3 py-1 rounded"
            >
              <UploadCloud size={16} />
              {uploading ? "Uploading..." : "Upload Audio"}
            </button>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="flex items-center justify-center text-green-500 text-sm gap-1">
          <CheckCircle size={16} />
          Uploaded Successfully
        </div>
      )}
    </div>
  );
}
