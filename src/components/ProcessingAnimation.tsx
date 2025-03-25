
import React from 'react';
import { cn } from '@/lib/utils';

interface ProcessingAnimationProps {
  isProcessing: boolean;
}

const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;
  
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 animate-fade-in">
      <div className="relative h-20 w-20 mb-6">
        <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin-slow opacity-30"></div>
        <div className="absolute inset-0 border-t-4 border-l-4 border-primary rounded-full animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 bg-white rounded-full shadow-sm"></div>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">Analyzing Interview</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        We're analyzing your video for body language, eye contact, and confidence metrics. This might take a moment...
      </p>
      
      <div className="w-full max-w-md mt-8">
        <div className="w-full bg-secondary rounded-full h-1.5 mb-2 overflow-hidden">
          <div className="bg-primary h-full rounded-full animate-pulse-subtle" style={{width: '60%'}}></div>
        </div>
        <div className="grid grid-cols-3 text-xs text-muted-foreground">
          <span>Analyzing</span>
          <span className="text-center text-primary">Processing</span>
          <span className="text-right">Scoring</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
