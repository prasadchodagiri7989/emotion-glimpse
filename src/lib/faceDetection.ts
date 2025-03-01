
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
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]);
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
    const detection = await faceapi
      .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) return null;

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
