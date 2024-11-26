import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Header } from "./components/Header";
import "./App.css";

const theme = createTheme({
  // You can customize your theme here
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        {/* Your other content goes here */}
      </div>
    </ThemeProvider>
  );
}

export default App;
