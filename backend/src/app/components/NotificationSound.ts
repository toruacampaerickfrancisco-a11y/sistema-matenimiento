// Utility functions for notification sounds
export class NotificationSound {
  private static audioContext: AudioContext | null = null;

  // Initialize audio context
  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play notification beep sound
  static playNotificationBeep() {
    try {
      const audioContext = this.getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configuration for pleasant notification sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800 Hz
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1); // Rise to 1000 Hz
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      console.log('🔊 Sonido de notificación reproducido');
    } catch (error) {
      console.error('❌ Error reproduciendo sonido:', error);
      // Fallback to system beep if available
      this.fallbackBeep();
    }
  }

  // Play success sound for report generation
  static playSuccessSound() {
    try {
      const audioContext = this.getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Success sound: ascending tones
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.15); // E5
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.3); // G5
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
      
      console.log('🎉 Sonido de éxito reproducido');
    } catch (error) {
      console.error('❌ Error reproduciendo sonido de éxito:', error);
    }
  }

  // Fallback beep using system
  private static fallbackBeep() {
    try {
      // Try to use system beep if available
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Use silent speech synthesis as a workaround for playing sound
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        utterance.rate = 10;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.log('Sistema sin soporte de audio avanzado');
    }
  }

  // Check if audio is supported
  static isAudioSupported(): boolean {
    try {
      return !!(window.AudioContext || (window as any).webkitAudioContext);
    } catch {
      return false;
    }
  }
}