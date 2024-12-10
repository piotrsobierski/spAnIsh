import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  TextField,
  IconButton,
  Collapse,
  Button,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import {
  useGetWordsNotLearnedWithExamples,
  usePostWordsAnswer,
  usePostWordsWordIdSkip,
} from "../api/generated/spanishLearningAPI";
import {
  normalizeAnswer,
  isValidAnswerFormat,
} from "../utils/string-normalizer";

interface WordState {
  userInput: string;
  isAnswered: boolean;
  isCorrect?: boolean;
  isTranslationVisible?: boolean;
  formatError?: boolean;
}

interface SkipConfirmation {
  isOpen: boolean;
  wordId: number | null;
  wordText: string | null;
}

const WordCard = ({ word, wordState, handlers }) => {
  const theme = useTheme();
  const isAnswered = wordState?.isAnswered;
  const isTranslationVisible = wordState?.isTranslationVisible || isAnswered;

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        p: 2,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          onClick={() => handlers.toggleTranslation(word.id ?? 0)}
          endIcon={
            isTranslationVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />
          }
          sx={{ textTransform: "none", fontSize: "1.1rem" }}
        >
          {word.word}
        </Button>
        <IconButton
          size="small"
          onClick={() =>
            handlers.handleSkipClick(word.id ?? 0, word.word ?? "")
          }
          sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Collapse in={isTranslationVisible}>
        <Typography color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
          {word.translation}
        </Typography>
      </Collapse>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <TextField
            fullWidth
            size="small"
            value={wordState?.userInput ?? ""}
            onChange={(e) =>
              handlers.handleInputChange(word.id ?? 0, e.target.value)
            }
            onKeyPress={(e) =>
              handlers.handleKeyPress(
                e,
                word.id ?? 0,
                wordState?.userInput ?? "",
                word.translation ?? ""
              )
            }
            disabled={isAnswered}
            error={wordState?.formatError}
            helperText={
              wordState?.formatError
                ? "Invalid format. Use 'english - spanish'"
                : "Format: 'english - spanish'"
            }
            placeholder="Type your answer..."
          />
          <IconButton
            onClick={() =>
              handlers.handleCheck(
                word.id ?? 0,
                wordState?.userInput ?? "",
                word.translation ?? "",
                word
              )
            }
            disabled={isAnswered}
            color="primary"
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </Box>

      {isAnswered && (
        <Fade in={true}>
          <Typography
            color={wordState.isCorrect ? "success.main" : "error.main"}
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            {wordState.isCorrect ? "Correct!" : "Wrong"}
          </Typography>
        </Fade>
      )}

      <Collapse in={isTranslationVisible}>
        {word.example && (
          <Box
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              p: 2,
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography>{word.example}</Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 1, fontStyle: "italic" }}
            >
              {word.exampleTranslation}
            </Typography>
          </Box>
        )}
      </Collapse>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "flex-end",
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          p: 1,
          borderRadius: 1,
        }}
      >
        <Typography>Correct: {word.goodAnswers ?? 0}</Typography>
        <Typography>Wrong: {word.badAnswers ?? 0}</Typography>
        <Typography>Streak: {word.goodAnswersStreak ?? 0}</Typography>
      </Box>
    </Paper>
  );
};

const WordRow = ({ word, wordState, handlers }) => {
  const theme = useTheme();
  const isAnswered = wordState?.isAnswered;
  const isTranslationVisible = wordState?.isTranslationVisible || isAnswered;

  return (
    <TableRow
      sx={{
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            onClick={() => handlers.toggleTranslation(word.id ?? 0)}
            endIcon={
              isTranslationVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }
            sx={{ textTransform: "none" }}
          >
            {word.word}
          </Button>
          <IconButton
            size="small"
            onClick={() =>
              handlers.handleSkipClick(word.id ?? 0, word.word ?? "")
            }
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <Collapse in={isTranslationVisible}>
          <Typography
            color="text.secondary"
            sx={{ mt: 1, fontStyle: "italic" }}
          >
            {word.translation}
          </Typography>
        </Collapse>
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <TextField
            size="small"
            value={wordState?.userInput ?? ""}
            onChange={(e) =>
              handlers.handleInputChange(word.id ?? 0, e.target.value)
            }
            onKeyPress={(e) =>
              handlers.handleKeyPress(
                e,
                word.id ?? 0,
                wordState?.userInput ?? "",
                word.translation ?? ""
              )
            }
            disabled={isAnswered}
            error={wordState?.formatError}
            helperText={
              wordState?.formatError
                ? "Invalid format"
                : "Format: 'english - spanish'"
            }
            placeholder="Type your answer..."
            sx={{ minWidth: 300 }}
          />
          <IconButton
            onClick={() =>
              handlers.handleCheck(
                word.id ?? 0,
                wordState?.userInput ?? "",
                word.translation ?? "",
                word
              )
            }
            disabled={isAnswered}
            color="primary"
          >
            <CheckIcon />
          </IconButton>
        </Box>
        {isAnswered && (
          <Fade in={true}>
            <Typography
              color={wordState.isCorrect ? "success.main" : "error.main"}
              sx={{ fontWeight: "bold", mt: 1 }}
            >
              {wordState.isCorrect ? "Correct!" : "Wrong"}
            </Typography>
          </Fade>
        )}
      </TableCell>

      <TableCell>
        <Collapse in={isTranslationVisible}>
          {word.example && (
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography>{word.example}</Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 1, fontStyle: "italic" }}
              >
                {word.exampleTranslation}
              </Typography>
            </Box>
          )}
        </Collapse>
      </TableCell>

      <TableCell>
        <Box sx={{ textAlign: "right" }}>
          <Typography>Correct: {word.goodAnswers ?? 0}</Typography>
          <Typography>Wrong: {word.badAnswers ?? 0}</Typography>
          <Typography>Streak: {word.goodAnswersStreak ?? 0}</Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

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
  } = useGetWordsNotLearnedWithExamples();

  const answerMutation = usePostWordsAnswer();
  const skipMutation = usePostWordsWordIdSkip();

  const handleCheck = (
    wordId: number,
    input: string,
    correctTranslation: string,
    currentWord: any
  ) => {
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

    const normalizedInput = normalizeAnswer(input);
    const correctParts = [
      currentWord.word
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim() ?? "",
      currentWord.translation?.toLowerCase().trim() ?? "",
    ];

    const isCorrect = (() => {
      const inputParts = normalizedInput.split(/[\s-]+/).map((w) =>
        w
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      );

      return (
        inputParts.length === 2 &&
        correctParts.length === 2 &&
        ((inputParts[0] === correctParts[0] &&
          inputParts[1] === correctParts[1]) ||
          (inputParts[0] === correctParts[1] &&
            inputParts[1] === correctParts[0]))
      );
    })();

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
    input: string,
    correctTranslation: string
  ) => {
    if (event.key === "Enter") {
      const currentWord = wordsWithExamples.find((word) => word.id === wordId);
      if (currentWord) {
        handleCheck(wordId, input, correctTranslation, currentWord);
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
              word={word}
              wordState={wordStates[word.id ?? 0]}
              handlers={handlers}
            />
          ))}
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: theme.shadows[3],
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Word
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Answer
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Example
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Stats
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wordsWithExamples.map((word) => (
                <WordRow
                  key={word.id}
                  word={word}
                  wordState={wordStates[word.id ?? 0]}
                  handlers={handlers}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
