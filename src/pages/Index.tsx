
import React, { useRef, useState, useEffect } from 'react';
import { toast } from "sonner";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Camera from '../components/Camera';
import VideoAnalysisResults from '../components/VideoAnalysisResults';
import { loadModels } from '../lib/faceDetection';
import { useInterviewAnalysis } from '../hooks/useInterviewAnalysis';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

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
        toast.success(`Analysis complete! Your score: ${results.overallScore}/100`);
      } else {
        toast.error("Analysis failed to produce valid results. Please try again.");
      }
    }
  });

  useEffect(() => {
    const initializeModels = async () => {
      setIsModelLoading(true);
      try {
        const modelsLoaded = await loadModels();
        if (!modelsLoaded) {
          throw new Error('Failed to load models');
        }
        toast.success("Analysis models loaded successfully");
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error initializing models:', error);
        setModelLoadError(true);
        setIsModelLoading(false);
        toast.error("Failed to load analysis models");
      }
    };

    initializeModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStreamReady = (stream: MediaStream) => {
    streamRef.current = stream;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <section className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8 space-y-2 animate-blur-in">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2 font-heading">
              Video Interview Analysis
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Our AI will analyze your interview performance by examining your facial expressions, eye contact, and confidence levels.
            </p>
          </div>

          {isModelLoading ? (
            <div className="w-full max-w-3xl aspect-video mx-auto bg-black/5 rounded-2xl flex items-center justify-center">
              <div className="text-center animate-pulse">
                <Loader2 className="w-10 h-10 mb-3 mx-auto animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading analysis models...</p>
              </div>
            </div>
          ) : modelLoadError ? (
            <div className="w-full max-w-3xl aspect-video mx-auto bg-black/5 rounded-2xl flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-lg font-medium font-heading mb-2">Failed to load analysis models</p>
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
              <div className="mb-6">
                <Camera onStreamReady={handleStreamReady} videoRef={videoRef} />
              </div>
              
              <div className="flex justify-center mb-8">
                <Button 
                  onClick={isAnalyzing ? resetAnalysis : startAnalysis}
                  size="lg"
                  className="px-8"
                  variant={isAnalyzing ? "destructive" : "default"}
                >
                  {isAnalyzing ? "Cancel Analysis" : "Start Analysis"}
                </Button>
              </div>
              
              <VideoAnalysisResults 
                isAnalyzing={isAnalyzing}
                metrics={metrics}
                timeRemaining={timeRemaining}
              />
            </>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
