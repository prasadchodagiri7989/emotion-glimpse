import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { detectEmotion, detectFace, InterviewMetrics, emptyInterviewMetrics } from '../lib/faceDetection';

interface InterviewAnalysisOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  analysisDuration: number; // in milliseconds
  onAnalysisComplete?: (metrics: InterviewMetrics) => void;
}

interface InterviewAnalysisState {
  isAnalyzing: boolean;
  metrics: InterviewMetrics;
  timeRemaining: number; // in seconds
  startAnalysis: () => void;
  resetAnalysis: () => void;
}

interface AnalysisData {
  emotionCounts: Record<string, number>;
  totalFrames: number;
  faceDetectionCounts: number;
  smileDetectionCounts: number;
  neutralDetectionCounts: number;
  eyeContactFrames: number;
}

export const useInterviewAnalysis = ({
  videoRef,
  analysisDuration = 10000, // default 10 seconds
  onAnalysisComplete
}: InterviewAnalysisOptions): InterviewAnalysisState => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<InterviewMetrics>(emptyInterviewMetrics);
  const [timeRemaining, setTimeRemaining] = useState(Math.ceil(analysisDuration / 1000));
  
  const analysisData = useRef<AnalysisData>({
    emotionCounts: {},
    totalFrames: 0,
    faceDetectionCounts: 0,
    smileDetectionCounts: 0,
    neutralDetectionCounts: 0,
    eyeContactFrames: 0
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetAnalysisData = () => {
    analysisData.current = {
      emotionCounts: {},
      totalFrames: 0,
      faceDetectionCounts: 0,
      smileDetectionCounts: 0,
      neutralDetectionCounts: 0,
      eyeContactFrames: 0
    };
  };

  const calculateMetrics = (): InterviewMetrics => {
    const data = analysisData.current;
    
    if (data.totalFrames === 0) {
      return {
        ...emptyInterviewMetrics,
        feedback: "No face detected during analysis. Please try again with better lighting."
      };
    }
    
    const faceDetectionRate = data.faceDetectionCounts / data.totalFrames;
    
    const smileRate = data.smileDetectionCounts / data.totalFrames;
    const neutralRate = data.neutralDetectionCounts / data.totalFrames;
    
    const eyeContactScore = Math.min(100, Math.round(faceDetectionRate * 100));
    
    const expressionBalance = 0.7 * smileRate + 0.3 * neutralRate;
    const facialExpressionScore = Math.min(100, Math.round(expressionBalance * 120));
    
    const confidenceScore = Math.min(100, Math.round((faceDetectionRate * 0.7 + smileRate * 0.3) * 110));
    
    const overallScore = Math.round(
      (eyeContactScore * 0.3) + 
      (facialExpressionScore * 0.4) + 
      (confidenceScore * 0.3)
    );
    
    const isPrepared = overallScore >= 70;
    
    let feedback = "";
    if (overallScore >= 85) {
      feedback = "Excellent! You appear very well-prepared for your interview.";
    } else if (overallScore >= 70) {
      feedback = "Good job! You seem prepared, but there's room for improvement.";
    } else if (overallScore >= 50) {
      feedback = "You need some more practice. Try to maintain better eye contact and show more confidence.";
    } else {
      feedback = "More preparation needed. Work on maintaining eye contact and showing appropriate facial expressions.";
    }
    
    if (eyeContactScore < 60) {
      feedback += " Try to maintain more consistent eye contact.";
    }
    if (facialExpressionScore < 60) {
      feedback += " Your facial expressions could be more engaging - smile naturally when appropriate.";
    }
    if (confidenceScore < 60) {
      feedback += " Work on appearing more confident during the interview.";
    }
    
    return {
      eyeContact: eyeContactScore,
      facialExpression: facialExpressionScore,
      confidence: confidenceScore,
      overallScore,
      feedback,
      isPrepared
    };
  };

  const analyzeFrame = async () => {
    if (!videoRef.current || !isAnalyzing) return;
    
    try {
      analysisData.current.totalFrames++;
      
      const faceDetection = await detectFace(videoRef.current);
      const emotionResult = await detectEmotion(videoRef.current);
      
      if (faceDetection) {
        analysisData.current.faceDetectionCounts++;
        
        if (faceDetection.landmarks && 
            faceDetection.landmarks.getLeftEye() && 
            faceDetection.landmarks.getRightEye()) {
          analysisData.current.eyeContactFrames++;
        }
      }
      
      if (emotionResult) {
        const { emotion } = emotionResult;
        analysisData.current.emotionCounts[emotion] = 
          (analysisData.current.emotionCounts[emotion] || 0) + 1;
        
        if (emotion === 'happy') {
          analysisData.current.smileDetectionCounts++;
        } else if (emotion === 'neutral') {
          analysisData.current.neutralDetectionCounts++;
        }
      }
    } catch (error) {
      console.error('Error analyzing frame:', error);
    }
  };

  const startAnalysis = () => {
    if (isAnalyzing) return;
    
    if (!videoRef.current) {
      toast.error("Camera not ready. Please try again.");
      return;
    }
    
    resetAnalysisData();
    setMetrics(emptyInterviewMetrics);
    setTimeRemaining(Math.ceil(analysisDuration / 1000));
    
    setIsAnalyzing(true);
    startTimeRef.current = Date.now();
    
    toast.info(`Interview analysis started. Please look at the camera for ${Math.ceil(analysisDuration / 1000)} seconds.`);
    
    analysisIntervalRef.current = window.setInterval(analyzeFrame, 200);
    
    countdownIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, Math.ceil((analysisDuration - elapsed) / 1000));
        
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          completeAnalysis();
        }
      }
    }, 300);
    
    timerRef.current = setTimeout(() => {
      completeAnalysis();
    }, analysisDuration + 500);
  };

  const completeAnalysis = () => {
    if (!isAnalyzing) return;
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    const finalMetrics = calculateMetrics();
    
    const validatedMetrics = finalMetrics.overallScore === 0 ? {
      eyeContact: 20,
      facialExpression: 30,
      confidence: 25,
      overallScore: 25,
      feedback: "Limited facial data was captured. Try again with better lighting and position your face clearly in the camera.",
      isPrepared: false
    } : finalMetrics;
    
    setMetrics(validatedMetrics);
    setTimeRemaining(0);
    setIsAnalyzing(false);
    
    if (onAnalysisComplete) {
      setTimeout(() => {
        onAnalysisComplete(validatedMetrics);
      }, 500);
    }
    
    toast.success("Interview analysis complete!");
    
    console.log("Analysis complete with metrics:", validatedMetrics);
  };

  const resetAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    setIsAnalyzing(false);
    setMetrics(emptyInterviewMetrics);
    setTimeRemaining(Math.ceil(analysisDuration / 1000));
    resetAnalysisData();
    startTimeRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return {
    isAnalyzing,
    metrics,
    timeRemaining,
    startAnalysis,
    resetAnalysis
  };
};
