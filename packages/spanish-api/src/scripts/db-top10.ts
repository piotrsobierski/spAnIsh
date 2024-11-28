import { showRows } from "./db-common";

// Get table name from command line argument
const tableName = process.argv[2];
if (!tableName) {
  console.error("Please provide a table name as an argument");
  process.exit(1);
}

showRows(tableName, 10);
