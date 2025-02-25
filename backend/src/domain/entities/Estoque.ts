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
import { Armazem } from "./Armazem";
import { Insumo } from "./Insumo";

@Entity("estoques")
export class Estoque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  quantidade: number = 0;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: "varchar", length: 255 })
  userId: string;

  @ManyToOne(() => Armazem, (armazem) => armazem.estoques)
  @JoinColumn({ name: "armazem_id" })
  armazem: Armazem;

  @ManyToOne(() => Insumo, (insumo) => insumo.estoques)
  @JoinColumn({ name: "insumo_id" })
  insumo: Insumo;

  possuiQuantidadeSuficiente(quantidadeDesejada: number): boolean {
    return this.quantidade >= quantidadeDesejada;
  }
}
