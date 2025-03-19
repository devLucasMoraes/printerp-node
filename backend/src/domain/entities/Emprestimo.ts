import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Armazem } from "./Armazem";
import { EmprestimoItem } from "./EmprestimoItem";
import { Parceiro } from "./Parceiro";

@Entity("emprestimos")
export class Emprestimo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "data_emprestimo", type: "timestamp" })
  dataEmprestimo: Date;

  @Column({ name: "previsao_devolucao", type: "timestamp", nullable: true })
  previsaoDevolucao: Date | null;

  @Column({
    name: "custo_estimado",
    type: "numeric",
    precision: 10,
    scale: 2,
    default: 0,
  })
  custoEstimado: number;

  @Column({ type: "varchar", length: 255 })
  tipo: "ENTRADA" | "SAIDA";

  @Column({ type: "varchar", length: 255, default: "EM ABERTO" })
  status: "EM ABERTO" | "BAIXADO";

  @Column({ name: "user_id", type: "varchar", length: 255 })
  userId: string;

  @ManyToOne(() => Armazem)
  @JoinColumn({ name: "armazem_id" })
  armazem: Armazem;

  @ManyToOne(() => Armazem)
  @JoinColumn({ name: "parceiro_id" })
  parceiro: Parceiro;

  @OneToMany(
    () => EmprestimoItem,
    (emprestimoItem) => emprestimoItem.emprestimo,
    { cascade: true }
  )
  itens: EmprestimoItem[];
}
