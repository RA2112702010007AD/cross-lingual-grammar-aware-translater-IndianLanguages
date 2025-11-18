import React from 'react';
import { Explanation } from '../types';

interface GrammarExplanationDisplayProps {
  explanation: Explanation;
}

const LINGUISTIC_KEYWORDS = [
  'Subject-Object-Verb', 'SOV', 'Subject-Verb-Object', 'SVO', 'agglutinative',
  'morphology', 'syntax', 'grammar', 'grammatical', 'verb', 'noun', 'adjective',
  'adverb', 'pronoun', 'preposition', 'postposition', 'conjunction', 'conjugation',
  'declension', 'case', 'ending', 'tense', 'aspect', 'mood', 'voice', 'gender',
  'number', 'person', 'linguistic', 'dependency', 'parse', 'structure', 'sentence',
  'token', 'head', 'relation', 'root'
];

const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const regex = new RegExp(`\\b(${LINGUISTIC_KEYWORDS.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        LINGUISTIC_KEYWORDS.some(kw => kw.toLowerCase() === part.toLowerCase()) ? (
          <strong key={i} className="text-cyan-300 font-semibold">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
};

// FIX: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const Section: React.FC<{ title: string; icon: React.ReactNode; colorClass: string; children: React.ReactNode }> = ({ title, icon, colorClass, children }) => (
    <div>
        <h3 className={`text-lg font-semibold ${colorClass} mb-3 flex items-center`}>
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className={`prose prose-invert prose-slate text-slate-300 max-w-none border-l-2 pl-4 ${colorClass.replace('text-', 'border-')}`}>
            {children}
        </div>
    </div>
);


const GrammarExplanationDisplay: React.FC<GrammarExplanationDisplayProps> = ({ explanation }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 shadow-lg animate-fade-in space-y-8">
      <Section
        title="Grammar Breakdown"
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2" /></svg>}
        colorClass="text-cyan-400"
      >
        <div className="space-y-4">
            {explanation.breakdown.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}><HighlightedText text={paragraph} /></p>
            ))}
        </div>
      </Section>

      {explanation.dependencyParse && (
        <>
            <hr className="border-slate-700" />
            <Section
                title="Dependency Parse"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" /></svg>}
                colorClass="text-cyan-400"
            >
                <pre className="bg-slate-900/70 p-4 rounded-md text-sm text-slate-300 overflow-x-auto font-mono">
                    <code><HighlightedText text={explanation.dependencyParse} /></code>
                </pre>
            </Section>
        </>
      )}

      {explanation.errorAnalysis && (
        <>
            <hr className="border-slate-700" />
            <Section
                title="Linguistic Error Analysis"
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
                colorClass="text-amber-400"
            >
                <div className="space-y-4">
                    {explanation.errorAnalysis.split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index}><HighlightedText text={paragraph} /></p>
                    ))}
                </div>
            </Section>
        </>
      )}
    </div>
  );
};

export default GrammarExplanationDisplay;