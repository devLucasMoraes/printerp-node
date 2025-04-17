import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1744850009371 implements MigrationInterface {
    name = 'Default1744850009371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "estorno" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "estorno"`);
    }

}
