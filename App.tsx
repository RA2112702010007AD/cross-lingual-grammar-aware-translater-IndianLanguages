import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TranslationCard from './components/TranslationCard';
import GrammarExplanationDisplay from './components/GrammarExplanationDisplay';
import EvaluationMetricsDisplay from './components/EvaluationMetricsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { translateAndExplain } from './services/geminiService';
import { Language, GrammarExplanationResponse } from './types';
import { LANGUAGES, LANGUAGE_CODES } from './constants';

// TypeScript definitions for the Web Speech API
// FIX: Correctly type the SpeechRecognition API to avoid "'SpeechRecognition' only refers to a type" error.
// The SpeechRecognition constructor and instance types are separated.
interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}


const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<Language>(Language.ENGLISH);
  const [targetLang, setTargetLang] = useState<Language>(Language.HINDI);
  const [sourceText, setSourceText] = useState<string>('');
  const [translationResult, setTranslationResult] = useState<GrammarExplanationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);


  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
    }
    // Clean up speech synthesis on component unmount
    return () => {
        window.speechSynthesis.cancel();
    }
  }, []);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return; // onend will set isRecording to false
    }

    const recognition = recognitionRef.current;
    if (!recognition) {
        setError("Speech recognition is not supported in this browser.");
        return;
    }

    recognition.lang = LANGUAGE_CODES[sourceLang];
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      setSourceText(finalTranscript.trim() + ' ' + interimTranscript);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== 'no-speech') {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
    };

    recognition.onend = () => {
        setIsRecording(false);
    };
    
    recognition.start();
    setIsRecording(true);

  }, [isRecording, sourceLang]);

  const handleToggleSpeaking = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
  
    if (!translationResult?.translation) return;
  
    const utterance = new SpeechSynthesisUtterance(translationResult.translation);
    utterance.lang = LANGUAGE_CODES[targetLang];
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
  
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setError(`Could not play audio for the selected language (${targetLang}). Voice may not be installed on your device.`);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  
  }, [isSpeaking, translationResult, targetLang]);


  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    if (sourceLang === targetLang) {
      setError("Source and target languages cannot be the same.");
      return;
    }

    setLoading(true);
    setError(null);
    setTranslationResult(null);
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    setIsSpeaking(false);

    try {
      const result = await translateAndExplain(sourceText, sourceLang, targetLang);
      setTranslationResult(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [sourceText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (translationResult) {
      setSourceText(translationResult.translation);
      setTranslationResult(null);
    }
  };

  return (
    <div className="bg-transparent min-h-screen text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <TranslationCard
          sourceLang={sourceLang}
          targetLang={targetLang}
          sourceText={sourceText}
          translatedText={translationResult ? translationResult.translation : ''}
          onSourceLangChange={setSourceLang}
          onTargetLangChange={setTargetLang}
          onSourceTextChange={setSourceText}
          onSwapLanguages={handleSwapLanguages}
          onSubmit={handleTranslate}
          languages={LANGUAGES}
          loading={loading}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          isSpeaking={isSpeaking}
          onToggleSpeaking={handleToggleSpeaking}
        />

        {error && <ErrorDisplay message={error} />}

        {loading && <LoadingSpinner />}

        {translationResult && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GrammarExplanationDisplay explanation={translationResult.explanation} />
            <EvaluationMetricsDisplay metrics={translationResult.evaluation} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;