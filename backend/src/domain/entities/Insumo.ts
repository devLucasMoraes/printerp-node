import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Categoria } from "./Categoria";
import { Unidade } from "./Unidade";

@Entity("insumos")
export class Insumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  descricao: string;

  @Column({ type: "numeric" })
  valorUntMed = 0;

  @Column({ type: "boolean" })
  valorUntMedAuto = false;

  @Column({
    type: "enum",
    enum: Unidade,
  })
  undEstoque: Unidade;

  @Column({ type: "numeric" })
  estoqueMinimo: number;

  @Column({ type: "numeric" })
  totalEntradas = 0;

  @Column({ type: "numeric" })
  totalSaidas = 0;

  @ManyToOne(() => Categoria, (categoria) => categoria.insumos)
  @JoinColumn({ name: "categoria_id" })
  categoria: Categoria;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(data?: Partial<Insumo>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public getSaldo() {
    return this.totalEntradas - this.totalSaidas;
  }

  public getValorTotal() {
    var saldo = this.getSaldo();
    return saldo * this.valorUntMed;
  }

  public getAbaixoDoMinimo() {
    return this.getSaldo() < 0 ? true : false;
  }
}
