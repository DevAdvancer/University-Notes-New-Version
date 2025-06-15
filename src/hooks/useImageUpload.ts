
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns the public URL for an image given the path
  const getPublicUrl = (filePath: string) => {
    return supabase.storage
      .from("note-images")
      .getPublicUrl(filePath).data.publicUrl;
  };

  // Upload file, returns { url, path } if success
  const uploadImage = async (file: File): Promise<{ url: string; path: string } | null> => {
    setUploading(true);
    setError(null);

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${ext}`;
    const filePath = fileName;

    const { error: uploadErr } = await supabase.storage
      .from("note-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return null;
    }

    const url = getPublicUrl(filePath);
    setUploading(false);
    return { url, path: filePath };
  };

  return { uploadImage, uploading, error };
}
