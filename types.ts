export const QuestionType = {
  Cloze: '文意選填',
  ParagraphStructure: '篇章結構',
  ReadingComprehension: '閱讀測驗',
  Mixed: '混合題型',
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

export interface GeneratedContent {
  question: string;
  answer: string;
}

export interface GradingResult {
    score: number;
    feedback: string;
}
