import React, { useRef, useState, useEffect } from 'react';
import { toast } from "sonner";
import Header from '../components/Header';
import Footer from '../components/Footer';

import { loadModels, detectEmotion, type EmotionResult } from '../lib/faceDetection';
import { useInterviewAnalysis } from '../hooks/useInterviewAnalysis';

import VideoUploader from '@/components/VideoUploader';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import ScoreDisplay from '@/components/ScoreDisplay';
import { analyzeInterviewVideo } from '@/utils/scoreUtils';
import { ScoreMetric } from '@/components/ScoreCard';
import { Video } from 'lucide-react';


const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showSuspiciousDialog, setShowSuspiciousDialog] = useState(false);
  const [showInterviewMode, setShowInterviewMode] = useState(false);
  const requestRef = useRef<number>();
  const detectionActive = useRef<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);







  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    overallScore: number;
    metrics: ScoreMetric[];
  } | null>(null);

  const handleVideoSelected = async (file: File) => {
    setVideoFile(file);
    setScoreResult(null);
    setIsProcessing(true);
    
    try {
      const result = await analyzeInterviewVideo(file);
      setScoreResult(result);
    } catch (error) {
      console.error('Error processing video:', error);
      // In a real app, you would handle this error properly
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setScoreResult(null);
    setIsProcessing(false);
  };










  const { 
    isAnalyzing, 
    metrics,
    timeRemaining,
    startAnalysis,
    resetAnalysis
  } = useInterviewAnalysis({
    videoRef,
    analysisDuration: 10000, // 10 seconds
    onAnalysisComplete: (results) => {
      console.log('Interview analysis complete with results:', results);
      if (results.overallScore > 0) {
        setShowResultDialog(true);
        toast.success(`Analysis complete! Your score: ${results.overallScore}/100`);
      } else {
        toast.error("Analysis failed to produce valid results. Please try again.");
      }
    }
  });

  useEffect(() => {
    if (emotionResult?.emotion === 'fearful') {
      setShowSuspiciousDialog(true);
    }
  }, [emotionResult]);

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
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      detectionActive.current = false;
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStreamReady = (stream: MediaStream) => {
    streamRef.current = stream;
    
    if (!isModelLoading && !modelLoadError) {
      startDetection();
    }
  };

  const startDetection = () => {
    if (detectionActive.current) return;
    
    setIsDetecting(true);
    detectionActive.current = true;
    detectLoop();
  };

  const detectLoop = async () => {
    if (!detectionActive.current || isAnalyzing) return;
    
    if (videoRef.current && !isModelLoading) {
      if (!videoRef.current.paused && !videoRef.current.ended && videoRef.current.readyState >= 2) {
        try {
          const result = await detectEmotion(videoRef.current);
          if (result) {
            setEmotionResult(result);
          }
        } catch (error) {
          console.error('Detection error:', error);
        }
      }
    }
    
    requestRef.current = requestAnimationFrame(() => {
      setTimeout(detectLoop, 200);
    });
  };

  useEffect(() => {
    if (isAnalyzing) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    } else if (detectionActive.current && !requestRef.current) {
      detectLoop();
    }
  }, [isAnalyzing]);

  const toggleInterviewMode = () => {
    setShowInterviewMode(!showInterviewMode);
    if (!showInterviewMode) {
      resetAnalysis();
    }
  };

  const closeResultDialog = () => {
    setShowResultDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="container mx-auto py-8 px-4 sm:px-6 max-w-5xl">
        {!videoFile ? (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-xs font-medium text-accent-foreground mb-4">
                AI-Powered Analysis
              </div>
              <h2 className="text-4xl font-bold mb-4 tracking-tight">
                Elevate Your Interview Performance
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload your interview video and receive instant, detailed feedback to help you improve your skills and ace your next interview.
              </p>
            </div>
            
            <VideoUploader onVideoSelected={handleVideoSelected} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Upload",
                  description: "Share your interview recording for AI analysis"
                },
                {
                  title: "Analyze",
                  description: "Our system evaluates multiple performance factors"
                },
                {
                  title: "Improve",
                  description: "Get actionable insights to enhance your skills"
                }
              ].map((step, i) => (
                <div 
                  key={i} 
                  className="border border-border rounded-xl p-6 text-center hover:border-primary/40 hover:shadow-sm transition-all"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mb-4">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {isProcessing ? (
              <ProcessingAnimation isProcessing={isProcessing} />
            ) : scoreResult ? (
              <ScoreDisplay 
                overallScore={scoreResult.overallScore} 
                metrics={scoreResult.metrics} 
              />
            ) : (
              <div className="text-center py-12">
                <p>Something went wrong. Please try again.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
