
import React from 'react';
import { Loader2 } from 'lucide-react';

interface AnalyzingIndicatorProps {
  isAnalyzing: boolean;
}

const AnalyzingIndicator: React.FC<AnalyzingIndicatorProps> = ({ isAnalyzing }) => {
  if (!isAnalyzing) return null;
  
  return (
    <div className="mt-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Analyzing video...</span>
      </div>
    </div>
  );
};

export default AnalyzingIndicator;
