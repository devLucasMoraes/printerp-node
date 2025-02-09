import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1739137004158 implements MigrationInterface {
    name = 'Default1739137004158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "equipamentos" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_cad18a4ac93dbd783fb793b9d01" UNIQUE ("nome"), CONSTRAINT "PK_0db94e9eed96824cb4446343a86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categorias" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_de8a2d8979f7820616e31dc1e15" UNIQUE ("nome"), CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."insumos_undestoque_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`);
        await queryRunner.query(`CREATE TABLE "insumos" ("id" SERIAL NOT NULL, "descricao" character varying(255) NOT NULL, "valorUntMed" numeric NOT NULL, "valorUntMedAuto" boolean NOT NULL, "undEstoque" "public"."insumos_undestoque_enum" NOT NULL, "estoqueMinimo" numeric NOT NULL, "totalEntradas" numeric NOT NULL, "totalSaidas" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "categoria_id" integer, CONSTRAINT "PK_b4e1b727a7b140e698e3a3dc7af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."requisicoes_estoque_itens_undestoque_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`);
        await queryRunner.query(`CREATE TABLE "requisicoes_estoque_itens" ("id" SERIAL NOT NULL, "quantidade" numeric NOT NULL, "undEstoque" "public"."requisicoes_estoque_itens_undestoque_enum" NOT NULL, "valorUnitario" numeric NOT NULL, "insumos_id" integer, "requisicoes_estoque_id" integer, CONSTRAINT "PK_d078291735274987d33366846a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "requisicoes_estoque" ("id" SERIAL NOT NULL, "dataRequisicao" date NOT NULL, "valorTotal" numeric NOT NULL, "ordemProducao" character varying(255) NOT NULL, "obs" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "requisitante_id" integer, "equipamentos_id" integer, CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "requisitantes" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_a5d6feb6a5bf80161d307bc865b" UNIQUE ("nome"), CONSTRAINT "PK_217e259327009b9ee87821bc07e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_221af3495763304b3a94e455cf1" FOREIGN KEY ("requisicoes_estoque_id") REFERENCES "requisicoes_estoque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e" FOREIGN KEY ("requisitante_id") REFERENCES "requisitantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_a59a8c27123c1aaf89259da056c" FOREIGN KEY ("equipamentos_id") REFERENCES "equipamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_a59a8c27123c1aaf89259da056c"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_221af3495763304b3a94e455cf1"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9"`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da"`);
        await queryRunner.query(`DROP TABLE "requisitantes"`);
        await queryRunner.query(`DROP TABLE "requisicoes_estoque"`);
        await queryRunner.query(`DROP TABLE "requisicoes_estoque_itens"`);
        await queryRunner.query(`DROP TYPE "public"."requisicoes_estoque_itens_undestoque_enum"`);
        await queryRunner.query(`DROP TABLE "insumos"`);
        await queryRunner.query(`DROP TYPE "public"."insumos_undestoque_enum"`);
        await queryRunner.query(`DROP TABLE "categorias"`);
        await queryRunner.query(`DROP TABLE "equipamentos"`);
    }

}
