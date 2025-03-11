
import React, { useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Camera from '../components/Camera';
import EmotionDisplay from '../components/EmotionDisplay';
import SuspiciousCommand from '../components/SuspiciousCommand';
import ModelLoadingState from '../components/ModelLoadingState';
import AnalyzingIndicator from '../components/AnalyzingIndicator';
import PageTitle from '../components/PageTitle';
import { useEmotionDetection } from '../hooks/useEmotionDetection';
import { useVideoAnalysis } from '../hooks/useVideoAnalysis';

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isModelLoading, modelLoadError } = useEmotionDetection();
  const { 
    emotionResult, 
    isAnalyzing, 
    showSuspiciousDialog, 
    setShowSuspiciousDialog, 
    analyzeVideo 
  } = useVideoAnalysis();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <SuspiciousCommand 
          open={showSuspiciousDialog}
          onOpenChange={setShowSuspiciousDialog}
        />
        
        <section className="w-full max-w-6xl mx-auto">
          <PageTitle 
            title="Analyze Video Emotions"
            description="Upload a video and click the Analyze button to determine the most prevalent emotion."
          />

          <ModelLoadingState 
            isLoading={isModelLoading} 
            hasError={modelLoadError} 
          />

          {!isModelLoading && !modelLoadError && (
            <>
              <Camera 
                onVideoProcess={analyzeVideo} 
                videoRef={videoRef} 
              />
              
              <AnalyzingIndicator isAnalyzing={isAnalyzing} />
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
