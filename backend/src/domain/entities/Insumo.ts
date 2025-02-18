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

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  valorUntMed: number = 0;

  @Column({ type: "boolean", default: false })
  valorUntMedAuto = false;

  @Column({ type: "boolean", default: false })
  permiteEstoqueNegativo = false;

  @Column({
    type: "enum",
    enum: Unidade,
  })
  undEstoque: Unidade;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  estoqueMinimo: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.insumos)
  @JoinColumn({ name: "categoria_id" })
  categoria: Categoria;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Estoque, (estoque) => estoque.insumo)
  estoques: Estoque[];

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.insumo)
  movimentos: MovimentoEstoque[];

  constructor(data?: Partial<Insumo>) {
    if (data) {
      Object.assign(this, data);
    }
  }

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
