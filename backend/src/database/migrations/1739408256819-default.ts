import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1739408256819 implements MigrationInterface {
    name = 'Default1739408256819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "deletedAt"`);
    }

}
