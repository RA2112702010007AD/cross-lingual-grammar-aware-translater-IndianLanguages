import React from 'react';
import { Language } from '../types';
import LanguageSelector from './LanguageSelector';
import TextArea from './TextArea';

interface TranslationCardProps {
  sourceLang: Language;
  targetLang: Language;
  sourceText: string;
  translatedText: string;
  onSourceLangChange: (lang: Language) => void;
  onTargetLangChange: (lang: Language) => void;
  onSourceTextChange: (text: string) => void;
  onSwapLanguages: () => void;
  onSubmit: () => void;
  languages: Language[];
  loading: boolean;
  isRecording: boolean;
  onToggleRecording: () => void;
  isSpeaking: boolean;
  onToggleSpeaking: () => void;
}

const TranslationCard: React.FC<TranslationCardProps> = ({
  sourceLang,
  targetLang,
  sourceText,
  translatedText,
  onSourceLangChange,
  onTargetLangChange,
  onSourceTextChange,
  onSwapLanguages,
  onSubmit,
  languages,
  loading,
  isRecording,
  onToggleRecording,
  isSpeaking,
  onToggleSpeaking,
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl shadow-slate-900/50 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        {/* Source Language */}
        <div className="flex flex-col">
          <LanguageSelector
            selectedLanguage={sourceLang}
            onLanguageChange={onSourceLangChange}
            languages={languages}
          />
          <div className="relative w-full">
            <TextArea
              value={sourceText}
              onChange={(e) => onSourceTextChange(e.target.value)}
              placeholder="Enter text or use the microphone..."
              disabled={loading}
            />
            <button
              onClick={onToggleRecording}
              disabled={loading}
              className={`absolute right-3 top-3 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center items-center h-full pt-10">
          <button
            onClick={onSwapLanguages}
            disabled={loading}
            className="p-2 rounded-full bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Swap languages"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </button>
        </div>

        {/* Target Language */}
        <div className="flex flex-col">
          <LanguageSelector
            selectedLanguage={targetLang}
            onLanguageChange={onTargetLangChange}
            languages={languages}
          />
          <div className="relative w-full">
            <TextArea
              value={translatedText}
              placeholder="Translation will appear here..."
              readOnly
              isTranslated
              disabled={loading}
            />
            {translatedText && (
              <button
                onClick={onToggleSpeaking}
                disabled={loading}
                className={`absolute right-3 top-3 p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSpeaking
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white'
                }`}
                aria-label={isSpeaking ? 'Stop speaking' : 'Speak translation'}
              >
                {isSpeaking ? (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.563A.562.562 0 019 14.437V9.564z" />
                   </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onSubmit}
          disabled={loading || !sourceText.trim()}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Translating...' : 'Translate & Explain'}
        </button>
      </div>
    </div>
  );
};

export default TranslationCard;