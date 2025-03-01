
import React, { useRef, useState, useEffect } from 'react';
import { toast } from "sonner";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Camera from '../components/Camera';
import EmotionDisplay from '../components/EmotionDisplay';
import { loadModels, detectEmotion, type EmotionResult } from '../lib/faceDetection';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const requestRef = useRef<number>();
  const detectionActive = useRef<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Load face detection models on component mount
  useEffect(() => {
    const initializeModels = async () => {
      setIsModelLoading(true);
      try {
        const modelsLoaded = await loadModels();
        if (!modelsLoaded) {
          throw new Error('Failed to load models');
        }
        toast.success("Emotion detection models loaded successfully");
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error initializing models:', error);
        setModelLoadError(true);
        setIsModelLoading(false);
        toast.error("Failed to load emotion detection models");
      }
    };

    initializeModels();

    return () => {
      // Clean up any animation frames
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      detectionActive.current = false;
      
      // Stop all tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle when camera stream is ready
  const handleStreamReady = (stream: MediaStream) => {
    // Store stream reference for cleanup
    streamRef.current = stream;
    
    // Once stream is ready and models are loaded, start detection loop
    if (!isModelLoading && !modelLoadError) {
      startDetection();
    }
  };

  // Start the emotion detection loop
  const startDetection = () => {
    if (detectionActive.current) return; // Prevent multiple detection loops
    
    setIsDetecting(true);
    detectionActive.current = true;
    detectLoop();
  };

  // Animation loop for continuous detection
  const detectLoop = async () => {
    if (!detectionActive.current) return; // Stop detection if not active
    
    if (videoRef.current && !isModelLoading) {
      // Only detect if video is playing and visible
      if (!videoRef.current.paused && !videoRef.current.ended && videoRef.current.readyState >= 2) {
        try {
          const result = await detectEmotion(videoRef.current);
          if (result) {
            setEmotionResult(result);
          }
        } catch (error) {
          console.error('Detection error:', error);
          // Don't stop detection on error
        }
      }
    }
    
    // Continue the loop with a small delay to prevent overwhelming the browser
    requestRef.current = requestAnimationFrame(() => {
      // Use setTimeout to throttle detection rate
      setTimeout(detectLoop, 200); // Increased throttle time to reduce load
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <section className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2 animate-blur-in">
            <div className="mb-3">
              <span className="text-xs bg-secondary px-3 py-1 rounded-full text-muted-foreground font-medium">
                Real-time Analysis
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">
              Recognize Emotions Instantly
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Our advanced technology captures and analyzes your facial expressions in real-time, providing 
              instant feedback on your emotional state.
            </p>
          </div>

          {isModelLoading ? (
            <div className="w-full max-w-3xl aspect-video mx-auto bg-black/5 rounded-2xl flex items-center justify-center">
              <div className="text-center animate-pulse">
                <Loader2 className="w-10 h-10 mb-3 mx-auto animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading emotion detection models...</p>
              </div>
            </div>
          ) : modelLoadError ? (
            <div className="w-full max-w-3xl aspect-video mx-auto bg-black/5 rounded-2xl flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-lg font-medium mb-2">Failed to load emotion detection models</p>
                <p className="text-sm text-muted-foreground mb-4">
                  There was an error initializing the face detection models.
                </p>
                <button 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </button>
              </div>
            </div>
          ) : (
            <Camera onStreamReady={handleStreamReady} videoRef={videoRef} />
          )}

          <div className="mt-12">
            <EmotionDisplay emotionResult={emotionResult} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
