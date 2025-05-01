import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1746132414434 implements MigrationInterface {
    name = 'Default1746132414434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "ativo" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "ativo"`);
    }

}
