import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "../spanish-api/openapi.json",
    output: {
      mode: "split",
      target: "./src/api/generated",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/api/mutator/custom-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useInfinite: false,
        },
      },
    },
  },
});
