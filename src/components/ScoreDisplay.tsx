
import React from 'react';
import { Award, Download, Share2 } from 'lucide-react';
import ScoreCard, { ScoreMetric } from './ScoreCard';
import { cn } from '@/lib/utils';
import { generatePdfReport } from '@/utils/scoreUtils';
import { useToast } from '@/hooks/use-toast';

interface ScoreDisplayProps {
  overallScore: number;
  metrics: ScoreMetric[];
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ overallScore, metrics }) => {
  const { toast } = useToast();
  
  // Get grade based on score
  const getGrade = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Above Average';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    return 'Needs Improvement';
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-emerald-600';
    if (score >= 60) return 'from-blue-400 to-blue-600';
    if (score >= 40) return 'from-amber-400 to-amber-600';
    return 'from-rose-400 to-rose-600';
  };

  const handleDownloadReport = async () => {
    toast({
      title: "Generating PDF",
      description: "Preparing your interview report...",
    });
    
    try {
      const pdfBlob = await generatePdfReport(overallScore, metrics);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `interview-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Report Downloaded",
        description: "Your interview performance report has been saved",
        variant: "success",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Overall Score Section */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-border mb-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative mb-6 md:mb-0 md:mr-8">
            <div className="h-36 w-36 rounded-full border-4 border-background flex items-center justify-center bg-gradient-to-b bg-opacity-15 shadow-inner">
              <div className={cn("h-28 w-28 rounded-full bg-gradient-to-br", getScoreColor(overallScore), "flex items-center justify-center text-white")}>
                <div className="text-center">
                  <div className="text-4xl font-bold">{overallScore}</div>
                  <div className="text-xs opacity-80">SCORE</div>
                </div>
              </div>
            </div>
            <Award className="absolute bottom-0 right-0 h-10 w-10 text-primary bg-white rounded-full p-1 shadow-md" />
          </div>
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-xs font-medium text-accent-foreground mb-2">
              Interview Performance
            </div>
            <h2 className="text-3xl font-bold mb-2">{getGrade(overallScore)}</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              Based on our analysis, your interview performance is rated {getGrade(overallScore).toLowerCase()}. 
              We've evaluated your body language, eye contact, and confidence levels.
            </p>
            
            <div className="flex space-x-3">
              <button 
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={handleDownloadReport}
              >
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <ScoreCard key={metric.name} metric={metric} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ScoreDisplay;
