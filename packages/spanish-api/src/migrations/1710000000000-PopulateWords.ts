import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateWords1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert words without categories
    await queryRunner.query(`
      INSERT INTO word (word, translation) VALUES 
      ('proteger', 'protect'),
      ('golpear', 'hit'),
      ('mediodía', 'noon'),
      ('elemento', 'element'),
      ('estudiante', 'student'),
      ('esquina', 'corner'),
      ('partido', 'party'),
      ('suministro', 'supply'),
      ('moderno', 'modern'),
      ('cuya', 'whose'),
      ('por favor', 'please'),
      ('de cultivos', 'crop')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the added words
    await queryRunner.query(`
      DELETE FROM word 
      WHERE word IN (
        'proteger', 'golpear', 'mediodía', 'elemento', 
        'estudiante', 'esquina', 'partido', 'suministro',
        'moderno', 'cuya', 'por favor', 'de cultivos'
      )
    `);
  }
}
