'use client';

import { useEffect, useRef } from 'react';

export interface NotificationSoundOptions {
  volume?: number;
  enabled?: boolean;
  soundType?: 'default' | 'ticket' | 'urgent';
}

export function useNotificationSound(options: NotificationSoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    volume = 0.5,
    enabled = true,
    soundType = 'default'
  } = options;

  // 🔊 Inicializar audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && enabled) {
      // Crear diferentes tipos de sonidos
      const soundUrls = {
        default: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQc=',
        ticket: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQc=',
        urgent: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQcZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhATuF0fPccTEFeJHP8tiJOQc='
      };

      // Crear elemento de audio
      audioRef.current = new Audio(soundUrls[soundType]);
      audioRef.current.volume = volume;
      audioRef.current.preload = 'auto';
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [enabled, soundType, volume]);

  // 🎵 Función para reproducir sonido
  const playSound = async () => {
    if (!enabled || !audioRef.current) return;

    try {
      // Resetear audio para permitir múltiples reproducciones
      audioRef.current.currentTime = 0;
      
      // Intentar reproducir
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('🔊 Sonido de notificación reproducido');
      }
    } catch (error) {
      // Si hay error (autoplay bloqueado, etc.), crear sonido alternativo
      console.log('🔇 Sonido bloqueado por el navegador, usando alternativa');
      createBeepSound();
    }
  };

  // 🎶 Función de sonido alternativo usando Web Audio API
  const createBeepSound = () => {
    if (typeof window === 'undefined') return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Crear oscilador para el tono
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configurar el sonido
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Frecuencias según el tipo
      const frequencies = {
        default: 800,
        ticket: 1000, 
        urgent: 1200
      };
      
      oscillator.frequency.value = frequencies[soundType];
      oscillator.type = 'sine';
      
      // Volumen y duración
      gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      // Reproducir
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      console.log('🎶 Sonido alternativo reproducido');
    } catch (error) {
      console.error('❌ Error creando sonido alternativo:', error);
    }
  };

  // 🎯 Función para sonido de doble beep (para notificaciones importantes)
  const playDoubleBeep = async () => {
    if (!enabled) return;
    
    await playSound();
    setTimeout(async () => {
      await playSound();
    }, 200);
  };

  return {
    playSound,
    playDoubleBeep,
    enabled
  };
}