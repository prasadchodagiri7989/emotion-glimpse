
import React from 'react';
import { cn } from '@/lib/utils';

export interface ScoreMetric {
  name: string;
  score: number;
  description: string;
}

interface ScoreCardProps {
  metric: ScoreMetric;
  index: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ metric, index }) => {
  const { name, score, description } = metric;
  
  // Convert score (0-100) to color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-emerald-50';
    if (score >= 60) return 'bg-blue-50';
    if (score >= 40) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-all",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={cn("rounded-full h-12 w-12 flex items-center justify-center font-semibold", getScoreBackground(score))}>
          <span className={cn("text-lg", getScoreColor(score))}>{score}</span>
        </div>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out")}
          style={{ 
            width: `${score}%`, 
            backgroundColor: score >= 80 ? '#059669' : 
                           score >= 60 ? '#3b82f6' : 
                           score >= 40 ? '#f59e0b' : 
                           '#ef4444' 
          }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreCard;
