
import * as faceapi from 'face-api.js';

// Types for emotions
export type Emotion = 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral';

export interface EmotionResult {
  emotion: Emotion;
  probability: number;
}

// Initialize face-api models
export const loadModels = async () => {
  try {
    // Create model URLs
    const modelUrl = '/models';
    
    console.log('Loading models from CDN...');
    
    // Load models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
      faceapi.nets.faceExpressionNet.loadFromUri(modelUrl)
    ]);
    
    console.log('Models loaded successfully!');
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
};

// Detect emotions from video element
export const detectEmotion = async (
  videoEl: HTMLVideoElement
): Promise<EmotionResult | null> => {
  if (!videoEl || videoEl.paused || videoEl.ended) return null;

  try {
    console.log("Detecting face...");
    // Try using a larger minSize for better detection
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 });
    
    const detection = await faceapi
      .detectSingleFace(videoEl, options)
      .withFaceExpressions();

    if (!detection) {
      console.log("No face detected in this frame");
      return null;
    }
    
    console.log("Face detected! Expressions:", detection.expressions);
    const expressions = detection.expressions;
    
    // Get the emotion with highest probability
    let maxProbability = 0;
    let dominantEmotion: Emotion = 'neutral';
    
    // Check each emotion and find the one with highest probability
    if (expressions.happy > maxProbability) {
      maxProbability = expressions.happy;
      dominantEmotion = 'happy';
    }
    if (expressions.sad > maxProbability) {
      maxProbability = expressions.sad;
      dominantEmotion = 'sad';
    }
    if (expressions.angry > maxProbability) {
      maxProbability = expressions.angry;
      dominantEmotion = 'angry';
    }
    if (expressions.fearful > maxProbability) {
      maxProbability = expressions.fearful;
      dominantEmotion = 'fearful';
    }
    if (expressions.disgusted > maxProbability) {
      maxProbability = expressions.disgusted;
      dominantEmotion = 'disgusted';
    }
    if (expressions.surprised > maxProbability) {
      maxProbability = expressions.surprised;
      dominantEmotion = 'surprised';
    }
    if (expressions.neutral > maxProbability) {
      maxProbability = expressions.neutral;
      dominantEmotion = 'neutral';
    }

    return {
      emotion: dominantEmotion,
      probability: maxProbability
    };
  } catch (error) {
    console.error('Error detecting emotions:', error);
    return null;
  }
};
