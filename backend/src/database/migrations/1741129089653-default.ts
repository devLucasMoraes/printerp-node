import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1741129089653 implements MigrationInterface {
    name = 'Default1741129089653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(255) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "categorias" ADD "ativo" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD "ativo" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "equipamentos" ADD "ativo" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "requisitantes" ADD "ativo" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisitantes" DROP COLUMN "ativo"`);
        await queryRunner.query(`ALTER TABLE "equipamentos" DROP COLUMN "ativo"`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "ativo"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "ativo"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "user_id" character varying(255)`);
    }

}
