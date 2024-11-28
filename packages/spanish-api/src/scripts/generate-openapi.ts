import swaggerJsdoc from "swagger-jsdoc";
import * as fs from "fs";
import * as path from "path";
import { specs } from "../config/swagger";

const outputPath = path.join(__dirname, "../../openapi.json");

// Generate and save OpenAPI spec
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
console.log(`OpenAPI spec generated at: ${outputPath}`);
