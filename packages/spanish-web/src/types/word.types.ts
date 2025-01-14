export interface Word {
  id?: number;
  word?: string;
  translation?: string;
  example?: string;
  exampleTranslation?: string;
  goodAnswers?: number;
  badAnswers?: number;
  goodAnswersStreak?: number;
}

export interface WordState {
  userInput: string;
  isAnswered: boolean;
  isCorrect?: boolean;
  isTranslationVisible?: boolean;
  formatError?: boolean;
}

export interface WordHandlers {
  toggleTranslation: (id: number) => void;
  handleSkipClick: (id: number, word: string) => void;
  handleInputChange: (id: number, value: string) => void;
  handleKeyPress: (
    event: React.KeyboardEvent<HTMLDivElement>,
    id: number,
    input: string
  ) => void;
  handleCheck: (id: number, input: string, word: Word) => void;
}

export interface WordProps {
  word: Word;
  wordState: WordState;
  handlers: WordHandlers;
}
