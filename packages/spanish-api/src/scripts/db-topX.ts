import { showRows } from "./db-common";

// Get table name and limit from command line arguments
const tableName = process.argv[2];
const limit = parseInt(process.argv[3] || "10", 10);

if (!tableName) {
  console.error("Please provide a table name as an argument");
  console.log("Usage: npm run db:topX <tableName> [limit]");
  console.log("Example: npm run db:topX word 20");
  process.exit(1);
}

if (isNaN(limit) || limit < 1) {
  console.error("Limit must be a positive number");
  process.exit(1);
}

showRows(tableName, limit);
