import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
} from "@mui/material";
import "./App.css";
import { WordsList } from "./components/WordsList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RainbowPrices from "./components/RainbowPrices";
import { LearningStatistics } from "./components/LearningStatistics";
import { PexelApi } from "./components/PexelApi";

const theme = createTheme({});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <RainbowPrices />
          <Container maxWidth="lg">
            <LearningStatistics />
            <WordsList />
            <PexelApi />
          </Container>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
