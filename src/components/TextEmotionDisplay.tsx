
import React from 'react';
import { 
  Smile, 
  Frown, 
  AlertTriangle, 
  Sparkles, 
  Cloud, 
  X, 
  Meh, 
  MessageCircle 
} from 'lucide-react';

type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';

interface EmotionResult {
  emotion: Emotion;
  probability: number;
}

interface TextEmotionDisplayProps {
  emotionResult: EmotionResult | null;
}

const TextEmotionDisplay: React.FC<TextEmotionDisplayProps> = ({ emotionResult }) => {
  if (!emotionResult) {
    return (
      <div className="w-full max-w-lg mx-auto glass rounded-2xl p-8 animate-blur-in">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-secondary rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium mb-2">No text analyzed yet</h2>
          <p className="text-sm text-muted-foreground">
            Enter a message and click "Analyze Emotion" to get started
          </p>
        </div>
      </div>
    );
  }

  const { emotion, probability } = emotionResult;
  const percentage = Math.round(probability * 100);
  
  const emotionConfig: Record<Emotion, {
    color: string,
    bgColor: string,
    icon: React.ReactNode,
    label: string,
    description: string,
    examples: string
  }> = {
    happy: {
      color: 'text-amber-600',
      bgColor: 'bg-emotion-happy/10',
      icon: <Smile className="w-8 h-8 text-emotion-happy" />,
      label: 'Happy',
      description: 'Your message conveys positivity and joy.',
      examples: 'Words like: happy, joy, love, great, excellent'
    },
    sad: {
      color: 'text-blue-600',
      bgColor: 'bg-emotion-sad/10',
      icon: <Frown className="w-8 h-8 text-emotion-sad" />,
      label: 'Sad',
      description: 'Your message expresses sadness or disappointment.',
      examples: 'Words like: sad, upset, miss, regret, sorry'
    },
    angry: {
      color: 'text-red-600',
      bgColor: 'bg-emotion-angry/10',
      icon: <AlertTriangle className="w-8 h-8 text-emotion-angry" />,
      label: 'Angry',
      description: 'Your message shows frustration or anger.',
      examples: 'Words like: angry, mad, hate, frustrated, annoyed'
    },
    surprised: {
      color: 'text-green-600',
      bgColor: 'bg-emotion-surprised/10',
      icon: <Sparkles className="w-8 h-8 text-emotion-surprised" />,
      label: 'Surprised',
      description: 'Your message expresses astonishment or surprise.',
      examples: 'Words like: wow, shocked, surprised, unexpected, omg'
    },
    fearful: {
      color: 'text-purple-600',
      bgColor: 'bg-emotion-fearful/10',
      icon: <Cloud className="w-8 h-8 text-emotion-fearful" />,
      label: 'Fearful',
      description: 'Your message indicates worry or anxiety.',
      examples: 'Words like: afraid, worried, scared, anxious, nervous'
    },
    disgusted: {
      color: 'text-green-700',
      bgColor: 'bg-emotion-disgusted/10',
      icon: <X className="w-8 h-8 text-emotion-disgusted" />,
      label: 'Disgusted',
      description: 'Your message shows disgust or strong dislike.',
      examples: 'Words like: gross, yuck, awful, terrible, disgusting'
    },
    neutral: {
      color: 'text-gray-600',
      bgColor: 'bg-emotion-neutral/10',
      icon: <Meh className="w-8 h-8 text-emotion-neutral" />,
      label: 'Neutral',
      description: 'Your message seems balanced or factual.',
      examples: 'Everyday language without strong emotional words'
    }
  };

  const config = emotionConfig[emotion];

  return (
    <div className={`w-full max-w-lg mx-auto glass rounded-2xl p-8 animate-scale-in ${config.bgColor}`}>
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
        <p className="text-sm text-muted-foreground mb-6">
          {config.description}
        </p>
        
        <div className="w-full p-4 bg-white/20 rounded-lg text-sm">
          <p className="text-xs text-muted-foreground mb-2">Common indicators:</p>
          <p>{config.examples}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Emotion Intensity</span>
          <span className={config.color}>{percentage}%</span>
        </div>
        <div className="mt-2 w-full bg-white/30 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out`}
            style={{ 
              width: `${percentage}%`,
              backgroundColor: `var(--emotion-${emotion})`,
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextEmotionDisplay;
