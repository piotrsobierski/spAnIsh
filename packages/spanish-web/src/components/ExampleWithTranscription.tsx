import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { VolumeUp as VolumeUpIcon } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { speak } from "../helpers/speech.helper";

interface ExampleWithTranscriptionProps {
  text: string;
  translation?: string;
  showTranslation?: boolean;
}

export const ExampleWithTranscription: React.FC<
  ExampleWithTranscriptionProps
> = ({ text, translation, showTranslation = false }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        cursor: "pointer",
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        p: 2,
        borderRadius: 1,
        position: "relative",
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          "& .speak-icon": {
            opacity: 1,
          },
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography>{text}</Typography>
        <IconButton
          size="small"
          className="speak-icon"
          onClick={(e) => {
            e.stopPropagation();
            speak(text);
          }}
          sx={{
            opacity: 0,
            transition: "opacity 0.2s",
            color: theme.palette.primary.main,
          }}
        >
          <VolumeUpIcon fontSize="small" />
        </IconButton>
      </Box>
      {showTranslation && translation && (
        <Typography color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
          {translation}
        </Typography>
      )}
    </Box>
  );
};
