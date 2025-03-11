
import { useState } from 'react';
import { toast } from "sonner";
import { detectEmotion, type EmotionResult } from '../lib/faceDetection';

export const useVideoAnalysis = () => {
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuspiciousDialog, setShowSuspiciousDialog] = useState(false);

  const analyzeVideo = async (video: HTMLVideoElement) => {
    if (!video) return;

    setIsAnalyzing(true);
    setEmotionResult(null);
    const emotionCounts: Record<string, number> = {};
    
    // Sample frames more frequently
    const duration = video.duration;
    console.log("Video duration:", duration);
    const interval = 0.2; // seconds - shorter for more frames
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

        // Longer delay to ensure frame is fully rendered
        await new Promise(r => setTimeout(r, 200));
        
        framesProcessed++;
        
        const result = await detectEmotion(video);
        console.log("Frame result:", result);
        
        if (result) {
          detectedFrames++;
          emotionCounts[result.emotion] = (emotionCounts[result.emotion] || 0) + 1;
          
          if (result.emotion === 'fearful') {
            setShowSuspiciousDialog(true);
          }
        }

        currentTime += interval;
      }

      console.log("Analysis complete. Emotion counts:", emotionCounts);
      console.log(`Frames processed: ${framesProcessed}, Faces detected: ${detectedFrames}`);
      
      // Always provide a result, even if no emotions were detected
      if (Object.keys(emotionCounts).length === 0) {
        toast.warning('No faces detected in the video. Please try again with clearer face visibility.');
        // Provide a default result
        setEmotionResult({
          emotion: 'neutral',
          probability: 0.5
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
        setEmotionResult(dominantEmotion || {
          emotion: 'neutral',
          probability: 0.5
        });
        
        if (dominantEmotion) {
          toast.success(`Analysis complete: Dominant emotion is ${dominantEmotion.emotion}`);
        }
      }
    } catch (error) {
      console.error('Error during video analysis:', error);
      toast.error('Failed to analyze video');
      // Always provide a fallback result
      setEmotionResult({
        emotion: 'neutral',
        probability: 0.5
      });
    } finally {
      setIsAnalyzing(false);
      // Reset video to beginning after analysis
      if (video) {
        video.currentTime = 0;
      }
    }
  };

  return {
    emotionResult,
    isAnalyzing,
    showSuspiciousDialog,
    setShowSuspiciousDialog,
    analyzeVideo
  };
};
