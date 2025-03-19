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
import { DevolucaoItem } from "./DevolucaoItem";
import { Emprestimo } from "./Emprestimo";
import { Insumo } from "./Insumo";
import { Unidade } from "./Unidade";

@Entity("emprestimo_itens")
export class EmprestimoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  quantidade: number;

  @Column({
    name: "unidade",
    type: "enum",
    enum: Unidade,
  })
  unidade: Unidade;

  @Column({ name: "valor_unitario", type: "numeric", precision: 10, scale: 2 })
  valorUnitario: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => Insumo, (insumo) => insumo.id)
  @JoinColumn({ name: "insumos_id" })
  insumo: Insumo;

  @ManyToOne(() => Emprestimo, (emprestimo) => emprestimo.itens, {
    orphanedRowAction: "soft-delete",
  })
  @JoinColumn({ name: "emprestimo_id" })
  emprestimo: Emprestimo;

  @OneToMany(
    () => DevolucaoItem,
    (devolucaoItem) => devolucaoItem.emprestimoItem,
    { cascade: true }
  )
  devolucaoItens: DevolucaoItem[];
}
