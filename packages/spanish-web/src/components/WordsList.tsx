import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import {
  useGetWordsRandomNotLearnedWithExamples,
  usePostWordsAnswer,
  usePostWordsWordIdSkip,
} from "../api/generated/spanishLearningAPI";
import { isValidAnswerFormat } from "../utils/string-normalizer";
import { WordsTable } from "./WordsTable";
import { WordState, Word } from "../types/word.types";
import { WordCard } from "./WordCard";
import { WORDS } from "../constants/app.constants";
import { checkWordAnswer } from "../utils/word-checker";

interface SkipConfirmation {
  isOpen: boolean;
  wordId: number | null;
  wordText: string | null;
}

export const WordsList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [wordStates, setWordStates] = useState<Record<number, WordState>>({});
  const [skipConfirmation, setSkipConfirmation] = useState<SkipConfirmation>({
    isOpen: false,
    wordId: null,
    wordText: null,
  });

  const {
    data: wordsWithExamples = [],
    isLoading,
    error,
  } = useGetWordsRandomNotLearnedWithExamples({ poolSize: WORDS.POOL_SIZE });
  const answerMutation = usePostWordsAnswer();
  const skipMutation = usePostWordsWordIdSkip();

  const handleCheck = (wordId: number, input: string, currentWord: any) => {
    if (!isValidAnswerFormat(input)) {
      setWordStates((prev) => ({
        ...prev,
        [wordId]: {
          ...prev[wordId],
          formatError: true,
        },
      }));
      return;
    }

    const { isCorrect, isValidFormat } = checkWordAnswer(
      currentWord.word ?? "",
      currentWord.translation ?? "",
      input
    );

    if (!isValidFormat) return;

    setWordStates((prev) => ({
      ...prev,
      [wordId]: {
        userInput: input,
        isAnswered: true,
        isCorrect,
        formatError: false,
      },
    }));

    answerMutation.mutate({
      data: {
        wordId,
        isCorrect,
      },
    });
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLDivElement>,
    wordId: number,
    input: string
  ) => {
    if (event.key === "Enter") {
      const currentWord = wordsWithExamples.find((word) => word.id === wordId);
      if (currentWord) {
        handleCheck(wordId, input, currentWord);
      }
    }
  };

  const toggleTranslation = (wordId: number) => {
    setWordStates((prev) => ({
      ...prev,
      [wordId]: {
        ...prev[wordId],
        isTranslationVisible: !prev[wordId]?.isTranslationVisible,
      },
    }));
  };

  const handleSkip = () => {
    if (skipConfirmation.wordId) {
      skipMutation.mutate({ wordId: skipConfirmation.wordId });
      setSkipConfirmation({ isOpen: false, wordId: null, wordText: null });
    }
  };

  const handleSkipClick = (wordId: number, wordText: string) => {
    setSkipConfirmation({
      isOpen: true,
      wordId,
      wordText,
    });
  };

  const handleCloseSkipConfirmation = () => {
    setSkipConfirmation({ isOpen: false, wordId: null, wordText: null });
  };

  const handleInputChange = (wordId: number, value: string) => {
    setWordStates((prev) => ({
      ...prev,
      [wordId]: {
        ...prev[wordId],
        userInput: value,
        formatError: false,
      },
    }));
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Typography color="error">Failed to fetch words</Typography>
      </Box>
    );
  }

  const handlers = {
    handleCheck,
    handleKeyPress,
    handleSkipClick,
    handleInputChange,
    toggleTranslation,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      {isMobile ? (
        <Box>
          {wordsWithExamples.map((word) => (
            <WordCard
              key={word.id}
              word={word as unknown as Word}
              wordState={wordStates[word.id ?? 0]}
              handlers={handlers}
            />
          ))}
        </Box>
      ) : (
        <WordsTable
          words={wordsWithExamples as unknown as Word[]}
          wordStates={wordStates}
          handlers={handlers}
        />
      )}

      <Dialog
        open={skipConfirmation.isOpen}
        onClose={handleCloseSkipConfirmation}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
          },
        }}
      >
        <DialogTitle>Skip Word?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to skip learning the word "
            {skipConfirmation.wordText}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkipConfirmation}>Cancel</Button>
          <Button onClick={handleSkip} variant="contained" color="primary">
            Skip
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
