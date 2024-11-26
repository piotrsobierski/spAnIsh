import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import db from "./config/database";
import { router } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
const swaggerFile = require("../swagger-output.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use("/api", router);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

async function testDatabaseConnection() {
  let conn;
  try {
    conn = await db.getConnection();
    console.log("Database connection successful");
    return true;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

// Start server
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await testDatabaseConnection();
});
