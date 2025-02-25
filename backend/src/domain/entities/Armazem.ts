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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: "varchar", length: 255 })
  userId: string;

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.armazemOrigem)
  movimentosSaida: MovimentoEstoque[];

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.armazemDestino)
  movimentosEntrada: MovimentoEstoque[];
}
