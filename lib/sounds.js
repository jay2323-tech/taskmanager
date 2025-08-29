// This function plays a sound based on the name provided.
// It uses the Web Audio API, so no audio files are needed.
export const playSound = (soundName) => {
  // Check if running in a browser environment
  if (typeof window === 'undefined') return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (!audioContext) return; // Web Audio API not supported

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Set volume

  switch (soundName) {
    case 'chime':
      // A softer, more pleasant chime
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime); // C6
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    
    case 'alert':
      // A more urgent, square wave alert
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;

    case 'beep': // Default case
    default:
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
  }
};