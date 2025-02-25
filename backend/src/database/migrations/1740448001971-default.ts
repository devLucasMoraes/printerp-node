import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740448001971 implements MigrationInterface {
    name = 'Default1740448001971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categorias" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armazens" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "equipamentos" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD "userId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requisitantes" ADD "userId" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisitantes" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "equipamentos" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "armazens" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "categorias" DROP COLUMN "userId"`);
    }

}
