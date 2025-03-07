import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1741375687677 implements MigrationInterface {
  name = "Initial1741375687677";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "role" character varying(255) NOT NULL DEFAULT 'user', "token_version" character varying(255), "user_id" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "categorias" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255), CONSTRAINT "UQ_de8a2d8979f7820616e31dc1e15" UNIQUE ("nome"), CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."movimentos_estoque_undidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`
    );
    await queryRunner.query(
      `CREATE TABLE "movimentos_estoque" ("id" SERIAL NOT NULL, "tipo" character varying(50) NOT NULL, "data" TIMESTAMP NOT NULL, "quantidade" numeric(10,2) NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "undidade" "public"."movimentos_estoque_undidade_enum" NOT NULL, "documento_origem" character varying(255) NOT NULL, "tipo_documento" character varying(50) NOT NULL, "regularizado" boolean NOT NULL DEFAULT false, "observacao" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255), "armazem_origem_id" integer, "armazem_destino_id" integer, "insumo_id" integer, CONSTRAINT "PK_f0167ad29177850a7c4dc6d4606" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."insumos_und_estoque_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`
    );
    await queryRunner.query(
      `CREATE TABLE "insumos" ("id" SERIAL NOT NULL, "descricao" character varying(255) NOT NULL, "valor_unt_med" numeric(10,2) NOT NULL DEFAULT '0', "valor_unt_med_auto" boolean NOT NULL DEFAULT false, "permite_estoque_negativo" boolean NOT NULL DEFAULT false, "und_estoque" "public"."insumos_und_estoque_enum" NOT NULL, "estoque_minimo" numeric(10,2) NOT NULL DEFAULT '0', "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255), "categoria_id" integer, CONSTRAINT "PK_b4e1b727a7b140e698e3a3dc7af" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "estoques" ("id" SERIAL NOT NULL, "quantidade" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "armazem_id" integer, "insumo_id" integer, CONSTRAINT "PK_049cbdf51633449b22f020680d1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "armazens" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255), CONSTRAINT "UQ_400d1bf5d06da8279326e57c4e8" UNIQUE ("nome"), CONSTRAINT "PK_395344d5289ccafcc9dfa1ac08a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "equipamentos" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255), CONSTRAINT "UQ_cad18a4ac93dbd783fb793b9d01" UNIQUE ("nome"), CONSTRAINT "PK_0db94e9eed96824cb4446343a86" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."requisicoes_estoque_itens_unidade_enum" AS ENUM('AMPOLA', 'BALDE', 'BANDEJ', 'BARRA', 'BISNAG', 'BLOCO', 'BOBINA', 'BOMB', 'CAPS', 'CART', 'CENTO', 'CJ', 'CM', 'CM2', 'CX', 'CX2', 'CX3', 'CX5', 'CX10', 'CX15', 'CX20', 'CX25', 'CX50', 'CX100', 'DISP', 'DUZIA', 'EMBAL', 'FARDO', 'FOLHA', 'FRASCO', 'GALAO', 'GF', 'GRAMAS', 'JOGO', 'KG', 'KIT', 'LATA', 'LITRO', 'M', 'M2', 'M3', 'MILHEI', 'ML', 'MWH', 'PACOTE', 'PALETE', 'PARES', 'PC', 'POTE', 'K', 'RESMA', 'ROLO', 'SACO', 'SACOLA', 'TAMBOR', 'TANQUE', 'TON', 'TUBO', 'UNID', 'VASIL', 'VIDRO')`
    );
    await queryRunner.query(
      `CREATE TABLE "requisicoes_estoque_itens" ("id" SERIAL NOT NULL, "quantidade" numeric(10,2) NOT NULL, "unidade" "public"."requisicoes_estoque_itens_unidade_enum" NOT NULL, "valor_unitario" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "insumos_id" integer, "requisicoes_estoque_id" integer, CONSTRAINT "PK_d078291735274987d33366846a7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "requisicoes_estoque" ("id" SERIAL NOT NULL, "data_requisicao" TIMESTAMP NOT NULL, "valor_total" numeric(10,2) NOT NULL, "ordem_producao" character varying(255), "obs" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255), "requisitante_id" integer, "equipamentos_id" integer, "armazem_id" integer, CONSTRAINT "PK_5ee11723bf79ec49cf429e372f5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "requisitantes" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "fone" character varying(255) NOT NULL, "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying(255), CONSTRAINT "UQ_a5d6feb6a5bf80161d307bc865b" UNIQUE ("nome"), CONSTRAINT "PK_217e259327009b9ee87821bc07e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("key" character varying(255) NOT NULL, "value" text NOT NULL, "user_id" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c8639b7626fa94ba8265628f214" PRIMARY KEY ("key"))`
    );
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_263864180fa1722935b2c6a24fc" FOREIGN KEY ("armazem_origem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_90b151f8373e6a63f78698d28b0" FOREIGN KEY ("armazem_destino_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "insumos" ADD CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_5615b9415c67026aef69c9e0af4" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "estoques" ADD CONSTRAINT "FK_0ecc351a100765a385b8277f44f" FOREIGN KEY ("insumo_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9" FOREIGN KEY ("insumos_id") REFERENCES "insumos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" ADD CONSTRAINT "FK_221af3495763304b3a94e455cf1" FOREIGN KEY ("requisicoes_estoque_id") REFERENCES "requisicoes_estoque"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e" FOREIGN KEY ("requisitante_id") REFERENCES "requisitantes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_a59a8c27123c1aaf89259da056c" FOREIGN KEY ("equipamentos_id") REFERENCES "equipamentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" ADD CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9" FOREIGN KEY ("armazem_id") REFERENCES "armazens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_d404274b3a61f65a7c0bc1d6ca9"`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_a59a8c27123c1aaf89259da056c"`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque" DROP CONSTRAINT "FK_0fab199ed6eaa484572b66c8f7e"`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_221af3495763304b3a94e455cf1"`
    );
    await queryRunner.query(
      `ALTER TABLE "requisicoes_estoque_itens" DROP CONSTRAINT "FK_2d011a3b06024eeaf2145c05cc9"`
    );
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_0ecc351a100765a385b8277f44f"`
    );
    await queryRunner.query(
      `ALTER TABLE "estoques" DROP CONSTRAINT "FK_5615b9415c67026aef69c9e0af4"`
    );
    await queryRunner.query(
      `ALTER TABLE "insumos" DROP CONSTRAINT "FK_998362c3f6fd2e8f4b19aa4d5da"`
    );
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_af99ea2738bb30e8892c1ff408e"`
    );
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_90b151f8373e6a63f78698d28b0"`
    );
    await queryRunner.query(
      `ALTER TABLE "movimentos_estoque" DROP CONSTRAINT "FK_263864180fa1722935b2c6a24fc"`
    );
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TABLE "requisitantes"`);
    await queryRunner.query(`DROP TABLE "requisicoes_estoque"`);
    await queryRunner.query(`DROP TABLE "requisicoes_estoque_itens"`);
    await queryRunner.query(
      `DROP TYPE "public"."requisicoes_estoque_itens_unidade_enum"`
    );
    await queryRunner.query(`DROP TABLE "equipamentos"`);
    await queryRunner.query(`DROP TABLE "armazens"`);
    await queryRunner.query(`DROP TABLE "estoques"`);
    await queryRunner.query(`DROP TABLE "insumos"`);
    await queryRunner.query(`DROP TYPE "public"."insumos_und_estoque_enum"`);
    await queryRunner.query(`DROP TABLE "movimentos_estoque"`);
    await queryRunner.query(
      `DROP TYPE "public"."movimentos_estoque_undidade_enum"`
    );
    await queryRunner.query(`DROP TABLE "categorias"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
