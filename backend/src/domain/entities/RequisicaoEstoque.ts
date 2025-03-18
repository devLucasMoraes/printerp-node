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
import { Armazem } from "./Armazem";
import { RequisicaoEstoqueItem } from "./RequisicaoEstoqueItem";
import { Requisitante } from "./Requisitante";
import { Setor } from "./Setor";

@Entity("requisicoes_estoque")
export class RequisicaoEstoque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "data_requisicao", type: "timestamp" })
  dataRequisicao: Date;

  @Column({ name: "valor_total", type: "numeric", precision: 10, scale: 2 })
  valorTotal: number;

  @Column({
    name: "ordem_producao",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  ordemProducao: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  obs: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @Column({ name: "user_id", type: "varchar", length: 255, nullable: true })
  userId: string;

  @ManyToOne(() => Requisitante, (requisitante) => requisitante.requisicoes)
  @JoinColumn({ name: "requisitante_id" })
  requisitante: Requisitante;

  @ManyToOne(() => Setor, (setor) => setor.requisicoes)
  @JoinColumn({ name: "setor_id" })
  setor: Setor;

  @ManyToOne(() => Armazem)
  @JoinColumn({ name: "armazem_id" })
  armazem: Armazem;

  @OneToMany(
    () => RequisicaoEstoqueItem,
    (requisicaoEstoqueItem) => requisicaoEstoqueItem.requisicaoEstoque,
    { cascade: true }
  )
  itens: RequisicaoEstoqueItem[];

  constructor(data?: Partial<RequisicaoEstoque>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
