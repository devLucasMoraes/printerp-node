import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1744491329927 implements MigrationInterface {
    name = 'Default1744491329927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estoques" ADD "consumo_medio_diario" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD "ultima_atualizacao_consumo" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "ultima_atualizacao_consumo"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP COLUMN "consumo_medio_diario"`);
    }

}
