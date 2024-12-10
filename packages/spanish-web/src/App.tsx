import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import { WordsList } from "./components/WordsList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RainbowPrices from "./components/RainbowPrices";

const theme = createTheme({});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <RainbowPrices />

          <WordsList />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
