
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import TextEmotionDisplay from '@/components/TextEmotionDisplay';

type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'neutral';

interface EmotionResult {
  emotion: Emotion;
  probability: number;
}

const TextEmotion: React.FC = () => {
  const [message, setMessage] = useState('');
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const detectEmotion = async () => {
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // In a real application, you would call an API for text emotion analysis
      // This is a simplified simulation for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple rule-based emotion detection (just for demo)
      const happyWords = ['happy', 'joy', 'excited', 'great', 'love', 'smile', 'wonderful', 'amazing'];
      const sadWords = ['sad', 'unhappy', 'depressed', 'upset', 'disappointed', 'sorry', 'miss', 'regret'];
      const angryWords = ['angry', 'mad', 'furious', 'upset', 'annoyed', 'irritated', 'hate', 'frustrated'];
      const fearfulWords = ['scared', 'afraid', 'terrified', 'worried', 'anxious', 'nervous', 'panic', 'fear'];
      const surprisedWords = ['surprised', 'shocked', 'wow', 'unexpected', 'amazing', 'unbelievable', 'omg', 'astonished'];
      const disgustedWords = ['disgusted', 'gross', 'yuck', 'eww', 'awful', 'nasty', 'terrible', 'horrible'];
      
      const messageWords = message.toLowerCase().split(/\s+/);
      
      const emotionScores = {
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        surprised: 0,
        disgusted: 0,
        neutral: 0.2 // baseline
      };
      
      messageWords.forEach(word => {
        if (happyWords.some(hw => word.includes(hw))) emotionScores.happy += 0.25;
        if (sadWords.some(sw => word.includes(sw))) emotionScores.sad += 0.25;
        if (angryWords.some(aw => word.includes(aw))) emotionScores.angry += 0.25;
        if (fearfulWords.some(fw => word.includes(fw))) emotionScores.fearful += 0.25;
        if (surprisedWords.some(sw => word.includes(sw))) emotionScores.surprised += 0.25;
        if (disgustedWords.some(dw => word.includes(dw))) emotionScores.disgusted += 0.25;
      });
      
      let maxEmotion: Emotion = 'neutral';
      let maxScore = emotionScores.neutral;
      
      Object.entries(emotionScores).forEach(([emotion, score]) => {
        if (score > maxScore) {
          maxScore = score;
          maxEmotion = emotion as Emotion;
        }
      });
      
      // If all scores are low, default to neutral
      if (maxScore <= 0.2) {
        maxEmotion = 'neutral';
        maxScore = 0.8;
      }
      
      // Cap probability at 0.95
      const probability = Math.min(maxScore, 0.95);
      
      setEmotionResult({
        emotion: maxEmotion,
        probability: probability
      });
      
      toast({
        title: "Analysis complete",
        description: `Text analyzed successfully`,
      });
    } catch (error) {
      console.error('Error detecting emotion:', error);
      toast({
        title: "Error",
        description: "Failed to analyze text emotion",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Text Emotion Detection</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enter a message and our system will analyze the emotional tone behind your words.
          </p>
        </div>

        <div className="glass p-6 rounded-xl mb-8 animate-fade-up animation-delay-100">
          <div className="mb-4">
            <Textarea
              placeholder="Type your message here..."
              className="min-h-32 text-base"
              value={message}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={detectEmotion}
              disabled={isAnalyzing}
              className="relative overflow-hidden group"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-pulse">Analyzing...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Analyze Emotion
                </>
              )}
            </Button>
          </div>
        </div>

        <TextEmotionDisplay emotionResult={emotionResult} />
      </div>
    </Layout>
  );
};

export default TextEmotion;
