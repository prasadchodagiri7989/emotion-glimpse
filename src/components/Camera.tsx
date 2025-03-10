
import React, { useRef, useState, useEffect } from 'react';
import { Upload, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CameraProps {
  onVideoProcess: (video: HTMLVideoElement) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const Camera: React.FC<CameraProps> = ({ onVideoProcess, videoRef }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if video is already loaded when component mounts
    if (videoRef.current?.src) {
      setVideoLoaded(true);
    }
  }, [videoRef]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is a video
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setIsLoading(true);
    const videoUrl = URL.createObjectURL(file);

    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.onloadeddata = () => {
        setIsLoading(false);
        setVideoLoaded(true);
        toast.success('Video loaded successfully');
      };
    }
  };

  const handleAnalyze = () => {
    if (!videoRef.current?.src) {
      toast.error('Please upload a video first');
      return;
    }
    
    setIsLoading(true);
    // Call the onVideoProcess function with the video element
    onVideoProcess(videoRef.current);
  };

  return (
    <div className="camera-container w-full max-w-3xl mx-auto">
      <div className="relative aspect-video bg-black/5 rounded-2xl overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
        />
        
        <input
          type="file"
          accept="video/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {!videoLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5" />
              Upload Video
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Upload a video to analyze emotions
            </p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2" />
              <p>Processing video...</p>
            </div>
          </div>
        )}
      </div>
      
      {videoLoaded && !isLoading && (
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={handleAnalyze}
            className="gap-2"
            size="lg"
          >
            <Play className="w-5 h-5" />
            Analyze Emotions
          </Button>
        </div>
      )}
    </div>
  );
};

export default Camera;
