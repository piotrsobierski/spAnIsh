import { AppBar, Toolbar, Typography, styled } from "@mui/material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  top: 0,
  backgroundColor: "#ffffff",
  color: "#000000",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.75rem",
  background: "linear-gradient(45deg, #2C3E50, #5B3A50)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
}));

export const Header = () => {
  return (
    <StyledAppBar>
      <Toolbar sx={{ minHeight: "64px" }}>
        <StyledTypography variant="h1">
          Spanish AI Vocabulary Tutor
        </StyledTypography>
      </Toolbar>
    </StyledAppBar>
  );
};
