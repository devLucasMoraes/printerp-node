import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1742417067598 implements MigrationInterface {
    name = 'Default1742417067598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parceiros" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255) NOT NULL, CONSTRAINT "UQ_1d6a17d7ebfed650263a61fb5d7" UNIQUE ("nome"), CONSTRAINT "PK_c641dd3567834fa7ae0d67e4835" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."devolucao_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`);
        await queryRunner.query(`CREATE TABLE "devolucao_itens" ("id" SERIAL NOT NULL, "data_devolucao" TIMESTAMP NOT NULL, "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."devolucao_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "insumos_id" integer, "emprestimo_item_id" integer, CONSTRAINT "PK_5cdb1deb1839d4a259f77a2c5d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."emprestimo_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`);
        await queryRunner.query(`CREATE TABLE "emprestimo_itens" ("id" SERIAL NOT NULL, "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."emprestimo_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "insumos_id" integer, "emprestimo_id" integer, CONSTRAINT "PK_4011a8b6f6174b1ea4f00b8f9fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "emprestimos" ("id" SERIAL NOT NULL, "data_emprestimo" TIMESTAMP NOT NULL, "previsao_devolucao" TIMESTAMP, "custo_estimado" numeric(10,2) NOT NULL DEFAULT '0', "tipo" character varying(255) NOT NULL, "status" character varying(255) NOT NULL DEFAULT 'EM ABERTO', "user_id" character varying(255) NOT NULL, "armazem_id" integer, "parceiro_id" integer, CONSTRAINT "PK_560d61bedea3b4e5926b39766b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categorias" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armazens" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requisitantes" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setores" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_59461ddef30364086bda2efb849" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devolucao_itens" ADD CONSTRAINT "FK_0e425435f460653be3612b49090" FOREIGN KEY ("emprestimo_item_id") REFERENCES "emprestimo_itens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "FK_249925997b30444b2ec8be2b377" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "emprestimo_itens" ADD CONSTRAINT "FK_d1ab83c0961d34e050819072d13" FOREIGN KEY ("emprestimo_id") REFERENCES "emprestimos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "emprestimos" ADD CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec" FOREIGN KEY ("parceiro_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_b70163b27048deb12b0caf9a2ec"`);
        await queryRunner.query(`ALTER TABLE "emprestimos" DROP CONSTRAINT "FK_10c70898b81ce80bda3d0963d8a"`);
        await queryRunner.query(`ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "FK_d1ab83c0961d34e050819072d13"`);
        await queryRunner.query(`ALTER TABLE "emprestimo_itens" DROP CONSTRAINT "FK_249925997b30444b2ec8be2b377"`);
        await queryRunner.query(`ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_0e425435f460653be3612b49090"`);
        await queryRunner.query(`ALTER TABLE "devolucao_itens" DROP CONSTRAINT "FK_59461ddef30364086bda2efb849"`);
        await queryRunner.query(`ALTER TABLE "settings" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "setores" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requisitantes" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "armazens" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categorias" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "emprestimos"`);
        await queryRunner.query(`DROP TABLE "emprestimo_itens"`);
        await queryRunner.query(`DROP TYPE "public"."emprestimo_itens_unidade_enum"`);
        await queryRunner.query(`DROP TABLE "devolucao_itens"`);
        await queryRunner.query(`DROP TYPE "public"."devolucao_itens_unidade_enum"`);
        await queryRunner.query(`DROP TABLE "parceiros"`);
    }

}
