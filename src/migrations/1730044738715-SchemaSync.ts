import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1730044738715 implements MigrationInterface {
  name = 'SchemaSync1730044738715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "createAt"`);
  }
}
