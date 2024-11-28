import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spanish Learning API",
      version: "1.0.0",
      description: "API for learning Spanish vocabulary",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Word: {
          type: "object",
          properties: {
            id: { type: "integer" },
            word: { type: "string" },
            translation: { type: "string" },
            example: { type: "string", nullable: true },
            exampleTranslation: { type: "string", nullable: true },
            notes: { type: "string", nullable: true },
            goodAnswers: { type: "integer" },
            badAnswers: { type: "integer" },
            lastAnswerTime: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            categoryId: { type: "integer", nullable: true },
          },
        },
        WordStats: {
          type: "object",
          properties: {
            id: { type: "integer" },
            word: { type: "string" },
            translation: { type: "string" },
            goodAnswers: { type: "integer" },
            badAnswers: { type: "integer" },
            lastAnswerTime: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            totalAnswers: { type: "integer" },
            successRate: { type: "number" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const specs = swaggerJsdoc(options);
