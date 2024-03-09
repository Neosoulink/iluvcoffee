import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSynch1709965252160 implements MigrationInterface {
  name = 'SchemaSynch1709965252160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
  }
}
