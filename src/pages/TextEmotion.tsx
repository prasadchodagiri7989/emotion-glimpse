
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
      
      // Enhanced emotion detection with more words and better scoring
      const happyWords = ['happy', 'joy', 'excited', 'great', 'love', 'smile', 'wonderful', 'amazing', 'glad', 'pleased', 
                         'delighted', 'thrilled', 'cheerful', 'content', 'satisfied', 'celebrate', 'enjoy', 'laughter', 'positive'];
      
      const sadWords = ['sad', 'unhappy', 'depressed', 'upset', 'disappointed', 'sorry', 'miss', 'regret', 'grief', 'heartbroken', 
                       'lonely', 'sorrow', 'miserable', 'gloomy', 'mourning', 'crying', 'tear', 'despair', 'hopeless'];
      
      const angryWords = ['angry', 'mad', 'furious', 'upset', 'annoyed', 'irritated', 'hate', 'frustrated', 'rage', 'outraged', 
                         'hostile', 'bitter', 'enraged', 'infuriated', 'threatening', 'offended', 'resent', 'livid', 'fuming'];
      
      const fearfulWords = ['scared', 'afraid', 'terrified', 'worried', 'anxious', 'nervous', 'panic', 'fear', 'dread', 'frightened', 
                           'horrified', 'alarmed', 'stressed', 'concern', 'uneasy', 'troubled', 'threatened', 'vulnerable', 'petrified'];
      
      const surprisedWords = ['surprised', 'shocked', 'wow', 'unexpected', 'amazing', 'unbelievable', 'omg', 'astonished', 'stunned', 
                             'startled', 'astounded', 'speechless', 'wonder', 'disbelief', 'awe', 'incredible', 'sudden', 'gasp', 'bewildered'];
      
      const disgustedWords = ['disgusted', 'gross', 'yuck', 'eww', 'awful', 'nasty', 'terrible', 'horrible', 'revolting', 'sickening', 
                             'repulsive', 'distasteful', 'offensive', 'appalling', 'loathsome', 'repugnant', 'hideous', 'foul', 'nauseating'];
      
      // More sophisticated text analysis - check for phrases and context
      const messageWords = message.toLowerCase().split(/\s+/);
      const fullMessageLower = message.toLowerCase();
      
      const emotionScores = {
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        surprised: 0,
        disgusted: 0,
        neutral: 0.1 // lower baseline
      };
      
      // Check individual words
      messageWords.forEach(word => {
        // Make sure to match entire words or word segments
        if (happyWords.some(hw => word.includes(hw))) emotionScores.happy += 0.2;
        if (sadWords.some(sw => word.includes(sw))) emotionScores.sad += 0.2;
        if (angryWords.some(aw => word.includes(aw))) emotionScores.angry += 0.2;
        if (fearfulWords.some(fw => word.includes(fw))) emotionScores.fearful += 0.2;
        if (surprisedWords.some(sw => word.includes(sw))) emotionScores.surprised += 0.2;
        if (disgustedWords.some(dw => word.includes(dw))) emotionScores.disgusted += 0.2;
      });
      
      // Check for phrases and patterns
      if (fullMessageLower.includes('i am happy') || fullMessageLower.includes('i feel good') || 
          fullMessageLower.includes('i love') || fullMessageLower.includes('thank you')) {
        emotionScores.happy += 0.4;
      }
      
      if (fullMessageLower.includes('i am sad') || fullMessageLower.includes('i feel bad') || 
          fullMessageLower.includes('i miss') || fullMessageLower.includes('i regret')) {
        emotionScores.sad += 0.4;
      }
      
      if (fullMessageLower.includes('i am angry') || fullMessageLower.includes('makes me mad') || 
          fullMessageLower.includes('i hate') || fullMessageLower.includes('so frustrated')) {
        emotionScores.angry += 0.4;
      }
      
      if (fullMessageLower.includes('i am scared') || fullMessageLower.includes('i am afraid') || 
          fullMessageLower.includes('i worry') || fullMessageLower.includes('i am anxious')) {
        emotionScores.fearful += 0.4;
      }
      
      if (fullMessageLower.includes('i am surprised') || fullMessageLower.includes('wow that') || 
          fullMessageLower.includes('i did not expect') || fullMessageLower.includes('i can\'t believe')) {
        emotionScores.surprised += 0.4;
      }
      
      if (fullMessageLower.includes('i am disgusted') || fullMessageLower.includes('makes me sick') || 
          fullMessageLower.includes('that\'s gross') || fullMessageLower.includes('so disgusting')) {
        emotionScores.disgusted += 0.4;
      }
      
      // Check for exclamation marks as intensity indicators
      const exclamationCount = (message.match(/!/g) || []).length;
      if (exclamationCount > 0) {
        // Boost the highest non-neutral emotion
        const highestEmotion = Object.entries(emotionScores)
          .filter(([emotion]) => emotion !== 'neutral')
          .sort(([, a], [, b]) => b - a)[0];
        
        if (highestEmotion && highestEmotion[1] > 0) {
          emotionScores[highestEmotion[0] as Emotion] += Math.min(exclamationCount * 0.1, 0.3);
        }
      }
      
      // Check for question marks to potentially boost surprise
      const questionCount = (message.match(/\?/g) || []).length;
      if (questionCount > 0) {
        emotionScores.surprised += Math.min(questionCount * 0.1, 0.2);
      }
      
      // If there's no clear emotion detected, boost neutral significantly less
      const maxNonNeutralScore = Math.max(
        emotionScores.happy, 
        emotionScores.sad, 
        emotionScores.angry, 
        emotionScores.fearful, 
        emotionScores.surprised, 
        emotionScores.disgusted
      );
      
      if (maxNonNeutralScore <= 0.2) {
        emotionScores.neutral = 0.3; // only slightly stronger than before
      } else {
        emotionScores.neutral = 0.05; // much weaker when other emotions are present
      }
      
      let maxEmotion: Emotion = 'neutral';
      let maxScore = emotionScores.neutral;
      
      Object.entries(emotionScores).forEach(([emotion, score]) => {
        if (score > maxScore) {
          maxScore = score;
          maxEmotion = emotion as Emotion;
        }
      });
      
      // Normalize the probability to a sensible range
      const rawProbability = maxScore;
      // Map to a reasonable probability range (never below 0.6 or above 0.95)
      const normalizedProbability = 0.6 + (Math.min(rawProbability, 1) * 0.35);
      
      setEmotionResult({
        emotion: maxEmotion,
        probability: normalizedProbability
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
