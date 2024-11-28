import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Header } from "./components/Header";
import "./App.css";
import { WordsList } from "./components/WordsList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  // You can customize your theme here
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          {/* <Header /> */}
          {/* dsadas */}
          {/* Your other content goes here */}
          <WordsList />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
