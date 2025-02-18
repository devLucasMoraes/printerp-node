import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1739910065313 implements MigrationInterface {
    name = 'Default1739910065313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumos" ADD "permiteEstoqueNegativo" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "permiteEstoqueNegativo"`);
    }

}
