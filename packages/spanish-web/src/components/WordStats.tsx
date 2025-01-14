import React, { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { usePostWordsWordIdStreak } from "../api/generated/spanishLearningAPI";

interface WordStatsProps {
  goodAnswers?: number;
  badAnswers?: number;
  goodAnswersStreak?: number;
  wordId?: number;
}

export const WordStats: React.FC<WordStatsProps> = ({
  goodAnswers = 0,
  badAnswers = 0,
  goodAnswersStreak = 0,
  wordId,
}) => {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const streakMutation = usePostWordsWordIdStreak();

  const handleStreakUpdate = () => {
    if (!wordId) return;

    streakMutation.mutate(
      {
        wordId,
        data: {
          streak: goodAnswersStreak + 1,
        },
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update streak:", error);
          // You might want to show an error message to the user here
        },
      }
    );
  };

  return (
    <>
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
        <Typography>✓ {goodAnswers}</Typography>
        <Typography>✗ {badAnswers}</Typography>
        <Typography
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
          onClick={() => setIsDialogOpen(true)}
        >
          🔥 {goodAnswersStreak}
        </Typography>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle>Update Streak?</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to increase the streak to {goodAnswersStreak + 1}?
          </Typography>
          <Typography color="warning.main" sx={{ mt: 2, fontStyle: "italic" }}>
            Note: This should only be used to correct mistakes when your answer
            was actually correct.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStreakUpdate}
            variant="contained"
            color="primary"
            disabled={streakMutation.isPending}
          >
            Update Streak
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
