import React, { useState } from "react";
import {
  Box,
  TextField,
  ImageList,
  ImageListItem,
  Typography,
  CircularProgress,
} from "@mui/material";

const API_KEY = "eyQy0UwZGitqZyP9zXMmSRK6BKnJ6HvrOA5lwPCgGd4OPVThHEIMdB8H";

interface PexelsImage {
  id: number;
  src: {
    medium: string;
  };
  alt: string;
}

export const PexelApi: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<PexelsImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchImages = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          query
        )}&per_page=9`,
        {
          headers: {
            Authorization: API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();
      setImages(data.photos);
    } catch (err) {
      setError("Error fetching images. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length >= 2) {
      searchImages(value);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <TextField
        fullWidth
        label="Search Images"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Type to search images..."
        sx={{ mb: 3 }}
      />

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center" my={2}>
          {error}
        </Typography>
      )}

      {images.length > 0 && (
        <ImageList cols={3} gap={8}>
          {images.map((image) => (
            <ImageListItem key={image.id}>
              <img
                src={image.src.medium}
                alt={image.alt}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};
