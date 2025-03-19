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
import { EmprestimoItem } from "./EmprestimoItem";
import { Insumo } from "./Insumo";
import { Unidade } from "./Unidade";

@Entity("devolucao_itens")
export class DevolucaoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "data_devolucao", type: "timestamp" })
  dataDevolucao: Date;

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

  @ManyToOne(() => EmprestimoItem, (emprestimo) => emprestimo.devolucaoItens, {
    orphanedRowAction: "soft-delete",
  })
  @JoinColumn({ name: "emprestimo_item_id" })
  emprestimoItem: EmprestimoItem;
}
