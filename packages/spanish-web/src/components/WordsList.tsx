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
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import styled from "styled-components";
import {
  useGetWordsNotLearnedWithExamples,
  usePostWordsAnswer,
} from "../api/generated/spanishLearningAPI";

const StyledTableContainer = styled(TableContainer)`
  margin: 2rem auto;
  max-width: 1200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledTableCell = styled(TableCell)`
  padding: 16px;
`;

const HeaderCell = styled(StyledTableCell)`
  background-color: #1976d2;
  color: white;
  font-weight: bold;
`;

const WordBox = styled(Box)`
  margin-bottom: 0.5rem;
`;

const Translation = styled.span`
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
`;

const Example = styled.div`
  margin-top: 0.5rem;
  color: #444;
`;

const ExampleTranslation = styled.div`
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
`;

const AnswerInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CorrectAnswer = styled.div`
  color: #4caf50;
  font-weight: bold;
`;

const WrongAnswer = styled.div`
  color: #f44336;
  font-weight: bold;
`;

const StatsCell = styled(StyledTableCell)`
  text-align: right;
  color: #666;
`;

const Streak = styled.div`
  color: #1976d2;
  font-weight: bold;
  margin-top: 4px;
`;

interface WordState {
  userInput: string;
  isAnswered: boolean;
  isCorrect?: boolean;
}

export const WordsList: React.FC = () => {
  const [wordStates, setWordStates] = useState<Record<number, WordState>>({});

  const {
    data: wordsWithExamples = [],
    isLoading,
    error,
  } = useGetWordsNotLearnedWithExamples();

  const answerMutation = usePostWordsAnswer();

  const handleCheck = (
    wordId: number,
    input: string,
    correctTranslation: string
  ) => {
    const isCorrect =
      input.toLowerCase().trim() === correctTranslation.toLowerCase().trim();

    setWordStates((prev) => ({
      ...prev,
      [wordId]: {
        userInput: input,
        isAnswered: true,
        isCorrect,
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
      handleCheck(wordId, input, correctTranslation);
    }
  };

  if (isLoading) {
    return (
      <StyledTableContainer>
        <CircularProgress />
      </StyledTableContainer>
    );
  }

  if (error) {
    return (
      <StyledTableContainer>
        <div className="error">Failed to fetch words</div>
      </StyledTableContainer>
    );
  }

  return (
    <StyledTableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell>Word</HeaderCell>
            <HeaderCell>Your Translation</HeaderCell>
            <HeaderCell>Example</HeaderCell>
            <HeaderCell>Stats</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wordsWithExamples.map((word) => {
            const wordState = wordStates[word.id ?? 0];
            const isAnswered = wordState?.isAnswered;

            return (
              <TableRow key={word.id}>
                <StyledTableCell>
                  <WordBox>
                    <strong>{word.word}</strong>
                    <Collapse in={isAnswered}>
                      <Translation>{word.translation}</Translation>
                    </Collapse>
                  </WordBox>
                </StyledTableCell>
                <StyledTableCell>
                  <AnswerInput>
                    <TextField
                      size="small"
                      value={wordState?.userInput ?? ""}
                      onChange={(e) =>
                        setWordStates((prev) => ({
                          ...prev,
                          [word.id ?? 0]: {
                            ...prev[word.id ?? 0],
                            userInput: e.target.value,
                          },
                        }))
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          word.id ?? 0,
                          wordState?.userInput ?? "",
                          word.translation ?? ""
                        )
                      }
                      disabled={isAnswered}
                    />
                    <IconButton
                      onClick={() =>
                        handleCheck(
                          word.id ?? 0,
                          wordState?.userInput ?? "",
                          word.translation ?? ""
                        )
                      }
                      disabled={isAnswered}
                    >
                      <CheckIcon />
                    </IconButton>
                    {isAnswered &&
                      (wordState.isCorrect ? (
                        <CorrectAnswer>Correct!</CorrectAnswer>
                      ) : (
                        <WrongAnswer>Wrong</WrongAnswer>
                      ))}
                  </AnswerInput>
                </StyledTableCell>
                <StyledTableCell>
                  <Collapse in={isAnswered}>
                    {word.example && (
                      <>
                        <Example>{word.example}</Example>
                        <ExampleTranslation>
                          {word.exampleTranslation}
                        </ExampleTranslation>
                      </>
                    )}
                  </Collapse>
                </StyledTableCell>
                <StatsCell>
                  <div>✅ {word.goodAnswers ?? 0}</div>
                  <div>❌ {word.badAnswers ?? 0}</div>
                  <div>Streak: {word.goodAnswersStreak ?? 0}</div>
                </StatsCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};
