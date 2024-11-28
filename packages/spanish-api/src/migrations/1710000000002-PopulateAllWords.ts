import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "fs";
import * as path from "path";

export class PopulateAllWords1710000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Read words from file
    const filePath = path.join(__dirname, "..", "migrations", "words_data.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n");

    // Prepare values for batch insert
    const values = lines
      .filter((line) => line.trim()) // Skip empty lines
      .map((line) => {
        const [, word, translation] = line.split("\t");
        // Use parameterized query instead of escape
        return [word.trim(), translation.trim()];
      });

    if (values.length > 0) {
      // Create parameterized query
      const placeholders = values.map(() => "(?, ?)").join(",\n");
      const flatValues = values.flat(); // Convert [[word1, trans1], [word2, trans2]] to [word1, trans1, word2, trans2]

      // First, check which words already exist
      await queryRunner.query(
        `INSERT IGNORE INTO word (word, translation) VALUES ${placeholders}`,
        flatValues
      );

      // Log the results
      const [{ count }] = await queryRunner.query(
        `SELECT COUNT(*) as count FROM word`
      );
      console.log(`Total words in database after migration: ${count}`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Get all words from the file
    const filePath = path.join(__dirname, "..", "migrations", "words_data.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const words = fileContent
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [, word] = line.split("\t");
        return word.trim();
      });

    if (words.length > 0) {
      // Use parameterized query for delete
      const placeholders = words.map(() => "?").join(",");
      await queryRunner.query(
        `DELETE FROM word WHERE word IN (${placeholders})`,
        words
      );
    }
  }
}
