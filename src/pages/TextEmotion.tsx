
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import TextEmotionDisplay from '@/components/TextEmotionDisplay';
import SuspiciousCommand from '@/components/SuspiciousCommand';
import { type Emotion } from '@/lib/faceDetection';

// Changed to match what TextEmotionDisplay expects
interface EmotionResult {
  emotion: Emotion;
  probability: number;
}

const TextEmotion: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuspiciousDialog, setShowSuspiciousDialog] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const analyzeTextEmotion = async (text: string): Promise<EmotionResult | null> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/text-emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.emotion && data.score !== undefined) {
        return {
          emotion: data.emotion as Emotion,
          probability: data.score, // Map score to probability
        };
      } else {
        console.error('Invalid response from the API:', data);
        return null;
      }
    } catch (error) {
      console.error('Error analyzing text emotion:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputText.trim()) {
      alert('Please enter some text to analyze.');
      return;
    }

    analyzeTextEmotion(inputText)
      .then(result => {
        setEmotionResult(result);
        if (result && result.emotion === 'fearful') {
          setShowSuspiciousDialog(true);
        }
      })
      .catch(error => {
        console.error("Error in text submission:", error);
      });
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans">
        <SuspiciousCommand
          open={showSuspiciousDialog}
          onOpenChange={setShowSuspiciousDialog}
        />

        <section className="w-full max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2 font-heading">
              Text Emotion Analyzer
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Enter any text to analyze the predominant emotion.
            </p>
          </div>

          <form onSubmit={handleTextSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter text here..."
              value={inputText}
              onChange={handleInputChange}
              rows={4}
              className="resize-none"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Analyzing...
                  <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  Analyze Text
                  <MessageCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <Separator className="my-6" />

          {emotionResult && (
            <TextEmotionDisplay emotionResult={emotionResult} />
          )}
        </section>
      </div>
    </Layout>
  );
};

export default TextEmotion;
