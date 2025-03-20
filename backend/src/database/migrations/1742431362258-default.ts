import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1742431362258 implements MigrationInterface {
    name = 'Default1742431362258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "created_at"`);
    }

}
