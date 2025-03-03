
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AudioEmotionDisplay from '@/components/AudioEmotionDisplay';
import SuspiciousCommand from '@/components/SuspiciousCommand';

type AudioEmotion = 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral';

interface AudioEmotionResult {
  emotion: AudioEmotion;
  probability: number;
}

const AudioEmotion: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [emotionResult, setEmotionResult] = useState<AudioEmotionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuspiciousDialog, setShowSuspiciousDialog] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const { toast } = useToast();

  // Watch for fearful emotion detection and show dialog
  useEffect(() => {
    if (emotionResult?.emotion === 'fearful') {
      setShowSuspiciousDialog(true);
    }
  }, [emotionResult]);

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      setAudioBlob(null);
      setEmotionResult(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Clean up stream tracks after recording
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly to capture your voice emotion",
      });
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied or not available');
      toast({
        variant: "destructive",
        title: "Recording failed",
        description: "Could not access your microphone",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your audio has been captured",
      });
    }
  };
  
  const analyzeEmotion = () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    
    // Simulate emotion detection with random result
    // In a real app, you would send the audio to an API for analysis
    setTimeout(() => {
      const emotions: AudioEmotion[] = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomProbability = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0
      
      setEmotionResult({
        emotion: randomEmotion,
        probability: randomProbability
      });
      
      setIsProcessing(false);
      
      toast({
        title: "Analysis complete",
        description: `Detected emotion: ${randomEmotion}`,
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Suspicious Content Dialog */}
          <SuspiciousCommand 
            open={showSuspiciousDialog} 
            onOpenChange={setShowSuspiciousDialog} 
          />
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Audio Emotion Detection</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Record your voice to analyze your emotional state based on speech patterns.
              Try speaking naturally to get the most accurate results.
            </p>
          </div>
          
          <div className="mb-8 flex flex-col items-center">
            <div className="glass rounded-2xl p-6 mb-8 w-full max-w-md">
              <div className="audio-recorder flex flex-col items-center">
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 rounded-md flex items-center text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}
                
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center mb-6 ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-secondary'}`}>
                  <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500' : 'text-muted-foreground'}`} />
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping"></div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording} 
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording} 
                      variant="destructive"
                      size="lg"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                  
                  {audioBlob && !isRecording && (
                    <Button 
                      onClick={analyzeEmotion} 
                      variant="outline"
                      size="lg"
                      disabled={isProcessing}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Analyzing...' : 'Analyze Emotion'}
                    </Button>
                  )}
                </div>
                
                {audioBlob && (
                  <div className="mt-6 w-full">
                    <p className="text-sm text-muted-foreground mb-2">Preview your recording:</p>
                    <audio 
                      controls 
                      src={URL.createObjectURL(audioBlob)} 
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {emotionResult && (
              <AudioEmotionDisplay emotionResult={emotionResult} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AudioEmotion;
