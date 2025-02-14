import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1739564482239 implements MigrationInterface {
    name = 'Default1739564482239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP COLUMN "dataRequisicao"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD "dataRequisicao" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP COLUMN "dataRequisicao"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD "dataRequisicao" date NOT NULL`);
    }

}
