import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Estoque } from "./Estoque";
import { MovimentoEstoque } from "./MovimentoEstoque";

@Entity("armazens")
export class Armazem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  nome: string;

  @Column({ type: "boolean", default: true })
  ativo: boolean;

  @OneToMany(() => Estoque, (estoque) => estoque.armazem)
  estoques: Estoque[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  @Column({ name: "user_id", type: "varchar", length: 255 })
  userId: string;

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.armazemOrigem)
  movimentosSaida: MovimentoEstoque[];

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.armazemDestino)
  movimentosEntrada: MovimentoEstoque[];
}
