
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  userInitials: string;
  onAvatarUpdate: (newUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

const AvatarUpload = ({ 
  userId, 
  currentAvatarUrl, 
  userInitials, 
  onAvatarUpdate,
  size = "md" 
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, uploading } = useAvatarUpload();

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-20 w-20",
    lg: "h-32 w-32"
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const newUrl = await uploadAvatar(file, userId);
    if (newUrl) {
      onAvatarUpdate(newUrl);
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative group">
        <Avatar className={`${sizeClasses[size]} cursor-pointer transition-opacity group-hover:opacity-80`}>
          <AvatarImage src={currentAvatarUrl || undefined} alt="Avatar" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        onClick={handleButtonClick}
        disabled={uploading}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        <Upload className="h-3 w-3 mr-1" />
        {uploading ? "Uploading..." : "Change Avatar"}
      </Button>
      
      {size !== "sm" && (
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Upload an image (max 5MB). It will be automatically compressed to under 50KB.
        </p>
      )}
    </div>
  );
};

export default AvatarUpload;
