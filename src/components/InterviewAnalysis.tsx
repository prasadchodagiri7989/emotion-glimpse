
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewMetrics } from '@/lib/faceDetection';
import { Smile, Eye, ThumbsUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InterviewAnalysisProps {
  isAnalyzing: boolean;
  metrics: InterviewMetrics;
  timeRemaining: number;
  onStartAnalysis: () => void;
  onResetAnalysis: () => void;
}

const InterviewAnalysis: React.FC<InterviewAnalysisProps> = ({
  isAnalyzing,
  metrics,
  timeRemaining,
  onStartAnalysis,
  onResetAnalysis
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
    <div className="w-full max-w-2xl mx-auto glass rounded-2xl animate-scale-in mt-6">
      <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            {metrics.overallScore > 0 ? (
              <>{metrics.isPrepared ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-yellow-600" />}</>
            ) : (
              <></>
            )}
            Interview Readiness Analysis
          </CardTitle>
          <CardDescription>
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-amber-600 font-medium">
                <Clock className="h-4 w-4 animate-pulse" />
                Analyzing... {displayTime} seconds remaining
              </div>
            ) : metrics.overallScore > 0 ? (
              <div className="font-medium">
                {metrics.isPrepared ? 
                  "You appear prepared for your interview!" : 
                  "You may need more preparation for your interview."}
              </div>
            ) : (
              "Start the analysis to see your interview readiness score"
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          {metrics.overallScore > 0 && (
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
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <h4 className="font-medium">Feedback</h4>
                </div>
                <p className="text-sm text-gray-700">
                  {metrics.feedback}
                </p>
              </div>
            </>
          )}
          
          {metrics.overallScore === 0 && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-center text-gray-600 max-w-sm">
                Start the analysis to evaluate your interview readiness. We'll analyze your facial expressions, 
                eye contact, and confidence during a 10-second mock interview scenario.
              </p>
            </div>
          )}
          
          {isAnalyzing && (
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
                Please look at the camera naturally, as if in an interview...
              </p>
              {/* Update timer progress bar to use progressValue */}
              <div className="w-full mt-4">
                <Progress 
                  value={progressValue} 
                  className="h-1.5" 
                  indicatorClassName="bg-blue-600 transition-all ease-linear duration-300" 
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4 pt-2">
          {isAnalyzing ? (
            <Button 
              variant="outline" 
              onClick={onResetAnalysis}
              className="bg-white">
              Cancel
            </Button>
          ) : (
            <>
              <Button 
                onClick={onStartAnalysis}
                className="px-6"
                disabled={isAnalyzing}
                variant={metrics.overallScore > 0 ? "outline" : "default"}>
                {metrics.overallScore > 0 ? "Analyze Again" : "Start Analysis"}
              </Button>
              
              {metrics.overallScore > 0 && (
                <Button 
                  onClick={onResetAnalysis}
                  variant="ghost"
                  className="bg-white/50">
                  Reset
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default InterviewAnalysis;
