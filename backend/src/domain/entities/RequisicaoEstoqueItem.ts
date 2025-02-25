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
import { Insumo } from "./Insumo";
import { RequisicaoEstoque } from "./RequisicaoEstoque";
import { Unidade } from "./Unidade";

@Entity("requisicoes_estoque_itens")
export class RequisicaoEstoqueItem {
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

  @ManyToOne(
    () => RequisicaoEstoque,
    (requisicaoEstoque) => requisicaoEstoque.itens,
    { orphanedRowAction: "soft-delete" }
  )
  @JoinColumn({ name: "requisicoes_estoque_id" })
  requisicaoEstoque: RequisicaoEstoque;

  constructor(data?: Partial<RequisicaoEstoqueItem>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public getValorTotal() {
    return this.quantidade * this.valorUnitario;
  }
}
