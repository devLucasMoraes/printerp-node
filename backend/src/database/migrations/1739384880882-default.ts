import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1739384880882 implements MigrationInterface {
    name = 'Default1739384880882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "obs" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "obs" SET NOT NULL`);
    }

}
