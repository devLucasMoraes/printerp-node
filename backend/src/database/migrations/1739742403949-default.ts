import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1739742403949 implements MigrationInterface {
    name = 'Default1739742403949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."movimentos_estoque_undestoque_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`);
        await queryRunner.query(`CREATE TABLE "movimentos_estoque" ("id" SERIAL NOT NULL, "tipo" character varying(50) NOT NULL, "data" TIMESTAMP NOT NULL, "quantidade" numeric(10,2) NOT NULL, "valorUnitario" numeric(10,2) NOT NULL, "undEstoque" "public"."movimentos_estoque_undestoque_enum" NOT NULL, "documentoOrigem" character varying(255) NOT NULL, "tipoDocumento" character varying(50) NOT NULL, "regularizado" boolean NOT NULL DEFAULT false, "observacao" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "armazem_origem_id" integer, "armazem_destino_id" integer, "insumo_id" integer, CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "estoques" ("id" SERIAL NOT NULL, "quantidade" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "armazem_id" integer, "insumo_id" integer, CONSTRAINT "PK_049cbdf51633449b22f020680d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "armazens" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_400d1bf5d06da8279326e57c4e8" UNIQUE ("nome"), CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "totalEntradas"`);
        await queryRunner.query(`ALTER TABLE "insumos" DROP COLUMN "totalSaidas"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD "armazem_id" integer`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "valorUntMed" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "valorUntMed" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "valorUntMedAuto" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "estoqueMinimo" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "estoqueMinimo" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ALTER COLUMN "quantidade" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ALTER COLUMN "valorUnitario" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "valorTotal" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "ordemProducao" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_263864180fa1722935b2c6a24fc" FOREIGN KEY ("armazem_origem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_90b151f8373e6a63f78698d28b0" FOREIGN KEY ("armazem_destino_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD CONSTRAINT "FK_5615b9415c67026aef69c9e0af4" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estoques" ADD CONSTRAINT "FK_0ecc351a100765a385b8277f44f" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP CONSTRAINT "FK_0ecc351a100765a385b8277f44f"`);
        await queryRunner.query(`ALTER TABLE "estoques" DROP CONSTRAINT "FK_5615b9415c67026aef69c9e0af4"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_90b151f8373e6a63f78698d28b0"`);
        await queryRunner.query(`ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_263864180fa1722935b2c6a24fc"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "ordemProducao" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" ALTER COLUMN "valorTotal" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ALTER COLUMN "valorUnitario" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" ALTER COLUMN "quantidade" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "estoqueMinimo" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "estoqueMinimo" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "valorUntMedAuto" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "valorUntMed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "insumos" ALTER COLUMN "valorUntMed" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque" DROP COLUMN "armazem_id"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "requisicoes_estoque_itens" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD "totalSaidas" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "insumos" ADD "totalEntradas" numeric NOT NULL`);
        await queryRunner.query(`DROP TABLE "armazens"`);
        await queryRunner.query(`DROP TABLE "estoques"`);
        await queryRunner.query(`DROP TABLE "movimentos_estoque"`);
        await queryRunner.query(`DROP TYPE "public"."movimentos_estoque_undestoque_enum"`);
    }

}
