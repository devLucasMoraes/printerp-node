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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @Column({ name: "user_id", type: "varchar", length: 255, nullable: true })
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
