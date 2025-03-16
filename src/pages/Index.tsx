import React, { useRef, useState, useEffect } from 'react';
import { toast } from "sonner";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Camera from '../components/Camera';
import EmotionDisplay from '../components/EmotionDisplay';
import InterviewAnalysis from '../components/InterviewAnalysis';
import SuspiciousCommand from '../components/SuspiciousCommand';
import { loadModels, detectEmotion, type EmotionResult } from '../lib/faceDetection';
import { useInterviewAnalysis } from '../hooks/useInterviewAnalysis';
import { Loader2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';

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
      
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <SuspiciousCommand 
          open={showSuspiciousDialog}
          onOpenChange={setShowSuspiciousDialog}
        />

        <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl flex items-center gap-2">
                {metrics.isPrepared ? 
                  <span className="text-green-600">You're Interview Ready!</span> : 
                  <span className="text-amber-600">More Practice Needed</span>
                }
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                <div className="space-y-4 my-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Eye Contact:</div>
                    <div className="text-right font-bold">{metrics.eyeContact}/100</div>
                    
                    <div className="text-sm font-medium">Facial Expression:</div>
                    <div className="text-right font-bold">{metrics.facialExpression}/100</div>
                    
                    <div className="text-sm font-medium">Confidence:</div>
                    <div className="text-right font-bold">{metrics.confidence}/100</div>
                    
                    <div className="text-sm font-medium border-t pt-1 mt-1">Overall Score:</div>
                    <div className="text-right font-bold text-lg border-t pt-1 mt-1">{metrics.overallScore}/100</div>
                  </div>
                  
                  <p className="text-sm pt-2">{metrics.feedback}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={closeResultDialog}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <section className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8 space-y-2 animate-blur-in">
            <div className="mb-3 flex justify-center gap-2">
              <span className="text-xs bg-secondary px-3 py-1 rounded-full text-muted-foreground font-medium">
                Real-time Analysis
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleInterviewMode}
                className="inline-flex items-center text-xs h-6 gap-1.5 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                <Activity className="h-3 w-3" />
                {showInterviewMode ? "Show Emotion Mode" : "Interview Mode"}
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2 font-heading">
              {showInterviewMode 
                ? "Interview Readiness Analyzer" 
                : "Recognize Emotions Instantly"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              {showInterviewMode 
                ? "Our AI will analyze your interview readiness by examining your facial expressions, eye contact, and confidence levels."
                : "Our advanced technology captures and analyzes your facial expressions in real-time, providing instant feedback on your emotional state."}
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
            <Camera onStreamReady={handleStreamReady} videoRef={videoRef} />
          )}

          <div className="mt-8">
            {showInterviewMode ? (
              <InterviewAnalysis 
                isAnalyzing={isAnalyzing}
                metrics={metrics}
                timeRemaining={timeRemaining}
                onStartAnalysis={startAnalysis}
                onResetAnalysis={resetAnalysis}
              />
            ) : (
              <EmotionDisplay emotionResult={emotionResult} />
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
