import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { QuestionTypeSelector } from './components/QuestionTypeSelector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { QuestionDisplay } from './components/QuestionDisplay';
import { AnswerSheet } from './components/AnswerSheet';
import { GradingResult } from './components/GradingResult';
import { HighlightedQuestion } from './components/HighlightedQuestion';
import { Timer } from './components/Timer';
import { generateQuestion, gradeAnswers } from './services/geminiService';
import { QuestionType, GeneratedContent, GradingResult as GradingResultType } from './types';

export const App = () => {
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [gradingResult, setGradingResult] = useState<GradingResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const resetState = () => {
      setGeneratedContent(null);
      setGradingResult(null);
      setError(null);
      setShowAnswer(false);
      setElapsedTime(0);
  }

  useEffect(() => {
    let timerId: number;
    if (generatedContent && !gradingResult) {
      timerId = window.setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [generatedContent, gradingResult]);

  const handleGenerate = useCallback(async () => {
    if (!selectedType) {
      setError('Please select a question type first.');
      return;
    }
    setIsLoading(true);
    resetState();

    try {
      const fullResponse = await generateQuestion(selectedType);
      const parts = fullResponse.split('@@@答案與解析@@@');
      
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        throw new Error('Invalid response format from AI. The response may be incomplete or missing the required separator.');
      }
      
      setGeneratedContent({
        question: parts[0].trim(),
        answer: parts[1].trim(),
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate question. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  const handleSubmitAnswers = useCallback(async (userAnswers: Record<string, string>) => {
    if (!generatedContent) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
        const result = await gradeAnswers(generatedContent.question, generatedContent.answer, userAnswers);
        setGradingResult(result);
    } catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to grade answers. ${errorMessage}`);
        console.error(e);
    } finally {
        setIsSubmitting(false);
    }
  }, [generatedContent]);

  const handleSelectType = (type: QuestionType) => {
    setSelectedType(type);
    if (generatedContent) {
        resetState();
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="mt-6"><LoadingSpinner /></div>;
    }
    if (error) {
      return <div className="mt-6"><ErrorMessage message={error} /></div>;
    }
    if (generatedContent) {
      return (
        <div className="mt-6">
            <Timer elapsedTime={elapsedTime} />
            <div className="w-full max-w-4xl mx-auto p-5 md:p-8 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-xl font-bold text-slate-200 border-b border-slate-600 pb-3 mb-4">試題內容</h3>
                <HighlightedQuestion text={generatedContent.question} />
            </div>
            
            {gradingResult && <GradingResult result={gradingResult} />}

            <AnswerSheet 
                questionType={selectedType!}
                questionText={generatedContent.question}
                onSubmit={handleSubmitAnswers}
                isSubmitting={isSubmitting}
                isSubmitted={!!gradingResult}
            />
            
            {gradingResult && (
                <QuestionDisplay
                    answer={generatedContent.answer}
                    showAnswer={showAnswer}
                    onToggleAnswer={() => setShowAnswer(prev => !prev)}
                />
            )}
        </div>
      );
    }
    return (
        <div className="text-center mt-10 p-8 bg-slate-800/30 rounded-lg max-w-2xl mx-auto border border-dashed border-slate-600">
            <h2 className="text-2xl font-bold text-slate-300">Welcome!</h2>
            <p className="text-slate-400 mt-2">Ready to challenge yourself? Select a test type above and click "Generate" to begin.</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-10">
        <QuestionTypeSelector
          selectedType={selectedType}
          onSelectType={handleSelectType}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-xs text-slate-600">
        &copy; {new Date().getFullYear()} AI English Test Generator. For educational purposes only.
      </footer>
    </div>
  );
};
