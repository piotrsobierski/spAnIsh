import {
  Box,
  Card,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { useGetWordsLearningStats } from "../api/generated/spanishLearningAPI";
import { School, EmojiEvents, Block } from "@mui/icons-material";

export const LearningStatistics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { data: stats, isLoading } = useGetWordsLearningStats();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({
    title,
    value,
    percentage,
    color,
    icon: Icon,
    isProgressBarVisible = false,
  }: {
    title: string;
    value: number;
    percentage?: string;
    color: string;
    icon: React.ElementType;
    isProgressBarVisible?: boolean;
  }) => (
    <Card
      elevation={0}
      sx={{
        minWidth: isMobile ? "100%" : isTablet ? 180 : 250,
        flex: 1,
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        bgcolor: "transparent",
        transition: "all 0.3s ease",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: "blur(8px)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 24px ${alpha(color, 0.15)}`,
          "& .icon-bg": {
            transform: "scale(1.1) rotate(5deg)",
          },
        },
      }}
    >
      <Box
        className="icon-bg"
        sx={{
          position: "absolute",
          right: -20,
          top: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: alpha(color, 0.15),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s ease",
        }}
      >
        <Icon
          sx={{
            fontSize: 40,
            color: alpha(color, 0.5),
            transform: "translate(-20%, 20%)",
          }}
        />
      </Box>
      <Box sx={{ p: 3, position: "relative" }}>
        <Typography
          variant="body2"
          sx={{
            color: alpha(theme.palette.text.secondary, 0.8),
            fontWeight: 500,
            mb: 1,
            textAlign: "left",
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: color,
              textShadow: `0 2px 4px ${alpha(color, 0.3)}`,
            }}
          >
            {value}
          </Typography>
          {percentage && (
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.text.secondary, 0.8),
                fontWeight: 500,
              }}
            >
              {percentage}
            </Typography>
          )}
        </Box>
      </Box>
      {isProgressBarVisible && percentage && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 4,
            bgcolor: alpha(color, 0.1),
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${parseFloat(percentage)}%`,
              bgcolor: color,
              transition: "width 0.6s ease-in-out",
            }}
          />
        </Box>
      )}
    </Card>
  );

  return (
    <Box
      sx={{
        mb: 4,
        px: isMobile ? 2 : 3,
        py: 2,
        background: `linear-gradient(to right, ${alpha(
          theme.palette.background.paper,
          0.7
        )}, ${alpha(theme.palette.background.paper, 0.3)})`,
        borderRadius: 5,
      }}
    >
      <Box
        display="flex"
        gap={3}
        sx={{
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <StatCard
          title="Total Words"
          value={stats?.totalWords || 0}
          color={theme.palette.primary.main}
          icon={School}
        />
        <StatCard
          title="Learned Words"
          value={(stats?.learnedWords || 0) + (stats?.skippedWords || 0)}
          percentage={`${(
            (((stats?.learnedWords || 0) + (stats?.skippedWords || 0)) /
              (stats?.totalWords || 1)) *
            100
          ).toFixed(1)}%`}
          color={theme.palette.success.main}
          icon={EmojiEvents}
          isProgressBarVisible
        />
        <StatCard
          title="Skipped Words"
          value={stats?.skippedWords || 0}
          percentage={`${(
            ((stats?.skippedWords || 0) / (stats?.totalWords || 1)) *
            100
          ).toFixed(1)}%`}
          color={theme.palette.warning.main}
          icon={Block}
        />
      </Box>
    </Box>
  );
};
