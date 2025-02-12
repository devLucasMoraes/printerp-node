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
import { Equipamento } from "./Equipamento";
import { RequisicaoEstoqueItem } from "./RequisicaoEstoqueItem";
import { Requisitante } from "./Requisitante";

@Entity("requisicoes_estoque")
export class RequisicaoEstoque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  dataRequisicao: Date;

  @Column({ type: "numeric" })
  valorTotal: number;

  @Column({ type: "varchar", length: 255 })
  ordemProducao: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  obs: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Requisitante, (requisitante) => requisitante.requisicoes)
  @JoinColumn({ name: "requisitante_id" })
  requisitante: Requisitante;

  @ManyToOne(() => Equipamento, (equipamento) => equipamento.requisicoes)
  @JoinColumn({ name: "equipamentos_id" })
  equipamento: Equipamento;

  @OneToMany(
    () => RequisicaoEstoqueItem,
    (requisicaoEstoqueItem) => requisicaoEstoqueItem.requisicaoEstoque
  )
  itens: RequisicaoEstoqueItem[];

  constructor(data?: Partial<RequisicaoEstoque>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
