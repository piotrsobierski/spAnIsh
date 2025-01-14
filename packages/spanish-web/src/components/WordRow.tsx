import React from "react";
import {
  TableRow,
  TableCell,
  Box,
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
import { alpha, useTheme } from "@mui/material/styles";
import { WordImage } from "./WordImage";
import { speak } from "../helpers/speech.helper";
import { WordProps } from "../types/word.types";
import { WordDetailsDialog } from "./WordDetailsDialog";
import { ExampleWithTranscription } from "./ExampleWithTranscription";
import { WordStats } from "./WordStats";

export const WordRow: React.FC<WordProps> = ({ word, wordState, handlers }) => {
  const theme = useTheme();
  const isAnswered = wordState?.isAnswered;
  const isTranslationVisible = wordState?.isTranslationVisible || isAnswered;
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  return (
    <>
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
              onClick={(e) => {
                e.stopPropagation();
                if (word.word) {
                  speak(word.word);
                }
              }}
            >
              <VolumeUpIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() =>
                handlers.handleSkipClick(word.id ?? 0, word.word ?? "")
              }
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDetailsOpen(true)}
              sx={{
                color: theme.palette.info.main,
                "&:hover": {
                  color: theme.palette.info.dark,
                },
              }}
            >
              <InfoIcon />
            </IconButton>
          </Box>
          <Collapse in={isTranslationVisible}>
            <Box sx={{ mt: 1 }}>
              <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                {word.translation}
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  maxWidth: "200px",
                  mx: "auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <WordImage
                  word={word.translation || ""}
                  visible={isTranslationVisible}
                />
              </Box>
            </Box>
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
                  wordState?.userInput ?? ""
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
              onFocus={() => {
                if (word.word) {
                  speak(word.word);
                }
              }}
            />
            <IconButton
              onClick={() =>
                handlers.handleCheck(
                  word.id ?? 0,
                  wordState?.userInput ?? "",
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
          {word.example && (
            <ExampleWithTranscription
              text={word.example}
              translation={word.exampleTranslation}
              showTranslation={isTranslationVisible}
            />
          )}
        </TableCell>
        <TableCell>
          <WordStats
            goodAnswers={word.goodAnswers}
            badAnswers={word.badAnswers}
            goodAnswersStreak={word.goodAnswersStreak}
            wordId={word.id}
          />
        </TableCell>
      </TableRow>

      <WordDetailsDialog
        word={word}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
};
