import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Categoria } from "./Categoria";
import { Estoque } from "./Estoque";
import { MovimentoEstoque } from "./MovimentoEstoque";
import { Unidade } from "./Unidade";

@Entity("insumos")
export class Insumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  descricao: string;

  @Column({
    name: "valor_unt_med",
    type: "numeric",
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorUntMed: number = 0;

  @Column({ name: "valor_unt_med_auto", type: "boolean", default: false })
  valorUntMedAuto = false;

  @Column({ name: "permite_estoque_negativo", type: "boolean", default: false })
  permiteEstoqueNegativo = false;

  @Column({
    name: "und_estoque",
    type: "enum",
    enum: Unidade,
  })
  undEstoque: Unidade;

  @Column({
    name: "estoque_minimo",
    type: "numeric",
    precision: 10,
    scale: 2,
    default: 0,
  })
  estoqueMinimo: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.insumos)
  @JoinColumn({ name: "categoria_id" })
  categoria: Categoria;

  @Column({ type: "boolean", default: true })
  ativo: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @Column({ name: "user_id", type: "varchar", length: 255 })
  userId: string;

  @OneToMany(() => Estoque, (estoque) => estoque.insumo)
  estoques: Estoque[];

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.insumo)
  movimentos: MovimentoEstoque[];

  getSaldoTotal(): number {
    return this.estoques.reduce(
      (total, estoque) => total + estoque.quantidade,
      0
    );
  }

  public getValorTotal() {
    var saldo = this.getSaldoTotal();
    return saldo * this.valorUntMed;
  }

  estaAbaixoDoMinimo(): boolean {
    return this.getSaldoTotal() < this.estoqueMinimo;
  }
}
