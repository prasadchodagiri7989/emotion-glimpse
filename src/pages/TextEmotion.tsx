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
      // This is a sophisticated simulation for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ENHANCED EMOTION DETECTION with expanded vocabulary and sentiment analysis
      const happyWords = [
        'happy', 'joy', 'excited', 'great', 'love', 'smile', 'wonderful', 'amazing', 'glad', 'pleased', 
        'delighted', 'thrilled', 'cheerful', 'content', 'satisfied', 'celebrate', 'enjoy', 'laughter', 'positive',
        'fantastic', 'excellent', 'ecstatic', 'elated', 'jubilant', 'bliss', 'overjoyed', 'triumph', 'optimistic',
        'proud', 'blessed', 'grateful', 'thankful', 'relief', 'comfortable', 'pleasant', 'hopeful', 'enthusiastic',
        'looking forward', 'congratulations', 'win', 'success', 'achievement', 'gorgeous', 'beautiful', 'perfect'
      ];
      
      const sadWords = [
        'sad', 'unhappy', 'depressed', 'upset', 'disappointed', 'sorry', 'miss', 'regret', 'grief', 'heartbroken', 
        'lonely', 'sorrow', 'miserable', 'gloomy', 'mourning', 'crying', 'tear', 'despair', 'hopeless',
        'melancholy', 'down', 'blue', 'heartache', 'devastated', 'hurt', 'pain', 'suffer', 'agony', 'anguish',
        'broken', 'crushed', 'tragic', 'unfortunate', 'disheartened', 'depressing', 'dreary', 'somber', 'low',
        'heavyhearted', 'hurt', 'painful', 'unbearable', 'lost', 'alone', 'abandoned', 'rejected', 'failure'
      ];
      
      const angryWords = [
        'angry', 'mad', 'furious', 'upset', 'annoyed', 'irritated', 'hate', 'frustrated', 'rage', 'outraged', 
        'hostile', 'bitter', 'enraged', 'infuriated', 'threatening', 'offended', 'resent', 'livid', 'fuming',
        'seething', 'irate', 'indignant', 'provoked', 'exasperated', 'agitated', 'vexed', 'displeased', 'cross',
        'sullen', 'violent', 'fierce', 'aggressive', 'outburst', 'unfair', 'injustice', 'betrayed', 'revenge',
        'damn', 'hell', 'screw', 'idiot', 'stupid', 'dumb', 'moron', 'ridiculous', 'absurd', 'unbelievable'
      ];
      
      const fearfulWords = [
        'scared', 'afraid', 'terrified', 'worried', 'anxious', 'nervous', 'panic', 'fear', 'dread', 'frightened', 
        'horrified', 'alarmed', 'stressed', 'concern', 'uneasy', 'troubled', 'threatened', 'vulnerable', 'petrified',
        'apprehensive', 'tense', 'restless', 'paranoid', 'horror', 'terror', 'phobia', 'doubt', 'hesitant',
        'suspicious', 'wary', 'intimidated', 'risk', 'danger', 'hazard', 'unsafe', 'insecure', 'fright', 'scare',
        'nightmare', 'desperate', 'haunted', 'trauma', 'victim', 'helpless', 'powerless', 'overwhelmed'
      ];
      
      const surprisedWords = [
        'surprised', 'shocked', 'wow', 'unexpected', 'amazing', 'unbelievable', 'omg', 'astonished', 'stunned', 
        'startled', 'astounded', 'speechless', 'wonder', 'disbelief', 'awe', 'incredible', 'sudden', 'gasp', 'bewildered',
        'flabbergasted', 'dumbfounded', 'mind-blown', 'jaw-dropping', 'extraordinary', 'remarkable', 'staggering',
        'unforeseen', 'bombshell', 'revelation', 'twist', 'unpredictable', 'astonishing', 'miraculous', 'phenomenon',
        'marvel', 'wonder', 'impressive', 'striking', 'unusual', 'strange', 'bizarre', 'peculiar', 'odd'
      ];
      
      const disgustedWords = [
        'disgusted', 'gross', 'yuck', 'eww', 'awful', 'nasty', 'terrible', 'horrible', 'revolting', 'sickening', 
        'repulsive', 'distasteful', 'offensive', 'appalling', 'loathsome', 'repugnant', 'hideous', 'foul', 'nauseating',
        'despicable', 'vile', 'obnoxious', 'abhorrent', 'detestable', 'abominable', 'odious', 'obscene', 'creepy',
        'inappropriate', 'vulgar', 'crude', 'unpleasant', 'disagreeable', 'objectionable', 'sick', 'queasy', 'retch',
        'tasteless', 'unsavory', 'unwholesome', 'distasteful', 'deplorable', 'shameful', 'vomit', 'puke'
      ];
      
      // Sophisticated text analysis with deeper context understanding
      const messageWords = message.toLowerCase().split(/\s+/);
      const fullMessageLower = message.toLowerCase();
      
      const emotionScores = {
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        surprised: 0,
        disgusted: 0,
        neutral: 0.05 // lower baseline to reduce neutral bias
      };
      
      // Intensity modifiers - amplify emotions when detected with these words
      const intensifiers = ['very', 'extremely', 'incredibly', 'really', 'so', 'totally', 'absolutely', 'completely', 'utterly', 'deeply', 'profoundly', 'thoroughly', 'entirely', 'immensely', 'tremendously'];
      const negators = ['not', 'don\'t', 'doesn\'t', 'didn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t', 'won\'t', 'wouldn\'t', 'can\'t', 'cannot', 'couldn\'t', 'no', 'never'];
      
      // Check for intensifiers and track their positions
      const intensifierPositions: number[] = [];
      messageWords.forEach((word, index) => {
        if (intensifiers.includes(word)) {
          intensifierPositions.push(index);
        }
      });
      
      // Check for negators and track their positions
      const negatorPositions: number[] = [];
      messageWords.forEach((word, index) => {
        if (negators.includes(word)) {
          negatorPositions.push(index);
        }
      });
      
      // Check individual words with context awareness
      messageWords.forEach((word, index) => {
        let wordScore = 0.25; // Base score for a matched word
        
        // Check if word is near an intensifier (within 2 words)
        const isIntensified = intensifierPositions.some(pos => Math.abs(index - pos) <= 2 && index > pos);
        if (isIntensified) {
          wordScore = 0.4; // Boost the score for intensified words
        }
        
        // Check if word is negated (within 3 words after a negator)
        const isNegated = negatorPositions.some(pos => index - pos >= 0 && index - pos <= 3);
        
        // Apply word matching with contextual awareness
        if (happyWords.some(hw => word.includes(hw))) {
          if (isNegated) {
            emotionScores.sad += wordScore * 0.8; // Negated happiness often indicates sadness
          } else {
            emotionScores.happy += wordScore;
          }
        }
        
        if (sadWords.some(sw => word.includes(sw))) {
          if (isNegated) {
            emotionScores.happy += wordScore * 0.5; // Negated sadness might indicate mild happiness
          } else {
            emotionScores.sad += wordScore;
          }
        }
        
        if (angryWords.some(aw => word.includes(aw))) {
          if (isNegated) {
            // Negated anger could mean different things based on context
            emotionScores.neutral += wordScore * 0.3;
          } else {
            emotionScores.angry += wordScore;
          }
        }
        
        if (fearfulWords.some(fw => word.includes(fw))) {
          if (isNegated) {
            emotionScores.neutral += wordScore * 0.3; // Negated fear often means reassurance
          } else {
            emotionScores.fearful += wordScore;
          }
        }
        
        if (surprisedWords.some(sw => word.includes(sw))) {
          // Surprise is less affected by negation
          emotionScores.surprised += wordScore;
        }
        
        if (disgustedWords.some(dw => word.includes(dw))) {
          if (isNegated) {
            emotionScores.neutral += wordScore * 0.3;
          } else {
            emotionScores.disgusted += wordScore;
          }
        }
      });
      
      // Advanced phrase detection for better context understanding
      
      // Happy phrases
      const happyPhrases = [
        'i am happy', 'i feel good', 'i love', 'thank you', 'made my day', 'feeling great',
        'looking forward to', 'can\'t wait', 'best day', 'good news', 'congratulations', 
        'proud of', 'well done', 'great job', 'excellent work', 'feels amazing', 'having fun',
        'enjoying myself', 'love this', 'so pleased', 'makes me smile', 'brightened my day',
        'happy to hear', 'happy to see', 'delighted', 'wonderful time', 'blessing'
      ];
      
      // Sad phrases
      const sadPhrases = [
        'i am sad', 'i feel bad', 'i miss', 'i regret', 'feel down', 'heart broken',
        'feeling blue', 'lost my', 'grieving', 'in pain', 'hurts me', 'miss you',
        'worst day', 'bad news', 'not okay', 'feel awful', 'so sad', 'depressed',
        'can\'t handle', 'too much to bear', 'wish i could', 'if only', 'hopeless',
        'given up', 'don\'t know what to do', 'falling apart', 'need someone'
      ];
      
      // Angry phrases
      const angryPhrases = [
        'i am angry', 'makes me mad', 'i hate', 'so frustrated', 'furious about',
        'can\'t stand', 'fed up with', 'sick of', 'tired of', 'irritated by',
        'drives me crazy', 'how dare', 'who do you think', 'that\'s ridiculous',
        'this is bullshit', 'what the hell', 'pisses me off', 'get on my nerves',
        'had enough', 'lost my patience', 'cannot believe', 'worst service',
        'will never', 'never again', 'absolutely unacceptable', 'waste of time'
      ];
      
      // Fearful phrases
      const fearfulPhrases = [
        'i am scared', 'i am afraid', 'i worry', 'i am anxious', 'terrified of',
        'concerned about', 'nervous about', 'what if', 'scared to death', 'frightened by',
        'fear for', 'panic attack', 'keeps me up at night', 'haunts me', 'nightmare',
        'can\'t stop thinking about', 'worried sick', 'don\'t feel safe', 'in danger',
        'something bad', 'afraid something will happen', 'freaking out', 'not prepared',
        'don\'t know how to', 'uncertain future', 'dread'
      ];
      
      // Surprised phrases
      const surprisedPhrases = [
        'i am surprised', 'wow that', 'i did not expect', 'i can\'t believe', 'shocked to',
        'never thought', 'out of nowhere', 'caught me off guard', 'no way', 'you\'re kidding',
        'are you serious', 'for real', 'unbelievable', 'shocking', 'plot twist',
        'surprised me', 'blew my mind', 'jaw dropped', 'couldn\'t believe my eyes',
        'who would have thought', 'that\'s crazy', 'unexpected turn', 'surprise surprise',
        'what a surprise', 'totally unexpected', 'never saw that coming'
      ];
      
      // Disgusted phrases
      const disgustedPhrases = [
        'i am disgusted', 'makes me sick', 'that\'s gross', 'so disgusting', 'revolting',
        'nasty', 'turns my stomach', 'can\'t look at', 'gross me out', 'repulsive',
        'nauseating', 'sickening', 'vomit', 'gag', 'eww', 'yuck', 'disgusting behavior',
        'unacceptable conduct', 'appalling', 'shameful', 'distasteful', 'how could anyone',
        'can\'t believe someone would', 'nothing more disgusting', 'makes me want to throw up'
      ];
      
      // Check for phrases with higher scoring impact
      const phraseLists = [
        { phrases: happyPhrases, emotion: 'happy', score: 0.5 },
        { phrases: sadPhrases, emotion: 'sad', score: 0.5 },
        { phrases: angryPhrases, emotion: 'angry', score: 0.5 },
        { phrases: fearfulPhrases, emotion: 'fearful', score: 0.5 },
        { phrases: surprisedPhrases, emotion: 'surprised', score: 0.5 },
        { phrases: disgustedPhrases, emotion: 'disgusted', score: 0.5 }
      ];
      
      phraseLists.forEach(({ phrases, emotion, score }) => {
        if (phrases.some(phrase => fullMessageLower.includes(phrase))) {
          emotionScores[emotion as Emotion] += score;
        }
      });
      
      // Check for punctuation intensity
      const exclamationCount = (message.match(/!/g) || []).length;
      const questionCount = (message.match(/\?/g) || []).length;
      const allCapsWordCount = message.split(/\s+/).filter(word => word.length > 1 && word === word.toUpperCase()).length;
      
      // Apply punctuation and formatting effects on emotions
      if (exclamationCount > 0) {
        // Find the two highest non-neutral emotions
        const sortedEmotions = Object.entries(emotionScores)
          .filter(([emotion]) => emotion !== 'neutral')
          .sort(([, a], [, b]) => b - a);
        
        if (sortedEmotions.length > 0) {
          // Boost the top emotions based on exclamation marks
          const boostAmount = Math.min(exclamationCount * 0.15, 0.45);
          emotionScores[sortedEmotions[0][0] as Emotion] += boostAmount;
          
          // Give a smaller boost to the second emotion if it exists
          if (sortedEmotions.length > 1 && sortedEmotions[1][1] > 0.2) {
            emotionScores[sortedEmotions[1][0] as Emotion] += boostAmount * 0.5;
          }
        }
      }
      
      // Question marks often indicate surprise, confusion, or fear
      if (questionCount > 0) {
        const questionBoost = Math.min(questionCount * 0.12, 0.36);
        emotionScores.surprised += questionBoost;
        
        // If there's fear present, questions might amplify it
        if (emotionScores.fearful > 0.1) {
          emotionScores.fearful += questionBoost * 0.5;
        }
      }
      
      // ALL CAPS often indicates strong emotion - usually anger or excitement
      if (allCapsWordCount > 0) {
        const capsBoost = Math.min(allCapsWordCount * 0.15, 0.45);
        
        // Determine if the context is more positive or negative
        const positiveScore = emotionScores.happy + emotionScores.surprised;
        const negativeScore = emotionScores.angry + emotionScores.sad + emotionScores.disgusted;
        
        if (negativeScore > positiveScore) {
          // In negative context, CAPS likely mean anger
          emotionScores.angry += capsBoost;
        } else {
          // In positive context, CAPS likely mean excitement (happiness)
          emotionScores.happy += capsBoost * 0.7;
          emotionScores.surprised += capsBoost * 0.3;
        }
      }
      
      // Context-specific modifiers
      // If message is very short (1-3 words), it's probably more emphatic
      if (messageWords.length <= 3 && messageWords.length > 0) {
        // Find the highest emotion and amplify it
        const highestEmotion = Object.entries(emotionScores)
          .filter(([emotion]) => emotion !== 'neutral')
          .sort(([, a], [, b]) => b - a)[0];
        
        if (highestEmotion && highestEmotion[1] > 0) {
          emotionScores[highestEmotion[0] as Emotion] += 0.3;
        }
      }
      
      // Check for emotional patterns with repetition (e.g., "no no no")
      const repetitionRegex = /(\b\w+\b)(\s+\1){2,}/g;
      const repetitions = fullMessageLower.match(repetitionRegex);
      
      if (repetitions) {
        repetitions.forEach(rep => {
          const word = rep.split(/\s+/)[0]; // Get the repeated word
          
          // Check which emotion this might amplify
          if (happyWords.some(hw => word.includes(hw))) {
            emotionScores.happy += 0.4;
          } else if (sadWords.some(sw => word.includes(sw))) {
            emotionScores.sad += 0.4;
          } else if (angryWords.some(aw => word.includes(aw))) {
            emotionScores.angry += 0.5; // Anger often has stronger repetition effect
          } else if (fearfulWords.some(fw => word.includes(fw))) {
            emotionScores.fearful += 0.4;
          } else if (disgustedWords.some(dw => word.includes(dw))) {
            emotionScores.disgusted += 0.4;
          } else if (word === 'no') {
            // "no no no" often indicates distress
            emotionScores.fearful += 0.3;
            emotionScores.sad += 0.2;
          } else if (word === 'please') {
            // "please please please" indicates urgency/desperation
            emotionScores.fearful += 0.3;
          } else if (word === 'yes') {
            // "yes yes yes" usually indicates excitement
            emotionScores.happy += 0.3;
            emotionScores.surprised += 0.2;
          }
        });
      }
      
      // Lower the neutral threshold based on message length
      // Longer messages have more opportunity to express emotion
      if (messageWords.length > 10) {
        emotionScores.neutral = Math.max(0.01, emotionScores.neutral - 0.02);
      }
      
      // If there's no clear emotion detected after all our analysis, 
      // only then consider neutral as the dominant emotion
      const maxNonNeutralScore = Math.max(
        emotionScores.happy, 
        emotionScores.sad, 
        emotionScores.angry, 
        emotionScores.fearful, 
        emotionScores.surprised, 
        emotionScores.disgusted
      );
      
      if (maxNonNeutralScore <= 0.1) {
        emotionScores.neutral = 0.2; // stronger than the non-neutral emotions
      } else {
        // If we have emotional content, suppress neutral even further
        emotionScores.neutral = 0.02;
      }
      
      // Get the highest scoring emotion
      let maxEmotion: Emotion = 'neutral';
      let maxScore = emotionScores.neutral;
      
      Object.entries(emotionScores).forEach(([emotion, score]) => {
        if (score > maxScore) {
          maxScore = score;
          maxEmotion = emotion as Emotion;
        }
      });
      
      // Map to a reasonable probability range:
      // - Neutral: 60-75% (less confident)
      // - Emotional: 75-98% (more confident)
      let normalizedProbability: number;
      
      if (maxEmotion === 'neutral') {
        // Neutral predictions should have lower confidence
        normalizedProbability = 0.6 + (Math.min(maxScore, 0.5) * 0.3);
      } else {
        // Emotional predictions can have higher confidence
        normalizedProbability = 0.75 + (Math.min(maxScore, 0.7) * 0.33);
      }
      
      // Cap at 98% - we're never absolutely certain
      normalizedProbability = Math.min(normalizedProbability, 0.98);
      
      setEmotionResult({
        emotion: maxEmotion,
        probability: normalizedProbability
      });
      
      toast({
        title: "Analysis complete",
        description: `Text analyzed successfully`,
      });
      
      // Show a warning popup when emotion detected is "fearful"
      if (maxEmotion === 'fearful') {
        setTimeout(() => {
          toast({
            title: "⚠️ Suspicious Content Detected",
            description: "This message contains concerning language that may indicate suspicious activity or threat.",
            variant: "destructive",
            duration: 6000,
          });
        }, 1000); // Small delay for better UX (show after the analysis complete message)
      }
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
