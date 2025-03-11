
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { loadModels } from '../lib/faceDetection';

export const useEmotionDetection = () => {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelLoadError, setModelLoadError] = useState(false);

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

  return {
    isModelLoading,
    modelLoadError
  };
};
