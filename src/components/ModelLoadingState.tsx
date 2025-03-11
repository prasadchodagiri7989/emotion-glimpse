
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModelLoadingStateProps {
  isLoading: boolean;
  hasError: boolean;
}

const ModelLoadingState: React.FC<ModelLoadingStateProps> = ({ isLoading, hasError }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl aspect-video mx-auto bg-black/5 rounded-2xl flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Loader2 className="w-10 h-10 mb-3 mx-auto animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading emotion detection models...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full max-w-3xl aspect-video mx-auto bg-black/5 rounded-2xl flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium font-heading mb-2">Failed to load emotion detection models</p>
          <p className="text-sm text-muted-foreground mb-4">
            There was an error initializing the face detection models.
          </p>
          <Button 
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default ModelLoadingState;
