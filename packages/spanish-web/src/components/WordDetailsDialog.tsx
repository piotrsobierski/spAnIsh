import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { Word } from "../types/word.types";
import {
  usePostAiGenerateRelatedWords,
  usePostAiGenerateExamples,
} from "../api/generated/spanishLearningAPI";
import { ExampleWithTranscription } from "./ExampleWithTranscription";

interface WordDetailsDialogProps {
  word: Word | null;
  open: boolean;
  onClose: () => void;
}

interface RelatedWord {
  word: string;
  translation: string;
  spanish: string;
  english: string;
  explanation: string;
}

interface Sentence {
  original: string;
  english: string;
}

interface Example {
  sentences: Sentence[];
}

interface ExamplesResponse {
  examples: Example[];
}

interface RelatedWordsResponse {
  category?: string;
  related_words: RelatedWord[];
}

export const WordDetailsDialog: React.FC<WordDetailsDialogProps> = ({
  word,
  open,
  onClose,
}) => {
  const [relatedWords, setRelatedWords] = useState<RelatedWordsResponse | null>(
    null
  );
  const [examples, setExamples] = useState<ExamplesResponse | null>(null);
  const generateRelatedWords = usePostAiGenerateRelatedWords();
  const generateExamples = usePostAiGenerateExamples();

  useEffect(() => {
    if (word && open) {
      generateRelatedWords.mutate(
        { data: { word: word.word ?? "" } },
        {
          onSuccess: (data: any) => {
            setRelatedWords(data);
          },
        }
      );

      generateExamples.mutate(
        {
          data: {
            words: [word.word ?? ""],
            sentencesPerWord: 3,
          },
        },
        {
          onSuccess: (data: any) => {
            setExamples(data);
          },
        }
      );
    }
  }, [word, open]);

  if (!word) return null;

  const renderRelatedWords = () => {
    if (generateRelatedWords.isPending) {
      return (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (generateRelatedWords.isError) {
      return (
        <Typography color="error" align="center">
          Failed to load related words
        </Typography>
      );
    }

    if (!relatedWords?.related_words?.length) {
      return null;
    }

    return (
      <Box>
        {relatedWords.category && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary">
              Category
            </Typography>
            <Typography>{relatedWords.category}</Typography>
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Related Forms
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {relatedWords.related_words.map(
              (relatedWord: RelatedWord, index: number) => (
                <Chip
                  key={index}
                  label={
                    <Box>
                      <Typography component="span" sx={{ fontWeight: "bold" }}>
                        {relatedWord.spanish}
                      </Typography>
                      <Typography
                        component="span"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {relatedWord.english}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5, fontStyle: "italic" }}
                      >
                        {relatedWord.explanation}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    height: "auto",
                    "& .MuiChip-label": {
                      display: "block",
                      whiteSpace: "normal",
                      py: 0.5,
                    },
                  }}
                />
              )
            )}
          </Stack>
        </Box>
      </Box>
    );
  };

  const renderExamples = () => {
    if (generateExamples.isPending) {
      return (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (generateExamples.isError) {
      return (
        <Typography color="error" align="center">
          Failed to load examples
        </Typography>
      );
    }

    if (!examples?.examples?.[0]?.sentences?.length) {
      return null;
    }

    console.log(examples);
    return (
      <Stack spacing={2}>
        {examples.examples[0].sentences.map(
          (sentence: Sentence, index: number) => (
            <ExampleWithTranscription
              key={index}
              text={sentence.original}
              translation={sentence.english}
              showTranslation={true}
            />
          )
        )}
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Word Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary">
            Word
          </Typography>
          <Typography variant="h5" gutterBottom>
            {word.word}
          </Typography>
          <Typography variant="overline" color="text.secondary">
            Translation
          </Typography>
          <Typography variant="h5" gutterBottom>
            {word.translation}
          </Typography>
        </Box>

        {word.example && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Example
              </Typography>
              <Typography paragraph>{word.example}</Typography>
              <Typography variant="overline" color="text.secondary">
                Example Translation
              </Typography>
              <ExampleWithTranscription
                text={word.example}
                translation={word.exampleTranslation}
                showTranslation={true}
              />
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            mt: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Correct Answers
            </Typography>
            <Typography variant="h6" color="success.main">
              {word.goodAnswers || 0}
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Wrong Answers
            </Typography>
            <Typography variant="h6" color="error.main">
              {word.badAnswers || 0}
            </Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Current Streak
            </Typography>
            <Typography variant="h6" color="primary.main">
              {word.goodAnswersStreak || 0}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="overline" color="text.secondary">
          More Examples
        </Typography>
        {renderExamples()}

        <Divider sx={{ my: 2 }} />
        <Typography variant="overline" color="text.secondary">
          Related Words
        </Typography>
        {renderRelatedWords()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
