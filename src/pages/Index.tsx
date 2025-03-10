
import React, { useRef, useState, useEffect } from 'react';
import { toast } from "sonner";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Camera from '../components/Camera';
import EmotionDisplay from '../components/EmotionDisplay';
import SuspiciousCommand from '../components/SuspiciousCommand';
import { loadModels, detectEmotion, type EmotionResult } from '../lib/faceDetection';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuspiciousDialog, setShowSuspiciousDialog] = useState(false);

  useEffect(() => {
    const initializeModels = async () => {
      setIsModelLoading(true);
      try {
        const modelsLoaded = await loadModels();
        if (!modelsLoaded) {
          throw new Error('Failed to load models');
        }
        console.log("Emotion detection models loaded successfully");
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
  }, []);

  const analyzeVideo = async (video: HTMLVideoElement) => {
    if (!video || isModelLoading) return;

    setIsAnalyzing(true);
    setEmotionResult(null);
    const emotionCounts: Record<string, number> = {};
    
    // Sample frames every 500ms during video duration
    const duration = video.duration;
    console.log("Video duration:", duration);
    const interval = 0.5; // seconds
    let currentTime = 0;
    let framesProcessed = 0;
    let detectedFrames = 0;

    try {
      console.log("Starting video analysis...");
      video.pause(); // Ensure video is paused before analysis
      
      // Process frames
      while (currentTime < duration) {
        console.log(`Processing frame at ${currentTime}s`);
        
        // Set current time and wait for seeked event
        video.currentTime = currentTime;
        await new Promise<void>(resolve => {
          const seekedHandler = () => {
            video.removeEventListener('seeked', seekedHandler);
            resolve();
          };
          video.addEventListener('seeked', seekedHandler);
        });

        try {
          framesProcessed++;
          // Give a brief moment for the frame to fully render
          await new Promise(r => setTimeout(r, 100));
          
          const result = await detectEmotion(video);
          console.log("Frame result:", result);
          
          if (result) {
            detectedFrames++;
            emotionCounts[result.emotion] = (emotionCounts[result.emotion] || 0) + 1;
            
            if (result.emotion === 'fearful') {
              setShowSuspiciousDialog(true);
            }
          }
        } catch (error) {
          console.error('Error analyzing frame:', error);
        }

        currentTime += interval;
      }

      console.log("Analysis complete. Emotion counts:", emotionCounts);
      console.log(`Frames processed: ${framesProcessed}, Faces detected: ${detectedFrames}`);
      
      // If no emotions were detected, set a default neutral emotion with low confidence
      if (Object.keys(emotionCounts).length === 0) {
        toast.warning('No faces detected in the video. Try a video with clearer face visibility.');
        setEmotionResult({
          emotion: 'neutral',
          probability: 0.3
        });
      } else {
        // Find the most frequent emotion
        let maxCount = 0;
        let dominantEmotion: EmotionResult | null = null;

        Object.entries(emotionCounts).forEach(([emotion, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantEmotion = {
              emotion: emotion as EmotionResult['emotion'],
              probability: count / (detectedFrames || 1)
            };
          }
        });

        console.log("Dominant emotion:", dominantEmotion);
        setEmotionResult(dominantEmotion);
        
        if (dominantEmotion) {
          toast.success(`Analysis complete: Dominant emotion is ${dominantEmotion.emotion}`);
        }
      }
    } catch (error) {
      console.error('Error during video analysis:', error);
      toast.error('Failed to analyze video');
      // Fallback to neutral emotion
      setEmotionResult({
        emotion: 'neutral',
        probability: 0.3
      });
    } finally {
      setIsAnalyzing(false);
      // Reset video to beginning after analysis
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <SuspiciousCommand 
          open={showSuspiciousDialog}
          onOpenChange={setShowSuspiciousDialog}
        />
        
        <section className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2 animate-blur-in">
            <div className="mb-3">
              <span className="text-xs bg-secondary px-3 py-1 rounded-full text-muted-foreground font-medium">
                Video Analysis
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2 font-heading">
              Analyze Video Emotions
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Upload a video and click the Analyze button to determine the most prevalent emotion.
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
                <p className="text-lg font-medium font-heading mb-2">Failed to load emotion detection models</p>
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
            <>
              <Camera onVideoProcess={analyzeVideo} videoRef={videoRef} />
              {isAnalyzing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing video...</span>
                  </div>
                </div>
              )}
            </>
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
