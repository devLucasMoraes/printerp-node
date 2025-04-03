import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1743642283884 implements MigrationInterface {
    name = 'Default1743642283884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD "obs" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP COLUMN "obs"`);
    }

}
