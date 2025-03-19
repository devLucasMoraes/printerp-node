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

  @Column({ name: "valor_unitario", type: "numeric", precision: 10, scale: 2 })
  valorUnitario: number;

  @Column({
    name: "undidade",
    type: "enum",
    enum: Unidade,
  })
  undidade: Unidade;

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosSaida)
  @JoinColumn({ name: "armazem_origem_id" })
  armazemOrigem: Armazem;

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosEntrada)
  @JoinColumn({ name: "armazem_destino_id" })
  armazemDestino: Armazem;

  @Column({ name: "documento_origem", type: "varchar", length: 255 })
  documentoOrigem: string;

  @Column({ name: "tipo_documento", type: "varchar", length: 50 })
  tipoDocumento: string;

  @Column({ type: "boolean", default: false })
  regularizado: boolean;

  @Column({ type: "text", nullable: true })
  observacao?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @Column({ name: "user_id", type: "varchar", length: 255 })
  userId: string;

  @ManyToOne(() => Insumo, (insumo) => insumo.movimentos)
  @JoinColumn({ name: "insumo_id" })
  insumo: Insumo;
}
