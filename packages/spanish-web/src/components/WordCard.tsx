import React from "react";
import {
  Box,
  Paper,
  Button,
  IconButton,
  Typography,
  TextField,
  Collapse,
  Fade,
} from "@mui/material";
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VolumeUp as VolumeUpIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { WordImage } from "./WordImage";
import { speak } from "../helpers/speech.helper";
import { WordDetailsDialog } from "./WordDetailsDialog";
import { ExampleWithTranscription } from "./ExampleWithTranscription";
import { WORDS } from "../constants/app.constants";
import { WordStats } from "./WordStats";

interface WordCardProps {
  word: {
    id?: number;
    word?: string;
    translation?: string;
    example?: string;
    exampleTranslation?: string;
    goodAnswers?: number;
    badAnswers?: number;
    goodAnswersStreak?: number;
  };
  wordState: {
    userInput?: string;
    isAnswered?: boolean;
    isCorrect?: boolean;
    isTranslationVisible?: boolean;
    formatError?: boolean;
  };
  handlers: {
    toggleTranslation: (id: number) => void;
    handleSkipClick: (id: number, word: string) => void;
    handleInputChange: (id: number, value: string) => void;
    handleKeyPress: (
      event: React.KeyboardEvent<HTMLDivElement>,
      id: number,
      input: string,
      translation: string
    ) => void;
    handleCheck: (
      id: number,
      input: string,
      translation: string,
      word: any
    ) => void;
  };
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  wordState,
  handlers,
}) => {
  const theme = useTheme();
  const isAnswered = wordState?.isAnswered;
  const isTranslationVisible = wordState?.isTranslationVisible || isAnswered;
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  return (
    <>
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
            alignItems: "flex-start",
            mb: 2,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
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
              onClick={(e) => {
                e.stopPropagation();
                speak(word.word ?? "");
              }}
            >
              <VolumeUpIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() =>
                handlers.handleSkipClick(word.id ?? 0, word.word ?? "")
              }
              sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDetailsOpen(true)}
              sx={{
                color: theme.palette.info.main,
                opacity: 0.7,
                "&:hover": { opacity: 1 },
              }}
            >
              <InfoIcon />
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isTranslationVisible}>
          <Box sx={{ width: "100%" }}>
            <Typography color="text.secondary">{word.translation}</Typography>
            <Box
              sx={{
                mt: 1,
                maxWidth: WORDS.IMAGE.MAX_WIDTH,
                mx: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <WordImage
                word={word.translation ?? ""}
                visible={isTranslationVisible ?? false}
              />
            </Box>
          </Box>
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
                  ? WORDS.VALIDATION.FORMAT.ERROR_MESSAGE
                  : WORDS.VALIDATION.FORMAT.HELP_MESSAGE
              }
              placeholder={WORDS.VALIDATION.FORMAT.PLACEHOLDER}
              onFocus={() => speak(word.word ?? "")}
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
              {wordState.isCorrect
                ? WORDS.FEEDBACK.CORRECT
                : WORDS.FEEDBACK.WRONG}
            </Typography>
          </Fade>
        )}

        {word.example && (
          <ExampleWithTranscription
            text={word.example}
            translation={word.exampleTranslation}
            showTranslation={isTranslationVisible}
          />
        )}

        <WordStats
          goodAnswers={word.goodAnswers}
          badAnswers={word.badAnswers}
          goodAnswersStreak={word.goodAnswersStreak}
          wordId={word.id}
        />
      </Paper>

      <WordDetailsDialog
        word={word}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};
