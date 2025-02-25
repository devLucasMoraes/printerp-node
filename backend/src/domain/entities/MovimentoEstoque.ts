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
import { Unidade } from "./Unidade";

@Entity("movimentos_estoque")
export class MovimentoEstoque {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  tipo: "ENTRADA" | "SAIDA" | "TRANSFERENCIA";

  @Column({ type: "timestamp" })
  data: Date;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  quantidade: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  valorUnitario: number;

  @Column({
    type: "enum",
    enum: Unidade,
  })
  undEstoque: Unidade;

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosSaida)
  @JoinColumn({ name: "armazem_origem_id" })
  armazemOrigem: Armazem;

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosEntrada)
  @JoinColumn({ name: "armazem_destino_id" })
  armazemDestino: Armazem;

  @Column({ type: "varchar", length: 255 })
  documentoOrigem: string;

  @Column({ type: "varchar", length: 50 })
  tipoDocumento: string;

  @Column({ type: "boolean", default: false })
  regularizado: boolean;

  @Column({ type: "text", nullable: true })
  observacao?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: "varchar", length: 255 })
  userId: string;

  @ManyToOne(() => Insumo, (insumo) => insumo.movimentos)
  @JoinColumn({ name: "insumo_id" })
  insumo: Insumo;
}
