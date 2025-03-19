
import React, { useState, useRef } from 'react';
import { Video, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      handleVideoSelection(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoSelection(e.target.files[0]);
    }
  };

  const handleVideoSelection = (file: File) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    onVideoSelected(file);
  };

  const clearVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "w-full relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 bg-white",
          isDragging ? "border-primary bg-accent/30" : "border-border hover:border-muted-foreground/50",
          videoPreview ? "border-primary/40" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!videoPreview ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <Video className="h-12 w-12 text-muted-foreground mb-4 animate-pulse-subtle" />
            <h3 className="text-lg font-medium text-foreground mb-2">Upload Interview Video</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              Drag and drop your interview video file here, or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Select video</span>
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: MP4, WebM, MOV (Max size: 100MB)
            </p>
          </div>
        ) : (
          <div className="relative animate-fade-in">
            <button 
              onClick={clearVideo}
              className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white rounded-full shadow-sm z-10 text-muted-foreground hover:text-destructive transition-all"
              aria-label="Remove video"
            >
              <X className="h-4 w-4" />
            </button>
            <video 
              src={videoPreview} 
              className="w-full rounded-lg max-h-[300px] object-contain bg-black/5" 
              controls
            />
            <p className="text-sm text-muted-foreground mt-2 truncate">
              {videoFile?.name}
            </p>
          </div>
        )}
        <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
};

export default VideoUploader;
