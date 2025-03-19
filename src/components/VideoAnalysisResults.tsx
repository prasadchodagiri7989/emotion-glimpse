
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewMetrics } from '@/lib/faceDetection';
import { Smile, Eye, ThumbsUp, Clock } from 'lucide-react';

interface VideoAnalysisResultsProps {
  isAnalyzing: boolean;
  metrics: InterviewMetrics;
  timeRemaining: number;
}

const VideoAnalysisResults: React.FC<VideoAnalysisResultsProps> = ({
  isAnalyzing,
  metrics,
  timeRemaining
}) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const [progressValue, setProgressValue] = useState(100);
  
  // Update the displayed time and progress when timeRemaining changes
  useEffect(() => {
    setDisplayTime(timeRemaining);
    setProgressValue((timeRemaining / 10) * 100);
  }, [timeRemaining]);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto glass rounded-2xl animate-scale-in">
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">
            {isAnalyzing ? 'Analyzing Your Performance...' : 'Performance Analysis'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-blue-800">
                  {displayTime}
                </span>
              </div>
              <p className="text-center text-gray-600 mt-4 animate-pulse">
                Please look at the camera naturally...
              </p>
              <div className="w-full mt-4">
                <Progress 
                  value={progressValue} 
                  className="h-1.5" 
                  indicatorClassName="bg-blue-600 transition-all ease-linear duration-300" 
                />
              </div>
            </div>
          ) : metrics.overallScore > 0 ? (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Eye Contact</span>
                  </div>
                  <span className={`font-semibold ${getScoreColor(metrics.eyeContact)}`}>
                    {metrics.eyeContact}/100
                  </span>
                </div>
                <Progress value={metrics.eyeContact} className="h-2" indicatorClassName={getProgressColor(metrics.eyeContact)} />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-medium">Facial Expression</span>
                  </div>
                  <span className={`font-semibold ${getScoreColor(metrics.facialExpression)}`}>
                    {metrics.facialExpression}/100
                  </span>
                </div>
                <Progress value={metrics.facialExpression} className="h-2" indicatorClassName={getProgressColor(metrics.facialExpression)} />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Confidence</span>
                  </div>
                  <span className={`font-semibold ${getScoreColor(metrics.confidence)}`}>
                    {metrics.confidence}/100
                  </span>
                </div>
                <Progress value={metrics.confidence} className="h-2" indicatorClassName={getProgressColor(metrics.confidence)} />
              </div>
              
              <div className="pt-2 pb-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`font-bold text-lg ${getScoreColor(metrics.overallScore)}`}>
                    {metrics.overallScore}/100
                  </span>
                </div>
                <Progress value={metrics.overallScore} className="h-3" indicatorClassName={getProgressColor(metrics.overallScore)} />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h4 className="font-medium mb-2">Feedback</h4>
                <p className="text-sm text-gray-700">
                  {metrics.feedback}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-center text-gray-600 max-w-sm">
                Start the analysis to evaluate your interview performance. We'll analyze your facial expressions, 
                eye contact, and confidence during a 10-second scenario.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoAnalysisResults;
