
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support for Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'fr-FR'; // Default to French as user speaks French

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
            setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    } else {
        console.warn("Web Speech API not supported");
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
        recognitionRef.current?.stop();
    } else {
        recognitionRef.current?.start();
        setIsListening(true);
    }
  };

  if (!recognitionRef.current) {
      return null; // Don't render if not supported
  }

  return (
    <button
      onClick={toggleListening}
      disabled={isProcessing}
      className={clsx(
        "p-3 rounded-full transition-all duration-300 flex items-center justify-center",
        isListening
            ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
      )}
      title="Parler à l'Agent"
    >
      {isProcessing ? (
          <Loader2 size={20} className="animate-spin" />
      ) : isListening ? (
          <MicOff size={20} />
      ) : (
          <Mic size={20} />
      )}
    </button>
  );
};

export default VoiceInput;
