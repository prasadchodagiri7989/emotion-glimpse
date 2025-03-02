
import React from 'react';
import { Music, Frown, AlertTriangle, Sparkles, Cloud, X, Meh } from 'lucide-react';

type AudioEmotion = 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral';

interface AudioEmotionResult {
  emotion: AudioEmotion;
  probability: number;
}

interface AudioEmotionDisplayProps {
  emotionResult: AudioEmotionResult;
}

const AudioEmotionDisplay: React.FC<AudioEmotionDisplayProps> = ({ emotionResult }) => {
  const { emotion, probability } = emotionResult;
  const percentage = Math.round(probability * 100);
  
  const emotionConfig: Record<AudioEmotion, {
    color: string,
    bgColor: string,
    icon: React.ReactNode,
    label: string,
    description: string
  }> = {
    happy: {
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      icon: <Music className="w-8 h-8 text-amber-500" />,
      label: 'Happy',
      description: 'Your voice sounds cheerful and upbeat'
    },
    sad: {
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: <Frown className="w-8 h-8 text-blue-500" />,
      label: 'Sad',
      description: 'Your voice has melancholic tones'
    },
    angry: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      label: 'Angry',
      description: 'Your voice shows signs of frustration'
    },
    surprised: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: <Sparkles className="w-8 h-8 text-green-500" />,
      label: 'Surprised',
      description: 'Your voice indicates astonishment'
    },
    fearful: {
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: <Cloud className="w-8 h-8 text-purple-500" />,
      label: 'Fearful',
      description: 'Your voice shows signs of anxiety'
    },
    disgusted: {
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      icon: <X className="w-8 h-8 text-green-700" />,
      label: 'Disgusted',
      description: 'Your voice indicates aversion'
    },
    neutral: {
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: <Meh className="w-8 h-8 text-gray-500" />,
      label: 'Neutral',
      description: 'Your voice shows balanced emotional state'
    }
  };

  const config = emotionConfig[emotion];

  return (
    <div className={`w-full max-w-lg mx-auto glass rounded-2xl p-8 animate-scale-in ${config.bgColor} bg-opacity-30`}>
      <div className="flex flex-col items-center text-center">
        <div className="p-4 bg-white/50 rounded-full mb-4 shadow-sm">
          {config.icon}
        </div>
        <p className="text-xs mb-2">
          <span className="emotion-chip bg-white/70">
            {percentage}% confidence
          </span>
        </p>
        <h2 className={`text-xl font-medium mb-2 ${config.color}`}>{config.label}</h2>
        <p className="text-sm text-muted-foreground">
          {config.description}
        </p>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Confidence Level</span>
          <span className={config.color}>{percentage}%</span>
        </div>
        <div className="mt-2 w-full bg-white/30 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${config.color.replace('text-', 'bg-')}`}
            style={{ 
              width: `${percentage}%`,
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioEmotionDisplay;
