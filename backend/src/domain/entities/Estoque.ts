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

  @Column({
    name: "consumo_medio_diario",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  consumoMedioDiario: number | null;

  @Column({
    name: "ultima_atualizacao_consumo",
    type: "timestamp",
    nullable: true,
  })
  ultimaAtualizacaoConsumo: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @ManyToOne(() => Armazem, (armazem) => armazem.estoques)
  @JoinColumn({ name: "armazem_id" })
  armazem: Armazem;

  @ManyToOne(() => Insumo, (insumo) => insumo.estoques)
  @JoinColumn({ name: "insumo_id" })
  insumo: Insumo;

  possuiQuantidadeSuficiente(quantidadeDesejada: number): boolean {
    return this.quantidade >= quantidadeDesejada;
  }

  estaAbaixoMinimo(): boolean {
    return this.quantidade < this.insumo.estoqueMinimo;
  }

  calcularDiasRestantes(): number | null {
    if (!this.consumoMedioDiario || this.consumoMedioDiario <= 0) {
      return null;
    }
    return Math.floor(this.quantidade / this.consumoMedioDiario);
  }

  calcularPrevisaoFimEstoque(): Date | null {
    const diasRestantes = this.calcularDiasRestantes();
    if (diasRestantes === null) {
      return null;
    }

    const dataPrevisao = new Date();
    dataPrevisao.setDate(dataPrevisao.getDate() + diasRestantes);
    return dataPrevisao;
  }

  calcularPrevisaoEstoqueMinimo(): Date | null {
    if (!this.consumoMedioDiario || this.consumoMedioDiario <= 0) {
      return null;
    }

    const diasAteEstoqueMinimo = Math.floor(
      (this.quantidade - this.insumo.estoqueMinimo) / this.consumoMedioDiario
    );
    if (diasAteEstoqueMinimo < 0) {
      return null; // Já está abaixo do mínimo
    }

    const dataPrevisao = new Date();
    dataPrevisao.setDate(dataPrevisao.getDate() + diasAteEstoqueMinimo);
    return dataPrevisao;
  }
}
