import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { WordRow } from "./WordRow";
import { Word, WordState, WordHandlers } from "../types/word.types";
import { useTheme } from "@mui/material/styles";

interface WordsTableProps {
  words: Word[];
  wordStates: Record<number, WordState>;
  handlers: WordHandlers;
}

export const WordsTable: React.FC<WordsTableProps> = ({
  words,
  wordStates,
  handlers,
}) => {
  const theme = useTheme();

  return (
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
          {words.map((word) => (
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
  );
};
