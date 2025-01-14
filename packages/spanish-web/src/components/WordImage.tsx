import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Collapse } from "@mui/material";

const API_KEY = "eyQy0UwZGitqZyP9zXMmSRK6BKnJ6HvrOA5lwPCgGd4OPVThHEIMdB8H";

interface WordImageProps {
  word: string;
  visible: boolean;
}

interface PexelsImage {
  id: number;
  src: {
    small: string;
  };
  alt: string;
}

export const WordImage: React.FC<WordImageProps> = ({ word, visible }) => {
  const [image, setImage] = useState<PexelsImage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (!word) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            word
          )}&per_page=1`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          setImage(data.photos[0]);
        }
      } catch (err) {
        console.error("Error fetching image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [word]);

  return (
    <Collapse in={visible}>
      <Box sx={{ mt: 1, mb: 2, minHeight: loading ? "100px" : "auto" }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100px"
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          image && (
            <img
              src={image.src.small}
              alt={image.alt}
              style={{
                maxWidth: "200px",
                maxHeight: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )
        )}
      </Box>
    </Collapse>
  );
};
