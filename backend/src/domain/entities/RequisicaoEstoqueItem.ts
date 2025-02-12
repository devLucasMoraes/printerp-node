import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Insumo } from "./Insumo";
import { RequisicaoEstoque } from "./RequisicaoEstoque";
import { Unidade } from "./Unidade";

@Entity("requisicoes_estoque_itens")
export class RequisicaoEstoqueItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Insumo, (insumo) => insumo.id)
  @JoinColumn({ name: "insumos_id" })
  insumo: Insumo;

  @Column({ type: "numeric" })
  quantidade: number;

  @Column({
    type: "enum",
    enum: Unidade,
  })
  undEstoque: Unidade;

  @Column({ type: "numeric" })
  valorUnitario: number;

  @ManyToOne(
    () => RequisicaoEstoque,
    (requisicaoEstoque) => requisicaoEstoque.itens,
    { orphanedRowAction: "delete" }
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
