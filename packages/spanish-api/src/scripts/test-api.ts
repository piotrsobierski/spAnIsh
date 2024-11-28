import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:3001/api";

interface ApiError {
  message: string;
  response?: { data: any };
}

async function testApi() {
  try {
    // Get words
    console.log("\nGetting 5 words:");
    const words = await axios.get(`${API_URL}/words?limit=5`);
    console.log(words.data);

    // Get not learned words
    console.log("\nGetting not learned words:");
    const notLearned = await axios.get(`${API_URL}/words/not-learned?limit=5`);
    console.log(notLearned.data);

    // Save an answer
    if (words.data.length > 0) {
      const wordId = words.data[0].id;
      console.log(`\nSaving answer for word ${wordId}:`);
      const answer = await axios.post(`${API_URL}/words/answer`, {
        wordId,
        isCorrect: true,
      });
      console.log(answer.data);

      // Get word stats
      console.log(`\nGetting stats for word ${wordId}:`);
      const stats = await axios.get(`${API_URL}/words/${wordId}/stats`);
      console.log(stats.data);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
}

testApi();
