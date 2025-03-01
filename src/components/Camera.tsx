
import React, { useRef, useEffect, useState } from 'react';
import { Camera as CameraIcon } from 'lucide-react';

interface CameraProps {
  onStreamReady: (stream: MediaStream) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const Camera: React.FC<CameraProps> = ({ onStreamReady, videoRef }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;

    const setupCamera = async () => {
      try {
        setIsLoading(true);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsLoading(false);
                  onStreamReady(stream);
                })
                .catch(err => {
                  console.error('Error playing video:', err);
                  setError('Could not start video playback');
                  setIsLoading(false);
                });
            }
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Camera access denied or not available');
        setIsLoading(false);
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onStreamReady, videoRef]);

  return (
    <div className="camera-container w-full max-w-3xl aspect-video mx-auto">
      <video 
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        playsInline
        muted
      />
      
      {isLoading && (
        <div className="camera-overlay">
          <div className="flex flex-col items-center justify-center text-white">
            <CameraIcon className="w-10 h-10 mb-4 animate-pulse" />
            <p className="text-lg font-medium">Starting camera...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="camera-overlay bg-black/80">
          <div className="text-center px-6">
            <p className="text-white text-lg mb-2">Camera Error</p>
            <p className="text-white/80 text-sm mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="camera-overlay pointer-events-none">
          <div className="camera-guide" />
        </div>
      )}
    </div>
  );
};

export default Camera;
